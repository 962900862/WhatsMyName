export interface Feature {
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Recommendation {
  title: string;
  description: string;
  href: string;
}

export interface ContentSection {
  title: string;
  body: string;
}

export interface ToolPage {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  h1: string;
  introduction?: string;
  content?: ContentSection[];
  features: Feature[];
  faq: FAQ[];
  recommendations?: Recommendation[];
} 