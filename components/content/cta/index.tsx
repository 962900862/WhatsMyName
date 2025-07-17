import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";

interface CTASection {
  title: string;
  description: string;
  primary: string;
  secondary: string;
}

interface CTAProps {
  section: CTASection;
}

export default function CTA({ section }: CTAProps) {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {section.title}
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            {section.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4" asChild>
              <Link href="#tool">
                {section.primary}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="text-lg px-8 py-4" asChild>
              <Link href="The-One-Big-Beautiful-Bill-Section-by-Section.pdf">
                {section.secondary}
                <ExternalLink className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}