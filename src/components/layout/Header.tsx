
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Users, LogIn, UserPlus, CreditCard, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    const localTheme = localStorage.getItem('theme');
    if (localTheme) {
      setIsDarkMode(localTheme === 'dark');
      if (localTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);
  
  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    if (newIsDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (!mounted) {
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
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" /> {/* Placeholder for theme toggle */}
            <div className="h-8 w-20 rounded-md bg-muted animate-pulse hidden sm:block" /> {/* Placeholder for login */}
            <div className="h-8 w-24 rounded-md bg-muted animate-pulse" /> {/* Placeholder for signup */}
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
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/#features" className="text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </Link>
          <Link href="/find-talent" className="flex items-center text-muted-foreground transition-colors hover:text-foreground">
            <Search className="mr-1 h-4 w-4" /> Find Professionals
          </Link>
          <Link href="/payments" className="flex items-center text-muted-foreground transition-colors hover:text-foreground">
            <CreditCard className="mr-1 h-4 w-4" /> Payments
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
        </div>
      </div>
    </header>
  );
};

export default Header;
