import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Users, ShieldCheck, MessageSquare, DollarSign, Search } from 'lucide-react';

const features = [
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: 'Advanced Project Matching',
    description: 'Our intelligent algorithm connects you with the perfect freelancers or projects based on your specific needs and skills.',
    delay: 0,
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Collaborative Workspaces',
    description: 'Seamlessly communicate, share files, and manage projects with our integrated collaboration tools.',
    delay: 1,
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Secure Payments & Escrow',
    description: 'Enjoy peace of mind with our secure payment system and escrow protection for all transactions.',
    delay: 2,
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: 'Real-time Communication',
    description: 'Stay connected with clients or freelancers through instant messaging and video calls.',
    delay: 0,
  },
  {
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    title: 'Transparent Pricing',
    description: 'Clear, upfront pricing with no hidden fees. Know what you pay or earn before you start.',
    delay: 1,
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Rapid Project Delivery',
    description: 'Find skilled professionals ready to start quickly and deliver high-quality work on time.',
    delay: 2,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Why Choose <span className="text-primary">WebiconDesign</span>?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the features that make our platform the ideal choice for freelancers and businesses alike.
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
