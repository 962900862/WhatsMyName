// 调用文件: app/[locale]/(default)/[tools]/page.tsx 等工具页面
// 组件功能: Feature1 - 展示工具核心特点的图文卡片, 支持动态 Section 数据(title, description, items, buttons, image)

import Icon from "@/components/other/icon";
import { Section as SectionType } from "@/types/blocks/section";
import Image from "next/image";

export default function Feature1({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-16">
      <div className="container">
        <div className="relative">
          {/* 装饰性浮动圆形 */}
          <div className="rounded-full blur-3xl opacity-30 animate-float-slow absolute -top-10 left-1/4 w-20 h-20 bg-secondary/50"></div>
          <div className="rounded-full blur-3xl opacity-30 animate-float-slow absolute -bottom-10 right-1/4 w-24 h-24 bg-primary/30"></div>
          
          {/* 主内容区域 - 新的网格布局 */}
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            {/* 左侧图片区域 */}
            <div className="relative">
              <Image
                alt={section.image?.alt || "Feature showcase image"} 
                loading="lazy"
                width={600}
                height={600}
                className="max-h-full w-full rounded-md object-cover"
                src={section.image?.src || "/imgs/showcases/1.png"} 
              />
            </div>
            
            {/* 右侧内容区域 */}
            <div className="flex flex-col lg:text-left">
              {section.title && (
                <h2 className="mb-6 text-pretty text-3xl font-bold text-card-foreground lg:text-4xl">
                  {section.title}
                </h2>
              )}
              {section.description && (
                <p className="mb-8 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
                  {section.description}
                </p>
              )}
              
              {/* 特性列表 */}
              {section.items && section.items.length > 0 && (
                <ul className="flex flex-col justify-center gap-y-8">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex">
                      <div className="mr-2 size-6 shrink-0 lg:mr-2 lg:size-6 flex items-center justify-center">
                        <Icon
                          name={item.icon || "sparkles"}
                          className="h-6 w-6 text-primary"
                        />
                      </div>
                      <div>
                        <div className="mb-3 h-5 text-sm font-semibold text-accent-foreground md:text-base">
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="text-sm font-medium text-muted-foreground md:text-base">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* 按钮 */}
              {section.buttons && section.buttons.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-8">
                  {section.buttons.map((btn, idx) => (
                    <a
                      key={idx}
                      href={btn.url || "#"}
                      target={btn.target || ""}
                    >
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8">
                        {btn.icon && <Icon name={btn.icon} className="mr-2 h-4 w-4" />}
                        {btn.title}
                      </button>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
