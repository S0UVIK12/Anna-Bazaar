import React, { useEffect, useState } from 'react';
import { ShoppingCart, Leaf, MessageSquare, Star, LogOut, Plus, Edit2, Trash2, Send, MapPin, Calendar, User, Package, Sun, Moon, Search, SlidersHorizontal, Receipt } from 'lucide-react';

const FarmerBuyerPlatform = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [listings, setListings] = useState([
    { id: 1, farmerId: 'farmer1', farmerName: 'Rajesh Kumar', product: 'Organic Tomatoes', price: 40, quantity: 100, unit: 'kg', location: 'Punjab', description: 'Fresh, pesticide-free tomatoes', image: '🍅', rating: 4.5, reviews: 12 }
  ]);
  const [negotiations, setNegotiations] = useState([]);
  const [showNewListing, setShowNewListing] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [negotiationView, setNegotiationView] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    product: '',
    price: '',
    quantity: '',
    unit: 'kg',
    location: '',
    description: '',
    image: '🥬'
  });
  const [negotiationMsg, setNegotiationMsg] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [selectedSection, setSelectedSection] = useState(null);
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [cart, setCart] = useState([]); // {id, listingId, listing, quantity}
  const [orders, setOrders] = useState([]); // {id, listingId, listing, buyerId, farmerId, quantity, price, status, createdAt}

  const [orderStatusFilter, setOrderStatusFilter] = useState('all'); // all|pending|confirmed|shipped|delivered|cancelled

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Spices'];

  const sampleImages = {
    'Organic Tomatoes': 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
    'default': 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop'
  };

  const isImageUrl = (val) => typeof val === 'string' && /^(https?:|data:|blob:)/.test(val);
  const imageForListing = (l) => isImageUrl(l.image) ? l.image : (sampleImages[l.product] || sampleImages.default);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  }, [theme]);

  const handleLogin = (type, id) => {
    setCurrentUser(id);
    setUserType(type);
    setSelectedListing(null);
    setNegotiationView(null);
    // default landing tab per role
    setSelectedSection(type === 'farmer' ? 'listings' : 'browse');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserType(null);
    setSelectedListing(null);
    setNegotiationView(null);
  };

  const handleAddListing = () => {
    if (formData.product && formData.price && formData.quantity && formData.location) {
      if (editingId) {
        setListings(listings.map(l => l.id === editingId ? { ...l, ...formData, price: parseFloat(formData.price), quantity: parseFloat(formData.quantity) } : l));
        setEditingId(null);
      } else {
        const newListing = {
          id: listings.length + 1,
          farmerId: currentUser,
          farmerName: currentUser === 'farmer1' ? 'Rajesh Kumar' : 'Priya Singh',
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseFloat(formData.quantity),
          rating: 4.5,
          reviews: 0
        };
        setListings([...listings, newListing]);
      }
      setFormData({ product: '', price: '', quantity: '', unit: 'kg', location: '', description: '', image: '🥬' });
      setShowNewListing(false);
    }
  };

  const handleEditListing = (listing) => {
    setFormData(listing);
    setEditingId(listing.id);
    setShowNewListing(true);
  };

  const handleDeleteListing = (id) => {
    setListings(listings.filter(l => l.id !== id));
  };

  const handleStartNegotiation = (listing) => {
    const existingNeg = negotiations.find(n => n.listingId === listing.id && n.buyerId === currentUser);
    if (existingNeg) {
      setNegotiationView(existingNeg.id);
    } else {
      const newNeg = {
        id: negotiations.length + 1,
        listingId: listing.id,
        buyerId: currentUser,
        farmerId: listing.farmerId,
        listing: listing,
        messages: [{ sender: 'farmer', text: `Hi! I'm selling ${listing.product} at ₹${listing.price}/${listing.unit}. Interested?`, time: new Date() }],
        status: 'active'
      };
      setNegotiations([...negotiations, newNeg]);
      setNegotiationView(newNeg.id);
    }
  };

  const handleSendMessage = () => {
    if (negotiationMsg.trim()) {
      const neg = negotiations.find(n => n.id === negotiationView);
      if (neg) {
        neg.messages.push({
          sender: userType === 'farmer' ? 'farmer' : 'buyer',
          text: negotiationMsg,
          time: new Date()
        });
        setNegotiationMsg('');
      }
    }
  };

  const handleProposePrice = () => {
    if (proposedPrice && negotiationView) {
      const neg = negotiations.find(n => n.id === negotiationView);
      if (neg) {
        neg.messages.push({
          sender: 'buyer',
          text: `Can you offer ₹${proposedPrice}/${neg.listing.unit}?`,
          time: new Date()
        });
        setProposedPrice('');
      }
    }
  };

  const handleCompleteTransaction = (negId) => {
    const neg = negotiations.find(n => n.id === negId);
    if (neg) {
      neg.status = 'completed';
      setNegotiationView(null);
    }
  };

  const handleCartQtyChange = (id, delta) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handlePlaceOrder = (item) => {
    const order = {
      id: orders.length + 1,
      listingId: item.listing.id,
      listing: item.listing,
      buyerId: currentUser,
      farmerId: item.listing.farmerId,
      quantity: item.quantity,
      price: item.listing.price * item.quantity,
      status: 'pending',
      createdAt: new Date()
    };
    setOrders([...orders, order]);
    setCart(cart.filter(c => c.id !== item.id));
  };

  const handlePlaceAllOrders = () => {
    const newOrders = cart.map(item => ({
      id: orders.length + 1,
      listingId: item.listing.id,
      listing: item.listing,
      buyerId: currentUser,
      farmerId: item.listing.farmerId,
      quantity: item.quantity,
      price: item.listing.price * item.quantity,
      status: 'pending',
      createdAt: new Date()
    }));
    setOrders([...orders, ...newOrders]);
    setCart([]);
  };

  const handleMarkOrderCompleted = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'completed' } : o));
  };

  const handleAddToCart = (listing) => {
    const existingItem = cart.find(item => item.listingId === listing.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      const newItem = { id: Date.now(), listingId: listing.id, listing, quantity: 1 };
      setCart([...cart, newItem]);
    }
  };

  const handleImageChange = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFormData({ ...formData, image: url });
  };

  const formatCurrency = (n) => `₹${Number(n).toFixed(2)}`;
  const computeCartTotals = (items) => items.reduce((acc, it) => {
    acc.items += it.quantity;
    acc.amount += (it.listing.price || 0) * it.quantity;
    return acc;
  }, { items: 0, amount: 0 });

  const normalizeStatus = (s) => s === 'completed' ? 'delivered' : s;
  const nextStatus = (s) => {
    const order = ['pending', 'confirmed', 'shipped', 'delivered'];
    const idx = order.indexOf(normalizeStatus(s));
    return idx >= 0 && idx < order.length - 1 ? order[idx + 1] : s;
  };
  const getStatusClasses = (s) => {
    const st = normalizeStatus(s);
    if (st === 'pending') return 'bg-yellow-100 text-yellow-700';
    if (st === 'confirmed') return 'bg-blue-100 text-blue-700';
    if (st === 'shipped') return 'bg-purple-100 text-purple-700';
    if (st === 'delivered') return 'bg-green-100 text-green-700';
    if (st === 'cancelled') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  // derived counts for navbar badges
  const farmerNegCount = negotiations.filter(n => n.farmerId === currentUser).length;
  const buyerNegCount = negotiations.filter(n => n.buyerId === currentUser).length;
  const farmerOrders = orders.filter(o => o.farmerId === currentUser);
  const buyerOrders = orders.filter(o => o.buyerId === currentUser);

  // Helpers
  const bySearch = (l) => l.product.toLowerCase().includes(searchQuery.trim().toLowerCase()) || l.description.toLowerCase().includes(searchQuery.trim().toLowerCase());
  const byPrice = (l) => {
    const minOk = priceMin === '' || l.price >= Number(priceMin);
    const maxOk = priceMax === '' || l.price <= Number(priceMax);
    return minOk && maxOk;
  };
  const byLocation = (l) => locationFilter === 'All' || l.location === locationFilter;
  const byCategory = (l) => {
    if (selectedCategory === 'All') return true;
    const name = l.product.toLowerCase();
    if (selectedCategory === 'Vegetables') return /tomato|potato|onion|chili|leaf|veg/i.test(name);
    if (selectedCategory === 'Fruits') return /apple|banana|mango|orange|fruit/i.test(name);
    if (selectedCategory === 'Grains') return /rice|wheat|grain|corn|millet/i.test(name);
    if (selectedCategory === 'Dairy') return /milk|cheese|curd|yogurt|ghee/i.test(name);
    if (selectedCategory === 'Spices') return /spice|turmeric|chili|cumin|masala/i.test(name);
    return true;
  };
  const sortFn = (a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  };

  // Unique locations for filter dropdown
  const allLocations = Array.from(new Set(listings.map(l => l.location)));
  const filteredBrowseListings = listings
    .filter(bySearch)
    .filter(byCategory)
    .filter(byPrice)
    .filter(byLocation)
    .sort(sortFn);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-sky-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <Leaf className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-green-700 dark:text-green-400">
                Anna Bazaar
              </h1>
            </div>
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg shadow-soft hover:shadow transition"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8">
            Direct Connection Between Farmers & Buyers
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
            <div className="bg-white/80 dark:bg-white/10 backdrop-blur rounded-2xl shadow-soft p-6 sm:p-8 hover:shadow-lg transition">
              <div className="text-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl sm:text-4xl">🚜</span>
                </div>
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">Farmer</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">List your products & reach buyers directly</p>
              </div>
              <button
                onClick={() => handleLogin('farmer', 'farmer1')}
                className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3 rounded-xl transition shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Login as Farmer
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">Demo: farmer1</p>
            </div>

            <div className="bg-white/80 dark:bg-white/10 backdrop-blur rounded-2xl shadow-soft p-6 sm:p-8 hover:shadow-lg transition">
              <div className="text-center mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl sm:text-4xl">🛒</span>
                </div>
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">Buyer</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Browse products & negotiate directly</p>
              </div>
              <button
                onClick={() => handleLogin('buyer', 'buyer1')}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-xl transition shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login as Buyer
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">Demo: buyer1</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/70 backdrop-blur shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 grid grid-cols-12 gap-3 items-center">
          <div className="col-span-12 sm:col-span-3 flex items-center gap-2">
            <Leaf className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400">Anna Bazaar</h1>
          </div>
          <div className="col-span-12 sm:col-span-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products (e.g., tomatoes, wheat, milk)"
                className="w-full pl-9 pr-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="col-span-12 sm:col-span-3 flex justify-end items-center gap-2">
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg shadow-soft hover:shadow transition"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} {theme === 'light' ? 'Dark' : 'Light'}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
        {/* Navbar */}
        {currentUser && (
          <div className="border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2">
              <div className="flex flex-wrap gap-2">
                {userType === 'farmer' ? (
                  <>
                    <button
                      onClick={() => setSelectedSection('listings')}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${selectedSection === 'listings' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border'}`}
                    >
                      <Package className="w-4 h-4" /> Products
                    </button>
                    <button
                      onClick={() => setSelectedSection('negotiations')}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${selectedSection === 'negotiations' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border'}`}
                    >
                      <MessageSquare className="w-4 h-4" /> Negotiations
                      <span className="ml-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full px-2 py-0.5">{farmerNegCount}</span>
                    </button>
                    <button
                      onClick={() => setSelectedSection('orders')}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${selectedSection === 'orders' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border'}`}
                    >
                      <Receipt className="w-4 h-4" /> Orders
                      <span className="ml-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full px-2 py-0.5">{farmerOrders.length}</span>
                    </button>
                    <button
                      onClick={() => setSelectedSection('profile')}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${selectedSection === 'profile' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border'}`}
                    >
                      <User className="w-4 h-4" /> Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setSelectedSection('browse')}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${selectedSection === 'browse' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border'}`}
                    >
                      <Package className="w-4 h-4" /> Browse
                    </button>
                    <button
                      onClick={() => setSelectedSection('negotiations')}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${selectedSection === 'negotiations' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border'}`}
                    >
                      <MessageSquare className="w-4 h-4" /> Negotiations
                      <span className="ml-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full px-2 py-0.5">{buyerNegCount}</span>
                    </button>
                    <button
                      onClick={() => setSelectedSection('cart')}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${selectedSection === 'cart' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border'}`}
                    >
                      <ShoppingCart className="w-4 h-4" /> Cart
                      <span className="ml-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full px-2 py-0.5">{cart.length}</span>
                    </button>
                    <button
                      onClick={() => setSelectedSection('orders')}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${selectedSection === 'orders' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border'}`}
                    >
                      <Receipt className="w-4 h-4" /> Orders
                      <span className="ml-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full px-2 py-0.5">{buyerOrders.length}</span>
                    </button>
                    <button
                      onClick={() => setSelectedSection('profile')}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${selectedSection === 'profile' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border'}`}
                    >
                      <User className="w-4 h-4" /> Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {userType === 'farmer' ? (
          // Farmer View
          <div>
            {/* Listings Section */}
            {selectedSection === 'listings' && (
              <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400">My Listings</h2>
              <button
                onClick={() => setShowNewListing(!showNewListing)}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-2.5 rounded-lg transition shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="w-5 h-5" /> Add Product
              </button>
            </div>

            {showNewListing && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 sm:p-6 mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4">{editingId ? 'Edit Product' : 'List New Product'}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product name"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  />
                  <input
                    type="number"
                    placeholder="Price per unit"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  />
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  >
                    <option>kg</option>
                    <option>liters</option>
                    <option>bags</option>
                    <option>dozen</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  />
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e.target.files && e.target.files[0])}
                      className="w-full border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                    />
                    {isImageUrl(formData.image) && (
                      <div className="mt-3">
                        <img src={formData.image} alt="Preview" className="w-full max-h-56 object-cover rounded-lg border dark:border-gray-700" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={handleAddListing}
                    className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-2.5 rounded-lg transition"
                  >
                    {editingId ? 'Update Listing' : 'Add Listing'}
                  </button>
                  <button
                    onClick={() => {
                      setShowNewListing(false);
                      setEditingId(null);
                      setFormData({ product: '', price: '', quantity: '', unit: 'kg', location: '', description: '', image: '🥬' });
                    }}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2.5 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {listings.filter(l => l.farmerId === currentUser).map(listing => (
                <div key={listing.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-shadow p-0 overflow-hidden group animate-slideUp">
                  <div className="relative h-36 sm:h-44">
                    {isImageUrl(listing.image) ? (
                      <img src={listing.image} alt={listing.product} className="w-full h-40 object-cover rounded mb-3" />
                    ) : (
                      <div className="text-4xl mb-3">{listing.image}</div>
                    )}
                    <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-900/70 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded">₹{listing.price}/{listing.unit}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">{listing.product}</h3>
                    <p className="text-gray-700 dark:text-gray-300 font-semibold">{listing.farmerName}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{listing.description}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <MapPin className="w-4 h-4" /> {listing.location}
                    </div>
                    <div className="flex items-center gap-1 text-sm mb-4">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-700 dark:text-gray-300">{listing.rating} ({listing.reviews} reviews)</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditListing(listing)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded flex items-center justify-center gap-1 transition">
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button onClick={() => handleDeleteListing(listing.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded flex items-center justify-center gap-1 transition">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {listings.filter(l => l.farmerId === currentUser).length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">No listings yet. Add your first product!</p>
              </div>
            )}
            </>
            )}

            {/* Negotiations Section */}
            {selectedSection === 'negotiations' && (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400 mb-6">Buyer Negotiations</h2>
                {negotiations.filter(n => n.farmerId === currentUser).length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300">No negotiations yet. Wait for buyers to contact you!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    {negotiations.filter(n => n.farmerId === currentUser).map(neg => (
                      <div key={neg.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border-l-4 border-green-600">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{neg.listing.product}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">Buyer: <span className="font-semibold">{neg.buyerId}</span></p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">Price: ₹{neg.listing.price}/{neg.listing.unit}</p>
                        <p className={`text-sm font-semibold mt-2 mb-4 ${neg.status === 'completed' ? 'text-green-600' : 'text-blue-600'}`}> 
                          {neg.status === 'completed' ? '✓ Transaction Completed' : '● Active Negotiation'}
                        </p>
                        <button
                          onClick={() => setNegotiationView(neg.id)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded flex items-center justify-center gap-2 transition"
                        >
                          <MessageSquare className="w-4 h-4" /> View Messages ({neg.messages.length})
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Orders Section */}
            {selectedSection === 'orders' && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400 mb-6">Orders</h2>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Filter:</span>
                    <select value={orderStatusFilter} onChange={(e)=>setOrderStatusFilter(e.target.value)} className="border rounded px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {(userType === 'farmer' ? farmerOrders : buyerOrders).filter(o => orderStatusFilter==='all' ? true : normalizeStatus(o.status)===orderStatusFilter).length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300">No orders{orderStatusFilter!=='all' ? ` in ${orderStatusFilter}` : ''}.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    {(userType === 'farmer' ? farmerOrders : buyerOrders)
                      .filter(o => orderStatusFilter==='all' ? true : normalizeStatus(o.status)===orderStatusFilter)
                      .map(o => (
                      <div key={o.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{o.listing.product}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusClasses(o.status)}`}>{normalizeStatus(o.status)}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Qty: {o.quantity} {o.listing.unit}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Price: {formatCurrency(o.price)}/{o.listing.unit}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Buyer: {o.buyerId}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Farmer: {o.listing.farmerName}</p>
                        {userType === 'farmer' && normalizeStatus(o.status) !== 'delivered' && normalizeStatus(o.status) !== 'cancelled' && (
                          <button onClick={() => handleAdvanceOrderStatus(o.id)} className="mt-3 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded">Advance Status</button>
                        )}
                        {userType === 'buyer' && normalizeStatus(o.status) === 'pending' && (
                          <button onClick={() => handleCancelOrder(o.id)} className="mt-3 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded">Cancel Order</button>
                        )}
                      </div>
                    ))}
                  </div>
                ) }
              </div>
            )}

            {/* Profile Section */}
            {selectedSection === 'profile' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">My Profile</h2>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl">🚜</div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">{currentUser}</p>
                    <p className="text-gray-600 dark:text-gray-300">Role: Farmer</p>
                    <p className="text-gray-600 dark:text-gray-300">Listings: {listings.filter(l => l.farmerId === currentUser).length}</p>
                    <p className="text-gray-600 dark:text-gray-300">Orders: {farmerOrders.length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Buyer View
          <div>
            {/* Browse Section */}
            {selectedSection === 'browse' && (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400 mb-6">Available Products</h2>

                {/* Search and Filter Bar */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border rounded-lg px-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <button
                      onClick={() => setSelectedSection('filters')}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded-lg transition"
                    >
                      <SlidersHorizontal className="w-5 h-5" /> Filters
                    </button>
                  </div>
                </div>

                {filteredBrowseListings.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-600 dark:text-gray-300">
                    No products available.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-8">
                    {filteredBrowseListings.map(listing => (
                      <div key={listing.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-shadow p-0 overflow-hidden group animate-slideUp">
                        <div className="relative h-36 sm:h-44">
                          <img src={imageForListing(listing)} alt={listing.product} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                          <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-900/70 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded">₹{listing.price}/{listing.unit}</div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">{listing.product}</h3>
                          <p className="text-gray-700 dark:text-gray-300 font-semibold">{listing.farmerName}</p>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{listing.description}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 mb-3">
                            <MapPin className="w-4 h-4" /> {listing.location}
                          </div>
                          <div className="flex items-center gap-1 text-sm mb-4">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-gray-700 dark:text-gray-300">{listing.rating} ({listing.reviews} reviews)</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStartNegotiation(listing)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2 rounded flex items-center justify-center gap-2 transition-colors"
                            >
                              <MessageSquare className="w-4 h-4" /> Negotiate
                            </button>
                            <button
                              onClick={() => handleAddToCart(listing)}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-2 rounded flex items-center justify-center gap-2 transition-colors"
                            >
                              <ShoppingCart className="w-4 h-4" /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {negotiations.filter(n => n.buyerId === currentUser).length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">My Negotiations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {negotiations.filter(n => n.buyerId === currentUser).map(neg => (
                        <div key={neg.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => setNegotiationView(neg.id)}>
                          <p className="font-bold text-gray-800 dark:text-white">{neg.listing.product}</p>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">With {neg.listing.farmerName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Messages: {neg.messages.length}</p>
                          <p className={`text-sm font-semibold mt-2 ${neg.status === 'completed' ? 'text-green-600' : 'text-blue-600'}`}>
                            {neg.status === 'completed' ? '✓ Completed' : 'Ongoing'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Negotiations Section */}
            {selectedSection === 'negotiations' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">My Negotiations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {negotiations.filter(n => n.buyerId === currentUser).map(neg => (
                    <div key={neg.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => setNegotiationView(neg.id)}>
                      <p className="font-bold text-gray-800 dark:text-white">{neg.listing.product}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">With {neg.listing.farmerName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Messages: {neg.messages.length}</p>
                      <p className={`text-sm font-semibold mt-2 ${neg.status === 'completed' ? 'text-green-600' : 'text-blue-600'}`}>
                        {neg.status === 'completed' ? '✓ Completed' : 'Ongoing'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cart Section */}
            {selectedSection === 'cart' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400 mb-4">My Cart</h2>
                {cart.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-300">Your cart is empty.</p>
                ) : (
                  <>
                    <div className="divide-y dark:divide-gray-700">
                      {cart.map(item => (
                        <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{item.listing.image}</div>
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-white">{item.listing.product}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">₹{item.listing.price}/{item.listing.unit} • {item.listing.farmerName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleCartQtyChange(item.id, -1)} className="px-2 py-1 border rounded">-</button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button onClick={() => handleCartQtyChange(item.id, 1)} className="px-2 py-1 border rounded">+</button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handlePlaceOrder(item)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded">Place Order</button>
                            <button onClick={() => handleRemoveFromCart(item.id)} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded">Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button onClick={handlePlaceAllOrders} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Place All</button>
                    </div>
                  </>
                )}
                {/* Cart Totals and Checkout Summary */}
                {cart.length > 0 && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Items</span><span>{cart.reduce((acc, item) => acc + item.quantity, 0)}</span></div>
                        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(cart.reduce((acc, item) => acc + item.listing.price * item.quantity, 0))}</span></div>
                        <div className="flex justify-between"><span>Delivery</span><span>{formatCurrency(cart.reduce((acc, item) => acc + item.listing.price * item.quantity, 0) > 0 ? 40 : 0)}</span></div>
                        <div className="flex justify-between"><span>Tax (5%)</span><span>{formatCurrency(cart.reduce((acc, item) => acc + item.listing.price * item.quantity, 0) * 0.05)}</span></div>
                        <div className="border-t dark:border-gray-700 pt-2 flex justify-between font-semibold"><span>Total</span><span>{formatCurrency(cart.reduce((acc, item) => acc + item.listing.price * item.quantity, 0) + (cart.reduce((acc, item) => acc + item.listing.price * item.quantity, 0) > 0 ? 40 : 0) + cart.reduce((acc, item) => acc + item.listing.price * item.quantity, 0) * 0.05)}</span></div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Actions</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Review your items and place all orders at once.</p>
                      </div>
                      <button onClick={handlePlaceAllOrders} disabled={cart.length === 0} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded">Place All</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Section */}
            {selectedSection === 'orders' && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-400 mb-6">{userType === 'farmer' ? 'Orders' : 'My Orders'}</h2>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Filter:</span>
                    <select value={orderStatusFilter} onChange={(e)=>setOrderStatusFilter(e.target.value)} className="border rounded px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {(userType === 'farmer' ? farmerOrders : buyerOrders).filter(o => orderStatusFilter==='all' ? true : normalizeStatus(o.status)===orderStatusFilter).length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300">No orders{orderStatusFilter!=='all' ? ` in ${orderStatusFilter}` : ''}.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    {(userType === 'farmer' ? farmerOrders : buyerOrders)
                      .filter(o => orderStatusFilter==='all' ? true : normalizeStatus(o.status)===orderStatusFilter)
                      .map(o => (
                      <div key={o.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{o.listing.product}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusClasses(o.status)}`}>{normalizeStatus(o.status)}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Qty: {o.quantity} {o.listing.unit}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Price: {formatCurrency(o.price)}/{o.listing.unit}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Buyer: {o.buyerId}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Farmer: {o.listing.farmerName}</p>
                        {userType === 'farmer' && normalizeStatus(o.status) !== 'delivered' && normalizeStatus(o.status) !== 'cancelled' && (
                          <button onClick={() => handleAdvanceOrderStatus(o.id)} className="mt-3 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded">Advance Status</button>
                        )}
                        {userType === 'buyer' && normalizeStatus(o.status) === 'pending' && (
                          <button onClick={() => handleCancelOrder(o.id)} className="mt-3 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded">Cancel Order</button>
                        )}
                      </div>
                    ))}
                  </div>
                ) }
              </div>
            )}

            {/* Profile Section */}
            {selectedSection === 'profile' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">My Profile</h2>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl">🛒</div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">{currentUser}</p>
                    <p className="text-gray-600 dark:text-gray-300">Role: Buyer</p>
                    <p className="text-gray-600 dark:text-gray-300">Negotiations: {buyerNegCount}</p>
                    <p className="text-gray-600 dark:text-gray-300">Orders: {buyerOrders.length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Negotiation Chat Modal */}
        {negotiationView && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col animate-slideUp">
              <div className="bg-blue-600 text-white p-3 sm:p-4 flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-bold">
                  Negotiating: {negotiations.find(n => n.id === negotiationView)?.listing.product}
                </h3>
                <button onClick={() => setNegotiationView(null)} className="text-xl font-bold">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50 dark:bg-gray-900">
                {negotiations.find(n => n.id === negotiationView)?.messages.map((msg, idx) => (
                  <div key={idx} className={`mb-3 flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] sm:max-w-xs px-3 sm:px-4 py-2 rounded-2xl ${msg.sender === 'buyer' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-100'}`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t p-3 sm:p-4 bg-white dark:bg-gray-800">
                {userType === 'buyer' && (
                  <div className="mb-3 flex gap-2">
                    <input
                      type="number"
                      placeholder="Propose price"
                      value={proposedPrice}
                      onChange={(e) => setProposedPrice(e.target.value)}
                      className="flex-1 border rounded px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                    />
                    <button
                      onClick={handleProposePrice}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                    >
                      Propose
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={negotiationMsg}
                    onChange={(e) => setNegotiationMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-1 transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                {negotiations.find(n => n.id === negotiationView)?.status === 'active' && (
                  <button
                    onClick={() => handleCompleteTransaction(negotiationView)}
                    className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
                  >
                    ✓ Complete Transaction
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerBuyerPlatform;