import React, { useState } from "react";
import { ArrowLeft, Search, Star, Sparkles, Plus, Check } from "lucide-react";
import { Canteen, MenuItem } from "../types";

interface CanteenDetailViewProps {
  canteen: Canteen;
  onBack: () => void;
  onAddToCart: (item: MenuItem) => void;
  cartCount: number;
  cartTotal: number;
  onViewCart: () => void;
  themeStyle: "vibrant" | "serene";
}

export default function CanteenDetailView({
  canteen,
  onBack,
  onAddToCart,
  cartCount,
  cartTotal,
  onViewCart,
  themeStyle,
}: CanteenDetailViewProps) {
  const [activeTab, setActiveTab] = useState<"specials" | "main" | "drinks">("specials");
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

  // Divide the menu dynamically depending on tabs
  const specials = canteen.menu.filter((m) => m.isBestseller || m.isVegan);
  const mainCourses = canteen.menu.filter((m) => !m.isBestseller && !m.name.toLowerCase().includes("latte") && !m.name.toLowerCase().includes("soup"));
  const drinks = canteen.menu.filter((m) => m.name.toLowerCase().includes("latte") || m.name.toLowerCase().includes("coffee") || m.name.toLowerCase().includes("box") || m.name.toLowerCase().includes("soup"));

  // Settle active menu list
  const getMenuList = () => {
    switch (activeTab) {
      case "specials":
        return specials.length > 0 ? specials : canteen.menu;
      case "main":
        return mainCourses.length > 0 ? mainCourses : canteen.menu;
      case "drinks":
        return drinks.length > 0 ? drinks : canteen.menu;
      default:
        return canteen.menu;
    }
  };

  const handleAddClick = (item: MenuItem) => {
    onAddToCart(item);
    setRecentlyAdded(item.id);
    setTimeout(() => {
      setRecentlyAdded(null);
    }, 1200);
  };

  const getCurrencyPrice = (itemPrice: number) => {
    if (canteen.currency === "₹") {
      return `₹${Math.round(itemPrice)}`;
    }
    // Switch dynamic pricing inside main campus vs engineering block values or format accordingly
    if (themeStyle === "serene") {
      // Format as INR price estimation from design specifications (e.g. $12.50 = ₹349, $9 = ₹280, etc.)
      if (itemPrice === 12.50) return "₹349";
      if (itemPrice === 9.00) return "₹280";
      if (itemPrice === 11.25) return "₹295";
      if (itemPrice === 6.50) return "₹220";
      if (itemPrice === 10.50) return "₹310";
      if (itemPrice === 9.50) return "₹295";
      return `₹${Math.round(itemPrice * 28)}`;
    }
    return `$${itemPrice.toFixed(2)}`;
  };

  return (
    <div className="pb-36 animate-fade-in max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        <img
          className="w-full h-full object-cover"
          src={canteen.image}
          alt={canteen.name}
        />
        <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 z-20">
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-semibold text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              themeStyle === "vibrant"
                ? "bg-teal-500 text-white"
                : "bg-[#76885B] text-white"
            }`}>
              Open
            </span>
            <span className="text-white flex items-center gap-1 text-xs font-bold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{" "}
              {canteen.rating} ({canteen.ratingCount}+ reviews)
            </span>
          </div>
          <h2 className="text-white font-display text-2xl md:text-4xl font-extrabold mb-1">
            {canteen.name}
          </h2>
          <p className="text-white/80 text-xs font-sans max-w-md">
            {themeStyle === "serene"
              ? "Nourishing the Mind & Body with sustainable, clean options."
              : "Sustainable, fresh, and vibrant meals for campus life."}
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <nav className="sticky top-12 z-40 bg-white border-b border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex px-5 gap-6">
          <button
            onClick={() => setActiveTab("specials")}
            className={`relative py-4 whitespace-nowrap text-xs font-bold uppercase tracking-wider font-display transition-all ${
              activeTab === "specials"
                ? themeStyle === "vibrant"
                  ? "text-orange-600 border-b-2 border-orange-500 font-extrabold"
                  : "text-[#516138] border-b-2 border-[#516138] font-extrabold"
                : "text-gray-400"
            }`}
          >
            Daily Specials
          </button>
          <button
            onClick={() => setActiveTab("main")}
            className={`relative py-4 whitespace-nowrap text-xs font-bold uppercase tracking-wider font-display transition-all ${
              activeTab === "main"
                ? themeStyle === "vibrant"
                  ? "text-orange-600 border-b-2 border-orange-500 font-extrabold"
                  : "text-[#516138] border-b-2 border-[#516138] font-extrabold"
                : "text-gray-400"
            }`}
          >
            Main Course
          </button>
          <button
            onClick={() => setActiveTab("drinks")}
            className={`relative py-4 whitespace-nowrap text-xs font-bold uppercase tracking-wider font-display transition-all ${
              activeTab === "drinks"
                ? themeStyle === "vibrant"
                  ? "text-orange-600 border-b-2 border-orange-500 font-extrabold"
                  : "text-[#516138] border-b-2 border-[#516138] font-extrabold"
                : "text-gray-400"
            }`}
          >
            Drinks & Sides
          </button>
        </div>
      </nav>

      {/* Menu Grid */}
      <main className="p-5 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {getMenuList().map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col justify-between p-4 group transition-all h-full shadow-sm hover:shadow-md hover:-translate-y-0.5`}
            >
              <div className="flex gap-4">
                {/* Image panel */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 relative">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={item.image}
                    alt={item.name}
                  />
                  <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                    {item.isVegan && (
                      <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                        VEGAN
                      </span>
                    )}
                    {item.isGlutenFree && (
                      <span className="bg-amber-500/90 backdrop-blur-sm text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                        GF
                      </span>
                    )}
                    {item.isBestseller && (
                      <span className="bg-orange-500/90 backdrop-blur-sm text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                        BEST
                      </span>
                    )}
                  </div>
                </div>

                {/* Info block */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-display font-bold text-sm sm:text-base text-gray-900 line-clamp-1">
                        {item.name}
                      </h3>
                      <span className={`text-sm sm:text-base font-extrabold shrink-0 ${
                        themeStyle === "vibrant" ? "text-orange-600" : "text-[#516138]"
                      }`}>
                        {getCurrencyPrice(item.price)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs font-sans line-clamp-2 leading-relaxed mb-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 tracking-wider">
                      {item.kcal} KCAL
                    </span>
                    <button
                      onClick={() => handleAddClick(item)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-all cursor-pointer ${
                        recentlyAdded === item.id
                          ? "bg-emerald-500 text-white"
                          : themeStyle === "vibrant"
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : "bg-[#516138] text-white hover:bg-[#697a4f]"
                      }`}
                    >
                      {recentlyAdded === item.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Status Cart Button - View Your Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 left-0 w-full px-5 z-40 transform transition-transform duration-300 ease-out">
          <button
            onClick={onViewCart}
            className={`w-full max-w-lg mx-auto ${
              themeStyle === "vibrant"
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-[#516138] hover:bg-[#697a4f] text-white"
            } h-14 rounded-full shadow-lg flex items-center justify-between px-6 active:scale-[0.98] transition-transform animate-bounce-subtle cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              <div className={`text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                themeStyle === "vibrant" ? "bg-white text-orange-600" : "bg-white text-[#516138]"
              }`}>
                {cartCount}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider font-display">
                View Your Cart
              </span>
            </div>
            <span className="text-base font-bold font-display">
              {themeStyle === "serene" ? "₹" : "$"}
              {cartTotal.toFixed(2)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
