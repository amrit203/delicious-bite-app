import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Plus, Edit, Trash2, Settings, ShoppingBag, Utensils, TrendingUp, DollarSign, LogOut, Save
} from 'lucide-react';
import { MenuItem, CATEGORIES, Order } from '../types';
import { motion } from 'motion/react';

export const AdminPanel: React.FC = () => {
  const { menu, orders, settings, updateMenu, updateSettings, updateOrderStatus, setIsAdmin } = useApp();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);

  // Stats
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const handleSaveItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: MenuItem = {
      id: editingItem?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: parseFloat(formData.get('price') as string),
      rating: parseFloat(formData.get('rating') as string) || 4.5,
      description: formData.get('description') as string,
      image: formData.get('image') as string,
      badge: formData.get('badge') as string,
      isPopular: formData.get('isPopular') === 'on',
    };

    if (editingItem) {
      updateMenu(menu.map(item => item.id === editingItem.id ? newItem : item));
    } else {
      updateMenu([...menu, newItem]);
    }
    setIsMenuDialogOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      updateMenu(menu.filter(item => item.id !== id));
    }
  };

  const handleUpdateSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateSettings({
      ...settings,
      siteName: formData.get('siteName') as string,
      deliveryFee: parseFloat(formData.get('deliveryFee') as string),
      taxRate: parseFloat(formData.get('taxRate') as string) / 100,
      contactPhone: formData.get('contactPhone') as string,
      contactEmail: formData.get('contactEmail') as string,
      contactAddress: formData.get('contactAddress') as string,
    });
    alert('Settings updated successfully!');
  };

  return (
    <div className="container py-10 max-w-7xl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your restaurant operations</p>
        </div>
        <Button variant="outline" onClick={() => setIsAdmin(false)} className="gap-2">
          <LogOut className="w-4 h-4" /> Exit Admin
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{settings.currencySymbol} {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">{pendingOrders} pending orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            <Utensils className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menu.length}</div>
            <p className="text-xs text-muted-foreground">Across {CATEGORIES.length - 1} categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Popular Items</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menu.filter(i => i.isPopular).length}</div>
            <p className="text-xs text-muted-foreground">Featured on home page</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Manage and track customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id}</TableCell>
                      <TableCell>
                        <div className="font-bold">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.countryCode} {order.phone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">{settings.currencySymbol} {order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          order.status === 'delivered' ? 'default' : 
                          order.status === 'cancelled' ? 'destructive' : 'secondary'
                        }>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={order.status} 
                          onValueChange={(val: Order['status']) => updateOrderStatus(order.id, val)}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Menu Items</CardTitle>
                <CardDescription>Add, edit or remove dishes from your menu</CardDescription>
              </div>
              <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingItem(null); setIsMenuDialogOpen(true); }} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form onSubmit={handleSaveItem}>
                    <DialogHeader>
                      <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Item Name</Label>
                          <Input id="name" name="name" defaultValue={editingItem?.name} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select name="category" defaultValue={editingItem?.category || CATEGORIES[1]}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.filter(c => c !== 'All').map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price ({settings.currencySymbol})</Label>
                          <Input id="price" name="price" type="number" defaultValue={editingItem?.price} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="badge">Badge (e.g. Popular)</Label>
                          <Input id="badge" name="badge" defaultValue={editingItem?.badge} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input id="image" name="image" defaultValue={editingItem?.image} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" name="description" defaultValue={editingItem?.description} required />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="isPopular" name="isPopular" defaultChecked={editingItem?.isPopular} />
                        <Label htmlFor="isPopular">Show in Featured Section</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="w-full">Save Changes</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menu.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img src={item.image} className="w-10 h-10 rounded-md object-cover" />
                      </TableCell>
                      <TableCell className="font-bold">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{settings.currencySymbol} {item.price.toLocaleString()}</TableCell>
                      <TableCell>
                        {item.isPopular && <Badge variant="secondary">Featured</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => { setEditingItem(item); setIsMenuDialogOpen(true); }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>Configure global website parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Restaurant Name</Label>
                    <Input id="siteName" name="siteName" defaultValue={settings.siteName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input id="contactEmail" name="contactEmail" defaultValue={settings.contactEmail} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryFee">Delivery Fee ({settings.currencySymbol})</Label>
                    <Input id="deliveryFee" name="deliveryFee" type="number" defaultValue={settings.deliveryFee} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input id="taxRate" name="taxRate" type="number" defaultValue={settings.taxRate * 100} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input id="contactPhone" name="contactPhone" defaultValue={settings.contactPhone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactAddress">Address</Label>
                    <Input id="contactAddress" name="contactAddress" defaultValue={settings.contactAddress} />
                  </div>
                </div>
                <Button type="submit" className="gap-2">
                  <Save className="w-4 h-4" /> Save Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
