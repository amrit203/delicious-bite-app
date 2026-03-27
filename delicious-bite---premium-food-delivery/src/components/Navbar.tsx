import React from 'react';
import { useApp } from '../AppContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, User, ShieldCheck, Moon, Sun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';

interface NavbarProps {
  onCartOpen: () => void;
  onAdminOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCartOpen, onAdminOpen }) => {
  const { cart, settings, isAdmin } = useApp();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 w-full border-b glass">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="text-2xl">🍔</span>
          <span className="text-xl font-black tracking-tighter hidden sm:inline-block">
            {settings.siteName.split(' ')[0]}<span className="text-primary">{settings.siteName.split(' ')[1]}</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#menu" className="text-sm font-bold hover:text-primary transition-colors">Menu</a>
          <a href="#about" className="text-sm font-bold hover:text-primary transition-colors">About</a>
          <a href="#reviews" className="text-sm font-bold hover:text-primary transition-colors">Reviews</a>
          <a href="#contact" className="text-sm font-bold hover:text-primary transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={onAdminOpen}
          >
            {isAdmin ? <ShieldCheck className="w-5 h-5 text-primary" /> : <User className="w-5 h-5" />}
          </Button>
          
          <Button 
            className="relative rounded-full px-4 font-bold gap-2"
            onClick={onCartOpen}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-white text-primary border-2 border-primary">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};
