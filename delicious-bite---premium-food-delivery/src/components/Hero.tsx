import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { Utensils, Clock, Star } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden hero-gradient text-white">
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop" 
          className="w-full h-full object-cover"
          alt="Hero background"
        />
      </div>
      
      <div className="container relative z-10 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <Badge className="mb-6 bg-primary/20 text-primary-foreground border-primary/30 py-1 px-4 text-sm font-bold">
            ✨ Now Serving in Kathmandu
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Taste the <span className="text-primary">Extraordinary</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 font-medium leading-relaxed">
            Premium flavors, fresh ingredients, and lightning-fast delivery. 
            Experience the best food in town, delivered straight to your door.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg font-bold rounded-full gap-2" 
              render={<a href="#menu">Order Now <Utensils className="w-5 h-5" /></a>}
            />
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-full bg-white/10 border-white/20 hover:bg-white/20">
              View Menu
            </Button>
          </div>

          <div className="flex gap-8 mt-16">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-primary">50+</span>
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Dishes</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-primary">4.9★</span>
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Rating</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-primary">25m</span>
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Avg Time</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="hidden lg:block absolute right-[-5%] top-[15%] w-[45%]"
      >
        <img 
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop" 
          alt="Featured Burger"
          className="rounded-full border-[15px] border-white/10 shadow-2xl"
          referrerPolicy="no-referrer"
        />
      </motion.div>
    </section>
  );
};

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </div>
);
