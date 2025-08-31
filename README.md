
````markdown
# 🌍 Plenti – Food Rescue & Redistribution App

Plenti is a social impact platform that connects **farmers, vendors, and supermarkets** with **NGOs, food banks, and local communities** to redistribute surplus food before it spoils.  
The goal: **reduce food waste, fight hunger, and track environmental impact**.

---

## 🚀 Features
- 👥 **User Roles**: Donors & Recipients  
- 🥕 **Post Surplus Food**: Donors list available items (name, quantity, expiry, location)  
- 🤝 **AI-Powered Matching**: Suggests best recipients based on location & urgency  
- 🔔 **Notifications**: Recipients see food available nearby  
- 💳 **Payments/Donations**: Integrated with **IntaSend (sandbox)** for delivery fees or donations  
- 📊 **Impact Dashboard**: Meals Rescued, Families Fed, and CO₂ Saved  

---

## 🛠️ Tech Stack
- **Frontend**: Vite + React + Shadcn + Tailwind + TypeScript  
- **Backend**: Flask (Python)  
- **Database**: Supabase (Postgres + Auth)  
- **Payments**: IntaSend (sandbox)  
- **AI Matching**: OpenAI API  

---

## ⚙️ Setup
1. Clone the repo  
   ```bash
   git clone https://github.com/your-username/plenti.git
   cd plenti
````

2. Install dependencies

   ```bash
   npm install
   ```
3. Create `.env` and add:

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_INSTASEND_PUBLISHABLE_KEY=your_instasend_sandbox_key
   ```
4. Run locally

   ```bash
   npm run dev
   ```

---

## 🌍 Live Demo

👉 [Try Plenti here](https://plenti.vercel.app)

---

## 🙌 Acknowledgments

Built with 💚 using **Lovable AI**, **Supabase**, and **IntaSend**.
Targets **SDG 2 (Zero Hunger), SDG 12 (Responsible Consumption), and SDG 13 (Climate Action)**.

---

# 🛠️ Development Notes (Lovable AI Build Log)

This section explains **how Plenti was built using Lovable AI** with Supabase + IntaSend integrations.
It records the **prompts, database design, and backend setup** for transparency and learning.

---

## 💡 Initial Prompt

> *“Build a web application called ‘Plenti – Food Rescue & Redistribution App’…”*

### Tech Stack Requested

* **Frontend**: HTML5, CSS, JS (later upgraded to Vite + React + Shadcn + Tailwind)
* **Backend**: Python (Flask)
* **Database**: MySQL → migrated to **Supabase (Postgres)**
* **AI**: OpenAI API for food matching
* **Payments**: IntaSend

---

## 📦 Database Schema (Supabase)

* **Profiles (Users)**: `id, name, email, role (donor/recipient), location`
* **Food\_Items**: `id, donor_id, item_name, quantity, expiry_date, status`
* **Requests**: `id, recipient_id, food_item_id, status`
* **Transactions**: `id, user_id, amount, type, date`

✅ Includes RLS (Row Level Security)
✅ Auth integrated with Supabase email/password
✅ Triggers for timestamps & user profile creation

---

## 🔐 Authentication

* Email/password login via Supabase Auth
* Roles assigned at signup (`donor` or `recipient`)
* Password reset flow

---

## 💳 Payment Integration

* **IntaSend (sandbox mode)**
* Delivery fees (KES 20–50)
* Donations (KES 50–200)
* Recorded in `Transactions` table
* Supports M-Pesa STK Push

---

## 📊 Dashboard

* Tracks **Meals Rescued, Families Fed, CO₂ Saved**
* Updates after requests & payments

---

## 🧠 AI Matching

* Based on **location proximity**
* Food **expiry urgency**
* **Quantity balance**

---

## 📜 Example Prompts Used

* *“Create Supabase schema with Users, Food\_Items, Requests, Transactions.”*
* *“Enable authentication with email/password and roles.”*
* *“Integrate IntaSend sandbox payments for donations and fees.”*
* *“Build dashboard showing Meals Rescued, Families Fed, CO₂ Saved.”*

---

## 🚀 Deployment

* **Frontend**: Vercel
* **Backend**: Railway
* **Live link**: [https://plenti.vercel.app](https://plenti.vercel.app)

---

## 📌 Notes

* Currently in **sandbox mode** for IntaSend
* Live mode requires verified keys
* Built via **AI prompting (Lovable)** + Supabase integration

---

## 🙌 Credits

* Built by \[Your Team/Name]
* Assisted by **Lovable AI**
* Powered by **Supabase** & **IntaSend**


