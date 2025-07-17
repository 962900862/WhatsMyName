import "@/app/globals.css";

import { MdOutlineHome } from "react-icons/md";
import { Metadata } from "next";
import React from "react";
import { getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { AppContextProvider } from "@/contexts/app";
import { NextAuthSessionProvider } from "@/auth/session";
import { ThemeProvider } from "@/providers/theme";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import Script from "next/script";
import Link from "next/link";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
});

// Simplified metadata for legal pages
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  
  return {
    title: {
      absolute: "Legal Information - Big Beautiful Bill Calculator",
    },
    description: "Legal information, privacy policy and terms of service for Big Beautiful Bill Calculator.",
    keywords: "legal, privacy policy, terms of service, bill calculator",
  };
}

export default async function LegalLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;
  const messages = await getMessages();
  const t = await getTranslations({ locale });

  // Create basic page structure for legal pages
  const pageData = {
    header: {
      brand: {
        title: "Bill Calculator",
        logo: {
          src: "/logo.png",
          alt: "Big Beautiful Bill Calculator"
        },
        url: "/"
      },
      nav: {
        items: []
      },
      show_sign: false,
      show_locale: false,
    show_theme: false,
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
            title: "Support",
            url: "mailto:support@bigbeautifulbillcalculator.org"
          }
        ]
      }
    }
  };

  return (
    <>
      {/* Page header */}
      {pageData.header && <Header header={pageData.header} />}
      
      {/* Page content */}
      <main className="mx-auto max-w-4xl my-8">
        <div className="flex items-center mb-8 px-8">
          <Link
            className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
            href="/"
          >
            <MdOutlineHome className="text-xl" />
            <span>Back to Home</span>
          </Link>
        </div>
        <div className="text-md max-w-3xl mx-auto leading-loose pt-4 pb-8 px-8 prose dark:prose-invert">
          {children}
        </div>
      </main>
      
      {/* Page footer */}
      {pageData.footer && <Footer footer={pageData.footer} />}
    </>
  );
}