import { ArrowRight } from "lucide-react";
import { Blog as BlogType } from "@/types/blocks/blog";

export default function Blog({ blog, useH1 = false }: { blog: BlogType; useH1?: boolean }) {
  if (blog.disabled) {
    return null;
  }

  // 标题组件 - 根据useH1参数决定使用h1还是h2标签
  const TitleTag = useH1 ? 'h1' : 'h2';

  return (
    <section className="w-full py-16">
      <div className="container flex flex-col items-center gap-8 lg:px-16">
        <div className="text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-wider">
            {blog.label}
          </p>
          <TitleTag className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            {blog.title}
          </TitleTag>
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            {blog.description}
          </p>
        </div>
        <div className="w-full flex flex-wrap items-start">
          {blog.items?.map((item, idx) => (
            <a
              key={idx}
              href={item.url || `/${item.locale}/posts/${item.slug}`}
              target={item.target || "_self"}
              className="w-full md:w-1/3 p-4"
            >
              <div className="flex flex-col overflow-clip rounded-xl border border-border">
                {item.cover_url && (
                  <div>
                    <img
                      src={item.cover_url}
                      alt={item.title || ""}
                      className="aspect-[16/9] h-full w-full object-cover object-center"
                    />
                  </div>
                )}
                <div className="px-4 py-4 md:px-4 md:py-4 lg:px-4 lg:py-4">
                  <h3 className="mb-3 text-lg font-semibold md:mb-4 md:text-xl lg:mb-6">
                    {item.title}
                  </h3>
                  <p className="mb-3 text-muted-foreground md:mb-4 lg:mb-6">
                    {item.description}
                  </p>
                  {blog.read_more_text && (
                    <p className="flex items-center hover:underline">
                      {blog.read_more_text}
                      <ArrowRight className="ml-2 size-4" />
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
