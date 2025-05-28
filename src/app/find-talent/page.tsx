
"use client";

import type { NextPage } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, DollarSign, MapPin, Star, Loader2, Search, ShieldAlert, Github, Linkedin, CalendarDays, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData, query, where } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'; // Renamed User to FirebaseUser
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


interface TeamMember { // Renamed from Professional to TeamMember
  id: string; // User UID
  name: string;
  avatarUrl?: string; // URL for the avatar image
  dataAiHint?: string; // Hint for AI if using placeholder/generated images
  role?: string; // e.g., "Senior UI/UX Designer"
  bio?: string;
  skills?: string[]; // Array of skill strings
  rate?: string; // e.g., "$75/hr"
  location?: string;
  rating?: number; // Average rating
  status?: "Available" | "Busy" | "Away" | ""; // Availability status
  githubLink?: string;
  linkedinLink?: string;
  projectsSummary?: string;
}

const placeholderTeamMembersOnError: TeamMember[] = [ // Renamed
 {
    id: 'fallback-1',
    name: 'Alice Wonderland (Error Fallback)',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman portrait',
    role: 'Lead Designer & Strategist',
    bio: 'Passionate designer with 7+ years creating intuitive user experiences. (Error data)',
    skills: ['UI Design', 'UX Research', 'Prototyping', 'Figma', 'Branding'],
    rate: 'Project-based',
    location: 'Remote',
    rating: 4.9,
    status: "Available",
  },
  {
    id: 'fallback-2',
    name: 'Bob The Builder (Error Fallback)',
    avatarUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'man portrait',
    role: 'Lead Full-Stack Developer',
    bio: 'Versatile developer specializing in React, Node.js, and modern cloud solutions. (Error data)',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Next.js', 'Firebase'],
    rate: 'Project-based',
    location: 'Remote',
    rating: 4.8,
    status: "Busy",
  },
];


const FindTeamPage: NextPage = () => { // Renamed from FindProfessionalsPage
  const router = useRouter();
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]); // Renamed
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchTeamMembers(); // Renamed
      } else {
        toast({
          title: "Access Denied",
          description: "You need to be logged in to view this page. Redirecting...",
          variant: "destructive",
        });
        router.replace('/'); 
      }
    });
    return () => unsubscribe();
  }, [router, toast]);

  const fetchTeamMembers = async () => { // Renamed
    try {
      setIsLoading(true);
      setError(null);
      // Fetch users marked as 'isProvider' which now means 'isTeamMember'
      const teamQuery = query(collection(db, 'users'), where('isProvider', '==', true));
      const teamSnapshot = await getDocs(teamQuery);
      
      const teamList = teamSnapshot.docs.map((docSnap: QueryDocumentSnapshot<DocumentData>) => {
        const data = docSnap.data();
        let skillsArray: string[] = [];
        if (Array.isArray(data.skills)) {
            skillsArray = data.skills;
        } else if (typeof data.skills === 'string' && data.skills.trim() !== '') {
            skillsArray = data.skills.split(',').map((s: string) => s.trim());
        }

        return {
          id: docSnap.id,
          name: data.name || 'Team Member',
          avatarUrl: data.avatarUrl || `https://placehold.co/100x100.png`,
          dataAiHint: data.dataAiHint || `${data.name ? data.name.split(' ')[0].toLowerCase() : 'person'} portrait`,
          role: data.role || 'Specialist',
          bio: data.bio || 'Dedicated team member bringing expertise to your projects.',
          skills: skillsArray,
          rate: data.rate || 'Project-based',
          location: data.location || 'Remote',
          rating: data.rating || 0, 
          status: data.status || '',
          githubLink: data.githubLink || '',
          linkedinLink: data.linkedinLink || '',
          projectsSummary: data.projectsSummary || '',
        } as TeamMember;
      });
      
      if (teamList.length === 0) {
         setTeamMembers(placeholderTeamMembersOnError); 
         setError("No team members found at the moment. Displaying placeholder data.");
      } else {
        setTeamMembers(teamList);
      }
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError('Failed to load team member information. Displaying placeholder data.');
      setTeamMembers(placeholderTeamMembersOnError);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser && isLoading) { 
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }
  
  if (!currentUser && !isLoading) {
     return (
       <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <p className="text-destructive">Access Denied. Redirecting...</p>
      </div>
    );
  }

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'Busy':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Away':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-screen-xl px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
           <Users className="h-16 w-16 mx-auto mb-4 text-primary" /> {/* Changed icon */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Meet Our <span className="text-primary">Experienced Team</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Get to know the dedicated individuals on our team who are ready to bring your projects to life with their expertise and passion.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg text-muted-foreground">Loading team members...</p>
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="mb-8">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && teamMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => ( // Renamed professional to member
              <Card 
                key={member.id} 
                className={`flex flex-col hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-delay-${index % 3}`}
              >
                <CardHeader className="items-center text-center pb-4">
                  <Avatar className="w-24 h-24 mb-4 border-2 border-primary/20 shadow-md">
                    <Image 
                        src={member.avatarUrl || 'https://placehold.co/100x100.png'} 
                        alt={member.name} 
                        width={100} 
                        height={100} 
                        className="rounded-full object-cover" 
                        data-ai-hint={member.dataAiHint || "person"} 
                    />
                    <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-2xl font-semibold text-foreground">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium flex items-center gap-1">
                    <Briefcase className="h-4 w-4" /> {member.role || 'Team Specialist'}
                  </CardDescription>
                   {member.status && (
                    <Badge className={`mt-2 text-xs ${getStatusBadgeColor(member.status)}`}>
                       <CalendarDays className="mr-1 h-3 w-3" /> {member.status}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="text-sm flex-grow">
                  <p className="text-muted-foreground mb-4 px-2 line-clamp-3">{member.bio || "No bio provided."}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-foreground mb-1">Skills:</h4>
                    {member.skills && member.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                        {member.skills.slice(0, 5).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                        {member.skills.length > 5 && <Badge variant="outline" className="text-xs">+{member.skills.length - 5} more</Badge>}
                        </div>
                    ) : (
                        <p className="text-muted-foreground italic">No skills listed.</p>
                    )}
                  </div>
                 
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-4 w-4 text-primary/80" />
                      <span>{member.rate || 'Rate not specified'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary/80" />
                      <span>{member.location || 'Location not specified'}</span>
                    </div>
                     {member.rating && member.rating > 0 ? (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span>{member.rating.toFixed(1)}</span>
                      </div>
                     ): (
                       <div className="flex items-center gap-1 text-muted-foreground">
                        <Star className="h-4 w-4 text-muted-foreground/50" />
                        <span>No ratings yet</span>
                      </div>
                     )}
                  </div>
                   {(member.githubLink || member.linkedinLink) && (
                    <div className="mt-4 pt-4 border-t flex items-center justify-center space-x-4">
                        {member.githubLink && (
                        <Link href={member.githubLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Github className="h-5 w-5" />
                        </Link>
                        )}
                        {member.linkedinLink && (
                        <Link href={member.linkedinLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Linkedin className="h-5 w-5" />
                        </Link>
                        )}
                    </div>
                  )}

                </CardContent>
                <CardFooter className="justify-center pt-4 mt-auto">
                  <Button asChild className="w-full md:w-auto" disabled>
                    <Link href={`/profile/${member.id}`}>View Full Profile (Soon)</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
         {teamMembers.length === 0 && !isLoading && !error && ( 
          <div className="text-center py-10">
            <p className="text-lg text-muted-foreground">No team members found matching the criteria.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default FindTeamPage; // Renamed
