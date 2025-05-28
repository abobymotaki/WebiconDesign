
"use client";

import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, LogOut, ShieldCheck, Loader2, Users, Briefcase, DollarSign, TrendingUp, LineChartIcon, BarChartIcon, ListChecks } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

// Mock Data
const totalClients = 125; // Changed from totalUsers
const totalProjects = 34;
const revenueThisMonth = 5250.75;
const newClientsLast7Days = 8; // Changed from newSignupsLast7Days

const clientAcquisitionData = [ // Changed from userSignupsData
  { date: '2024-07-01', clients: 1 },
  { date: '2024-07-02', clients: 2 },
  { date: '2024-07-03', clients: 0 },
  { date: '2024-07-04', clients: 3 },
  { date: '2024-07-05', clients: 1 },
  { date: '2024-07-06', clients: 1 },
  { date: '2024-07-07', clients: 2 },
];

const projectCategoriesFocusData = [ // Changed from projectCategoriesData
  { category: 'Web Dev', count: 12 },
  { category: 'Mobile Dev', count: 8 },
  { category: 'Design', count: 9 },
  { category: 'Strategy', count: 5 },
];

const recentPaymentsData = [
  { id: 'pay_1', email: 'client1@example.com', amount: 500.00, date: '2024-07-07', status: 'Succeeded' },
  { id: 'pay_2', email: 'client2@example.com', amount: 750.00, date: '2024-07-06', status: 'Succeeded' },
  { id: 'pay_3', email: 'client3@example.com', amount: 1200.00, date: '2024-07-05', status: 'Succeeded' },
  { id: 'pay_4', email: 'client4@example.com', amount: 300.00, date: '2024-07-05', status: 'Succeeded' },
];

const chartConfig = {
  clients: { label: "Clients", color: "hsl(var(--chart-1))" }, // Changed from signups
  projects: { label: "Projects", color: "hsl(var(--chart-2))" },
};


const AdminAnalyticsPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists() && userDocSnap.data().isAdmin === true) {
            setAdminUser(user);
          } else {
            await signOut(auth);
            sessionStorage.removeItem('isAdminAuthenticated');
            toast({ title: "Access Denied", description: "Not an admin. Redirecting...", variant: "destructive" });
            router.replace('/');
          }
        } catch (error) {
          console.error("Error verifying admin status:", error);
          await signOut(auth);
          sessionStorage.removeItem('isAdminAuthenticated');
          toast({ title: "Authentication Error", description: "Could not verify admin status. Redirecting...", variant: "destructive" });
          router.replace('/');
        }
      } else {
        sessionStorage.removeItem('isAdminAuthenticated');
        toast({ title: "Access Denied", description: "Not logged in. Redirecting...", variant: "destructive" });
        router.replace('/adminpanel/admin/login');
      }
      setIsLoading(false);
    });
     if (sessionStorage.getItem('isAdminAuthenticated') !== 'true' && !auth.currentUser) {
        if (!isLoading) { 
           router.replace('/adminpanel/admin/login');
        }
    }
    return () => unsubscribe();
  }, [router, toast, isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Verifying Admin Access & Loading Analytics...</p>
      </div>
    );
  }

  if (!adminUser) {
    return (
       <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <ShieldCheck className="h-16 w-16 text-destructive mb-4" />
        <p className="text-destructive">Access Denied. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-screen-xl px-4 md:px-6 py-12 md:py-16">
        <div className="mb-8">
            <Link href="/adminpanel/admin" className="text-primary hover:underline text-sm flex items-center">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Back to Admin Panel
            </Link>
        </div>
        <Card className="animate-fade-in shadow-xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <TrendingUp className="mr-3 h-8 w-8 text-primary" />
              Team Analytics Dashboard
            </CardTitle>
            <CardDescription>Overview of client activity and project metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalClients.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">All engaged clients</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProjects.toLocaleString()}</div>
                   <p className="text-xs text-muted-foreground">Completed & Active</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue (This Month)</CardTitle>
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${revenueThisMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <p className="text-xs text-muted-foreground">Team earnings</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Clients (7d)</CardTitle>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{newClientsLast7Days}</div>
                   <p className="text-xs text-muted-foreground">In the last 7 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><LineChartIcon className="mr-2 h-5 w-5 text-primary" />Client Acquisition Over Time</CardTitle>
                  <CardDescription>Daily new client engagements (mock data)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <LineChart data={clientAcquisitionData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="clients" stroke="var(--color-clients)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><BarChartIcon className="mr-2 h-5 w-5 text-primary" />Project Category Focus</CardTitle>
                  <CardDescription>Number of projects by service category (mock data)</CardDescription>
                </CardHeader>
                <CardContent>
                   <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={projectCategoriesFocusData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                      <Bar dataKey="count" fill="var(--color-projects)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Payments Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" />Recent Payments</CardTitle>
                <CardDescription>A list of recent transactions from clients (mock data)</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client Email</TableHead>
                      <TableHead>Amount (USD)</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPaymentsData.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.email}</TableCell>
                        <TableCell>${payment.amount.toFixed(2)}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>
                           <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            payment.status === 'Succeeded' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {payment.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminAnalyticsPage;
