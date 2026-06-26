const products = [
  {
    id: 1,
    name: "Organic Heirloom Tomato Seeds",
    category: "Seeds & Bulbs",
    price: 4.99,
    rating: 4.8,
    reviewsCount: 124,
    image: "images/premium_seeds.png",
    tag: "Organic",
    stock: 50,
    description: "Premium, non-GMO, organic heirloom tomato seeds. Specially harvested for high germination rates. Produces sweet, juicy, deep-red tomatoes perfect for salads and cooking.",
    features: ["100% Organic & Non-GMO", "Germination rate > 92%", "Harvest in 75-80 days", "Perfect for container gardens or open fields"],
    reviews: [
      { user: "Farmer John", rating: 5, comment: "Incredible germination rate! Virtually every seed sprouted. Will buy again." },
      { user: "Sarah K.", rating: 4, comment: "Sprouted within a week. Tomatoes are starting to form now and look very healthy." }
    ]
  },
  {
    id: 2,
    name: "Liquid Seaweed Extract Nutrient",
    category: "Soil & Fertilizers",
    price: 18.99,
    rating: 4.9,
    reviewsCount: 98,
    image: "images/organic_fertilizer.png",
    tag: "Bestseller",
    stock: 35,
    description: "100% natural cold-processed seaweed liquid concentrate. Packed with over 60 naturally occurring micro-nutrients and plant growth regulators. Promotes vigorous root growth and stress tolerance.",
    features: ["Enriched with natural hormones", "Improves heat and drought resistance", "Safe for all plants and vegetables", "Highly concentrated - makes up to 50 gallons"],
    reviews: [
      { user: "GreenThumb_Pete", rating: 5, comment: "My fiddle leaf fig and tomato plants went crazy after one application. Best organic fertilizer on the market!" },
      { user: "Amelia R.", rating: 5, comment: "Safe, organic, and doesn't have a horrible chemical smell. My crop yield doubled." }
    ]
  },
  {
    id: 3,
    name: "Smart Soil Moisture & pH Probe",
    category: "Tools & Equipment",
    price: 34.99,
    rating: 4.7,
    reviewsCount: 76,
    image: "images/smart_meter.png",
    tag: "Smart Tech",
    stock: 20,
    description: "A high-precision electronic digital meter for testing soil moisture, pH, and light levels. Help prevent overwatering and ensure your plants are in the optimal soil environment.",
    features: ["3-in-1 functions: Moisture, pH, and Sunlight", "Large digital display with soft backlit indicator", "Long rust-resistant double probes", "No batteries required for basic sensing"],
    reviews: [
      { user: "David L.", rating: 4, comment: "Very accurate readings. Helped me realize I was overwatering my pepper plants." },
      { user: "Emily W.", rating: 5, comment: "Saves a lot of guesswork. The design is neat and fits nicely in my garden bag." }
    ]
  },
  {
    id: 4,
    name: "Gourmet Mushroom Grow Kit",
    category: "Fresh Farm Produce",
    price: 24.99,
    rating: 4.6,
    reviewsCount: 142,
    image: "images/fresh_produce.png",
    tag: "Fun Project",
    stock: 15,
    description: "An easy-to-use home mushroom cultivation kit. Simply slash the bag, mist with water, and harvest fresh, delicious organic oyster mushrooms within 10 to 14 days.",
    features: ["Guaranteed to grow first crop", "Includes misting spray bottle and guidebook", "100% organic substrate", "Harvest multiple times from one kit"],
    reviews: [
      { user: "Marcus G.", rating: 5, comment: "So fun! Within 10 days I had a huge flush of beautiful oyster mushrooms. Delicious!" },
      { user: "Lisa M.", rating: 4, comment: "Super easy. Great project for kids. Got two harvests out of it." }
    ]
  },
  {
    id: 5,
    name: "Bio-Humus Compost Booster",
    category: "Soil & Fertilizers",
    price: 12.49,
    rating: 4.5,
    reviewsCount: 52,
    image: "images/organic_fertilizer.png",
    tag: "Eco-Friendly",
    stock: 40,
    description: "Concentrated microbial inoculant containing beneficial bacteria, mycorrhizae, and humic acids. Supercharges compost breakdown and improves soil fertility instantly.",
    features: ["Billions of active soil microbes", "Reduces compost bin odors", "Neutralizes soil toxins", "Improves organic matter uptake"],
    reviews: [
      { user: "Robert T.", rating: 5, comment: "Sped up my compost pile heap by weeks. Highly recommend." }
    ]
  },
  {
    id: 6,
    name: "Ergonomic Bypass Pruning Shears",
    category: "Tools & Equipment",
    price: 19.99,
    rating: 4.8,
    reviewsCount: 110,
    image: "images/smart_meter.png",
    tag: "Durable",
    stock: 25,
    description: "Heavy-duty garden shears with carbon steel blades and self-cleaning sap groove. Features an ergonomic non-slip handle with shock-absorbing pad to reduce hand fatigue.",
    features: ["Premium SK5 carbon steel blade", "Safety lock clasp", "Cuts up to 3/4 inch diameter branches", "Sap groove prevents sticking"],
    reviews: [
      { user: "AgriMaster", rating: 5, comment: "Sharp, clean cuts. Feels very heavy-duty and comfortable." }
    ]
  },
  {
    id: 7,
    name: "Raw Wildflower Honeycomb",
    category: "Fresh Farm Produce",
    price: 15.99,
    rating: 4.9,
    reviewsCount: 88,
    image: "images/fresh_produce.png",
    tag: "100% Pure",
    stock: 12,
    description: "Pure, raw, and unpasteurized honeycomb harvested directly from wildflower meadows. Completely edible, rich in enzymes, and bursting with floral sweetness.",
    features: ["Direct from local organic apiaries", "No additives or preservatives", "Fully edible wax comb", "Great with cheese, fruits, or teas"],
    reviews: [
      { user: "HoneyLover", rating: 5, comment: "The taste is out of this world. Clean, sweet, and pure." }
    ]
  },
  {
    id: 8,
    name: "Golden Sweetcorn Seeds (100pcs)",
    category: "Seeds & Bulbs",
    price: 3.49,
    rating: 4.4,
    reviewsCount: 34,
    image: "images/premium_seeds.png",
    tag: "High Yield",
    stock: 60,
    description: "Sweet corn seeds bred for cold tolerance and early sweetness. Exceptional vigor and disease resistance, producing large 8-inch ears filled with tender yellow kernels.",
    features: ["High germination rate", "Disease-resistant variety", "Sweet, tender kernels", "Matures in 75 days"],
    reviews: [
      { user: "Clara S.", rating: 4, comment: "Grown these last season and the corn was wonderfully sweet and juicy." }
    ]
  }
];

// Export to window object for global availability in index.html/app.js script context
window.products = products;
