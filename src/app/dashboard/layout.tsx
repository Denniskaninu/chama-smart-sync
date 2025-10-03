
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Settings,
  Wallet,
  MessageSquare,
  FileText,
  TrendingUp,
  CreditCard,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/user-nav";
import { Logo } from "@/components/icons";
import { useUser } from "@/firebase";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";

function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/groups", label: "My Groups", icon: Users },
    { href: "/dashboard/contributions", label: "Contributions", icon: Wallet },
    { href: "/dashboard/reports", label: "Reports", icon: TrendingUp },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
    { href: "/dashboard/receipts", label: "Receipts", icon: FileText },
  ];

  const bottomMenuItems = [
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-7 h-7 text-primary" />
          <span className="text-xl font-headline font-semibold group-data-[collapsible=icon]:hidden">ChamaSync</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label} onClick={handleLinkClick}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')}
                  tooltip={{
                    children: item.label,
                    className: "font-body",
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-body">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
          {bottomMenuItems.map((item) => (
            <SidebarMenuItem key={item.label} onClick={handleLinkClick}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{
                    children: item.label,
                    className: "font-body",
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-body">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
      </SidebarFooter>
    </Sidebar>
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
       <div className="h-screen w-full bg-background flex items-center justify-center">
         <div className="p-4 sm:p-6 w-full h-full flex flex-col gap-4">
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 rounded-lg border bg-card px-4 sm:px-6">
                <Skeleton className="h-8 w-8 md:hidden" />
                <div className="flex-1">
                    {/* Placeholder for future search */}
                </div>
                <Skeleton className="h-10 w-28" />
            </header>
            <main className="flex-1 p-4 sm:p-6 rounded-lg border bg-card">
              <Skeleton className="h-full w-full" />
            </main>
         </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-end gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <SidebarTrigger className="md:hidden mr-auto" />
          <UserNav />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
      <FirebaseErrorListener />
    </SidebarProvider>
  );
}

    