// src/components/SupplierDashboard.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { collection, addDoc, query, where, onSnapshot, orderBy, doc, updateDoc, getDoc, DocumentData, QuerySnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";
import { CardDescription as UiCardDescription } from './ui/card';

// Interfaces
interface Product { id: string; name: string; pricePerUnit: number; unit: string; status?: 'available' | 'unavailable'; }
interface Order { id: string; productName: string; totalAmount: number; status: 'pending' | 'accepted' | 'declined'; createdAt: { toDate: () => Date }; vendorId: string; }
interface Report { id:string; originalText: string; category: string; summary: string; timestamp: { toDate: () => Date }; }
interface VendorDetails { email: string; address: string; }

const EmptyState = ({ title, description }: { title: string, description: string }) => ( <TableRow><TableCell colSpan={5} className="h-48 text-center"><h3 className="text-xl font-semibold">{title}</h3><p className="text-muted-foreground mt-2">{description}</p></TableCell></TableRow> );

export default function SupplierDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVendorDetailsOpen, setIsVendorDetailsOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState<VendorDetails | null>(null);

  useEffect(() => {
    if (!user) return; setLoading(true);
    const productsQuery = query(collection(db, 'products'), where('supplierId', '==', user.uid), orderBy('createdAt', 'desc'));
    const ordersQuery = query(collection(db, 'orders'), where('supplierId', '==', user.uid), orderBy('createdAt', 'desc'));
    const reportsQuery = query(collection(db, 'qualityReports'), where('supplierId', '==', user.uid), orderBy('timestamp', 'desc'));
    const unsubProducts = onSnapshot(productsQuery, (snapshot: QuerySnapshot) => setProducts(snapshot.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as Product))));
    const unsubOrders = onSnapshot(ordersQuery, (snapshot: QuerySnapshot) => setOrders(snapshot.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as Order))));
    const unsubReports = onSnapshot(reportsQuery, (snapshot: QuerySnapshot) => setReports(snapshot.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as Report))));
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => { unsubProducts(); unsubOrders(); unsubReports(); clearTimeout(timer); };
  }, [user]);

  const handleImageUpload = async (): Promise<string | null> => { if (!imageFile) return null; setIsUploading(true); const IMGBB_API_KEY = "YOUR_IMGBB_API_KEY"; const formData = new FormData(); formData.append('image', imageFile); try { const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData, }); const result = await response.json(); if (result.success) { return result.data.url; } else { throw new Error(result.error.message); } } catch (error) { console.error("Image upload failed:", error); toast({ title: "Image Upload Failed", variant: "destructive" }); return null; } finally { setIsUploading(false); } };
  const handleAddProduct = async (e: React.FormEvent) => { e.preventDefault(); if (!user || !productName || !price || !unit) return; let imageUrl = "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image"; if (imageFile) { const uploadedUrl = await handleImageUpload(); if (uploadedUrl) { imageUrl = uploadedUrl; } else { return; } } try { await addDoc(collection(db, 'products'), { supplierId: user.uid, supplierName: user.displayName || user.email, name: productName, pricePerUnit: Number(price), unit: unit, imageUrl: imageUrl, status: 'available', createdAt: new Date(), }); toast({ title: "✅ Product Added!" }); setProductName(''); setPrice(''); setUnit(''); setImageFile(null); setIsDialogOpen(false); } catch (error) { console.error("Error adding product: ", error); } };
  const handleToggleAvailability = async (product: Product) => { const productRef = doc(db, 'products', product.id); const newStatus = product.status === 'available' ? 'unavailable' : 'available'; try { await updateDoc(productRef, { status: newStatus }); toast({ title: `Product is now ${newStatus}` }); } catch (error) { console.error("Error updating status: ", error); toast({ title: "Error", description: "Could not update status.", variant: "destructive" }); } };
  
  const handleUpdateOrderStatus = async (orderId: string, status: 'accepted' | 'declined') => {
    const orderRef = doc(db, 'orders', orderId);
    try {
      await updateDoc(orderRef, { status: status });
      toast({ title: `Order ${status}` });
    } catch (error) {
      console.error(`Error updating order: `, error);
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleShowVendorDetails = async (vendorId: string) => {
    const vendorDocRef = doc(db, 'users', vendorId);
    try {
        const docSnap = await getDoc(vendorDocRef);
        if (docSnap.exists()) {
            const vendorData = docSnap.data() as DocumentData;
            setCurrentVendor({ email: vendorData.email, address: vendorData.address });
            setIsVendorDetailsOpen(true);
        } else {
            toast({ title: "Error", description: "Could not find vendor details.", variant: "destructive" });
        }
    } catch (error) {
        console.error("Error fetching vendor details: ", error);
        toast({ title: "Error", description: "Failed to fetch details.", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'accepted': return 'bg-green-100 text-green-800';
        case 'declined': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Tabs defaultValue="products" className="w-full">
        <div className="flex justify-between items-center mb-4"><div><h2 className="text-3xl font-bold">Supplier Dashboard</h2><p className="text-muted-foreground">Manage your products, orders, and reports.</p></div><TabsList><TabsTrigger value="products">My Products</TabsTrigger><TabsTrigger value="orders">Incoming Orders</TabsTrigger><TabsTrigger value="reports">Quality Reports</TabsTrigger></TabsList></div>
        
        <TabsContent value="products">
            <div className="flex justify-end mb-4"><Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}><DialogTrigger asChild><Button>Add New Product</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Add a New Raw Material</DialogTitle><UiCardDescription>Fill in the details of the product you want to sell.</UiCardDescription></DialogHeader><form onSubmit={handleAddProduct}><div className="grid gap-4 py-4"><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Product Name</Label><Input id="name" value={productName} onChange={(e) => setProductName(e.target.value)} className="col-span-3" required /></div><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="price" className="text-right">Price</Label><Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="col-span-3" required /></div><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="unit" className="text-right">Unit</Label><div className="col-span-3"><Select onValueChange={setUnit} required value={unit}><SelectTrigger><SelectValue placeholder="Select a unit" /></SelectTrigger><SelectContent><SelectItem value="kg">kg</SelectItem><SelectItem value="litre">litre</SelectItem><SelectItem value="dozen">dozen</SelectItem></SelectContent></Select></div></div><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="picture" className="text-right">Image</Label><Input id="picture" type="file" className="col-span-3" accept="image/*" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} /></div></div><DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit" disabled={isUploading}>{isUploading ? 'Uploading...' : 'Save Product'}</Button></DialogFooter></form></DialogContent></Dialog></div>
            <div className="border rounded-lg"><Table><TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{loading ? <TableRow><TableCell colSpan={4} className="h-48 text-center">Loading products...</TableCell></TableRow> : products.length > 0 ? products.map(p => (<TableRow key={p.id}><TableCell className="font-medium">{p.name}</TableCell><TableCell>₹{p.pricePerUnit} / {p.unit}</TableCell><TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{p.status || 'available'}</span></TableCell><TableCell className="text-right"><Switch checked={p.status === 'available'} onCheckedChange={() => handleToggleAvailability(p)} aria-label="Toggle availability" /></TableCell></TableRow>)) : <EmptyState title="No Products Yet" description="Click 'Add New Product' to get started." />}</TableBody></Table></div>
        </TabsContent>
        
        <TabsContent value="orders">
          <div className="border rounded-lg">
            <Table>
              <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={4} className="h-48 text-center">Loading orders...</TableCell></TableRow> : orders.length > 0 ? orders.map(o => (
                  <TableRow key={o.id}>
                    <TableCell>{o.productName}</TableCell>
                    <TableCell>{o.createdAt.toDate().toLocaleDateString()}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(o.status)}`}>{o.status}</span></TableCell>
                    <TableCell className="space-x-2">
                      {o.status === 'pending' ? (
                        <>
                          <Button onClick={() => handleUpdateOrderStatus(o.id, 'accepted')} size="sm">Accept</Button>
                          <Button onClick={() => handleUpdateOrderStatus(o.id, 'declined')} size="sm" variant="destructive">Decline</Button>
                        </>
                      ) : (
                        <Button onClick={() => handleShowVendorDetails(o.vendorId)} size="sm" variant="outline">View Details</Button>
                      )}
                    </TableCell>
                  </TableRow>
                )) : <EmptyState title="No Incoming Orders" description="When a vendor places an order, it will appear here." />}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
            <div className="border rounded-lg"><Table><TableHeader><TableRow><TableHead>Vendor Comment</TableHead><TableHead>AI Category</TableHead><TableHead>AI Summary</TableHead><TableHead>Date</TableHead></TableRow></TableHeader><TableBody>{loading ? <TableRow><TableCell colSpan={4} className="h-48 text-center">Loading reports...</TableCell></TableRow> : reports.length > 0 ? reports.map(r => (<TableRow key={r.id}><TableCell className="italic">"{r.originalText}"</TableCell><TableCell><span className="font-semibold">{r.category}</span></TableCell><TableCell>{r.summary}</TableCell><TableCell>{r.timestamp.toDate().toLocaleDateString()}</TableCell></TableRow>)) : <EmptyState title="No Quality Reports" description="Issues reported by vendors will be shown here." />}</TableBody></Table></div>
        </TabsContent>
      </Tabs>

      <Dialog open={isVendorDetailsOpen} onOpenChange={setIsVendorDetailsOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>Vendor Contact Details</DialogTitle><DialogDescription>Use this information to coordinate delivery.</DialogDescription></DialogHeader>
            <div className="py-4 space-y-4">
                <div><Label className="text-muted-foreground">Email</Label><p className="font-semibold">{currentVendor?.email}</p></div>
                <div><Label className="text-muted-foreground">Delivery Address</Label><p className="font-semibold whitespace-pre-wrap">{currentVendor?.address}</p></div>
            </div>
            <DialogFooter><Button onClick={() => setIsVendorDetailsOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
