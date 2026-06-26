document.addEventListener('DOMContentLoaded', () => {
  // --- APPLICATION STATE ---
  let cart = JSON.parse(localStorage.getItem('agrobloom_cart')) || [];
  let compareList = [];
  let currentCategory = 'All';
  let searchQuery = '';
  let maxPrice = 50;
  let sortBy = 'default';
  let theme = localStorage.getItem('agrobloom_theme') || 'light';

  // Retrieve products from window (loaded via products.js)
  const productsList = window.products || [];

  // --- DOM ELEMENTS ---
  // Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Search and Sort
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const priceSlider = document.getElementById('price-slider');
  const priceDisplay = document.getElementById('price-max-display');
  
  // Containers
  const productsGrid = document.getElementById('products-grid');
  const categoryFilters = document.getElementById('category-filters');
  const resultsCount = document.getElementById('results-count');
  
  // Cart elements
  const cartTrigger = document.getElementById('cart-trigger');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const cartItemsWrapper = document.getElementById('cart-items-wrapper');
  const cartCountBadge = document.getElementById('cart-count');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartTax = document.getElementById('cart-tax');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  // Details Modal
  const detailsModalOverlay = document.getElementById('details-modal-overlay');
  const detailsModalContainer = document.getElementById('details-modal-container');
  
  // Checkout Modal
  const checkoutModalOverlay = document.getElementById('checkout-modal-overlay');
  const closeCheckoutBtn = document.getElementById('close-checkout-btn');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutFormPanels = document.querySelectorAll('.checkout-form-panel');
  const checkoutStepNodes = document.querySelectorAll('.step-node');
  const prevStepBtn = document.getElementById('prev-step');
  const nextStepBtn = document.getElementById('next-step');
  
  // Chatbot elements
  const chatBubble = document.getElementById('chat-bubble');
  const chatWindow = document.getElementById('chat-window');
  const chatCloseBtn = document.getElementById('chat-close');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatSuggestions = document.getElementById('chat-suggestions');
  const chatBadge = document.getElementById('chat-badge');

  // Compare elements
  const compareBar = document.getElementById('compare-bar');
  const compareCountNum = document.getElementById('compare-count-num');
  const compareClearBtn = document.getElementById('compare-clear-btn');
  const compareNowBtn = document.getElementById('compare-now-btn');
  const compareModalOverlay = document.getElementById('compare-modal-overlay');
  const closeCompareBtn = document.getElementById('close-compare-btn');
  const compareTableWrapper = document.getElementById('compare-table-wrapper');

  // Planner elements
  const plannerCrop = document.getElementById('planner-crop');
  const plannerArea = document.getElementById('planner-area');
  const plannerAreaVal = document.getElementById('planner-area-val');
  const plannerSoil = document.getElementById('planner-soil');
  const metricDensity = document.getElementById('metric-density');
  const metricWater = document.getElementById('metric-water');
  const metricYield = document.getElementById('metric-yield');
  const metricAdvice = document.getElementById('metric-advice');

  // --- THEME MANAGEMENT ---
  const applyTheme = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('agrobloom_theme', newTheme);
    theme = newTheme;
    // Update theme toggle icon
    if (newTheme === 'dark') {
      themeToggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M6.34 17.66l-1.41 1.41"></path><path d="M19.07 4.93l-1.41 1.41"></path>
        </svg>
      `;
    } else {
      themeToggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  };
  
  applyTheme(theme);
  
  themeToggleBtn.addEventListener('click', () => {
    applyTheme(theme === 'light' ? 'dark' : 'light');
  });

  // --- FILTER & SORT LOGIC ---
  const renderCategories = () => {
    const categories = ['All', ...new Set(productsList.map(p => p.category))];
    categoryFilters.innerHTML = categories.map(cat => {
      const activeClass = cat === currentCategory ? 'active' : '';
      const count = cat === 'All' ? productsList.length : productsList.filter(p => p.category === cat).length;
      return `
        <button class="category-btn ${activeClass}" data-category="${cat}">
          ${cat}
          <span class="category-count">${count}</span>
        </button>
      `;
    }).join('');
    
    // Add Event Listeners to Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentCategory = btn.getAttribute('data-category');
        renderCategories();
        renderProducts();
      });
    });
  };

  const renderProducts = () => {
    let filtered = productsList.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = currentCategory === 'All' || product.category === currentCategory;
      const matchesPrice = product.price <= maxPrice;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sorting
    if (sortBy === 'price-low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    resultsCount.textContent = `${filtered.length} products found`;

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="no-results">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <h3>No Products Found</h3>
          <p>Try refining your search terms or clearing filters.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered.map(product => {
      const tagClass = product.tag ? `tag-${product.tag.toLowerCase().replace(' ', '-')}` : '';
      const tagBadge = product.tag ? `<div class="card-badge ${tagClass}">${product.tag}</div>` : '';
      const isCompared = compareList.includes(product.id) ? 'checked' : '';
      
      return `
        <div class="product-card" data-id="${product.id}">
          ${tagBadge}
          <div class="compare-select-wrap">
            <input type="checkbox" class="compare-checkbox" data-id="${product.id}" ${isCompared}>
            <span>Compare</span>
          </div>
          <div class="product-card-img" onclick="window.openDetails(${product.id})">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
          </div>
          <div class="product-card-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title" onclick="window.openDetails(${product.id})">${product.name}</h3>
            <div class="product-rating">
              <div class="stars">
                ${generateStarsHTML(product.rating)}
              </div>
              <span class="reviews-count">(${product.reviewsCount})</span>
            </div>
            <div class="product-footer">
              <span class="product-price">$${product.price.toFixed(2)}</span>
              <button class="add-cart-btn" onclick="window.addItemToCart(${product.id})" aria-label="Add to cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind checkbox change listeners
    document.querySelectorAll('.compare-checkbox').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        if (e.target.checked) {
          if (compareList.length >= 3) {
            e.target.checked = false;
            alert('You can compare up to 3 products at a time!');
            return;
          }
          compareList.push(id);
        } else {
          compareList = compareList.filter(item => item !== id);
        }
        updateCompareBar();
      });
    });
  };

  const generateStarsHTML = (rating) => {
    let stars = '';
    const rounded = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= rounded) {
        stars += '★';
      } else {
        stars += '☆';
      }
    }
    return stars;
  };

  // --- CART MANAGEMENT ---
  const updateCartBadge = () => {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalCount;
    cartCountBadge.classList.add('bounce');
    setTimeout(() => cartCountBadge.classList.remove('bounce'), 300);
  };

  const renderCart = () => {
    localStorage.setItem('agrobloom_cart', JSON.stringify(cart));
    updateCartBadge();
    
    if (cart.length === 0) {
      cartItemsWrapper.innerHTML = `
        <div class="empty-cart-view">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
            <path d="M17.21 9l-4.38-6.56c-.18-.27-.51-.34-.78-.16-.27.18-.34.51-.16.78L15.79 9H6.21L9.11 3.06c.18-.27.11-.6-.16-.78-.27-.18-.6-.11-.78.16L3.79 9H2c-.55 0-1 .45-1 1s.45 1 1 1h19c.55 0 1-.45 1-1s-.45-1-1-1h-1.79zM19 13H5c-.55 0-1 .45-1 1v5c0 1.66 1.34 3 3 3h10c1.66 0 3-1.34 3-3v-5c0-.55-.45-1-1-1zm-9 6H8v-4h2v4zm4 0h-2v-4h2v4zm3 0h-2v-4h3v4z"/>
          </svg>
          <p>Your shopping cart is empty.</p>
        </div>
      `;
      cartSubtotal.textContent = '$0.00';
      cartTax.textContent = '$0.00';
      cartTotal.textContent = '$0.00';
      checkoutBtn.disabled = true;
      return;
    }

    checkoutBtn.disabled = false;
    cartItemsWrapper.innerHTML = cart.map(item => {
      const product = productsList.find(p => p.id === item.id);
      if (!product) return '';
      return `
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="cart-item-details">
            <h4 class="cart-item-title">${product.name}</h4>
            <span class="cart-item-price">$${(product.price * item.quantity).toFixed(2)}</span>
            <div class="cart-item-quantity">
              <button class="quantity-control-btn" onclick="window.updateQty(${product.id}, -1)">-</button>
              <span class="cart-item-qty">${item.quantity}</span>
              <button class="quantity-control-btn" onclick="window.updateQty(${product.id}, 1)">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="window.removeItemFromCart(${product.id})" aria-label="Remove item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;
    }).join('');

    const sub = cart.reduce((sum, item) => {
      const product = productsList.find(p => p.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    const tax = sub * 0.05; // 5% VAT / Tax
    const tot = sub + tax;

    cartSubtotal.textContent = `$${sub.toFixed(2)}`;
    cartTax.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${tot.toFixed(2)}`;
  };

  // --- EXPOSE GLOBAL METHODS FOR HTML CLICK BINDINGS ---
  window.addItemToCart = (productId) => {
    const existing = cart.find(item => item.id === productId);
    const product = productsList.find(p => p.id === productId);
    if (!product) return;

    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity += 1;
      } else {
        alert('Cannot add more, out of stock limit!');
      }
    } else {
      cart.push({ id: productId, quantity: 1 });
    }
    renderCart();
  };

  window.removeItemFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
  };

  window.updateQty = (productId, delta) => {
    const item = cart.find(i => i.id === productId);
    const product = productsList.find(p => p.id === productId);
    if (!item || !product) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      window.removeItemFromCart(productId);
    } else if (item.quantity > product.stock) {
      item.quantity = product.stock;
      alert('Maximum stock availability reached!');
    }
    renderCart();
  };

  // --- DRAWER OPEN/CLOSE ---
  const toggleCartDrawer = (open) => {
    if (open) {
      cartOverlay.classList.add('active');
    } else {
      cartOverlay.classList.remove('active');
    }
  };

  cartTrigger.addEventListener('click', () => toggleCartDrawer(true));
  closeCartBtn.addEventListener('click', () => toggleCartDrawer(false));
  cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) toggleCartDrawer(false);
  });

  // --- DETAILED MODAL ---
  window.openDetails = (productId) => {
    const product = productsList.find(p => p.id === productId);
    if (!product) return;

    detailsModalContainer.innerHTML = `
      <button class="close-btn modal-close" onclick="window.closeDetails()" aria-label="Close modal">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="modal-content-grid">
        <div class="modal-img-holder">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-details">
          <span class="modal-badge">${product.category}</span>
          <h2 class="modal-title">${product.name}</h2>
          <div class="modal-price-rating">
            <span class="modal-price">$${product.price.toFixed(2)}</span>
            <div class="product-rating">
              <div class="stars">${generateStarsHTML(product.rating)}</div>
              <span>${product.rating} (${product.reviewsCount} reviews)</span>
            </div>
          </div>
          <p class="modal-desc">${product.description}</p>
          <ul class="features-list">
            ${product.features.map(f => `
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                ${f}
              </li>
            `).join('')}
          </ul>
          <div class="modal-action-row">
            <button class="btn btn-primary" onclick="window.addItemToCart(${product.id}); window.closeDetails();">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div class="modal-tabs">
        <div class="tabs-header">
          <button class="tab-btn active">Customer Reviews (${product.reviews.length})</button>
        </div>
        <div class="reviews-tab-content">
          <div class="reviews-list">
            ${product.reviews.map(r => `
              <div class="review-card">
                <div class="review-author-row">
                  <span class="review-author">${r.user}</span>
                  <div class="stars">${generateStarsHTML(r.rating)}</div>
                </div>
                <p class="review-comment">"${r.comment}"</p>
              </div>
            `).join('')}
          </div>
          
          <form class="review-form" id="new-review-form" onsubmit="window.submitReview(event, ${product.id})">
            <h4>Leave a Review</h4>
            <div class="form-group">
              <label for="review-name">Name</label>
              <input type="text" id="review-name" required placeholder="Enter your name">
            </div>
            <div class="form-group">
              <label for="review-rating">Rating</label>
              <select id="review-rating">
                <option value="5">5 Stars - Outstanding</option>
                <option value="4">4 Stars - Good</option>
                <option value="3">3 Stars - Average</option>
                <option value="2">2 Stars - Poor</option>
                <option value="1">1 Star - Very Bad</option>
              </select>
            </div>
            <div class="form-group">
              <label for="review-comment">Review Description</label>
              <textarea id="review-comment" rows="3" required placeholder="Describe your experience with this product..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="padding: 10px 20px; font-size: 0.9rem;">Submit Review</button>
          </form>
        </div>
      </div>
    `;
    detailsModalOverlay.classList.add('active');
  };

  window.closeDetails = () => {
    detailsModalOverlay.classList.remove('active');
  };

  detailsModalOverlay.addEventListener('click', (e) => {
    if (e.target === detailsModalOverlay) window.closeDetails();
  });

  window.submitReview = (e, productId) => {
    e.preventDefault();
    const product = productsList.find(p => p.id === productId);
    if (!product) return;

    const nameInput = document.getElementById('review-name');
    const ratingInput = document.getElementById('review-rating');
    const commentInput = document.getElementById('review-comment');

    const newReview = {
      user: nameInput.value.trim(),
      rating: parseInt(ratingInput.value),
      comment: commentInput.value.trim()
    };

    // Add review
    product.reviews.unshift(newReview);
    product.reviewsCount += 1;
    // Calculate new average rating
    const sum = product.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    product.rating = parseFloat((sum / product.reviews.length).toFixed(1));

    // Refresh view
    window.openDetails(productId);
    renderProducts();
  };

  // --- CHECKOUT PROCESS ---
  let currentCheckoutStep = 0;

  const updateCheckoutStepView = () => {
    checkoutFormPanels.forEach((panel, index) => {
      panel.classList.toggle('active', index === currentCheckoutStep);
    });

    checkoutStepNodes.forEach((node, index) => {
      if (index < currentCheckoutStep) {
        node.className = 'step-node completed';
        node.textContent = '✓';
      } else if (index === currentCheckoutStep) {
        node.className = 'step-node active';
        node.textContent = index + 1;
      } else {
        node.className = 'step-node';
        node.textContent = index + 1;
      }
    });

    // Handle Buttons
    if (currentCheckoutStep === 0) {
      prevStepBtn.style.display = 'none';
      nextStepBtn.textContent = 'Next - Payment';
    } else if (currentCheckoutStep === 1) {
      prevStepBtn.style.display = 'inline-flex';
      nextStepBtn.textContent = 'Place Order';
    } else {
      prevStepBtn.style.display = 'none';
      nextStepBtn.style.display = 'none';
    }
  };

  checkoutBtn.addEventListener('click', () => {
    toggleCartDrawer(false);
    currentCheckoutStep = 0;
    updateCheckoutStepView();
    checkoutModalOverlay.classList.add('active');
    
    // Auto-fill total price summary in payment description if exists
    const totalLabel = document.getElementById('checkout-summary-total');
    if (totalLabel) {
      totalLabel.textContent = cartTotal.textContent;
    }
  });

  closeCheckoutBtn.addEventListener('click', () => {
    checkoutModalOverlay.classList.remove('active');
  });

  checkoutModalOverlay.addEventListener('click', (e) => {
    if (e.target === checkoutModalOverlay) checkoutModalOverlay.classList.remove('active');
  });

  nextStepBtn.addEventListener('click', () => {
    // Basic validation
    if (currentCheckoutStep === 0) {
      const inputs = checkoutFormPanels[0].querySelectorAll('input[required]');
      let valid = true;
      inputs.forEach(input => {
        if (!input.checkValidity()) {
          input.reportValidity();
          valid = false;
        }
      });
      if (!valid) return;
      currentCheckoutStep = 1;
      updateCheckoutStepView();
    } else if (currentCheckoutStep === 1) {
      // Payment details validation
      const inputs = checkoutFormPanels[1].querySelectorAll('input[required]');
      let valid = true;
      inputs.forEach(input => {
        if (!input.checkValidity()) {
          input.reportValidity();
          valid = false;
        }
      });
      if (!valid) return;
      
      // Submit order mock success
      currentCheckoutStep = 2;
      updateCheckoutStepView();
      
      // Clear Cart
      cart = [];
      renderCart();
    }
  });

  prevStepBtn.addEventListener('click', () => {
    if (currentCheckoutStep > 0) {
      currentCheckoutStep -= 1;
      updateCheckoutStepView();
    }
  });

  // --- AGRI-DOCTOR CHATBOT LOGIC ---
  const botAnswers = {
    seeds: "We have fantastic seed options! Check out our **Organic Heirloom Tomato Seeds** (high yield) and **Golden Sweetcorn Seeds**. Click on their cards in the catalog to learn more about soil requirements and harvesting cycles.",
    tomato: "Heirloom Tomatoes are easy to grow! They need full sun (6-8 hours), rich fertile soil with composting booster, and consistent watering. Our Organic Heirloom Tomato Seeds have over 92% germination rate!",
    soil: "Good soil is the key to healthy plants. We recommend testing your soil with our **Smart Soil Moisture & pH Probe**. You can boost microbial activity using our **Bio-Humus Compost Booster** to improve yields.",
    fertilizer: "To supercharge your growth, try our **Liquid Seaweed Extract Nutrient**. It is 100% organic, cold-pressed seaweed containing essential macro/micro hormones that enhance transplant resilience and yield.",
    tools: "For basic garden maintenance, our **Ergonomic Bypass Pruning Shears** are a must. For tracking soil conditions, use the **Smart Soil Moisture & pH Probe**.",
    produce: "Looking for fresh harvest? Check out our **Gourmet Mushroom Grow Kit** (harvest oysters in 10 days at home) or our organic sweet **Raw Wildflower Honeycomb**."
  };

  // Maps bot categories to product ID shortcuts
  const botShortcuts = {
    seeds: [1, 8],
    tomato: [1],
    soil: [5],
    fertilizer: [2],
    tools: [3, 6],
    produce: [4, 7]
  };

  const addChatMessage = (sender, text, buttons = []) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;
    // Support basic bolding
    msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    if (buttons.length > 0) {
      const btnWrapper = document.createElement('div');
      btnWrapper.className = 'chat-btn-wrapper';
      buttons.forEach(btnInfo => {
        const btn = document.createElement('button');
        btn.className = 'chat-shortcut-btn';
        btn.innerHTML = `🛒 Add ${btnInfo.name}`;
        btn.onclick = () => {
          window.addItemToCart(btnInfo.id);
          btn.innerHTML = '✓ Added!';
          btn.style.backgroundColor = 'var(--primary-green-dark)';
          setTimeout(() => btn.innerHTML = `🛒 Add ${btnInfo.name}`, 1500);
        };
        btnWrapper.appendChild(btn);
      });
      msgDiv.appendChild(btnWrapper);
    }

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const handleBotResponse = (userText) => {
    const text = userText.toLowerCase();
    let reply = "Hello! I am AgroBloom's Agri-Doctor. I can help recommend seeds, fertilizers, soil enhancement, tools, and crop advice. Just ask me about 'seeds', 'tomatoes', 'soil', 'fertilizer', or 'tools'!";
    let buttons = [];

    for (const key in botAnswers) {
      if (text.includes(key)) {
        reply = botAnswers[key];
        
        // Find matching shortcuts
        if (botShortcuts[key]) {
          buttons = botShortcuts[key].map(pid => {
            const prod = productsList.find(p => p.id === pid);
            return prod ? { name: prod.name.split(' ').slice(-2).join(' '), id: prod.id } : null;
          }).filter(x => x !== null);
        }
        break;
      }
    }

    setTimeout(() => {
      addChatMessage('bot', reply, buttons);
    }, 600);
  };

  const sendUserChatMessage = (text) => {
    if (!text.trim()) return;
    addChatMessage('user', text);
    handleBotResponse(text);
  };

  chatBubble.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    chatBadge.style.display = 'none'; // Clear notifications
  });

  chatCloseBtn.addEventListener('click', () => {
    chatWindow.classList.remove('active');
  });

  chatSendBtn.addEventListener('click', () => {
    const val = chatInput.value;
    chatInput.value = '';
    sendUserChatMessage(val);
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const val = chatInput.value;
      chatInput.value = '';
      sendUserChatMessage(val);
    }
  });

  // Suggestion chips event binding
  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.textContent.trim();
      sendUserChatMessage(text);
    });
  });

  // Trigger automated greeting after 3 seconds
  setTimeout(() => {
    chatBadge.style.display = 'block';
  }, 2000);

  // --- FILTERS INTERACTION EVENTS ---
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  sortSelect.addEventListener('change', (e) => {
    sortBy = e.target.value;
    renderProducts();
  });

  priceSlider.addEventListener('input', (e) => {
    maxPrice = parseFloat(e.target.value);
    priceDisplay.textContent = `$${maxPrice.toFixed(2)}`;
    renderProducts();
  });

  // --- COMPARE WIDGET CONTROLLER ---
  const updateCompareBar = () => {
    compareCountNum.textContent = compareList.length;
    if (compareList.length >= 2) {
      compareBar.classList.add('active');
    } else {
      compareBar.classList.remove('active');
    }
  };

  compareClearBtn.addEventListener('click', () => {
    compareList = [];
    updateCompareBar();
    renderProducts();
  });

  compareNowBtn.addEventListener('click', () => {
    renderCompareTable();
    compareModalOverlay.classList.add('active');
  });

  const renderCompareTable = () => {
    const matchedProds = compareList.map(pid => productsList.find(p => p.id === pid)).filter(x => x !== undefined);
    
    if (matchedProds.length === 0) {
      compareTableWrapper.innerHTML = `<p style="padding: 20px; text-align: center; color: var(--text-muted);">Please select products to compare.</p>`;
      return;
    }

    compareTableWrapper.innerHTML = `
      <table class="compare-table">
        <thead>
          <tr>
            <th>Specification</th>
            ${matchedProds.map(p => `
              <td>
                <div class="compare-img-slot">
                  <img src="${p.image}" alt="${p.name}">
                </div>
                <div class="compare-title-cell">${p.name}</div>
              </td>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Category</th>
            ${matchedProds.map(p => `<td>${p.category}</td>`).join('')}
          </tr>
          <tr>
            <th>Price</th>
            ${matchedProds.map(p => `<td style="font-weight: 700; color: var(--primary-green-dark);">$${p.price.toFixed(2)}</td>`).join('')}
          </tr>
          <tr>
            <th>Germination / Speed</th>
            ${matchedProds.map(p => `<td>${p.features[2] || 'Fast growth'}</td>`).join('')}
          </tr>
          <tr>
            <th>Organic Grade</th>
            ${matchedProds.map(p => `<td>${p.tag || 'Tested Grade'}</td>`).join('')}
          </tr>
          <tr>
            <th>Rating</th>
            ${matchedProds.map(p => `<td>${p.rating} ★ (${p.reviewsCount} reviews)</td>`).join('')}
          </tr>
          <tr>
            <th>Description</th>
            ${matchedProds.map(p => `<td style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">${p.description}</td>`).join('')}
          </tr>
          <tr>
            <th>Purchase Action</th>
            ${matchedProds.map(p => `
              <td>
                <button class="btn btn-primary" onclick="window.addItemToCart(${p.id}); document.getElementById('compare-modal-overlay').classList.remove('active');" style="padding: 10px 18px; font-size: 0.85rem;">
                  Add to Cart
                </button>
              </td>
            `).join('')}
          </tr>
        </tbody>
      </table>
    `;
  };

  closeCompareBtn.addEventListener('click', () => {
    compareModalOverlay.classList.remove('active');
  });

  compareModalOverlay.addEventListener('click', (e) => {
    if (e.target === compareModalOverlay) compareModalOverlay.classList.remove('active');
  });

  // --- MY FARM PLANNING ESTIMATOR ---
  const calculatePlannerYield = () => {
    const pid = parseInt(plannerCrop.value);
    const area = parseFloat(plannerArea.value);
    const soil = plannerSoil.value;
    
    plannerAreaVal.textContent = `${area} sq. ft.`;

    const cropObj = productsList.find(p => p.id === pid);
    if (!cropObj) return;

    let spacingVal = 4; // sq ft per plant default (Tomato)
    let waterFactor = 0.5; // gallons per day per plant default
    let yieldFactor = 8; // lbs yield per plant default
    
    if (pid === 8) { // Sweetcorn
      spacingVal = 1.5;
      waterFactor = 0.35;
      yieldFactor = 1.8;
    } else if (pid === 4) { // Mushroom Grow Kit
      spacingVal = 2;
      waterFactor = 0.08;
      yieldFactor = 2.2;
    }

    // density calculation
    const density = Math.floor(area / spacingVal);
    
    // adjust water consumption factors based on soil properties
    let soilWaterMod = 1.0;
    let adviceText = "";
    
    if (soil === 'sandy') {
      soilWaterMod = 1.25;
      adviceText = "Sandy soil drains rapidly. Work in **Bio-Humus Compost Booster** to bind nutrients and apply **Seaweed Nutrient** every 10 days to counter leaching.";
    } else if (soil === 'clay') {
      soilWaterMod = 0.85;
      adviceText = "Clay holds moisture but compacts easily. Mix in **Bio-Humus Compost Booster** to aerate root channels and avoid overwatering.";
    } else {
      adviceText = "Loamy soil is ideal! Maintain organic matter with **Bio-Humus Compost Booster** monthly and spray **Seaweed Nutrient** for mid-season vigor.";
    }

    const waterDaily = density * waterFactor * soilWaterMod;
    const estYield = density * yieldFactor;

    metricDensity.textContent = `${density} units`;
    metricWater.textContent = `${waterDaily.toFixed(1)} gallons`;
    metricYield.textContent = `${estYield.toFixed(0)} lbs`;
    metricAdvice.innerHTML = adviceText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  // Bind Planner Listeners
  plannerCrop.addEventListener('change', calculatePlannerYield);
  plannerArea.addEventListener('input', calculatePlannerYield);
  plannerSoil.addEventListener('change', calculatePlannerYield);

  // --- INITIALIZATION ---
  renderCategories();
  renderProducts();
  renderCart();
  calculatePlannerYield();
});
