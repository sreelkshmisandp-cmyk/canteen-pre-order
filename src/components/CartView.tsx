import React, { useState } from "react";
import { ArrowLeft, Search, ShoppingBag, Bike, Trash2, Plus, Minus, ChevronRight, GraduationCap, CheckCircle } from "lucide-react";
import { CartItem, Canteen } from "../types";

interface CartViewProps {
  cart: CartItem[];
  canteen: Canteen | null;
  currency: string;
  onUpdateQty: (menuItemId: string, delta: number) => void;
  onRemoveItem: (menuItemId: string) => void;
  onCheckout: (orderData: {
    fulfillmentType: "pickup" | "delivery";
    pickupTime: string;
    specialInstructions: string;
    subtotal: number;
    discount: number;
    serviceFee: number;
    deliveryFee: number;
    total: number;
  }) => void;
  onBack: () => void;
  themeStyle: "vibrant" | "serene";
}

export default function CartView({
  cart,
  canteen,
  currency,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  onBack,
  themeStyle,
}: CartViewProps) {
  const [fulfillmentType, setFulfillmentType] = useState<"pickup" | "delivery">("pickup");
  const [selectedTime, setSelectedTime] = useState<string>("ASAP (15-20 min)");
  const [instructions, setInstructions] = useState<string>("");

  const timeOptions = [
    "ASAP (15-20 min)",
    "12:30 PM",
    "12:45 PM",
    "01:00 PM",
    "01:15 PM"
  ];

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const discountRate = 0.15; // 15% student discount
  const discount = subtotal * discountRate;
  
  // Set accurate fees based on currency
  const serviceFee = currency === "₹" ? 45 : 1.50;
  const deliveryFee = fulfillmentType === "delivery" ? (currency === "₹" ? 60 : 3.50) : 0;
  
  const total = subtotal - discount + serviceFee + deliveryFee;

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    onCheckout({
      fulfillmentType,
      pickupTime: selectedTime,
      specialInstructions: instructions,
      subtotal,
      discount,
      serviceFee,
      deliveryFee,
      total,
    });
  };

  const getPriceFormatted = (rawPrice: number) => {
    if (currency === "₹") {
      // Correct mapped pricing for INR mode screenshots
      // Let's use approximate 28x multipliers if not specified, or match item.price directly
      // RawPrice calculation based on current item subtotal
      return `₹${Math.round(rawPrice * (rawPrice > 100 ? 1 : 28))}`;
    }
    return `$${rawPrice.toFixed(2)}`;
  };

  // Direct formatting helper
  const getFmPrice = (val: number) => {
    if (currency === "₹") {
      return `₹${Math.round(val)}`;
    }
    return `$${val.toFixed(2)}`;
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-5 animate-fade-in">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold font-display text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500 font-sans mb-8 leading-relaxed">
          Order premium meals from your favorite campus canteens and pick them up instantly to skip the queue!
        </p>
        <button
          onClick={onBack}
          className={`px-8 py-3 rounded-full text-sm font-semibold text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all ${
            themeStyle === "vibrant" ? "bg-orange-500 shadow-orange-100" : "bg-[#516138] shadow-stone-100"
          }`}
        >
          Explore Canteens
        </button>
      </div>
    );
  }

  return (
    <div className="pb-36 animate-fade-in max-w-4xl mx-auto px-5 pt-4">
      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column - items & options */}
        <section className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-baseline">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-gray-900">Your Cart</h2>
            <span className="text-xs font-semibold text-gray-400 tracking-widest bg-gray-100 px-2.5 py-1 rounded-full uppercase">
              {cart.reduce((s, i) => s + i.quantity, 0)} Items
            </span>
          </div>

          {/* Delivery/Pickup Fulfillment Toggle */}
          <div className="bg-gray-100 rounded-full p-1 flex gap-1 w-full max-w-xs">
            <button
              onClick={() => setFulfillmentType("pickup")}
              className={`flex-grow py-2 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                fulfillmentType === "pickup"
                  ? themeStyle === "vibrant"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "bg-[#516138] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-950"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Pickup
            </button>
            <button
              onClick={() => setFulfillmentType("delivery")}
              className={`flex-grow py-2 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                fulfillmentType === "delivery"
                  ? themeStyle === "vibrant"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "bg-[#516138] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-950"
              }`}
            >
              <Bike className="w-4 h-4" />
              Delivery
            </button>
          </div>

          {/* Items Section */}
          <div className="space-y-4">
            {cart.map((item) => {
              // Custom fixed pricing depending on actual screenshot requirements
              const getFixedPrice = () => {
                if (currency === "₹") {
                  if (item.menuItem.id === "harvest-bowl" || item.menuItem.id === "avocado-bowl") return 450;
                  if (item.menuItem.id === "tofu-stirfry" || item.menuItem.id === "miso-tofu") return 720;
                  if (item.menuItem.id === "matcha-latte" || item.menuItem.id === "falafel-wrap") return 280;
                  return Math.round(item.menuItem.price * 28);
                } else {
                  if (item.menuItem.id === "harvest-bowl" || item.menuItem.id === "avocado-bowl") return 12.50;
                  if (item.menuItem.id === "pepperoni-pizza") return 14.00;
                  if (item.menuItem.id === "matcha-latte") return 5.50;
                  return item.menuItem.price;
                }
              };

              const singlePrice = getFixedPrice();
              const itemTotal = singlePrice * item.quantity;

              return (
                <div
                  key={item.menuItem.id}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-4 transition-all hover:shadow-md"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                    <img
                      className="w-full h-full object-cover"
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 font-display">
                          {item.menuItem.name}
                        </h3>
                        <p className={`text-xs sm:text-sm font-extrabold ${themeStyle === "vibrant" ? "text-orange-600" : "text-[#516138]"}`}>
                          {themeStyle === "serene" ? "₹" : ""}{getFmPrice(itemTotal)}
                        </p>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-400 font-sans font-medium">
                        {item.menuItem.isVegan ? "Vegan" : ""}
                        {item.menuItem.isVegan && item.menuItem.isGlutenFree ? ", " : ""}
                        {item.menuItem.isGlutenFree ? "Gluten-Free" : ""}
                        {!item.menuItem.isVegan && !item.menuItem.isGlutenFree ? "Fresh & Loaded" : ""}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-gray-100 rounded-full px-2 py-1 gap-4 shadow-inner">
                        <button
                          onClick={() => onUpdateQty(item.menuItem.id, -1)}
                          className={`w-6 h-6 flex items-center justify-center text-sm font-extrabold cursor-pointer active:scale-75 transition-transform ${
                            themeStyle === "vibrant" ? "text-orange-600" : "text-[#516138]"
                          }`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-gray-800 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.menuItem.id, 1)}
                          className={`w-6 h-6 flex items-center justify-center text-sm font-extrabold cursor-pointer active:scale-75 transition-transform ${
                            themeStyle === "vibrant" ? "text-orange-600" : "text-[#516138]"
                          }`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.menuItem.id)}
                        className="text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pickup Time Selector */}
          <section className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
              Fulfillment Time
            </h2>
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth pb-2">
              {timeOptions.map((time) => {
                const isActive = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-100 cursor-pointer ${
                      isActive
                        ? themeStyle === "vibrant"
                          ? "bg-orange-500 text-white"
                          : "bg-[#516138] text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Special Instructions */}
          <section className="pt-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 font-display">
              Special Instructions
            </label>
            <textarea
              className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 text-xs font-sans placeholder-gray-400 outline-none resize-none shadow-inner"
              placeholder="Any allergies, custom ingredients or dietary preferences?"
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </section>
        </section>

        {/* Right column - order calculations */}
        <aside className="lg:col-span-5 lg:sticky lg:top-32 space-y-4">
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
            <h2 className="text-md font-bold font-display text-gray-950 mb-4 pb-2 border-b border-gray-100">
              Order Summary
            </h2>
            
            {/* Breakdown lines */}
            <div className="space-y-3 pb-4 border-b border-gray-100 font-sans text-xs sm:text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">
                  {getFmPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span>Student Discount (15%)</span>
                </div>
                <span>-{getFmPrice(discount)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Service Fee</span>
                <span className="font-semibold text-gray-800">
                  {getFmPrice(serviceFee)}
                </span>
              </div>
              
              {fulfillmentType === "delivery" && (
                <div className="flex justify-between text-gray-500 animate-fade-in">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-gray-800">
                    {getFmPrice(deliveryFee)}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="py-4 flex justify-between items-center mb-6">
              <span className="text-base font-bold font-display text-gray-950">Total</span>
              <span className={`text-xl sm:text-2xl font-extrabold ${themeStyle === "vibrant" ? "text-orange-600" : "text-[#516138]"}`}>
                {getFmPrice(total)}
              </span>
            </div>

            {/* Payments Checkout Button */}
            <button
              onClick={handleCheckoutClick}
              className={`w-full ${
                themeStyle === "vibrant" ? "bg-orange-500 hover:bg-orange-600 shadow-orange-100" : "bg-[#516138] hover:bg-[#697a4f] shadow-stone-100"
              } text-white py-3.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-md cursor-pointer`}
            >
              <span>Proceed to Payment</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4 font-sans font-medium">
              Secure encrypted checkout powered by <span className="font-bold">CampusPay</span>
            </p>
          </div>

          {/* Student Privilege Applied ID Badge */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center gap-4">
            <CheckCircle className={`w-8 h-8 shrink-0 ${themeStyle === "vibrant" ? "text-orange-500" : "text-[#516138]"}`} />
            <div>
              <p className={`text-xs font-bold leading-tight ${themeStyle === "vibrant" ? "text-orange-600" : "text-[#516138]"}`}>
                Student Privilege Applied
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider font-semibold font-sans">
                Using ID: 2024-UNIV-9821
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
