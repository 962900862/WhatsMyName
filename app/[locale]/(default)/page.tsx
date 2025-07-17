import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import UsernameChecker from '@/components/apps/username-checker';
import Hero from '@/components/content/hero';
import Feature1 from '@/components/content/feature1';
import Feature2 from '@/components/content/feature2';
import Feature3 from '@/components/content/feature3';
import Feature4 from '@/components/content/feature4';
import HowItWorks from '@/components/content/how-it-works';
import FAQ from '@/components/content/faq';
export const runtime = 'edge';
import CTA from "@/components/content/cta";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'landing' });
  
  // 设置canonical URL - 英文版本指向根域名，其他语言包含语言代码
  const baseUrl = 'https://whatsmyname.pro';
  const canonicalUrl = locale === 'en' ? baseUrl : `${baseUrl}/${locale}`;
  
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: t('metadata.keywords'),
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'landing' });

  // Prepare content data from translations
  const heroData = {
    announcement: {
      label: t('hero.announcement.label'),
      title: t('hero.announcement.title'),
      url: t('hero.announcement.url')
    },
    title: t('hero.title'),
    highlight_text: t('hero.highlight_text'),
    description: t('hero.description'),
    buttons: [
      {
        title: t('hero.buttons.0.title'),
        url: t('hero.buttons.0.url'),
        variant: t('hero.buttons.0.variant') as "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" | null | undefined,
        icon: t('hero.buttons.0.icon')
      },
      {
        title: t('hero.buttons.1.title'),
        url: t('hero.buttons.1.url'),
        variant: t('hero.buttons.1.variant') as "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" | null | undefined,
        icon: t('hero.buttons.1.icon')
      }
    ],
    tip: t('hero.tip'),
    disabled: false
  };

  const howItWorksData = {
    title: t('how_it_works.title'),
    subtitle: t('how_it_works.subtitle'),
    steps: [
      {
        title: t('how_it_works.steps.0.title'),
        description: t('how_it_works.steps.0.description'),
        icon: t('how_it_works.steps.0.icon')
      },
      {
        title: t('how_it_works.steps.1.title'),
        description: t('how_it_works.steps.1.description'),
        icon: t('how_it_works.steps.1.icon')
      },
      {
        title: t('how_it_works.steps.2.title'),
        description: t('how_it_works.steps.2.description'),
        icon: t('how_it_works.steps.2.icon')
      },
      {
        title: t('how_it_works.steps.3.title'),
        description: t('how_it_works.steps.3.description'),
        icon: t('how_it_works.steps.3.icon')
      }
    ]
  };

  const feature1Data = {
    name: t('feature1.name'),
    label: t('feature1.label'),
    title: t('feature1.title'),
    description: t('feature1.description'),
    items: [
      {
        title: t('feature1.items.0.title'),
        description: t('feature1.items.0.description'),
        icon: t('feature1.items.0.icon')
      },
      {
        title: t('feature1.items.1.title'),
        description: t('feature1.items.1.description'),
        icon: t('feature1.items.1.icon')
      },
      {
        title: t('feature1.items.2.title'),
        description: t('feature1.items.2.description'),
        icon: t('feature1.items.2.icon')
      },
      {
        title: t('feature1.items.3.title'),
        description: t('feature1.items.3.description'),
        icon: t('feature1.items.3.icon')
      }
    ],
    image: {
      src: "/imgs/features/1.png",
      alt: t('feature1.image.alt')
    },
    disabled: false
  };

  const feature2Data = {
    name: t('feature2.name'),
    label: t('feature2.label'),
    title: t('feature2.title'),
    description: t('feature2.description'),
    items: [
      {
        title: t('feature2.items.0.title'),
        description: t('feature2.items.0.description'),
        icon: t('feature2.items.0.icon'),
        image: {
          src: "/imgs/features/2.png",
          alt: t('feature2.items.0.image.alt')
        }
      },
      {
        title: t('feature2.items.1.title'),
        description: t('feature2.items.1.description'),
        icon: t('feature2.items.1.icon'),
        image: {
          src: "/imgs/features/3.png",
          alt: t('feature2.items.1.image.alt')
        }
      },
      {
        title: t('feature2.items.2.title'),
        description: t('feature2.items.2.description'),
        icon: t('feature2.items.2.icon'),
        image: {
          src: "/imgs/features/4.png",
          alt: t('feature2.items.2.image.alt')
        }
      }
    ],
    disabled: false
  };

  const feature3Data = {
    name: t('feature3.name'),
    label: t('feature3.label'),
    title: t('feature3.title'),
    description: t('feature3.description'),
    items: [
      {
        title: t('feature3.items.0.title'),
        description: t('feature3.items.0.description')
      },
      {
        title: t('feature3.items.1.title'),
        description: t('feature3.items.1.description')
      },
      {
        title: t('feature3.items.2.title'),
        description: t('feature3.items.2.description')
      },
      {
        title: t('feature3.items.3.title'),
        description: t('feature3.items.3.description')
      }
    ],
    disabled: false
  };

  const feature4Data = {
    name: t('feature4.name'),
    title: t('feature4.title'),
    description: t('feature4.description'),
    items: [
      {
        title: t('feature4.items.0.title'),
        description: t('feature4.items.0.description'),
        icon: t('feature4.items.0.icon')
      },
      {
        title: t('feature4.items.1.title'),
        description: t('feature4.items.1.description'),
        icon: t('feature4.items.1.icon')
      },
      {
        title: t('feature4.items.2.title'),
        description: t('feature4.items.2.description'),
        icon: t('feature4.items.2.icon')
      },
      {
        title: t('feature4.items.3.title'),
        description: t('feature4.items.3.description'),
        icon: t('feature4.items.3.icon')
      },
      {
        title: t('feature4.items.4.title'),
        description: t('feature4.items.4.description'),
        icon: t('feature4.items.4.icon')
      },
      {
        title: t('feature4.items.5.title'),
        description: t('feature4.items.5.description'),
        icon: t('feature4.items.5.icon')
      }
    ],
    disabled: false
  };

  const faqData = {
    name: t('faq.name'),
    label: t('faq.label'),
    title: t('faq.title'),
    description: t('faq.description'),
    items: [
      {
        title: t('faq.items.0.title'),
        description: t('faq.items.0.description')
      },
      {
        title: t('faq.items.1.title'),
        description: t('faq.items.1.description')
      },
      {
        title: t('faq.items.2.title'),
        description: t('faq.items.2.description')
      },
      {
        title: t('faq.items.3.title'),
        description: t('faq.items.3.description')
      },
      {
        title: t('faq.items.4.title'),
        description: t('faq.items.4.description')
      },
      {
        title: t('faq.items.5.title'),
        description: t('faq.items.5.description')
      }
    ],
    disabled: false
  };

  const ctaData = {
    title: t('cta.title'),
    description: t('cta.description'),
    primary: t('cta.primary')
  };

  return (
    <div className="min-h-screen">
      {/* Username Checker Tool Section */}
      <section id="tool" className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <UsernameChecker />
      </section>
      
      {/* How It Works Section */}
      <HowItWorks section={howItWorksData} />
      
      {/* Feature1 Section */}
      <Feature1 section={feature1Data} />
      
      {/* Feature2 Section */}
      <Feature2 section={feature2Data} />
      
      {/* Feature3 Section */}
      <Feature3 section={feature3Data} />
      
      {/* Feature4 Section */}
      <Feature4 section={feature4Data} />
      
      {/* FAQ Section */}
      <FAQ section={faqData} />
      
      {/* CTA Section */}
      <CTA section={ctaData} />
    </div>
  );
}