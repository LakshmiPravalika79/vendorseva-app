// src/pages/SignupPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'vendor' | 'supplier'>('vendor');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (userType === 'vendor' && !address.trim()) {
        setError("Address is required for vendors.");
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        userType: userType,
        createdAt: new Date(),
        ...(userType === 'vendor' && { address: address }),
      });

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to sign up:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Your VendorSeva Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
              <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div className="grid gap-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
              
              <div className="grid gap-2">
                <Label>I am a:</Label>
                <RadioGroup defaultValue="vendor" value={userType} onValueChange={(value: 'vendor' | 'supplier') => setUserType(value)}>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="vendor" id="r1" /><Label htmlFor="r1">Street Food Vendor</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="supplier" id="r2" /><Label htmlFor="r2">Raw Material Supplier</Label></div>
                </RadioGroup>
              </div>

              {userType === 'vendor' && (
                <div className="grid gap-2">
                    <Label htmlFor="address">Your Business Address</Label>
                    <Textarea id="address" placeholder="Enter your full delivery address" required value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">Create Account</Button>
              <div className="mt-4 text-center text-sm">Already have an account?{" "}<Link to="/login" className="underline">Sign in</Link></div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
