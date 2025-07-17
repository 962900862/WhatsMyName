export interface PageContext {
  toolId: string;
  category: string;
  featured: boolean | undefined;
  locale: string;
  pageData: any;
}

export interface PageSection {
  type: string;
  enabled: boolean;
  props?: any;
}

export interface ToolTemplate {
  sections?: string[];
}

/**
 * 构建页面区块配置
 * @param template 工具模板名称或配置对象
 * @param context 页面上下文
 * @param customSections 自定义区块配置
 * @returns 页面区块配置数组
 */
export function buildPageSections(
  template: string | ToolTemplate | undefined,
  context: PageContext,
  customSections?: string[]
): PageSection[] {
  const defaultSections = [
    'hero',
    'feature1', 
    'feature2',
    'feature3',
    'feature',
    'faq'
  ];
  
  // 如果template是字符串，则使用默认区块配置
  let templateSections: string[] | undefined;
  if (typeof template === 'object' && template?.sections) {
    templateSections = template.sections;
  }
  
  // 使用自定义区块配置，如果没有则使用模板配置，最后使用默认配置
  const sectionsToEnable = customSections || templateSections || defaultSections;
  
  return sectionsToEnable.map(sectionType => ({
    type: sectionType,
    enabled: true,
    props: {}
  }));
}