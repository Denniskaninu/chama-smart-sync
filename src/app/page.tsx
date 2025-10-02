
import { Button, buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import Link from "next/link";
import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images";
import { ShieldCheck, TrendingUp, Users, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    name: "Centralized Contributions",
    description: "Easily track and manage all member contributions in one place, ensuring transparency and accuracy.",
    icon: Wallet,
  },
  {
    name: "Simplified Loan Management",
    description: "Streamline the entire loan process from application and voting to repayment, all within the app.",
    icon: TrendingUp,
  },
  {
    name: "Transparent Reporting",
    description: "Generate insightful financial reports instantly, giving every member a clear view of the group's health.",
    icon: ShieldCheck,
  },
  {
    name: "Seamless Member Coordination",
    description: "Keep everyone in the loop with group messaging and a shared view of all activities.",
    icon: Users,
  },
];


export default function LandingPage() {
  const heroImage = placeholderImages.find(p => p.id === "login-hero");
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline">ChamaSync</span>
            </Link>
          </div>
          {/* <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="#features">Features</Link>
            <Link href="#">Pricing</Link>
            <Link href="#">About</Link>
          </nav> */}
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>Sign In</Link>
            <Link href="/login" className={cn(buttonVariants({ variant: "default" }))}>Get Started</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
             {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    data-ai-hint={heroImage.imageHint}
                    fill
                    className="object-cover"
                    priority
                />
             )}
            <div className="relative container h-[80vh] min-h-[500px] flex flex-col items-center justify-center text-center text-white bg-black/50">
                <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    Modernize Your Savings Group
                </h1>
                <p className="max-w-[700px] text-lg text-primary-foreground/80 md:text-xl my-6">
                    ChamaSync provides the digital tools your chama needs to thrive. Manage contributions, loans, and reports with unparalleled ease and transparency.
                </p>
                <div className="flex space-x-4">
                    <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
                        Get Started for Free
                    </Link>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">Why Choose ChamaSync?</h2>
              <p className="text-muted-foreground">
                We've built a platform focused on transparency, efficiency, and member empowerment. Say goodbye to spreadsheets and endless WhatsApp threads.
              </p>
            </div>
            <div className="grid gap-6">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{feature.name}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      
       <footer className="border-t">
          <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
              <Logo className="h-6 w-6 text-primary" />
              <p className="text-center text-sm leading-loose md:text-left">
                Built to empower savings groups. &copy; {new Date().getFullYear()} ChamaSync.
              </p>
            </div>
          </div>
        </footer>
    </div>
  );
}
