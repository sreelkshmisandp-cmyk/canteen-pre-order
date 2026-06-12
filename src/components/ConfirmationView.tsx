import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, MapPin, Map, HelpCircle, ArrowLeft, Heart, CreditCard, Award } from "lucide-react";
import { Order, Canteen, MenuItem } from "../types";

interface ConfirmationViewProps {
  order: Order;
  onHome: () => void;
  themeStyle: "vibrant" | "serene";
}

export default function ConfirmationView({
  order,
  onHome,
  themeStyle,
}: ConfirmationViewProps) {
  const [secondsLeft, setSecondsLeft] = useState(292); // 4 minutes 52 seconds standard starting
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCountdown = () => {
    if (isReady) return "READY";
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `0${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Hotlink matching the digital QR mockup from screenshot 4
  const qrImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuDsnIW-rxkz-YAQEmUcE2EH9GWKBwgx8MoBe1rGv-2PAHouqkQmFItd709TZKUUkDTt1MWg_EduSO1YTRa7R2l5IR_kmwkJhefX4ZWVrMPhYLyFpYoK9L1hNCPc4wru_oHPrQYxgzImUPEJjtV5w9IRPCDWcL556SasqXYAGTu1SXxzdLsnt69N2epf7z7shMiKaoJwL9ylDiKXwkwKp1HtytU004q5sSodulRccQVZm45GUz3Cd0xXD8fVCJEmM-vrf0FfX8WXy0U";

  const getFmPrice = (val: number) => {
    if (order.canteen.currency === "₹") {
      return `₹${Math.round(val)}`;
    }
    return `$${val.toFixed(2)}`;
  };

  return (
    <div className="pb-32 animate-fade-in max-w-md mx-auto px-5 pt-6">
      {/* Success Hero */}
      <section className="flex flex-col items-center text-center mb-8">
        <div className="relative mb-4">
          {/* Pulsing Back Ring */}
          <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping pointer-events-none" />
          <div className="relative bg-emerald-50 border border-emerald-100 w-20 h-20 rounded-full flex items-center justify-center shadow-inner">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
        </div>
        <h1 className="font-display font-bold text-xl sm:text-2xl text-gray-950 mb-1">
          Order Confirmed!
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm font-sans max-w-sm leading-relaxed">
          We've received your order and the kitchen has started preparing your meal.
        </p>
      </section>

      {/* ETA Preparing Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center mb-6">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-display">
            Estimated Ready In
          </p>
          <div className="flex items-baseline gap-1 mt-1 font-display">
            <span className={`text-4xl font-extrabold ${themeStyle === "vibrant" ? "text-orange-500" : "text-[#516138]"}`}>
              {formatCountdown()}
            </span>
            {!isReady && <span className="text-xs text-gray-500 font-bold ml-1">mins</span>}
          </div>
        </div>
        
        {/* Preparing Status Pulse Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse ${
          themeStyle === "vibrant" 
            ? "bg-orange-50 text-orange-600" 
            : "bg-stone-100 text-stone-700"
        }`}>
          <Clock className="w-3.5 h-3.5 animate-spin-slow text-orange-500" />
          <span>{isReady ? "Ready" : "Preparing"}</span>
        </div>
      </div>

      {/* QR Code Counter Release container */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-150 relative overflow-hidden mb-6">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 font-display">
            Scan at Counter
          </span>
          <div className="relative p-3 bg-white rounded-xl border border-gray-100 shadow-sm mb-4">
            {/* Red Laser Scan Line effect */}
            <div className="absolute left-3 right-3 top-3 h-[2px] bg-red-500 animate-scan pointer-events-none" />
            <img
              className="w-44 h-44 object-contain opacity-95"
              src={qrImage}
              alt="Order release QR code"
            />
          </div>
          <h3 className="font-display font-semibold text-sm sm:text-base text-gray-900 mb-1">
            Show this at the counter
          </h3>
          <p className="text-gray-400 text-center text-xs leading-relaxed font-sans max-w-[280px]">
            Once the status updates to <span className="font-bold text-gray-600">"Ready"</span>, show this QR code at the counter to retrieve your hot meal.
          </p>
          <p className="text-[10px] bg-gray-100 px-3 py-1 text-gray-500 rounded-full font-bold uppercase tracking-wider mt-4">
            Order ID: {order.id}
          </p>
        </div>

        {/* CSS Ticket Cutouts on margins */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border border-gray-150" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full border border-gray-150" />
      </div>

      {/* Bento breakdown cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-100/60 p-4 rounded-xl flex flex-col justify-between">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-display">
            Payment Method
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <CreditCard className={`w-4 h-4 ${themeStyle === "vibrant" ? "text-orange-500" : "text-[#516138]"}`} />
            <p className="text-xs font-bold text-gray-800">Apple Pay (...4242)</p>
          </div>
        </div>
        
        <div className="bg-gray-100/60 p-4 rounded-xl flex flex-col justify-between">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-display">
            Campus Points
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <Award className="w-4 h-4 text-amber-500" />
            <p className="text-xs font-bold text-gray-800">
              +{Math.round(order.total * 1.5)} Points
            </p>
          </div>
        </div>

        {/* Quick Summary list */}
        <div className="bg-gray-100/60 p-4 rounded-xl col-span-2">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-display">
              Order Details ({order.items.reduce((s, i) => s + i.quantity, 0)} Items)
            </p>
            <p className={`text-xs font-bold ${themeStyle === "vibrant" ? "text-orange-600" : "text-[#516138]"}`}>
              {getFmPrice(order.total)}
            </p>
          </div>
          <ul className="space-y-2 max-h-32 overflow-y-auto no-scrollbar pr-1">
            {order.items.map((i) => (
              <li key={i.menuItem.id} className="flex justify-between text-xs text-gray-600 font-sans">
                <span className="font-semibold">{i.quantity}x {i.menuItem.name}</span>
                <span>{getFmPrice(i.menuItem.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action links */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => {
            alert("Routing map instructions triggered! Directions point to " + order.canteen.name + " (" + order.canteen.location + ").");
          }}
          className={`w-full py-4 uppercase font-display tracking-wider text-xs font-bold flex items-center justify-center gap-2 rounded-xl text-white shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer ${
            themeStyle === "vibrant" ? "bg-orange-500 shadow-orange-100" : "bg-[#516138] shadow-stone-100"
          }`}
        >
          <Map className="w-4 h-4" />
          Get Map Directions
        </button>
        
        <button
          onClick={() => {
            alert("Connecting to Campus support! A representative is joining the session shortly.");
          }}
          className="w-full py-4 text-xs font-bold uppercase tracking-wider text-gray-700 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-gray-500" />
          Need Help?
        </button>
        
        <button
          onClick={onHome}
          className={`w-full py-3 text-xs font-bold uppercase tracking-wider ${
            themeStyle === "vibrant" ? "text-orange-500 hover:text-orange-600" : "text-[#516138] hover:text-[#697a4f]"
          } flex items-center justify-center gap-1 cursor-pointer hover:underline`}
        >
          Return to Canteens
        </button>
      </div>
    </div>
  );
}
