import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { MenuItem } from '../types';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Plus, Minus, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { addToCart, updateCartQuantity, cart, settings } = useApp();
  const cartItem = cart.find(i => i.menuItemId === item.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full flex flex-col group border-muted/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={item.image} 
            alt={item.name} 
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          {item.badge && (
            <Badge className="absolute top-3 left-3 bg-primary text-white font-bold">
              {item.badge}
            </Badge>
          )}
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-sm">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {item.rating}
          </div>
        </div>
        
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold line-clamp-1">{item.name}</CardTitle>
          </div>
          <CardDescription className="text-xs line-clamp-2 min-h-[2.5rem]">
            {item.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-grow">
          <div className="text-xl font-black text-primary">
            {settings.currencySymbol} {item.price.toLocaleString()}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {quantity > 0 ? (
            <div className="flex items-center justify-between w-full bg-muted/50 rounded-lg p-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-primary hover:text-white"
                onClick={() => updateCartQuantity(item.id, quantity - 1)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-bold text-sm">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-primary hover:text-white"
                onClick={() => updateCartQuantity(item.id, quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full gap-2 font-bold rounded-lg group-hover:bg-primary/90"
              onClick={() => addToCart(item.id)}
            >
              <Plus className="w-4 h-4" /> Add to Cart
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};
