// Structured Data (Schema.org JSON-LD) generation system for Big Beautiful Bill Calculator
// 为Big Beautiful Bill Calculator项目生成各种页面类型的结构化数据

export interface StructuredDataConfig {
  baseUrl: string;
  locale: string;
  siteName: string;
  organizationName: string;
  supportEmail: string;
}

// 基础配置
const defaultConfig: StructuredDataConfig = {
  baseUrl: 'https://bigbeautifulbillcalculator.org',
  locale: 'en',
  siteName: 'Big Beautiful Bill Calculator',
  organizationName: 'Big Beautiful Bill Calculator',
  supportEmail: 'support@bigbeautifulbillcalculator.org'
};

// 生成组织信息
export function generateOrganizationSchema(config: Partial<StructuredDataConfig> = {}) {
  const cfg = { ...defaultConfig, ...config };
  
  return {
    "@type": "Organization",
    "name": cfg.organizationName,
    "url": cfg.baseUrl,
    "logo": `${cfg.baseUrl}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "",
      "contactType": "customer service",
      "email": cfg.supportEmail,
      "availableLanguage": ["English"]
    },
    "sameAs": [
      "https://x.com/bigbeautifulbillcalculator",
      "https://github.com/bigbeautifulbillcalculator"
    ]
  };
}

// 生成网站信息
export function generateWebSiteSchema(config: Partial<StructuredDataConfig> = {}) {
  const cfg = { ...defaultConfig, ...config };
  
  return {
    "@type": "WebSite",
    "name": cfg.siteName,
    "url": cfg.baseUrl,
    "description": "The most beautiful and intuitive bill splitting calculator for groups, families, and friends",
    "inLanguage": cfg.locale,
    "publisher": generateOrganizationSchema(config),
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${cfg.baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

// 生成面包屑导航
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>,
  config: Partial<StructuredDataConfig> = {}
) {
  const cfg = { ...defaultConfig, ...config };
  
  return {
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url.startsWith('http') ? crumb.url : `${cfg.baseUrl}${crumb.url}`
    }))
  };
}

// 生成软件应用信息
export function generateSoftwareApplicationSchema(
  appData: {
    name: string;
    description: string;
    category: string[];
    url: string;
    imageUrl?: string;
    rating?: { value: number; count: number };
    features?: string[];
  },
  config: Partial<StructuredDataConfig> = {}
) {
  const cfg = { ...defaultConfig, ...config };
  
  const schema: any = {
    "@type": "SoftwareApplication",
    "name": appData.name,
    "description": appData.description,
    "url": appData.url,
    "applicationCategory": appData.category,
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/OnlineOnly",
      "category": "free"
    },
    "publisher": generateOrganizationSchema(config),
    "inLanguage": cfg.locale
  };

  if (appData.imageUrl) {
    schema.image = appData.imageUrl.startsWith('http') 
      ? appData.imageUrl 
      : `${cfg.baseUrl}${appData.imageUrl}`;
  }

  if (appData.rating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": appData.rating.value.toString(),
      "ratingCount": appData.rating.count.toString(),
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  if (appData.features && appData.features.length > 0) {
    schema.featureList = appData.features;
  }

  return schema;
}

// 生成FAQ页面结构化数据
export function generateFAQPageSchema(
  faqItems: Array<{ question: string; answer: string }>,
  config: Partial<StructuredDataConfig> = {}
) {
  return {
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

// 生成HowTo结构化数据
export function generateHowToSchema(
  howToData: {
    name: string;
    description: string;
    image?: string;
    steps: Array<{ name: string; text: string; image?: string }>;
    totalTime?: string;
    estimatedCost?: string;
  },
  config: Partial<StructuredDataConfig> = {}
) {
  const cfg = { ...defaultConfig, ...config };
  
  const schema: any = {
    "@type": "HowTo",
    "name": howToData.name,
    "description": howToData.description,
    "supply": [],
    "tool": [],
    "step": howToData.steps.map((step, index) => {
      const stepSchema: any = {
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.name,
        "text": step.text
      };
      
      if (step.image) {
        stepSchema.image = step.image.startsWith('http') 
          ? step.image 
          : `${cfg.baseUrl}${step.image}`;
      }
      
      return stepSchema;
    })
  };

  if (howToData.image) {
    schema.image = howToData.image.startsWith('http') 
      ? howToData.image 
      : `${cfg.baseUrl}${howToData.image}`;
  }

  if (howToData.totalTime) {
    schema.totalTime = howToData.totalTime;
  }

  if (howToData.estimatedCost) {
    schema.estimatedCost = {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": howToData.estimatedCost
    };
  }

  return schema;
}

// 生成WebPage结构化数据
export function generateWebPageSchema(
  pageData: {
    name: string;
    description: string;
    url: string;
    breadcrumbs?: Array<{ name: string; url: string }>;
    lastModified?: string;
  },
  config: Partial<StructuredDataConfig> = {}
) {
  const cfg = { ...defaultConfig, ...config };
  
  const schema: any = {
    "@type": "WebPage",
    "name": pageData.name,
    "description": pageData.description,
    "url": pageData.url,
    "inLanguage": cfg.locale,
    "isPartOf": generateWebSiteSchema(config)
  };

  if (pageData.lastModified) {
    schema.dateModified = pageData.lastModified;
  }

  if (pageData.breadcrumbs && pageData.breadcrumbs.length > 0) {
    schema.breadcrumb = generateBreadcrumbSchema(pageData.breadcrumbs, config);
  }

  return schema;
}

// 生成ItemList结构化数据（用于工具列表页面）
export function generateItemListSchema(
  listData: {
    name: string;
    description: string;
    url: string;
    items: Array<{
      name: string;
      description: string;
      url: string;
      image?: string;
    }>;
  },
  config: Partial<StructuredDataConfig> = {}
) {
  const cfg = { ...defaultConfig, ...config };
  
  return {
    "@type": "ItemList",
    "name": listData.name,
    "description": listData.description,
    "url": listData.url,
    "numberOfItems": listData.items.length,
    "itemListElement": listData.items.map((item, index) => {
      const listItem: any = {
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "description": item.description,
        "url": item.url.startsWith('http') ? item.url : `${cfg.baseUrl}${item.url}`
      };
      
      if (item.image) {
        listItem.image = item.image.startsWith('http') 
          ? item.image 
          : `${cfg.baseUrl}${item.image}`;
      }
      
      return listItem;
    })
  };
}


// 生成完整的结构化数据文档
export function generateStructuredDataDocument(
  schemas: any[],
  config: Partial<StructuredDataConfig> = {}
) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas
  };
}

// 为动态工具页面生成结构化数据
export function generateDynamicToolStructuredData(
  toolConfig: {
    id: string;
    name: string;
    description: string;
    category: string;
    seo: {
      title: string;
      description: string;
      keywords: string[];
      imageUrl?: string;
    };
  },
  pageData: any,
  locale: string = 'en',
  baseUrl: string = 'https://bigbeautifulbillcalculator.org'
) {
  const config: StructuredDataConfig = {
    baseUrl,
    locale,
    siteName: 'Songless',
    organizationName: 'Songless',
    supportEmail: 'support@bigbeautifulbillcalculator.org'
  };

  const schemas = [];
  
  // 获取工具URL
  const toolUrl = locale === 'en' 
    ? `${baseUrl}/${toolConfig.id}`
    : `${baseUrl}/${locale}/${toolConfig.id}`;

  // 添加软件应用Schema
  schemas.push(generateSoftwareApplicationSchema({
    name: toolConfig.name,
    description: toolConfig.seo.description,
    category: ['WebApplication', 'Game', 'MusicApplication'],
    url: `${toolUrl}#tool`,
    imageUrl: toolConfig.seo.imageUrl,
    rating: { value: 4.8, count: 892 },
    features: [
      'Free music guessing game',
      'Unlimited song previews',
      'Multiple game modes',
      'Social features',
      'Progress tracking'
    ]
  }, config));

  // 添加网站Schema
  schemas.push(generateWebSiteSchema(config));

  // 添加面包屑Schema
  const breadcrumbs = [
    { name: 'Home', url: locale === 'en' ? '/' : `/${locale}` },
    { name: 'Games', url: locale === 'en' ? '/apps' : `/${locale}/apps` },
    { name: toolConfig.name, url: toolUrl }
  ];
  schemas.push(generateBreadcrumbSchema(breadcrumbs, config));

  // 如果有FAQ数据，添加FAQ Schema
  if (pageData?.faq && pageData.faq.items) {
    const faqItems = pageData.faq.items.map((item: any) => ({
      question: item.title || item.question,
      answer: item.description || item.answer
    }));
    schemas.push(generateFAQPageSchema(faqItems, config));
  }

  // 如果有使用说明，添加HowTo Schema
  if (pageData?.usage && pageData.usage.items) {
    schemas.push(generateHowToSchema({
      name: `How to Use ${toolConfig.name}`,
      description: pageData.usage.description || `Learn how to use ${toolConfig.name} effectively`,
      steps: pageData.usage.items.map((step: any, index: number) => ({
        name: step.title,
        text: step.description,
        image: step.image?.src
      })),
      totalTime: 'PT5M'
    }, config));
  }

  return generateStructuredDataDocument(schemas, config);
}

// 为法律页面生成结构化数据
export function generateLegalPageStructuredData(
  pageType: 'privacy' | 'terms' | 'cookie',
  locale: string = 'en',
  baseUrl: string = 'https://bigbeautifulbillcalculator.org'
) {
  const config: StructuredDataConfig = {
    baseUrl,
    locale,
    siteName: 'Songless',
    organizationName: 'Songless',
    supportEmail: 'support@bigbeautifulbillcalculator.org'
  };

  const schemas = [];
  
  const pageUrls = {
    privacy: locale === 'en' ? `${baseUrl}/privacy-policy` : `${baseUrl}/${locale}/privacy-policy`,
    terms: locale === 'en' ? `${baseUrl}/terms-of-service` : `${baseUrl}/${locale}/terms-of-service`,
    cookie: locale === 'en' ? `${baseUrl}/cookie-policy` : `${baseUrl}/${locale}/cookie-policy`
  };

  const pageNames = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    cookie: 'Cookie Policy'
  };

  const pageDescriptions = {
    privacy: 'Our privacy policy outlines how we collect, use, and protect your information when using Songless music games.',
    terms: 'Terms and conditions for using Songless music games, including usage guidelines and intellectual property information.',
    cookie: 'Learn about how Songless uses cookies to enhance your music gaming experience.'
  };

  // 添加WebPage Schema
  schemas.push(generateWebPageSchema({
    name: pageNames[pageType],
    description: pageDescriptions[pageType],
    url: pageUrls[pageType],
    breadcrumbs: [
      { name: 'Home', url: locale === 'en' ? '/' : `/${locale}` },
      { name: pageNames[pageType], url: pageUrls[pageType] }
    ],
    lastModified: new Date().toISOString()
  }, config));

  // 添加网站Schema
  schemas.push(generateWebSiteSchema(config));

  // 添加组织Schema
  schemas.push(generateOrganizationSchema(config));

  return generateStructuredDataDocument(schemas, config);
}

// 为Apps页面生成结构化数据
export function generateAppsPageStructuredData(
  apps: Array<{
    id: string;
    name: string;
    description: string;
    url: string;
    image?: string;
  }>,
  locale: string = 'en',
  baseUrl: string = 'https://bigbeautifulbillcalculator.org'
) {
  const config: StructuredDataConfig = {
    baseUrl,
    locale,
    siteName: 'Songless',
    organizationName: 'Songless',
    supportEmail: 'support@bigbeautifulbillcalculator.org'
  };

  const schemas = [];
  
  const appsUrl = locale === 'en' ? `${baseUrl}/apps` : `${baseUrl}/${locale}/apps`;

  // 添加ItemList Schema
  schemas.push(generateItemListSchema({
    name: 'Music Games Collection',
    description: 'Discover our collection of interactive music games and experiences',
    url: appsUrl,
    items: apps.map(app => ({
      name: app.name,
      description: app.description,
      url: app.url,
      image: app.image
    }))
  }, config));

  // 添加WebPage Schema
  schemas.push(generateWebPageSchema({
    name: 'Music Games Collection',
    description: 'Discover our collection of interactive music games and experiences',
    url: appsUrl,
    breadcrumbs: [
      { name: 'Home', url: locale === 'en' ? '/' : `/${locale}` },
      { name: 'Music Games', url: appsUrl }
    ]
  }, config));

  // 添加网站Schema
  schemas.push(generateWebSiteSchema(config));

  return generateStructuredDataDocument(schemas, config);
}