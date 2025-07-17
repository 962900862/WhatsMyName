import "@/app/globals.css";

import { getMessages, getTranslations } from "next-intl/server";

import { AppContextProvider } from "@/contexts/app";
import { Inter as FontSans } from "next/font/google";
import { Metadata } from "next";
import { NextAuthSessionProvider } from "@/auth/session";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/providers/theme";
import { cn } from "@/lib/utils";
import Script from 'next/script';
import { headers } from 'next/headers';
import ShareButtons from "@/components/common/share-buttons";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { defaultLocale } from "@/i18n/locale";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
  preload: true, // 预加载字体
});

// 站点基础URL
const BASE_URL = 'https://bigbeautifulbillcalculator.org';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'landing' });
  
  return {
    title: {
      absolute: "",
      default: t("metadata.defaultTitle"),
      template: "%s",
    },
    description: t("metadata.description") || "",
    keywords: t("metadata.keywords") || "",
    metadataBase: new URL(BASE_URL),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: t("metadata.title"),
      description: t("metadata.description"),
      url: BASE_URL,
      siteName: "Big Beautiful Bill Calculator",
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.title"),
      description: t("metadata.description"),
    },
  };
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  const t = await getTranslations({ locale });

  // 使用 headers API 获取当前请求的完整URL，然后解析出 pathname
  const headersList = headers();
  const fullUrl = headersList.get('x-url') || BASE_URL;
  const pathname = new URL(fullUrl).pathname;

  // 根据 next-intl 的 'as-needed' 策略，非默认语言的路径会包含语言代码前缀
  // 我们需要移除这个前缀，以便 LanguageMeta 组件能正确构建所有链接
  let pathWithoutLocale = pathname;
  const prefix = `/${locale}`;
  // 仅为非默认语言且路径确实以其语言代码开头的路径移除前缀
  if (locale !== defaultLocale && pathname.startsWith(prefix)) {
    pathWithoutLocale = pathname.substring(prefix.length) || '/';
  }

  // 计算主页 URL 和分享标题
  const homePageUrl = locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`;
  const shareTitle = t('metadata.title');

  // const currentPath = getCurrentPath(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4590211004253246"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overflow-x-hidden",
          fontSans.variable
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <NextAuthSessionProvider>
            <AppContextProvider>
              <ThemeProvider attribute="class" disableTransitionOnChange>
                <ShareButtons url={homePageUrl} title={shareTitle} />
                {children}
              </ThemeProvider>
            </AppContextProvider>
          </NextAuthSessionProvider>
        </NextIntlClientProvider>

        {/* Google Analytics */}
        <Script 
          strategy="afterInteractive" 
          src="https://www.googletagmanager.com/gtag/js?id=G-HSF5XL17VM"
        />
        <Script 
          id="gtag-init" 
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-HSF5XL17VM');
            `,
          }}
        />

        {/* Plausible Analytics */}
        <Script 
          defer
          data-domain="bigbeautifulbillcalculator.org"
          src="https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
          strategy="afterInteractive"
        />
        <Script 
          id="plausible-init" 
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`,
          }}
        />
      </body>
    </html>
  );
}
