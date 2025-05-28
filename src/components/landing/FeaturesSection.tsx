import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Users, ShieldCheck, MessageSquare, DollarSign, Search, Palette, Code } from 'lucide-react';

const features = [
  {
    icon: <Code className="h-8 w-8 text-primary" />,
    title: 'Our Expertise: Custom Development',
    description: 'Our team provides tailored web and application development to meet your specific project requirements and business goals.',
    delay: 0,
  },
  {
    icon: <Palette className="h-8 w-8 text-primary" />,
    title: 'Our Skills: UI/UX & Brand Design',
    description: 'We create intuitive user experiences and impactful brand identities that resonate with your audience and elevate your presence.',
    delay: 1,
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Our Process: Secure & Transparent Payments',
    description: 'Enjoy peace of mind with our straightforward and secure payment system, ensuring clarity for all project engagements.',
    delay: 2,
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: 'Our Commitment: Direct Communication',
    description: 'You’ll have direct lines of communication with our team members, ensuring clarity and responsiveness throughout your project.',
    delay: 0,
  },
  {
    icon: <DollarSign className="h-8 w-8 text-primary" />,
    title: 'Our Promise: Transparent Project Pricing',
    description: 'We offer clear, upfront pricing for our services. Know the costs involved before we begin, ensuring a transparent partnership.',
    delay: 1,
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Our Focus: Efficient Project Delivery',
    description: 'Our experienced team is dedicated to delivering high-quality work efficiently and on schedule, helping you achieve results faster.',
    delay: 2,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Our Core <span className="text-primary">Team Services</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how our team's core services can help you achieve your project goals. We bring a personal touch and collective expertise to every project.
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
