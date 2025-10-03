# ChamaSync: Modernize Your Savings Group

![ChamaSync Landing Page](https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxjb21tdW5pdHklMjBtZWV0aW5nfGVufDB8fHx8MTc1OTQyMDg2OXww&ixlib=rb-4.1.0&q=80&w=1080)

**ChamaSync** is a modern, web-based platform designed to digitize and streamline the management of "chamas" or savings groups. It provides the digital tools your group needs to thrive by managing contributions, loans, and reports with unparalleled ease and transparency. Say goodbye to cumbersome spreadsheets and endless messaging threads!

This project was built to showcase a full-stack application using a modern, scalable tech stack, perfect for a portfolio.

**[Live Demo](https://your-deployment-link-here.com)** (Link to be added after deployment)

---

## ✨ Features

- **User Authentication:** Secure sign-up and login for members using email/password and Google OAuth.
- **Group Management:** Create new savings groups, invite members with a unique link, and manage group details.
- **Contribution Tracking:** Centralized system to record and track all member contributions with M-Pesa reference validation.
- **Loan Management:** A streamlined process for members to request loans, with a built-in voting system for group approval.
- **Merry-Go-Round:** A digital system to manage and track the rotational payout cycle common in many savings groups.
- **Transparent Reporting:** Visual dashboards and charts to give every member a clear view of the group's financial health.
- **Receipt Uploads:** Members can upload proof-of-payment receipts to Firebase Storage for complete transparency.
- **Real-time Communication:** A dedicated messaging wall for each group to discuss matters and stay coordinated.
- **Responsive Design:** A beautiful and intuitive interface that works seamlessly on both desktop and mobile devices.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Firestore, Authentication, Storage)
- **Generative AI:** [Google AI & Genkit](https://firebase.google.com/docs/genkit) for M-Pesa reference validation.
- **State Management:** React Hooks & Context API
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
- **Deployment:** Ready for [Netlify](https://www.netlify.com/)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- A Firebase project with Firestore, Firebase Authentication (Email/Password & Google providers enabled), and Firebase Storage enabled.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/chamasync.git
    cd chamasync
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Firebase project configuration. You can find these details in your Firebase project settings.

    Use the `.env.example` file as a template:
    ```env
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

    # Genkit Configuration (Optional for local AI flows)
    GOOGLE_API_KEY=
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

---

## 部署到 Netlify

This project is configured for easy deployment to Netlify.

1.  **Push your code to a Git repository** (e.g., GitHub, GitLab).
2.  **Create a new site on Netlify** and connect it to your Git repository.
3.  **Configure the build settings:**
    - **Build command:** `npm run build`
    - **Publish directory:** `.next`
4.  **Add your environment variables** in the Netlify site settings (under "Site configuration" > "Build & deploy" > "Environment"). Add all the variables from your `.env.local` file.
5.  **Deploy!** Netlify will automatically build and deploy your site.

---

## Acknowledgements

- Built in [Firebase Studio](https://studio.firebase.google.com/).
- UI components from [shadcn/ui](https://ui.shadcn.com/).
- Icons by [Lucide](https://lucide.dev/).
