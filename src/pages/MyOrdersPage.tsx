// src/pages/MyOrdersPage.tsx

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, addDoc, QuerySnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

interface Order {
  id: string;
  productName: string;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'cancelled';
  createdAt: { toDate: () => Date };
  supplierId: string;
}

export default function MyOrdersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [issueText, setIssueText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportedOrderIds, setReportedOrderIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const q = query(collection(db, 'orders'), where('vendorId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
      setOrders(snapshot.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() })) as Order[]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "qualityReports"), where("vendorId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
        const ids = new Set(snapshot.docs.map((doc: QueryDocumentSnapshot) => doc.data().orderId as string));
        setReportedOrderIds(ids);
    });
    return () => unsubscribe();
  }, [user]);

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueText || !selectedOrder || !user) return;
    setIsSubmitting(true);
    try {
      const apiResponse = await fetch('/api/categorize-issue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ issueText: issueText }),
      });
      if (!apiResponse.ok) { throw new Error('AI analysis failed'); }
      const aiData = await apiResponse.json();
      await addDoc(collection(db, 'qualityReports'), {
        orderId: selectedOrder.id,
        vendorId: user.uid,
        supplierId: selectedOrder.supplierId,
        originalText: issueText,
        category: aiData.category,
        summary: aiData.summary,
        status: 'new',
        timestamp: new Date(),
      });
      toast({ title: "✅ Report Submitted", description: "Our AI has analyzed your feedback." });
      setIssueText('');
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error submitting report: ", error);
      toast({ title: "Error", description: "Could not submit report.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">← Back to Marketplace</Link>
      </div>
      {loading ? (
        <div className="text-center py-20"><p>Loading your orders...</p></div>
      ) : (
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map(order => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle>{order.productName}</CardTitle>
                  <CardDescription>Ordered on: {order.createdAt.toDate().toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div>
                    <p>Status: <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{order.status}</span></p>
                    <p className="mt-2">Amount: <span className="font-semibold">₹{order.totalAmount}</span></p>
                  </div>
                  <Dialog open={selectedOrder?.id === order.id} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" disabled={order.status === 'pending' || reportedOrderIds.has(order.id)} onClick={() => setSelectedOrder(order)}>
                        {reportedOrderIds.has(order.id) ? 'Reported' : 'Report Issue'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Report an issue for {selectedOrder?.productName}</DialogTitle></DialogHeader>
                      <form onSubmit={handleReportIssue}>
                        <div className="grid gap-4 py-4"><Label htmlFor="issue">Describe the issue</Label><Textarea id="issue" value={issueText} onChange={(e) => setIssueText(e.target.value)} required /></div>
                        <DialogFooter><DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose><Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</Button></DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold">No Orders Yet</h3>
              <p className="text-muted-foreground mt-2">Go to the marketplace to place your first order.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
