import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Users, ShieldCheck, MessageSquare, DollarSign, Search } from 'lucide-react';

const features = [
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: 'Service: Expert Project Matching',
    description: 'Our intelligent platform connects you with the perfect professionals or projects based on your specific needs and skills.',
    delay: 0,
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Service: Seamless Collaboration Tools',
    description: 'Utilize our integrated tools to communicate, share files, and manage projects effectively from start to finish.',
    delay: 1,
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Service: Secure Payment Processing',
    description: 'Enjoy peace of mind with our secure payment system, ensuring fair and timely transactions for all parties.',
    delay: 2,
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: 'Service: Direct Communication Channels',
    description: 'Stay connected with collaborators or clients through instant messaging and other communication features.',
    delay: 0,
  },
  {
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    title: 'Service: Transparent Project Bidding',
    description: 'Experience clear, upfront pricing and project terms. Know what you pay or earn before you commit.',
    delay: 1,
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Service: Efficient Project Delivery',
    description: 'Find skilled professionals ready to start quickly and access tools that help deliver high-quality work on time.',
    delay: 2,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Our Core <span className="text-primary">Platform Services</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the key services WebiconDesign provides to help you achieve your project goals, whether you're hiring talent or offering your expertise.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-delay-${feature.delay}`}
            >
              <CardHeader className="items-center text-center md:items-start md:text-left">
                <div className="p-3 rounded-full bg-primary/10 mb-4 inline-block">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center md:text-left">
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
