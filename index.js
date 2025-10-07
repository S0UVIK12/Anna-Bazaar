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
  };import React, { useState } from 'react';
import { ShoppingCart, Leaf, MessageSquare, Star, LogOut, Plus, Edit2, Trash2, Send, MapPin, Calendar } from 'lucide-react';

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

  const handleLogin = (type, id) => {
    setCurrentUser(id);
    setUserType(type);
    setSelectedListing(null);
    setNegotiationView(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserType(null);
    setSelectedListing(null);
    setNegotiationView(null);
  };

  const handleAddListing = () => {
    if (formData.product && formData.price && formData.quantity && formData.location) {
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
      setFormData({ product: '', price: '', quantity: '', unit: 'kg', location: '', description: '', image: '🥬' });
      setShowNewListing(false);
    }
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="flex justify-center gap-2 mb-4">
              <Leaf className="w-12 h-12 text-green-600" />
              <h1 className="text-5xl font-bold text-gray-800">Anna Bazaar</h1>
            </div>
            <p className="text-xl text-gray-600">Direct Connection Between Farmers & Buyers</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚜</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Farmer</h2>
                <p className="text-gray-600 mt-2">List your products & reach buyers directly</p>
              </div>
              <button
                onClick={() => handleLogin('farmer', 'farmer1')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition mb-2"
              >
                Login as Farmer
              </button>
              <p className="text-sm text-gray-500 text-center">Demo: farmer1</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🛒</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Buyer</h2>
                <p className="text-gray-600 mt-2">Browse products & negotiate directly</p>
              </div>
              <button
                onClick={() => handleLogin('buyer', 'buyer1')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition mb-2"
              >
                Login as Buyer
              </button>
              <p className="text-sm text-gray-500 text-center">Demo: buyer1</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">Anna Bazaar</h1>
            <span className="text-sm bg-gray-200 px-3 py-1 rounded-full text-gray-700">
              {userType === 'farmer' ? '🚜 Farmer' : '🛒 Buyer'} • {currentUser}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {userType === 'farmer' ? (
          // Farmer View
          <div>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSelectedListing('listings')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${selectedListing === 'listings' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border'}`}
              >
                My Listings
              </button>
              <button
                onClick={() => setSelectedListing('negotiations')}
                className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${selectedListing === 'negotiations' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border'}`}
              >
                <MessageSquare className="w-5 h-5" />
                Negotiations ({negotiations.filter(n => n.farmerId === currentUser).length})
              </button>
            </div>

            {(!selectedListing || selectedListing === 'listings') && (
            <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">My Listings</h2>
              <button
                onClick={() => setShowNewListing(!showNewListing)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                <Plus className="w-5 h-5" /> Add Product
              </button>
            </div>

            {showNewListing && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{editingId ? 'Edit Product' : 'List New Product'}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Product name"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Price per unit"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleAddListing}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    {editingId ? 'Update Listing' : 'Add Listing'}
                  </button>
                  <button
                    onClick={() => {
                      setShowNewListing(false);
                      setEditingId(null);
                      setFormData({ product: '', price: '', quantity: '', unit: 'kg', location: '', description: '', image: '🥬' });
                    }}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {listings.filter(l => l.farmerId === currentUser).map(listing => (
                <div key={listing.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-5">
                  <div className="text-4xl mb-3">{listing.image}</div>
                  <h3 className="text-xl font-bold text-gray-800">{listing.product}</h3>
                  <p className="text-gray-600 text-sm mb-3">{listing.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-green-600">₹{listing.price}/{listing.unit}</span>
                    <span className="text-sm text-gray-600">{listing.quantity} {listing.unit} available</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" /> {listing.location}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditListing(listing)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded flex items-center justify-center gap-1 transition"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteListing(listing.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded flex items-center justify-center gap-1 transition"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {listings.filter(l => l.farmerId === currentUser).length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600">No listings yet. Add your first product!</p>
              </div>
            )}
            </div>
            )}

            {selectedListing === 'negotiations' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Buyer Negotiations</h2>
                {negotiations.filter(n => n.farmerId === currentUser).length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <p className="text-gray-600">No negotiations yet. Wait for buyers to contact you!</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {negotiations.filter(n => n.farmerId === currentUser).map(neg => (
                      <div key={neg.id} className="bg-white rounded-lg shadow p-5 border-l-4 border-green-600">
                        <h3 className="text-lg font-bold text-gray-800">{neg.listing.product}</h3>
                        <p className="text-gray-600 text-sm">Buyer: <span className="font-semibold">{neg.buyerId}</span></p>
                        <p className="text-gray-600 text-sm">Price: ₹{neg.listing.price}/{neg.listing.unit}</p>
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
              </div>
            )}
          </div>
        ) : (
          // Buyer View
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Products</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {listings.map(listing => (
                <div key={listing.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-5">
                  <div className="text-4xl mb-3">{listing.image}</div>
                  <h3 className="text-xl font-bold text-gray-800">{listing.product}</h3>
                  <p className="text-gray-700 font-semibold">{listing.farmerName}</p>
                  <p className="text-gray-600 text-sm mb-3">{listing.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-green-600">₹{listing.price}/{listing.unit}</span>
                    <span className="text-sm text-gray-600">{listing.quantity} {listing.unit}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" /> {listing.location}
                  </div>
                  <div className="flex items-center gap-1 text-sm mb-4">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{listing.rating} ({listing.reviews} reviews)</span>
                  </div>
                  <button
                    onClick={() => handleStartNegotiation(listing)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2 transition"
                  >
                    <MessageSquare className="w-4 h-4" /> Negotiate
                  </button>
                </div>
              ))}
            </div>

            {negotiations.filter(n => n.buyerId === currentUser).length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">My Negotiations</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {negotiations.filter(n => n.buyerId === currentUser).map(neg => (
                    <div key={neg.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setNegotiationView(neg.id)}>
                      <p className="font-bold text-gray-800">{neg.listing.product}</p>
                      <p className="text-gray-600 text-sm">With {neg.listing.farmerName}</p>
                      <p className="text-sm text-gray-500 mt-2">Messages: {neg.messages.length}</p>
                      <p className={`text-sm font-semibold mt-2 ${neg.status === 'completed' ? 'text-green-600' : 'text-blue-600'}`}>
                        {neg.status === 'completed' ? '✓ Completed' : 'Ongoing'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Negotiation Chat Modal */}
        {negotiationView && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-hidden flex flex-col">
              <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <h3 className="text-lg font-bold">
                  Negotiating: {negotiations.find(n => n.id === negotiationView)?.listing.product}
                </h3>
                <button onClick={() => setNegotiationView(null)} className="text-xl font-bold">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {negotiations.find(n => n.id === negotiationView)?.messages.map((msg, idx) => (
                  <div key={idx} className={`mb-3 flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'buyer' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t p-4 bg-white">
                {userType === 'buyer' && (
                  <div className="mb-3 flex gap-2">
                    <input
                      type="number"
                      placeholder="Propose price"
                      value={proposedPrice}
                      onChange={(e) => setProposedPrice(e.target.value)}
                      className="flex-1 border rounded px-3 py-2"
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
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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