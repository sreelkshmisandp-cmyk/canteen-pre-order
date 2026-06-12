export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  kcal: number;
  isVegan: boolean;
  isGlutenFree: boolean;
  isBestseller?: boolean;
  image: string;
}

export interface Canteen {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  ratingCount: number;
  deliveryTime: string;
  deliveryOnly: boolean;
  priceLevel: string; // "$", "$$", "$$$" or "₹", "₹₹", "₹₹₹"
  currency: string; // "$" or "₹"
  image: string;
  location: string;
  tags: string[];
  menu: MenuItem[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customization?: string;
  canteenId: string;
  canteenName: string;
}

export interface Order {
  id: string;
  canteen: Canteen;
  items: CartItem[];
  subtotal: number;
  discount: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
  fulfillmentType: "pickup" | "delivery";
  pickupTime: string;
  specialInstructions: string;
  timestamp: string;
  estimatedMinutes: number;
  status: "Preparing" | "Ready" | "Completed";
}
