
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, FileText, Briefcase, DollarSign } from 'lucide-react'; // Removed Award

const steps = [
  {
    icon: <UserPlus className="h-10 w-10 text-primary" />,
    title: 'Sign Up & Create Profile',
    description: 'Join for free and set up your detailed profile, whether you are a professional showcasing skills or a client posting a project.',
    delay: 0,
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: 'Post or Find Opportunities',
    description: 'Clients can post detailed project requirements. Professionals can browse and apply for projects that match their expertise.',
    delay: 1,
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: 'Collaborate & Complete',
    description: 'Use our platform tools to communicate, share files, and manage the project. Ensure successful completion with milestones.',
    delay: 2,
  },
  {
    icon: <DollarSign className="h-10 w-10 text-primary" />,
    title: 'Payment & Review',
    description: 'Securely process payments before the project begins. After completion, both parties can leave reviews to build reputation.',
    delay: 3,
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-b from-accent/20 to-background dark:from-accent/10 dark:to-background">
      <div className="container mx-auto max-w-screen-xl px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Getting Started is <span className="text-primary">Easy</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow these simple steps to start your journey on WebiconDesign.
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
