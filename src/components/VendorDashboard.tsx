// src/components/VendorDashboard.tsx

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where, QuerySnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Input } from './ui/input';
import { useToast } from "@/hooks/use-toast"
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface Product {
  id: string;
  name: string;
  pricePerUnit: number;
  unit: string;
  supplierId: string;
  supplierName: string;
  imageUrl?: string;
  status?: 'available' | 'unavailable';
}

export default function VendorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where("status", "==", "available"));
        const productsSnapshot: QuerySnapshot = await getDocs(q);
        
        const productsData = productsSnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setAllProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast({ title: "Error", description: "Could not load products.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [toast]);

  useEffect(() => {
    const results = allProducts.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()) );
    setFilteredProducts(results);
  }, [searchTerm, allProducts]);

  const handleOrderNow = async (product: Product) => {
    if (!user) { toast({ title: "Error", description: "You must be logged in to order.", variant: "destructive" }); return; }
    try {
      await addDoc(collection(db, 'orders'), {
        vendorId: user.uid,
        supplierId: product.supplierId,
        productName: product.name,
        totalAmount: product.pricePerUnit,
        status: 'pending',
        createdAt: new Date(),
      });
      toast({ title: "✅ Order Placed!", description: `Your order for ${product.name} has been sent.` });
    } catch (error) {
      console.error("Error placing order: ", error);
      toast({ title: "Error", description: "Could not place order.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Marketplace</h2>
        <p className="text-muted-foreground">Find the best raw materials for your business.</p>
        <Input type="text" placeholder="Search for products like 'Onions', 'Spices'..." className="mt-4" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {loading ? ( <div className="text-center py-10"><p>Loading the marketplace...</p></div> ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="aspect-video bg-gray-100 relative">
                    <img src={product.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image'} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Image+Error'; }} />
                    {product.status === 'unavailable' && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded">Out of Stock</span>
                        </div>
                    )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <CardHeader className="p-0 mb-2">
                        <CardTitle>{product.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">from {product.supplierName || 'A Supplier'}</p>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow flex flex-col justify-end">
                        <p className="text-2xl font-bold mb-4">₹{product.pricePerUnit} <span className="text-sm font-normal text-muted-foreground">/ {product.unit}</span></p>
                        <Button className="w-full" onClick={() => handleOrderNow(product)} disabled={product.status === 'unavailable'}>
                            {product.status === 'unavailable' ? 'Out of Stock' : 'Order Now'}
                        </Button>
                    </CardContent>
                </div>
              </Card>
            ))}
          </div>
          {filteredProducts.length === 0 && !loading && ( <div className="text-center py-20 bg-gray-50 rounded-lg"><h3 className="text-xl font-semibold">No Products Found</h3><p className="text-muted-foreground mt-2">Try adjusting your search or check back later.</p></div> )}
        </>
      )}
    </div>
  );
}
