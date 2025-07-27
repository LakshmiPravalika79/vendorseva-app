// src/pages/LandingPage.tsx

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-700">VendorSeva</h1>
        <div>
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/signup">
            <Button className="ml-2">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center px-4 py-16">
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-800 tracking-tight">
            Fresh Ingredients. Fair Prices.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            VendorSeva connects street food vendors directly with local suppliers, ensuring quality, transparency, and efficiency. Spend less time sourcing and more time selling.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold">How It Works</h3>
            <p className="text-muted-foreground mt-2">A simple, powerful platform for your business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-700 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h4 className="text-xl font-semibold">Discover Suppliers</h4>
              <p className="mt-2 text-gray-600">Find verified local suppliers and compare real-time prices for all your raw materials.</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-700 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h4 className="text-xl font-semibold">Order with Ease</h4>
              <p className="mt-2 text-gray-600">Place orders directly through the app and get your supplies delivered or ready for pickup.</p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-700 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="text-xl font-semibold">Ensure Quality</h4>
              <p className="mt-2 text-gray-600">Use our AI-powered reporting tool to give feedback and maintain high standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-6 text-gray-500 text-sm">
        © 2025 VendorSeva. A Hackathon Project.
      </footer>
    </div>
  );
}
