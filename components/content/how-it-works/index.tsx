import { Check, ArrowRight, Gem, Settings, Hash, Eye } from "lucide-react";

interface HowItWorksStep {
  title: string;
  description: string;
  icon: string;
}

interface HowItWorksSection {
  title: string;
  subtitle: string;
  steps: HowItWorksStep[];
}

interface HowItWorksProps {
  section: HowItWorksSection;
}

const getStepIcon = (iconName: string) => {
  const icons = {
    step1: Gem,
    step2: Settings,
    step3: Hash,
    step4: Eye,
    gem: Gem,
    settings: Settings,
    hash: Hash,
    eye: Eye
  };
  
  return icons[iconName as keyof typeof icons] || Check;
};

export default function HowItWorks({ section }: HowItWorksProps) {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {section.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {section.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {section.steps.map((step, index) => {
            const IconComponent = getStepIcon(step.icon);
            
            return (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {index < section.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-muted-foreground mx-auto" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}