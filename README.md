# ChamaSync: Transforming Savings Groups with Modern Technology

![ChamaSync Landing Page](https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxjb21tdW5pdHklMjBtZWV0aW5nfGVufDB8fHx8MTc...)

**ChamaSync** is a feature-rich, production-ready web application meticulously engineered to digitize and elevate the management of "chamas"—informal savings groups. Leveraging robust modern technologies, ChamaSync empowers members with secure, transparent, and seamless group financial management.

---

## 🚩 Why ChamaSync?

Traditional savings groups face challenges with manual records, limited transparency, and inefficient communication. ChamaSync solves these problems by providing:

- **End-to-End Digitalization:** Replace paper-based processes with secure, cloud-powered management.
- **Automated Workflows:** Streamline contribution tracking, loan approvals, and rotational payouts.
- **Real-Time Insights:** Empower members with instant financial dashboards and reporting.

---

## 🌟 Key Features

- **🔐 Secure Authentication:**  
  Multi-provider login (Email/Password & Google OAuth) powered by [Firebase Authentication](https://firebase.google.com/docs/auth).
- **👥 Advanced Group Management:**  
  Create, configure, and invite members to savings groups using unique, secure invitation links.
- **💰 Contribution Tracking & M-Pesa Validation:**  
  Log and verify member contributions. M-Pesa payment references are validated using an integrated GenAI model ([Google AI & Genkit](https://firebase.google.com/docs/genkit)) for accuracy.
- **💸 Loan Lifecycle Management:**  
  Digitally request loans, vote for approvals, and track loan statuses all within the app.
- **🔄 Merry-Go-Round Automation:**  
  Automate and monitor the rotational payout cycles common in savings groups.
- **📊 Transparent Financial Reporting:**  
  Interactive dashboards and charts provide real-time visibility into group finances, powered by [Firestore](https://firebase.google.com/docs/firestore) for reliable data storage and updates.
- **🧾 Receipt Uploads:**  
  Members upload payment proofs directly to [Firebase Storage](https://firebase.google.com/docs/storage), ensuring auditability and trust.
- **💬 Real-Time Group Messaging:**  
  Each group features a dedicated wall for instant messaging and decision-making.
- **📱 Responsive, Modern Design:**  
  Built using [Next.js](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/) for a beautiful, consistent experience on desktop and mobile.

---

## 🏗️ Technology Stack

ChamaSync is architected for scalability, security, and developer productivity:

- **Frontend:** Next.js 14+ (App Router), React, Tailwind CSS, shadcn/ui
- **State Management:** React Context API & Hooks
- **Forms & Validation:** React Hook Form, Zod
- **Backend Services:** Firebase (Firestore, Authentication, Storage)
- **Generative AI:** Google AI & Genkit (M-Pesa reference validation and automation)
- **Deployment:** Netlify (CI/CD ready)
- **Type Safety:** End-to-end type safety with TypeScript

---

## 🚀 Getting Started

Follow these steps to set up ChamaSync locally for development or evaluation.

### Prerequisites

- Node.js (v18+ recommended)
- A Firebase project with Firestore, Authentication (Email/Password & Google), and Storage enabled

### Installation

1. **Clone the Repository**
    ```bash
    git clone https://github.com/Denniskaninu/chama-smart-sync.git
    cd chama-smart-sync
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Configure Environment Variables**
    Copy the example environment file and fill in your Firebase and Google AI credentials:
    ```bash
    cp .env.example .env.local
    ```
    Edit `.env.local`:
    ```env
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

    # Genkit AI Configuration
    GOOGLE_API_KEY=your_google_ai_api_key
    ```

4. **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:9002](http://localhost:9002) to view the application.

---

## 📚 Codebase Overview

ChamaSync is built for maintainability and extensibility. Key architectural choices include:

- **Modular Design:**  
  Each feature (auth, groups, contributions, loans, messaging) is encapsulated in its own directory.
- **Type Safety:**  
  TypeScript and Zod ensure data integrity throughout the stack.
- **Realtime Data:**  
  Firebase Firestore and Storage are used for live updates and persistent storage.
- **AI Integration:**  
  Genkit-powered functions validate M-Pesa references, reducing manual errors and fraud.

Feel free to explore and contribute! Start with the `/app` directory for routing, `/components` for UI, and `/lib` for utility functions.

---

## 🛡️ Security & Compliance

- End-to-end encryption for sensitive data
- Authentication and authorization enforced at every layer
- All payment references are validated using AI for extra security

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

We welcome contributions! Please fork the repo and submit a pull request. For major changes, open an issue first to discuss your proposal.

---

## 💬 Support & Feedback

For feature requests, bug reports, or questions, open an issue on GitHub or contact [Denniskaninu](https://github.com/Denniskaninu).

---

_Professional. Secure. Scalable. ChamaSync unlocks the future of savings groups._
