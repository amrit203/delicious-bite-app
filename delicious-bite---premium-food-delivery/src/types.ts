export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  image: string;
  badge?: string;
  isPopular: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  countryCode: string;
  address: string;
  items: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  deliveryFee: number;
  taxRate: number;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  currencySymbol: string;
}

export const COUNTRY_CODES = [
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
];

export const CATEGORIES = ["All", "Pizza", "Burger", "Momo", "Sushi", "Dessert", "Drinks"];
