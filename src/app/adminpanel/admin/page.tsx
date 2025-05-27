
"use client";

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminPanelPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication status on component mount
    const adminAuthStatus = sessionStorage.getItem('isAdminAuthenticated');
    if (adminAuthStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      toast({
        title: "Access Denied",
        description: "You are not authorized to view this page. Redirecting to homepage.",
        variant: "destructive"
      });
      router.replace('/'); // Redirect to homepage if not authenticated
    }
  }, [router, toast]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    toast({
      title: "Admin Logout",
      description: "You have been logged out from the admin panel.",
    });
    router.push('/adminpanel/admin/login');
  };

  if (isAuthenticated === null) {
    // Still checking auth status, render loading or nothing
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <LayoutDashboard className="h-16 w-16 text-primary animate-pulse mb-4" />
        <p className="text-muted-foreground">Loading Admin Panel...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // This state should ideally not be reached for long due to redirect
    // but acts as a fallback.
    return (
       <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <ShieldCheck className="h-16 w-16 text-destructive mb-4" />
        <p className="text-destructive">Access Denied. Redirecting...</p>
      </div>
    );
  }

  // If authenticated, render admin panel content
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-screen-lg px-4 md:px-6 py-12 md:py-16">
        <Card className="animate-fade-in shadow-xl border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center">
                <LayoutDashboard className="mr-3 h-8 w-8 text-primary" />
                Admin Control Panel
              </CardTitle>
              <CardDescription>Manage your application from here.</CardDescription>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Admin Logout
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">Welcome, Admin!</p>
            <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-300 rounded-md">
              <p className="font-bold">Security Notice:</p>
              <p className="text-sm">This admin panel is using a prototype-level hardcoded authentication mechanism. It is NOT secure for production use. For a real application, implement robust authentication with proper user roles and permissions.</p>
            </div>
            <div className="p-6 border rounded-lg bg-muted/30">
              <h3 className="text-xl font-semibold mb-3 text-foreground">Placeholder Admin Content</h3>
              <p className="text-muted-foreground">
                This is where your admin functionalities like user management, analytics, content moderation, etc., would go.
                For now, it's a placeholder to demonstrate the login and logout flow.
              </p>
              {/* Example: Link to other admin sections could go here */}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanelPage;
