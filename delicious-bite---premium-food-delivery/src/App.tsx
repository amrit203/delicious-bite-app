import React, { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FoodCard } from './components/FoodCard';
import { CartSheet } from './components/CartSheet';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { CATEGORIES } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ShieldAlert, Star } from 'lucide-react';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';

const MainContent = () => {
  const { menu, isAdmin, setIsAdmin } = useApp();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMenu = menu.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      setIsAdminLoginOpen(false);
      setAdminPassword('');
    } else {
      alert('Invalid password');
    }
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <AdminPanel />
        <Toaster position="top-center" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar 
        onCartOpen={() => setIsCartOpen(true)} 
        onAdminOpen={() => setIsAdminLoginOpen(true)} 
      />
      
      <main className="flex-grow">
        <Hero />

        {/* Menu Section */}
        <section id="menu" className="py-24 bg-muted/30">
          <div className="container px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Our Menu</Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-6">Explore Our <span className="text-primary">Delicious</span> Menu</h2>
              <p className="text-muted-foreground">Every item is crafted fresh to order. Find your next favorite dish among our curated selection.</p>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
              <div className="flex flex-wrap justify-center gap-2">
                {CATEGORIES.map(cat => (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? 'default' : 'outline'}
                    className="rounded-full px-6 font-bold"
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search dishes..." 
                  className="pl-10 rounded-full h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence>
                {filteredMenu.map(item => (
                  <FoodCard key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>

            {filteredMenu.length === 0 && (
              <div className="text-center py-20">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-bold">No dishes found</h3>
                <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
              </div>
            )}
          </div>
        </section>

        {/* Why Us Section */}
        <section className="py-24">
          <div className="container px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Utensils className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Fresh Ingredients</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">We source locally every morning. Only the freshest produce makes it to your plate.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Hot food at your door within 30 minutes. Speed is our promise to you.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Best Prices</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Premium flavors at everyday prices. Great food should be affordable for everyone.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />

      {/* Admin Login Dialog */}
      <Dialog open={isAdminLoginOpen} onOpenChange={setIsAdminLoginOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" /> Admin Access
            </DialogTitle>
            <DialogDescription>
              Enter the administrator password to access the management panel.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              type="password" 
              placeholder="Enter password" 
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdminLoginOpen(false)}>Cancel</Button>
            <Button onClick={handleAdminLogin}>Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster position="top-center" />
    </div>
  );
};

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </div>
);

const Utensils = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
