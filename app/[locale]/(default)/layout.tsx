import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { ReactNode } from "react";
import { getTranslations } from 'next-intl/server';

export default async function DefaultLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'landing' });

  // Create basic page structure for Big Beautiful Bill Calculator
  const pageData = {
    header: {
      brand: {
        title: t('header.brand.title'),
        logo: {
          src: "/logo.png",
          alt: "Big Beautiful Bill Calculator"
        },
        url: "/"
      },
      nav: {
        items: [
          {
            title: t('header.nav.items.0.title'),
            url: t('header.nav.items.0.url')
          },
          {
            title: t('header.nav.items.1.title'),
            url: t('header.nav.items.1.url')
          }
        ]
      },
      show_locale: false,
      show_theme: false
    },
    footer: {
      brand: {
        title: "Big Beautiful Bill Calculator",
        description: "The most beautiful and intuitive bill splitting calculator for groups, families, and friends.",
        logo: {
          src: "/logo.png",
          alt: "Big Beautiful Bill Calculator"
        }
      },
      copyright: "© 2025 Big Beautiful Bill Calculator. All rights reserved.",
      nav: {
        items: []
      },
      agreement: {
        items: [
          {
            title: "Privacy Policy",
            url: "/privacy-policy"
          },
          {
            title: "Terms of Service",
            url: "/terms-of-service"
          },
          {
            title: "Cookie Policy",
            url: "/cookie-policy"
          },
          {
            title: "Support",
            url: "mailto:support@bigbeautifulbillcalculator.org"
          }
        ]
      }
    }
  };

  return (
    <>
      {pageData.header && <Header header={pageData.header} />}
      <main className="overflow-x-hidden">{children}</main>
      {pageData.footer && <Footer footer={pageData.footer} />}
    </>
  );
}