# VendorSeva – A Hyperlocal Raw Material Marketplace

[![Vercel](https://vercelbadge.vercel.app/api/your-username/vendorseva-app)](https://vendorseva-app.vercel.app)
![Made with Firebase](https://img.shields.io/badge/Firebase-Tools-yellow?logo=firebase)
![Powered by Gemini API](https://img.shields.io/badge/Google%20Gemini-API-blue?logo=google)
![Tech Stack](https://img.shields.io/badge/React-Vite-blue?logo=react)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

🌐 **Live Demo:** [vendorseva-app.vercel.app](https://vendorseva-app-3.vercel.app)

VendorSeva is a hyperlocal marketplace designed to revolutionize how street food vendors source raw materials by directly connecting them with verified local suppliers. Built during a 48-hour hackathon, our platform brings transparency, quality assurance, and operational efficiency to this essential yet underserved sector of the Indian economy.

---

## 🚨 Problem Statement

Street food vendors face several challenges in sourcing raw materials:
- **Fluctuating prices** in unregulated markets  
- **Inconsistent product quality** with no recourse  
- **Loss of time** traveling to wholesale markets  
- **Lack of transparency** and feedback systems  

---

## ✅ Our Solution

**VendorSeva** streamlines the entire procurement process with a user-first, mobile-friendly web platform that enables:
- Direct vendor-supplier connections
- Transparent pricing
- Real-time inventory updates
- AI-powered feedback mechanisms for quality control

---

## ✨ Key Features

### 🔁 Dual User Roles
- Separate dashboards for **Vendors** and **Suppliers**  
- Role-based experiences built into the same application

### 📦 Supplier Product Management
- Add/Edit/Delete product listings  
- Upload real images via **ImgBB API**  
- Toggle product availability (`Available` / `Out of Stock`)

### 🛒 Vendor Marketplace
- Real-time product listings from nearby suppliers  
- Search and filter products by name  
- View product images and pricing

### 📬 Real-Time Order System
- Vendors place orders instantly  
- Suppliers can **Accept** or **Decline** orders in real-time  
- Upon acceptance, suppliers view vendor’s address for delivery coordination

### 🤖 AI-Powered Quality Feedback
- Vendors can report issues with delivered goods  
- Our backend (powered by **Google Gemini API**) classifies and summarizes the issue (e.g., *Freshness*, *Damaged Goods*)  
- Structured, actionable feedback for suppliers

---

## 📸 Screenshots

### 👤 Vendor Dashboard
<img src="" width="100%" alt="Vendor Dashboard" />

### 🛍️ Supplier Product Management
<img src="https://i.imgur.com/supplier-dashboard.png" width="100%" alt="Supplier Dashboard" />

### 🤖 AI-Powered Feedback Summary
<img src="https://i.imgur.com/ai-feedback.png" width="100%" alt="AI Feedback System" />

> 📝 Replace these image links with your own screenshots uploaded to [Imgur](https://imgur.com/) or [ImgBB](https://imgbb.com/).

---


## 🔧 Tech Stack

| Frontend              | Backend                      | AI Integration         | Other Tools              |
|-----------------------|------------------------------|------------------------|--------------------------|
| React + Vite          | Firebase (Auth + Firestore)  | Google Gemini API      | ImgBB API for image upload |
| Tailwind CSS          | Vercel Serverless Functions  |                        | Vercel Deployment         |
| TypeScript + Shadcn/UI|                              |                        |                          |

---

## 🛠️ Getting Started Locally

```bash
# 1. Clone the repository
git clone https://github.com/LakshmiPravalika79/vendorseva-app.git

# 2. Navigate into the project directory
cd vendorseva-app

# 3. Install dependencies
npm install

# 4. Setup environment variables
# Create a `.env.local` file with the following:
# Replace values with your actual keys

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_IMGBB_API_KEY=your_imgbb_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key

# 5. Run the development server
npm run dev
```
---

## 🚀 Deployment

The app is deployed via Vercel, with continuous deployment from the main branch.

---

## 🤝 Team & Hackathon

Built with ❤️ in 48 hours for Tutedude Web Development Hackathon 1.0

---

## 📬 Feedback & Contributions

We welcome bug reports, feature suggestions, and contributions!
Open an Issue or submit a Pull Request.

---

## 📜 License

This project is licensed under the MIT License.
Feel free to fork, enhance, and build upon it.
