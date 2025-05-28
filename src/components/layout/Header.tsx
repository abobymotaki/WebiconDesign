
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Moon, Sun, CreditCard, Search, LogIn, UserPlus, LogOut, Briefcase, UserCog, MessageSquare, Mail, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter, usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetClose, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'; // Added SheetHeader, SheetTitle
import { cn } from '@/lib/utils';

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isProvider, setIsProvider] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const localTheme = localStorage.getItem('theme');
    if (localTheme) {
      const newIsDarkMode = localTheme === 'dark';
      setIsDarkMode(newIsDarkMode);
      document.documentElement.classList.toggle('dark', newIsDarkMode);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const currentIsProvider = userData.isProvider === true;
            const currentIsAdmin = userData.isAdmin === true;
            setIsProvider(currentIsProvider);
            setIsAdmin(currentIsAdmin);
            
            if(currentIsProvider) sessionStorage.setItem('isProviderAuthenticated', 'true'); else sessionStorage.removeItem('isProviderAuthenticated');
            if(currentIsAdmin) sessionStorage.setItem('isAdminAuthenticated', 'true'); else sessionStorage.removeItem('isAdminAuthenticated');

            const isProviderPanelPage = pathname.startsWith('/providerspanel');
            const isAdminPanelPage = pathname.startsWith('/adminpanel/admin');

            if (currentIsProvider && !isProviderPanelPage && sessionStorage.getItem('providerWelcomeShownThisSession') !== 'true') {
              toast({
                title: "Welcome back, Provider!",
                description: "You can access your provider tools.",
                action: (
                  <Button variant="outline" size="sm" onClick={() => router.push('/providerspanel/dashboard')}>
                    Go to Dashboard
                  </Button>
                ),
              });
              sessionStorage.setItem('providerWelcomeShownThisSession', 'true');
            } else if (currentIsAdmin && !isAdminPanelPage && sessionStorage.getItem('adminWelcomeShownThisSession') !== 'true') {
                // Similar toast for admin if desired
                // toast({ title: "Admin Access", description: "Welcome to the admin panel."});
                // sessionStorage.setItem('adminWelcomeShownThisSession', 'true');
            }


          } else {
            setIsProvider(false);
            setIsAdmin(false);
            sessionStorage.removeItem('isProviderAuthenticated');
            sessionStorage.removeItem('isAdminAuthenticated');
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setIsProvider(false);
          setIsAdmin(false);
        }
      } else {
        setIsProvider(false);
        setIsAdmin(false);
        sessionStorage.removeItem('isProviderAuthenticated');
        sessionStorage.removeItem('isAdminAuthenticated');
        sessionStorage.removeItem('providerWelcomeShownThisSession');
        sessionStorage.removeItem('adminWelcomeShownThisSession');
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, [toast, router, pathname]);
  
  useEffect(() => {
    if (isSheetOpen) {
      setIsSheetOpen(false);
    }
    // Intentionally disabled exhaustive-deps, we only want this to run on pathname change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleTheme = () => {
    const newIsDarkModeState = !isDarkMode;
    setIsDarkMode(newIsDarkModeState);
    document.documentElement.classList.toggle('dark', newIsDarkModeState);
    localStorage.setItem('theme', newIsDarkModeState ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    setIsSheetOpen(false);
    try {
      await signOut(auth);
      setIsProvider(false);
      setIsAdmin(false);
      sessionStorage.removeItem('isProviderAuthenticated');
      sessionStorage.removeItem('isAdminAuthenticated');
      sessionStorage.removeItem('providerWelcomeShownThisSession');
      sessionStorage.removeItem('adminWelcomeShownThisSession');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/'); 
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Logout Failed",
        description: "Could not log you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const NavLink = ({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon?: React.ElementType }) => (
    <SheetClose asChild>
      <Link
        href={href}
        className={cn(
          "flex items-center py-2 px-3 rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-accent",
          pathname === href && "bg-accent text-foreground"
        )}
      >
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        {children}
      </Link>
    </SheetClose>
  );

  if (!mounted || isLoadingAuth) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary">
              <path d="M6.5 3L2 7V17L6.5 21L11 17V7L6.5 3ZM4 7.5L6.5 5L9 7.5V16.5L6.5 19L4 16.5V7.5Z" />
              <path d="M17.5 3L13 7V17L17.5 21L22 17V7L17.5 3ZM15 7.5L17.5 5L20 7.5V16.5L17.5 19L15 16.5V7.5Z" />
            </svg>
            <span className="font-extrabold text-2xl tracking-tight text-foreground">WebiconDesign</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="h-8 w-20 rounded-md bg-muted animate-pulse hidden sm:block" />
            <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary">
            <path d="M6.5 3L2 7V17L6.5 21L11 17V7L6.5 3ZM4 7.5L6.5 5L9 7.5V16.5L6.5 19L4 16.5V7.5Z" />
            <path d="M17.5 3L13 7V17L17.5 21L22 17V7L17.5 3ZM15 7.5L17.5 5L20 7.5V16.5L17.5 19L15 16.5V7.5Z" />
          </svg>
          <span className="font-extrabold text-2xl tracking-tight text-foreground">WebiconDesign</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-4 text-sm font-medium">
          <Link href="/#features" className="text-muted-foreground transition-colors hover:text-foreground">Features</Link>
          <Link href="/#how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">How It Works</Link>
          <Link href="/find-talent" className="flex items-center text-muted-foreground transition-colors hover:text-foreground"><Search className="mr-1 h-4 w-4" /> Find Professionals</Link>
           {currentUser && (
            <Link href="/messages" className="flex items-center text-muted-foreground transition-colors hover:text-foreground"><MessageSquare className="mr-1 h-4 w-4" /> Messages</Link>
           )}
          <Link href="/payments" className="flex items-center text-muted-foreground transition-colors hover:text-foreground"><CreditCard className="mr-1 h-4 w-4" /> Payments</Link>
          <Link href="/contact" className="flex items-center text-muted-foreground transition-colors hover:text-foreground"><Mail className="mr-1 h-4 w-4" /> Contact Us</Link>
          {isProvider && currentUser && (
            <Link href="/providerspanel/dashboard" className="flex items-center text-primary font-semibold transition-colors hover:text-primary/80"><Briefcase className="mr-1 h-4 w-4" /> Provider Panel</Link>
          )}
           {isAdmin && currentUser && (
            <Link href="/adminpanel/admin" className="flex items-center text-destructive font-semibold transition-colors hover:text-destructive/80"><UserCog className="mr-1 h-4 w-4" /> Admin Panel</Link>
          )}
        </nav>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="hidden md:inline-flex">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {currentUser ? (
            <Button variant="outline" size="sm" onClick={handleLogout} className="hidden md:inline-flex">
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild className="hidden md:inline-flex">
                <Link href="/login"><LogIn className="mr-2 h-4 w-4" /> Log In</Link>
              </Button>
              <Button size="sm" asChild className="hidden md:inline-flex">
                <Link href="/signup"><UserPlus className="mr-2 h-4 w-4" /> Sign Up</Link>
              </Button>
            </>
          )}

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] p-4 flex flex-col">
              <SheetHeader className="mb-4">
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-2 flex-grow">
                <NavLink href="/#features" icon={Search}>Features</NavLink>
                <NavLink href="/#how-it-works" icon={Search}>How It Works</NavLink>
                <NavLink href="/find-talent" icon={Search}>Find Professionals</NavLink>
                {currentUser && <NavLink href="/messages" icon={MessageSquare}>Messages</NavLink>}
                <NavLink href="/payments" icon={CreditCard}>Payments</NavLink>
                <NavLink href="/contact" icon={Mail}>Contact Us</NavLink>
                {isProvider && currentUser && <NavLink href="/providerspanel/dashboard" icon={Briefcase}>Provider Panel</NavLink>}
                {isAdmin && currentUser && <NavLink href="/adminpanel/admin" icon={UserCog}>Admin Panel</NavLink>}
              </nav>
              
              <div className="mt-auto pt-4 border-t border-border/40">
                {currentUser ? (
                  <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                    <LogOut className="mr-2 h-4 w-4" /> Log Out
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <SheetClose asChild>
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <Link href="/login"><LogIn className="mr-2 h-4 w-4" /> Log In</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button size="sm" asChild className="w-full">
                        <Link href="/signup"><UserPlus className="mr-2 h-4 w-4" /> Sign Up</Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme} 
        aria-label="Toggle theme" 
        className="md:hidden fixed bottom-4 left-4 z-50 bg-background/80 backdrop-blur-sm border border-border/60 shadow-md"
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </header>
  );
};

export default Header;
