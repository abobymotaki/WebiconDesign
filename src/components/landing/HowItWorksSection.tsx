
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, FileText, Briefcase, DollarSign, MessageSquare, Zap } from 'lucide-react'; 

const steps = [
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: '1. Initial Consultation & Goal Setting',
    description: 'Reach out to us. We\'ll discuss your project needs, goals, and how our team’s expertise can best serve you.',
    delay: 0,
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: '2. Project Proposal & Agreement',
    description: 'Based on our discussion, we\'ll craft a detailed project proposal. Once we align on the scope and terms, we kick things off.',
    delay: 1,
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: '3. Dedicated Collaboration & Execution',
    description: 'You\'ll work directly with our dedicated team members. We use efficient tools for communication and project management to ensure success.',
    delay: 2,
  },
  {
    icon: <DollarSign className="h-10 w-10 text-primary" />,
    title: '4. Secure Payment & Project Handoff',
    description: 'We ensure secure payment processing as per our agreement. After completion and your final review, we ensure a smooth project handoff.',
    delay: 3,
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-b from-accent/20 to-background dark:from-accent/10 dark:to-background">
      <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            How We <span className="text-primary">Work With You</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Our process is designed for clarity and collaboration, ensuring we meet your project needs effectively from consultation to delivery.
          </p>
        </div>
        <div className="relative">
          {/* Connecting line - visible on larger screens */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 -z-10"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className={`relative animate-fade-in-delay-${step.delay}`}>
                {/* Circle for step number */}
                <div className="hidden lg:flex absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-primary rounded-full items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
                  {index + 1}
                </div>
                <Card className="text-center h-full hover:shadow-lg transition-shadow duration-300 border-2 border-transparent hover:border-primary/30">
                  <CardHeader className="items-center pt-8">
                    <div className="p-4 rounded-full bg-primary/10 mb-4 inline-block">
                      {step.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
