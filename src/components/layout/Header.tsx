
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Moon, Sun, CreditCard, Search, LogIn, UserPlus, LogOut, Briefcase, UserCog, MessageSquare } from 'lucide-react'; // Added Briefcase, UserCog, MessageSquare
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase'; // Added db
import { doc, getDoc } from 'firebase/firestore'; // Added getDoc
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isProvider, setIsProvider] = useState(false); // New state for provider status
  const [isAdmin, setIsAdmin] = useState(false); // New state for admin status
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Theme initialization
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

    // Auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Check for provider or admin status from Firestore
        const userDocRef = doc(db, "users", user.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setIsProvider(userData.isProvider === true);
            setIsAdmin(userData.isAdmin === true);
            // Also update sessionStorage flags if needed for other components
            if(userData.isProvider) sessionStorage.setItem('isProviderAuthenticated', 'true'); else sessionStorage.removeItem('isProviderAuthenticated');
            if(userData.isAdmin) sessionStorage.setItem('isAdminAuthenticated', 'true'); else sessionStorage.removeItem('isAdminAuthenticated');
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
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);
  
  const toggleTheme = () => {
    const newIsDarkModeState = !isDarkMode;
    setIsDarkMode(newIsDarkModeState);
    document.documentElement.classList.toggle('dark', newIsDarkModeState);
    localStorage.setItem('theme', newIsDarkModeState ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsProvider(false); // Reset provider state on logout
      setIsAdmin(false); // Reset admin state on logout
      sessionStorage.removeItem('isProviderAuthenticated');
      sessionStorage.removeItem('isAdminAuthenticated');
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

  // Skeleton loader for header while auth is loading
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
          <Link href="/#features" className="text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </Link>
          <Link href="/find-talent" className="flex items-center text-muted-foreground transition-colors hover:text-foreground">
            <Search className="mr-1 h-4 w-4" /> Find Professionals
          </Link>
           {currentUser && (
            <Link href="/messages" className="flex items-center text-muted-foreground transition-colors hover:text-foreground">
                <MessageSquare className="mr-1 h-4 w-4" /> Messages
            </Link>
           )}
          <Link href="/payments" className="flex items-center text-muted-foreground transition-colors hover:text-foreground">
            <CreditCard className="mr-1 h-4 w-4" /> Payments
          </Link>
          {isProvider && currentUser && (
            <Link href="/providerspanel/dashboard" className="flex items-center text-primary font-semibold transition-colors hover:text-primary/80">
              <Briefcase className="mr-1 h-4 w-4" /> Provider Panel
            </Link>
          )}
           {isAdmin && currentUser && (
            <Link href="/adminpanel/admin" className="flex items-center text-destructive font-semibold transition-colors hover:text-destructive/80">
              <UserCog className="mr-1 h-4 w-4" /> Admin Panel
            </Link>
          )}
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          {currentUser ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/providerspanel/login">
                   Provider Login
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" /> Log In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
