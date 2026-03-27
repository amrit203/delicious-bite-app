import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, Order, SiteSettings } from './types';
import { INITIAL_MENU, INITIAL_SETTINGS } from './constants';

interface AppContextType {
  menu: MenuItem[];
  orders: Order[];
  settings: SiteSettings;
  cart: { menuItemId: string; quantity: number }[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateMenu: (newMenu: MenuItem[]) => void;
  updateSettings: (newSettings: SiteSettings) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('db_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('db_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('db_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [cart, setCart] = useState<{ menuItemId: string; quantity: number }[]>(() => {
    const saved = localStorage.getItem('db_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('is_admin') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('db_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('db_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('db_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('db_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('is_admin', isAdmin.toString());
  }, [isAdmin]);

  const addToCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.menuItemId === id);
      if (existing) {
        return prev.map(item => item.menuItemId === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { menuItemId: id, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.menuItemId !== id));
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.menuItemId === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateMenu = (newMenu: MenuItem[]) => setMenu(newMenu);
  const updateSettings = (newSettings: SiteSettings) => setSettings(newSettings);
  
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status } : order));
  };

  return (
    <AppContext.Provider value={{
      menu, orders, settings, cart,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      addOrder, updateMenu, updateSettings, updateOrderStatus,
      isAdmin, setIsAdmin
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
