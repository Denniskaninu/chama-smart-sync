
'use client';

import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import Link from "next/link";
import Image from "next/image";
import { placeholderImages } from "@/lib/placeholder-images";
import { ShieldCheck, TrendingUp, Users, Wallet, ArrowRight, Sun, Moon, Zap, BarChart, MessageCircle, Star, Twitter, Facebook, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

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
    icon: BarChart,
  },
  {
    name: "Seamless Member Coordination",
    description: "Keep everyone in the loop with group messaging and a shared view of all activities.",
    icon: MessageCircle,
  },
];

const testimonials = [
  {
    name: "Aisha Ke.",
    role: "Treasurer, Kilimani Young Investors",
    quote: "ChamaSync has revolutionized how we manage our group's finances. What used to take hours of spreadsheet work now happens in minutes. It's brilliant!",
    avatar: placeholderImages.find(p => p.id === "avatar-2")?.imageUrl || '',
  },
  {
    name: "Ben Oloo",
    role: "Member, Family & Friends SACCO",
    quote: "The transparency is a game-changer. I can see every transaction, vote on loans, and track our group's progress anytime. I trust our chama more than ever.",
    avatar: placeholderImages.find(p => p.id === "avatar-3")?.imageUrl || '',
  }
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
          <div className="flex flex-1 items-center justify-end space-x-2">
             <ThemeToggle />
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
            <div className="relative container h-[85vh] min-h-[600px] flex flex-col items-center justify-center text-center text-white bg-black/60">
                <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                    Finally, a smarter way to manage your Chama.
                </h1>
                <p className="max-w-[750px] text-lg text-primary-foreground/80 md:text-xl my-6">
                    Say goodbye to confusing spreadsheets and endless messaging threads. ChamaSync provides the digital tools your savings group needs to thrive.
                </p>
                <div className="flex space-x-4">
                    <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
                        Start for Free <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-16 md:py-24 lg:py-32">
          <div className="text-center">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-4">Key Features</div>
              <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">Why Choose ChamaSync?</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground mt-4">
                We've built a platform focused on transparency, efficiency, and member empowerment. It's everything you need, and nothing you don't.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-lg gap-8 lg:max-w-none lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col items-center text-center p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">{feature.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
        </section>
        
        {/* How it Works Section */}
        <section className="bg-muted py-16 md:py-24 lg:py-32">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">Get Started in 3 Simple Steps</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground mt-4">
                Joining or creating a group is simple and takes just a few minutes.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-md gap-10 md:max-w-5xl md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background border shadow-md mb-4 text-primary font-bold text-2xl font-headline">1</div>
                <h3 className="text-xl font-bold">Create Your Group</h3>
                <p className="mt-2 text-muted-foreground">Sign up and create a new savings group, giving it a name and a clear purpose.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background border shadow-md mb-4 text-primary font-bold text-2xl font-headline">2</div>
                <h3 className="text-xl font-bold">Invite Members</h3>
                <p className="mt-2 text-muted-foreground">Share a unique and secure invitation link to bring your members on board.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background border shadow-md mb-4 text-primary font-bold text-2xl font-headline">3</div>
                <h3 className="text-xl font-bold">Start Saving</h3>
                <p className="mt-2 text-muted-foreground">Begin recording contributions, managing loans, and tracking your group's financial growth together.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="container py-16 md:py-24 lg:py-32">
          <div className="text-center">
              <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">Trusted by Groups Like Yours</h2>
              <p className="mx-auto max-w-2xl text-muted-foreground mt-4">
                See what other group members are saying about their experience with ChamaSync.
              </p>
            </div>
             <div className="mx-auto mt-16 grid max-w-lg gap-8 lg:max-w-4xl lg:grid-cols-2">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="p-6">
                    <CardContent className="p-0">
                         <div className="flex items-center gap-4">
                           {testimonial.avatar && <Image src={testimonial.avatar} alt={testimonial.name} width={56} height={56} className="h-14 w-14 rounded-full object-cover" />}
                            <div>
                                <p className="font-semibold">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                            </div>
                        </div>
                        <blockquote className="mt-4 border-l-2 pl-6 text-muted-foreground italic">
                            "{testimonial.quote}"
                        </blockquote>
                    </CardContent>
                </Card>
              ))}
            </div>
        </section>
        
        {/* Final CTA */}
        <section className="bg-muted">
            <div className="container py-16 md:py-24 text-center">
                 <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                 <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">Ready to Transform Your Chama?</h2>
                 <p className="mx-auto max-w-2xl text-muted-foreground mt-4">
                    Empower your group with the tools it deserves. Get started today—it's free!
                  </p>
                  <div className="mt-8">
                     <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
                        Sign Up & Create a Group
                    </Link>
                  </div>
            </div>
        </section>

      </main>
      
       <footer className="border-t bg-background">
          <div className="container py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <Link href="/" className="flex items-center space-x-2">
                  <Logo className="h-7 w-7 text-primary" />
                  <span className="font-bold text-lg font-headline">ChamaSync</span>
                </Link>
                <p className="text-sm text-muted-foreground">The modern solution for managing your savings group with transparency and ease.</p>
                 <div className="flex space-x-4">
                  <Link href="#" className="text-muted-foreground hover:text-foreground"><Twitter className="h-5 w-5" /></Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground"><Facebook className="h-5 w-5" /></Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground"><Linkedin className="h-5 w-5" /></Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#features" className="text-muted-foreground hover:text-foreground">Features</Link></li>
                  <li><Link href="/login" className="text-muted-foreground hover:text-foreground">Get Started</Link></li>
                  <li><Link href="#testimonials" className="text-muted-foreground hover:text-foreground">Testimonials</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                  <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact Us</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">123 Westlands Rd, Nairobi, Kenya</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                    <a href="mailto:contact@chamasync.com" className="text-muted-foreground hover:text-foreground">contact@chamasync.com</a>
                  </li>
                   <li className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                    <a href="tel:+254700000000" className="text-muted-foreground hover:text-foreground">+254 700 000 000</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} ChamaSync. All Rights Reserved. Built to empower savings groups in Kenya.</p>
            </div>
          </div>
        </footer>
    </div>
  );
}

    