import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { ShoppingBag, Trash2, Plus, Minus, CheckCircle2, ArrowRight, CreditCard, Truck } from 'lucide-react';
import { COUNTRY_CODES } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartSheet: React.FC<CartSheetProps> = ({ open, onOpenChange }) => {
  const { cart, menu, settings, updateCartQuantity, removeFromCart, clearCart, addOrder } = useApp();
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    countryCode: '+977',
    address: '',
  });

  const cartItems = cart.map(item => {
    const menuItem = menu.find(m => m.id === item.menuItemId);
    return {
      ...item,
      details: menuItem
    };
  }).filter(item => item.details);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.details?.price || 0) * item.quantity, 0);
  const tax = subtotal * settings.taxRate;
  const total = subtotal + tax + settings.deliveryFee;

  const handleCheckout = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill all fields");
      return;
    }

    const orderItems = cartItems.map(item => ({
      menuItemId: item.menuItemId,
      name: item.details!.name,
      price: item.details!.price,
      quantity: item.quantity
    }));

    addOrder({
      customerName: formData.name,
      phone: formData.phone,
      countryCode: formData.countryCode,
      address: formData.address,
      items: orderItems,
      total: total
    });

    setStep('success');
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep('cart');
      setFormData({ name: '', phone: '', countryCode: '+977', address: '' });
    }, 300);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            {step === 'cart' ? 'Your Cart' : step === 'checkout' ? 'Checkout' : 'Order Placed'}
          </SheetTitle>
          <SheetDescription>
            {step === 'cart' ? `You have ${cartItems.length} items in your cart` : ''}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-grow overflow-hidden relative">
          <AnimatePresence mode="wait">
            {step === 'cart' && (
              <motion.div
                key="cart"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                <ScrollArea className="flex-grow p-6">
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[40vh] text-muted-foreground">
                      <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                      <p>Your cart is empty</p>
                      <Button variant="link" onClick={() => onOpenChange(false)}>Start shopping</Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <div key={item.menuItemId} className="flex gap-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.details?.image} alt={item.details?.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-sm">{item.details?.name}</h4>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => removeFromCart(item.menuItemId)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-primary font-bold text-sm">
                              {settings.currencySymbol} {item.details?.price.toLocaleString()}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-2 bg-muted rounded-md px-2 py-1">
                                <button onClick={() => updateCartQuantity(item.menuItemId, item.quantity - 1)} className="hover:text-primary"><Minus className="w-3 h-3" /></button>
                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateCartQuantity(item.menuItemId, item.quantity + 1)} className="hover:text-primary"><Plus className="w-3 h-3" /></button>
                              </div>
                              <span className="text-xs font-bold ml-auto">
                                {settings.currencySymbol} {(item.details!.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                
                {cartItems.length > 0 && (
                  <div className="p-6 bg-muted/30 border-t space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{settings.currencySymbol} {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>{settings.currencySymbol} {settings.deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax ({settings.taxRate * 100}%)</span>
                      <span>{settings.currencySymbol} {tax.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-black text-lg">
                      <span>Total</span>
                      <span className="text-primary">{settings.currencySymbol} {total.toLocaleString()}</span>
                    </div>
                    <Button className="w-full mt-4 h-12 text-lg font-bold gap-2" onClick={() => setStep('checkout')}>
                      Checkout <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {step === 'checkout' && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full p-6 flex flex-col"
              >
                <div className="space-y-6 flex-grow">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input 
                      placeholder="Enter your name" 
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <div className="flex gap-2">
                      <Select 
                        value={formData.countryCode} 
                        onValueChange={val => setFormData(prev => ({ ...prev, countryCode: val }))}
                      >
                        <SelectTrigger className="w-[110px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRY_CODES.map(c => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.flag} {c.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input 
                        className="flex-grow" 
                        placeholder="98XXXXXXXX" 
                        value={formData.phone}
                        onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Address</Label>
                    <Textarea 
                      placeholder="House no, Street, Area..." 
                      className="min-h-[100px]"
                      value={formData.address}
                      onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>

                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <Truck className="w-4 h-4" /> Delivery Info
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Estimated delivery time: 25-35 minutes.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t space-y-3">
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">{settings.currencySymbol} {total.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setStep('cart')}>Back</Button>
                    <Button className="flex-grow font-bold gap-2" onClick={handleCheckout}>
                      Place Order <CheckCircle2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-black mb-2">Order Confirmed!</h2>
                <p className="text-muted-foreground mb-8">
                  Thank you for your order. We've received it and our chefs are starting to prepare your meal.
                </p>
                <div className="w-full bg-muted p-4 rounded-lg mb-8 text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order ID</span>
                    <span className="font-mono font-bold">#DB-{(Math.random()*10000).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Time</span>
                    <span className="font-bold">30 Minutes</span>
                  </div>
                </div>
                <Button className="w-full h-12 font-bold" onClick={handleClose}>
                  Done
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
};
