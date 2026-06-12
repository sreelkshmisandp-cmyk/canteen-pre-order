import React, { useState } from "react";
import { Search, MapPin, Star, Heart, Clock, ShoppingBag, ArrowRight } from "lucide-react";
import { Canteen, MenuItem } from "../types";
import { CANTEENS, CATEGORIES } from "../data";

interface DiscoverViewProps {
  location: string;
  onSelectLocation: (loc: string) => void;
  currency: string;
  onSelectCanteen: (canteen: Canteen) => void;
  onAddToCartDirect: (item: MenuItem, canteen: Canteen) => void;
  themeStyle: "vibrant" | "serene";
}

export default function DiscoverView({
  location,
  onSelectLocation,
  currency,
  onSelectCanteen,
  onAddToCartDirect,
  themeStyle,
}: DiscoverViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter canteens based on selected location
  const filteredCanteens = CANTEENS.filter((canteen) => {
    // Show appropriate canteens based on USD vs INR location mappings
    if (currency === "$") {
      return canteen.location === "Engineering Block" || canteen.id === "green-bowl";
    } else {
      return canteen.location !== "Engineering Block";
    }
  });

  // Filter based on search query
  const searchedCanteens = filteredCanteens.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedCategory) {
      const matchesCategory = c.tags.some(
        (t) => t.toLowerCase() === selectedCategory.toLowerCase()
      ) || c.cuisine.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    }
    return matchesSearch;
  });

  // Hotlink or fallback image placeholders matching exactly
  const bannerImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuAJkMPcp2wCXcfZN-EdG8DliJVaKVsNmPheutOClMfr5--BvzBofxA19DbX_NZ328JGfOKENQmJk5Cd4P3G8Pj6x2tTAA8-k6fsvx_VXJg0XIywHCxcNCsaHnM5d7wyJsyMWApH1W-e82EtWlbYkGJlGMhGXMRN4V-g3-1h_5EEgFMMFHyLK4m3mpTXUtqXly_sbDzV3aBinhNXKPsHB9j6QIGGI0vNymyHzd5E1lZZOZjL6HTsf3GoHuFYoCEK92M2jL40sQsIW9I";

  const getPriceSymbol = (level: string) => {
    if (currency === "₹") {
      return level.replace(/\$/g, "₹");
    }
    return level;
  };

  const getCategoryIcon = (id: string, colorClass: string) => {
    switch (id) {
      case "pizza":
        return <span className="text-xl">🍕</span>;
      case "bowls":
        return <span className="text-xl">🥗</span>;
      case "coffee":
        return <span className="text-xl">☕</span>;
      case "salads":
        return <span className="text-xl">🥑</span>;
      case "desserts":
      case "sweet":
        return <span className="text-xl">🧁</span>;
      case "drinks":
        return <span className="text-xl">🍹</span>;
      default:
        return <span className="text-xl">🍔</span>;
    }
  };

  // Seasonal/Specials data to show on Serene Campus screen
  const sereneSpecials = [
    {
      id: "special-1",
      name: "Classic Margherita",
      category: "WOODFIRED",
      price: 249,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA28tuW1-OmKBOnJewfQorCm5hMIUQ74qeYYdYyS5ZkKinGBWIUOIPUyZwesMENJ5UFgnhdGVc_1e4WJF7-YtC7pVHEEAqy0k-HjvakYXqUWCFoXU1udkFlZOaDUZfBYGNm4ZujLzxOdrD8wnWBQC3i0K6--pSZu3ZR_cNFkveH0tFkf8kzYeD3wuTcWi_6CsTHzctBdkCtsjsPV0GHmwcm4ftJxdYav1uLXy_xHiMfu-LeeJNAMOjAjRZEuDJToFVtx7EGYQOhZU",
      canteenId: "burger-loft", // Fallback association
    },
    {
      id: "special-2",
      name: "Salmon Zen Bowl",
      category: "FRESH BOWL",
      price: 380,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAE0596ALmR0i3-xDd-18R6ikkgPq2XD8hgHHDase-wgPDopjeXV9-FNTg7k8jSbcYyB5DWd_54UbgiHN8HdOeMUvoQuMF6-PiSliOz8aRjujXbVSb0J97Xe92GQZ5iVMaeGuyZH6449pP2_HZ_bOmawZto43j-vktvDeTFhoVJLNxbvU3axWOUnyEs2e0C3Ktc0Qvx9L-k0FakzZ3CMJChRDYXaHYV-pyOxPlKZJOO_54HmX7EWHUmg7w56OrqCSUz9GvhsYi1L04",
      canteenId: "north-wing-cafe",
    },
    {
      id: "special-3",
      name: "Honey Glaze Box",
      category: "SWEET TREAT",
      price: 120,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCxwPoZyw9FxAQE9URvcQFp27-saOTRuCLTY4GXYR2m4dRjEgFxoT6xZM2lciGFGNXsHhw7sdhKPuoys5dUiujIwU9n2E4J-9edAGirTQWJdE7OcIOODEJ78r5FvAsl7OCnp6wAKUH_RlYZyso3JM3EMcB5LKcgocjc3W0WBWtO0Y9tsehfy2SAt_LSvL3ETmFFzIfzB9UHde_rhuPEfOXhQu3tsB2t0BPuSr-01hwFu6F_za0smhaut0w97hm9Hd5iWDaGQItoWI",
      canteenId: "atrium-brew",
    },
    {
      id: "special-4",
      name: "Matcha Zen Latte",
      category: "BREWED",
      price: 185,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfY0-GZpUz-J91W-3X80PY2wQoOlloCTYOnvfsiKgMbcXOI_ISJaixGljCX0U0XVxUOnVF85ydhT_a70Xweo-YvmR9VvtC4YxXi9j3zOKiz3X9BhPi3XtfDy5o5lR3GUsrUCLv--wIzCpxehMJ293EZ3tZ0xtdWkDTrPZf3TuF3TYVwRYitV7-mJ6WI0P9syBTb6Fl_0dGHMWZMIdHqdPcoM6-QI1k2MRLnj44wftWSPuPKMy8FiE-3pMwhccWNZccnrMJZgAy0K4",
      canteenId: "atrium-brew",
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Search Input Box */}
      <section className="px-5 mt-4 sm:px-6">
        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full h-12 pl-12 pr-4 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-amber-500 text-gray-800 transition-all shadow-sm outline-none"
            placeholder={
              themeStyle === "vibrant"
                ? "Search for meals or canteens..."
                : "Find meals or canteens..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      {/* Promo Banner */}
      <section className="px-5 mt-6 sm:px-6">
        {themeStyle === "vibrant" ? (
          /* Vibrant Appetizing Orange Banner (Engineering Block) */
          <div className="relative overflow-hidden rounded-2xl h-44 bg-gradient-to-r from-orange-500 to-amber-600 flex items-center p-6 shadow-lg max-w-4xl mx-auto">
            {/* SVG Abstract Background */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-15 transform translate-x-1/4 pointer-events-none">
              <svg className="h-full w-full fill-white" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.7,-31.3,87.1,-15.7,85.2,-0.7C83.2,14.3,75.9,28.6,66.8,41.4C57.7,54.1,46.8,65.3,33.5,72.4C20.2,79.5,4.6,82.5,-11.2,80.6C-27,78.7,-43,72,-55.5,61.1C-68.1,50.1,-77.2,34.9,-81.2,18.7C-85.3,2.5,-84.3,-14.7,-77.5,-29.4C-70.7,-44.2,-58.1,-56.4,-44,-63.9C-29.8,-71.4,-14.9,-74.2,0.4,-74.9C15.7,-75.6,31.3,-83.5,44.7,-76.4Z" transform="translate(100 100)"></path>
              </svg>
            </div>
            <div className="relative z-10 w-2/3">
              <h2 className="text-xl font-bold font-display text-white mb-1">Skip the Queue</h2>
              <p className="text-xs text-white opacity-90 mb-4 font-sans max-w-sm">
                Pre-order your lunch and pick it up instantly. No more waiting.
              </p>
              <button 
                onClick={() => {
                  const bowl = CANTEENS.find(c => c.id === "green-bowl");
                  if (bowl) onSelectCanteen(bowl);
                }}
                className="bg-white text-orange-600 px-5 py-2 rounded-full text-xs font-semibold shadow-md active:scale-95 transition-transform hover:bg-orange-50 cursor-pointer"
              >
                Order Now
              </button>
            </div>
            <div className="absolute bottom-[-15px] right-[-15px] opacity-20 hidden md:block">
              <Clock className="w-36 h-36 text-white" />
            </div>
          </div>
        ) : (
          /* Serene Sage Green Elegant Banner (Main Campus) */
          <div 
            onClick={() => {
              const bowl = CANTEENS.find(c => c.id === "green-bowl");
              if (bowl) onSelectCanteen(bowl);
            }}
            className="relative w-full h-[200px] md:h-[260px] rounded-2xl overflow-hidden shadow-sm bg-stone-900 group cursor-pointer max-w-4xl mx-auto"
          >
            <img 
              className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" 
              src={bannerImage} 
              alt="Skip the queue banner" 
            />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
              <h3 className="font-display font-bold text-2xl md:text-4xl text-white mb-2 leading-tight">
                Skip the Queue.
              </h3>
              <p className="text-sm text-gray-200 opacity-90 max-w-md font-sans mb-3">
                Pre-order your favorite campus meals and pick them up at the designated Zen-Point.
              </p>
              <button className="px-5 py-2 bg-[#516138] text-white text-xs font-medium font-sans rounded-full w-fit hover:bg-opacity-95 transition-all active:scale-95">
                Pre-order Now
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Horizontal Categories */}
      <section className="mt-8 max-w-4xl mx-auto">
        <div className="px-5 flex justify-between items-center mb-4">
          <h3 className={`font-display font-semibold ${themeStyle === "vibrant" ? "text-lg text-gray-900" : "text-lg text-stone-800"}`}>
            Categories
          </h3>
          <button className={`text-xs font-medium cursor-pointer hover:underline ${themeStyle === "vibrant" ? "text-orange-600" : "text-[#516138]"}`}>
            View All
          </button>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-4 px-5 pb-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer active:scale-95 transition-transform group"
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-sm ${
                    isSelected
                      ? themeStyle === "vibrant"
                        ? "bg-orange-500 text-white"
                        : "bg-[#516138] text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {getCategoryIcon(cat.id, "")}
                </div>
                <span className={`text-xs font-medium tracking-wider uppercase text-[10px] ${isSelected ? "text-gray-900 font-bold" : "text-gray-500"}`}>
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Canteens Card List */}
      <section className="mt-8 px-5 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className={`font-display font-semibold ${themeStyle === "vibrant" ? "text-lg text-gray-900" : "text-lg text-stone-800"}`}>
            Popular Canteens
          </h3>
          <span className={`text-xs font-medium cursor-pointer hover:underline ${themeStyle === "vibrant" ? "text-orange-600" : "text-[#516138]"}`}>
            View all
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchedCanteens.length > 0 ? (
            searchedCanteens.map((canteen) => (
              <div
                key={canteen.id}
                onClick={() => onSelectCanteen(canteen)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col group"
              >
                <div className="h-44 relative overflow-hidden bg-gray-50">
                  <img
                    alt={canteen.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={canteen.image}
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-gray-800">
                      {canteen.rating}
                    </span>
                  </div>
                  <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${
                    themeStyle === "vibrant"
                      ? "bg-orange-500 text-white"
                      : "bg-[#516138] text-white"
                  }`}>
                    {canteen.deliveryTime}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="text-base font-bold font-display text-gray-900 group-hover:text-orange-600 transition-colors">
                        {canteen.name}
                      </h4>
                      <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 hover:fill-red-500 transition-colors" />
                    </div>
                    <div className="flex gap-2 items-center text-gray-500 text-xs font-sans">
                      <span className="flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        {canteen.deliveryOnly ? "Delivery Only" : "Pickup Available"}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                      <span>{getPriceSymbol(canteen.priceLevel)}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {canteen.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                          themeStyle === "vibrant"
                            ? "bg-teal-50 text-teal-700"
                            : "bg-[#516138]/10 text-[#516138]"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-gray-500">
              No canteens match your query. Try searching for something else!
            </div>
          )}
        </div>
      </section>

      {/* Seasonal Highlights - Displays on Serene campus / INR mode (Screen 5) */}
      {themeStyle === "serene" && (
        <section className="mt-12 px-5 max-w-4xl mx-auto">
          <h2 className="font-display font-semibold text-lg text-stone-800 mb-4 border-b border-gray-100 pb-2">
            Today's Specials
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sereneSpecials.map((special) => (
              <div
                key={special.id}
                className="bg-white p-3 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow cursor-pointer flex flex-col justify-between"
              >
                <div 
                  onClick={() => {
                    const cant = CANTEENS.find(c => c.id === special.canteenId);
                    if (cant) onSelectCanteen(cant);
                  }}
                >
                  <img
                    className="w-full aspect-square object-cover rounded-lg mb-2.5"
                    src={special.image}
                    alt={special.name}
                  />
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5 font-sans">
                    {special.category}
                  </p>
                  <h5 className="text-xs font-semibold text-gray-800 mb-2 truncate">
                    {special.name}
                  </h5>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-[#516138]">
                    ₹{special.price}
                  </span>
                  <button
                    onClick={() => {
                      const cant = CANTEENS.find(c => c.id === special.canteenId);
                      const mItem = cant?.menu.find(m => m.name === special.name) || {
                        id: special.id,
                        name: special.name,
                        description: "",
                        price: special.price,
                        kcal: 250,
                        isVegan: true,
                        isGlutenFree: false,
                        image: special.image
                      };
                      if (cant) onAddToCartDirect(mItem, cant);
                    }}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-[#516138] hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
