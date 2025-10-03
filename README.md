# ChamaSync: Modernize Your Savings Group

![ChamaSync Landing Page](https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxjb21tdW5pdHklMjBtZWV0aW5nfGVufDB8fHx8MTc1OTQyMDg2OXww&ixlib=rb-4.1.0&q=80&w=1080)

**ChamaSync** is a full-stack, responsive web application designed to digitize and streamline the management of "chamas," or informal savings groups. It provides a modern, centralized platform for members to track contributions, manage loans, and view transparent financial reports, replacing cumbersome spreadsheets and fragmented messaging threads.

This project is a demonstration of building a feature-rich, production-quality application using a modern tech stack.

---

## ✨ Features

-   **🔐 Secure User Authentication:** Secure sign-up and login for members using email/password and Google OAuth, built with Firebase Authentication.
-   **👥 Group Management:** Users can create new savings groups, manage group details, and invite new members with a unique, secure link.
-   **💰 Contribution Tracking:** A centralized system to record and track all member contributions. Features M-Pesa reference validation using a GenAI model to ensure accuracy.
-   **💸 Loan Management:** A streamlined process for members to request loans, with a built-in voting system for group approval and transparent status tracking.
-   **🔄 Merry-Go-Round Automation:** A digital system to manage and track the rotational payout cycle (merry-go-round) common in many savings groups.
-   **📊 Transparent Reporting:** Visual dashboards and charts provide every member with a clear, real-time view of the group's financial health.
-   **🧾 Receipt Uploads:** Members can upload proof-of-payment receipts directly to Firebase Storage for complete transparency and record-keeping.
-   **💬 Real-time Communication:** A dedicated messaging wall for each group allows members to discuss matters and stay coordinated.
-   **📱 Fully Responsive Design:** A beautiful and intuitive interface that works seamlessly on both desktop and mobile devices.

---

## 🛠️ Technology Stack

This project is built with a modern, scalable, and type-safe technology stack.

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
-   **Backend & Database:** [Firebase](https://firebase.google.com/) (Firestore, Authentication, Storage)
-   **Generative AI:** [Google AI & Genkit](https://firebase.google.com/docs/genkit) for AI-powered M-Pesa reference validation.
-   **State Management:** React Hooks & Context API for client-side state and real-time data fetching.
-   **Form Handling:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for robust and type-safe form validation.
-   **Deployment:** Configured for seamless deployment to [Netlify](https://www.netlify.com/).

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v18 or later)
-   A Firebase project with Firestore, Firebase Authentication (Email/Password & Google providers enabled), and Firebase Storage enabled.

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
    Create a `.env.local` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env.local
    ```
    Now, add your Firebase project configuration and Google AI API key to the `.env.local` file. You can find your Firebase credentials in your Firebase project settings.

    ```env
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

    # Genkit Configuration (for AI features)
    GOOGLE_API_KEY=
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

---

## 部署到 Netlify

This project is pre-configured for easy deployment to Netlify.

1.  **Push your code to a Git repository** (e.g., GitHub, GitLab).
2.  **Create a new site on Netlify** and connect it to your Git repository.
3.  **Configure the build settings:** Netlify will automatically detect that this is a Next.js project and configure the build settings for you. The `netlify.toml` file in this repository ensures these settings are correct.
    -   **Build command:** `npm run build`
    -   **Publish directory:** `.next`
4.  **Add your environment variables** in the Netlify site settings (under "Site configuration" > "Build & deploy" > "Environment"). Add all the variables from your `.env.local` file.
5.  **Deploy!** Netlify will automatically build and deploy your site.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
