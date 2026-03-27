import React from 'react';
import { useApp } from '../AppContext';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useApp();

  return (
    <footer className="bg-neutral-950 text-neutral-400 py-20">
      <div className="container px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍔</span>
              <span className="text-xl font-black tracking-tighter text-white">
                {settings.siteName.split(' ')[0]}<span className="text-primary">{settings.siteName.split(' ')[1]}</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Premium food delivery service bringing the finest flavors of Kathmandu straight to your doorstep. Fresh, fast, and delicious.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#menu" className="hover:text-primary transition-colors">Menu</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#reviews" className="hover:text-primary transition-colors">Reviews</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Menu</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Gourmet Pizza</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Signature Burgers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Authentic Momo</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Fresh Sushi</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sweet Desserts</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>{settings.contactPhone}</span>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>{settings.contactEmail}</span>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{settings.contactAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 {settings.siteName}. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
