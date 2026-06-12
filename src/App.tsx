import React, { useState } from "react";
import { 
  MapPin, 
  Search, 
  ShoppingBag, 
  Home as HomeIcon, 
  FileText, 
  Trophy, 
  User, 
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  Clock,
  Heart
} from "lucide-react";
import { Canteen, MenuItem, CartItem, Order } from "./types";
import { CANTEENS } from "./data";
import DiscoverView from "./components/DiscoverView";
import CanteenDetailView from "./components/CanteenDetailView";
import CartView from "./components/CartView";
import ConfirmationView from "./components/ConfirmationView";

export default function App() {
  // Navigation & Location states
  const [currentView, setCurrentView] = useState<"discover" | "canteen" | "cart" | "confirmation">("discover");
  const [activeNavTab, setActiveNavTab] = useState<"home" | "orders" | "rewards" | "profile">("home");
  const [selectedLocation, setSelectedLocation] = useState<string>("Engineering Block");
  const [selectedCanteen, setSelectedCanteen] = useState<Canteen | null>(null);

  // Cart & Orders state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Favorite states
  const [favorites, setFavorites] = useState<string[]>(["green-bowl"]);

  // Computed configuration based on selected location
  // "Engineering Block" -> Vibrant styling in USD
  // "Main Campus" or "Library West Wing" -> Serene styling in INR
  const isVibrant = selectedLocation === "Engineering Block";
  const currency = isVibrant ? "$" : "₹";
  const themeStyle = isVibrant ? "vibrant" : "serene";

  // Location selector switch toggler
  const rotateLocation = () => {
    if (selectedLocation === "Engineering Block") {
      setSelectedLocation("Main Campus");
      // Optional: Clear active cart to prevent mismatching currency pricing
      setCart([]);
    } else if (selectedLocation === "Main Campus") {
      setSelectedLocation("Library West Wing");
    } else {
      setSelectedLocation("Engineering Block");
      setCart([]);
    }
  };

  // Cart Actions
  const handleAddToCart = (menuItem: MenuItem, canteen: Canteen) => {
    setCart((prevCart) => {
      // Check if item already exists in the cart
      const existingIndex = prevCart.findIndex((item) => item.menuItem.id === menuItem.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prevCart, { menuItem, quantity: 1, canteenId: canteen.id, canteenName: canteen.name }];
    });
  };

  const handleUpdateQty = (menuItemId: string, delta: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.menuItem.id === menuItemId);
      if (!existing) return prevCart;
      
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        return prevCart.filter((item) => item.menuItem.id !== menuItemId);
      }
      
      return prevCart.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, quantity: newQty } : item
      );
    });
  };

  const handleRemoveItem = (menuItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.menuItem.id !== menuItemId));
  };

  // Checkout Placing order simulation
  const handleCheckout = (checkoutDetails: {
    fulfillmentType: "pickup" | "delivery";
    pickupTime: string;
    specialInstructions: string;
    subtotal: number;
    discount: number;
    serviceFee: number;
    deliveryFee: number;
    total: number;
  }) => {
    if (cart.length === 0) return;

    const newOrder: Order = {
      id: `#CB-${Math.floor(10000 + Math.random() * 90000)}`,
      canteen: selectedCanteen || CANTEENS[0],
      items: [...cart],
      ...checkoutDetails,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedMinutes: 5,
      status: "Preparing",
    };

    setActiveOrder(newOrder);
    setOrderHistory((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart upon successful ordering
    setCurrentView("confirmation");
    setActiveNavTab("orders");
  };

  // Nav Switch helpers
  const handleNavClick = (tab: "home" | "orders" | "rewards" | "profile") => {
    setActiveNavTab(tab);
    if (tab === "home") {
      setCurrentView("discover");
    } else if (tab === "orders") {
      if (activeOrder) {
        setCurrentView("confirmation");
      } else {
        setCurrentView("discover"); // Remains on discover but lets us render an interactive prompt
      }
    } else if (tab === "rewards" || tab === "profile") {
      setCurrentView("discover"); // Managed with local modal overlays on current view
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);

  return (
    <div className={`min-h-screen pb-24 font-sans bg-gray-50 flex flex-col justify-between tracking-normal leading-normal transition-colors duration-300 ${
      themeStyle === "serene" ? "selection:bg-emerald-100" : "selection:bg-orange-100"
    }`}>
      
      {/* Top Application Bar Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-5 py-4 w-full shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentView !== "discover" && (
            <button
              onClick={() => {
                if (currentView === "confirmation") {
                  setCurrentView("discover");
                  setActiveNavTab("home");
                } else if (currentView === "cart") {
                  setCurrentView(selectedCanteen ? "canteen" : "discover");
                } else {
                  setCurrentView("discover");
                }
              }}
              className={`p-1 rounded-full cursor-pointer hover:bg-gray-150 transition-all active:scale-90 ${
                isVibrant ? "text-orange-500" : "text-[#516138]"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={rotateLocation}
            className="flex items-center gap-1.5 cursor-pointer select-none group active:scale-95 transition-transform"
            title="Click to toggle campus locations"
          >
            <MapPin className={`w-5 h-5 shrink-0 ${isVibrant ? "text-orange-500" : "text-[#516138]"}`} />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                Deliver to
              </span>
              <span className="text-xs font-bold text-gray-800 leading-tight group-hover:underline">
                {selectedLocation}
              </span>
            </div>
          </div>
        </div>

        {/* Brand Center Title */}
        <h1 
          onClick={() => {
            setCurrentView("discover");
            setActiveNavTab("home");
          }}
          className={`font-display font-extrabold text-lg sm:text-xl tracking-tight cursor-pointer select-none ${
            isVibrant ? "text-orange-600" : "text-[#516138]"
          }`}
        >
          CampusBites
        </h1>

        {/* Action button toggling specific headers/search */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView("cart")}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ShoppingBag className={`w-5 h-5 ${isVibrant ? "text-orange-500" : "text-[#516138]"}`} />
            {cartCount > 0 && (
              <span className={`absolute -top-0.5 -right-0.5 text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center text-white ${
                isVibrant ? "bg-orange-500" : "bg-[#516138]"
              }`}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Primary Application Interactive Layout Body */}
      <main className="flex-1 w-full max-w-4xl mx-auto">
        {/* Render overlay states for non-view tabs (Rewards, Profile) */}
        {activeNavTab === "rewards" ? (
          <section className="p-5 animate-fade-in max-w-md mx-auto">
            <div className="flex flex-col items-center text-center mt-4">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100 mb-4 shadow-sm animate-bounce-subtle">
                <Sparkles className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="font-display font-extrabold text-xl text-gray-900 mb-1">
                Your Campus Rewards
              </h2>
              <p className="text-xs text-gray-500 font-sans mb-6">
                Earn eating points with every pre-order to unlock student privileges.
              </p>

              {/* Reward Points Card */}
              <div className="w-full bg-gradient-to-br from-stone-900 to-stone-850 p-6 rounded-2xl text-white shadow-lg text-left relative overflow-hidden mb-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Current Balance
                </p>
                <h3 className="text-3xl font-extrabold font-display text-white mt-1">
                  1,420 <span className="text-sm font-normal text-gray-300">Points</span>
                </h3>
                
                <div className="h-2 w-full bg-stone-700/60 rounded-full mt-4 overflow-hidden">
                  <div className={`h-full rounded-full ${isVibrant ? "bg-orange-500" : "bg-[#76885B]"} w-3/4`} />
                </div>
                <p className="text-[10px] text-gray-400 mt-2">
                  750 points until next tier: <span className="font-bold text-white">Elite Eater</span>
                </p>

                <div className="absolute top-4 right-4 bg-white/10 p-2 rounded-full">
                  <Award className="w-6 h-6 text-amber-400 fill-amber-400 animate-spin-slow" />
                </div>
              </div>

              {/* Privilege lists */}
              <div className="w-full text-left space-y-4">
                <h4 className="font-display font-bold text-sm text-gray-800 uppercase tracking-wide">
                  Active Privileges
                </h4>

                <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 leading-tight">Student Privilege Active</p>
                    <p className="text-[10px] text-gray-400 font-medium">15% off automatically applied at checkout</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl opacity-60">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 leading-tight">Double-Points Tuesdays</p>
                    <p className="text-[10px] text-gray-400 font-medium">Earn double loyalty rewards on all lunch pre-orders</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : activeNavTab === "profile" ? (
          <section className="p-5 animate-fade-in max-w-md mx-auto">
            <div className="flex flex-col items-center text-center mt-4">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 mb-4">
                <img
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                  alt="Student profile"
                />
              </div>
              <h2 className="font-display font-extrabold text-xl text-gray-900 mb-0.5">
                Sreelekshmi Sandeep
              </h2>
              <p className="text-xs text-stone-500 font-sans font-semibold mb-6">
                sreelkshmisandp@gmail.com
              </p>

              {/* Profile Details Cards */}
              <div className="w-full text-left space-y-3 mb-8">
                <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block font-display">
                    University Affiliation
                  </span>
                  <p className="text-xs font-bold text-gray-800 mt-1">School of Engineering</p>
                  <p className="text-[10px] text-gray-500">Academic ID: 2024-UNIV-9821</p>
                </div>

                <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block font-display">
                    Saved Preferences
                  </span>
                  <p className="text-xs font-bold text-gray-800 mt-1">Gluten-Free, Vegetarian</p>
                  <p className="text-[10px] text-gray-500">Auto-filters active menu items for dietary requirements.</p>
                </div>
              </div>

              {/* Small Action */}
              <button
                onClick={() => {
                  alert("Settings successfully saved!");
                }}
                className={`w-full py-3 text-xs font-bold uppercase tracking-wider text-white rounded-full active:scale-95 transition-all shadow-sm ${
                  isVibrant ? "bg-orange-500 hover:bg-orange-600" : "bg-[#516138] hover:bg-[#697a4f]"
                }`}
              >
                Save Profile
              </button>
            </div>
          </section>
        ) : (
          /* Render Main Views (Discover, Menu Details, Cart, Tracking Confirmation) */
          <>
            {currentView === "discover" && (
              <DiscoverView
                location={selectedLocation}
                onSelectLocation={(loc) => setSelectedLocation(loc)}
                currency={currency}
                onSelectCanteen={(canteen) => {
                  setSelectedCanteen(canteen);
                  setCurrentView("canteen");
                }}
                onAddToCartDirect={(mi, cant) => {
                  setSelectedCanteen(cant);
                  handleAddToCart(mi, cant);
                  alert(`${mi.name} has been added to your cart!`);
                }}
                themeStyle={themeStyle}
              />
            )}

            {currentView === "canteen" && selectedCanteen && (
              <CanteenDetailView
                canteen={selectedCanteen}
                onBack={() => setCurrentView("discover")}
                onAddToCart={(item) => handleAddToCart(item, selectedCanteen)}
                cartCount={cartCount}
                cartTotal={cartTotal}
                onViewCart={() => setCurrentView("cart")}
                themeStyle={themeStyle}
              />
            )}

            {currentView === "cart" && (
              <CartView
                cart={cart}
                canteen={selectedCanteen}
                currency={currency}
                onUpdateQty={handleUpdateQty}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
                onBack={() => setCurrentView(selectedCanteen ? "canteen" : "discover")}
                themeStyle={themeStyle}
              />
            )}

            {currentView === "confirmation" && activeOrder && (
              <ConfirmationView
                order={activeOrder}
                onHome={() => {
                  setCurrentView("discover");
                  setActiveNavTab("home");
                }}
                themeStyle={themeStyle}
              />
            )}
          </>
        )}
      </main>

      {/* Prominent Bottom Navigation Bar Shell */}
      <nav className="fixed bottom-0 left-0 w-full z-50 rounded-t-2xl bg-white shadow-xl flex justify-around items-center px-4 pb-4 pt-3 border-t border-gray-100">
        
        {/* Home */}
        <button
          onClick={() => handleNavClick("home")}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 active:scale-90 cursor-pointer ${
            activeNavTab === "home" && currentView !== "cart"
              ? isVibrant
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-[#516138] text-white shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <HomeIcon className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1 font-display tracking-widest uppercase">Home</span>
        </button>

        {/* Orders / Tracking */}
        <button
          onClick={() => {
            if (activeOrder) {
              handleNavClick("orders");
              setCurrentView("confirmation");
            } else {
              alert("You have no active orders. Head over to the menu to place one!");
            }
          }}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 active:scale-90 cursor-pointer ${
            activeNavTab === "orders" || currentView === "confirmation"
              ? isVibrant
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-[#516138] text-white shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1 font-display tracking-widest uppercase">Orders</span>
        </button>

        {/* Rewards / Points */}
        <button
          onClick={() => handleNavClick("rewards")}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 active:scale-90 cursor-pointer ${
            activeNavTab === "rewards"
              ? isVibrant
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-[#516138] text-white shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1 font-display tracking-widest uppercase">Rewards</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => handleNavClick("profile")}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-150 active:scale-90 cursor-pointer ${
            activeNavTab === "profile"
              ? isVibrant
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-[#516138] text-white shadow-sm"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1 font-display tracking-widest uppercase">Profile</span>
        </button>
      </nav>
    </div>
  );
}
