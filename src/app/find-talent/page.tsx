
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, DollarSign, MapPin, Star } from 'lucide-react';

const placeholderTalents = [
  {
    id: '1',
    name: 'Alice Wonderland',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman portrait',
    role: 'Senior UI/UX Designer',
    bio: 'Passionate designer with 7+ years of experience creating intuitive and engaging user experiences for web and mobile.',
    skills: ['UI Design', 'UX Research', 'Prototyping', 'Figma', 'Adobe XD'],
    rate: '$75/hr',
    location: 'New York, USA',
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Bob The Builder',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man portrait',
    role: 'Full-Stack Web Developer',
    bio: 'Versatile developer specializing in React, Node.js, and modern cloud architectures. Loves solving complex problems.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'GraphQL', 'Next.js'],
    rate: '$90/hr',
    location: 'London, UK',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Charlie Brown',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'person smiling',
    role: 'Graphic Designer & Illustrator',
    bio: 'Creative illustrator and graphic designer focused on branding, digital art, and marketing materials. Let\'s make something beautiful!',
    skills: ['Illustration', 'Branding', 'Adobe Illustrator', 'Photoshop', 'Logo Design'],
    rate: '$60/hr',
    location: 'Remote',
    rating: 5.0,
  },
   {
    id: '4',
    name: 'Diana Prince',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman professional',
    role: 'Project Manager & Scrum Master',
    bio: 'Experienced Project Manager with a knack for agile methodologies and keeping complex projects on track and on budget.',
    skills: ['Agile', 'Scrum', 'Jira', 'Project Planning', 'Risk Management'],
    rate: '$80/hr',
    location: 'Berlin, Germany',
    rating: 4.7,
  },
  {
    id: '5',
    name: 'Edward Elric',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'young man',
    role: 'Mobile App Developer (iOS & Android)',
    bio: 'Dedicated mobile developer creating high-performance native apps for both iOS and Android platforms using Swift and Kotlin.',
    skills: ['Swift', 'Kotlin', 'iOS Development', 'Android Development', 'Firebase'],
    rate: '$85/hr',
    location: 'Tokyo, Japan',
    rating: 4.9,
  },
  {
    id: '6',
    name: 'Fiona Glenanne',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman confident',
    role: 'Cybersecurity Consultant',
    bio: 'Cybersecurity expert specializing in threat assessment, penetration testing, and security architecture for businesses of all sizes.',
    skills: ['Penetration Testing', 'Network Security', 'Ethical Hacking', 'CISSP'],
    rate: '$120/hr',
    location: 'Remote',
    rating: 4.8,
  },
];

export default function FindTalentPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto max-w-screen-xl px-4 md:px-6 py-12 md:py-16">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Discover <span className="text-primary">Talented Freelancers</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our curated list of skilled professionals ready to bring your projects to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {placeholderTalents.map((talent, index) => (
            <Card 
              key={talent.id} 
              className={`hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-delay-${index % 3}`}
            >
              <CardHeader className="items-center text-center pb-4">
                <Avatar className="w-24 h-24 mb-4 border-2 border-primary/20 shadow-md">
                  <Image src={talent.avatar} alt={talent.name} width={100} height={100} className="rounded-full" data-ai-hint={talent.dataAiHint} />
                  <AvatarFallback>{talent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl font-semibold text-foreground">{talent.name}</CardTitle>
                <CardDescription className="text-primary font-medium flex items-center gap-1">
                  <Briefcase className="h-4 w-4" /> {talent.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm mb-4 px-2">{talent.bio}</p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {talent.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                  ))}
                  {talent.skills.length > 4 && <Badge variant="outline" className="text-xs">+{talent.skills.length - 4} more</Badge>}
                </div>
                <div className="flex justify-around items-center text-sm text-muted-foreground border-t pt-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-primary/80" />
                    <span>{talent.rate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary/80" />
                    <span>{talent.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>{talent.rating}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center pt-4">
                <Button asChild className="w-full md:w-auto">
                  <Link href={`/profile/${talent.id}`}>View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
