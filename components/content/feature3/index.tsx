import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

import { Badge } from "@/components/ui/badge";
import { Section as SectionType } from "@/types/blocks/section";

export default function Feature3({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="lg:container px-8">
        <div className="mb-16 max-w-xl px-8 lg:px-0">
          {section.label && (
            <Badge variant="outline" className="mb-4">
              {section.label}
            </Badge>
          )}
          <h2 className="mb-6 text-pretty text-3xl font-bold lg:text-4xl">
            {section.title}
          </h2>
          <p className="mb-4 max-w-xl text-muted-foreground lg:max-w-none lg:text-lg">
            {section.description}
          </p>
        </div>
        <div>
          <Tabs defaultValue="tab-1">
            <TabsList className="relative grid items-start gap-6 lg:grid-cols-4">
              <div className="absolute left-4 right-0 top-[30px] -z-10 hidden h-px bg-input lg:block"></div>
              {section.items?.map((item, index) => {
                return (
                  <TabsTrigger
                    key={index}
                    value={`tab-${index + 1}`}
                    className="group pointer-events-none lg:pointer-events-auto"
                  >
                    <div className="flex gap-4 rounded-md px-8 py-4 text-left hover:bg-muted/50 lg:block lg:px-4">
                      <div className="flex flex-col items-center lg:contents">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full border bg-background font-mono text-xs font-medium lg:group-data-[state=active]:bg-primary lg:group-data-[state=active]:text-primary-foreground lg:group-data-[state=active]:ring lg:group-data-[state=active]:ring-primary/40">
                          {index + 1}
                        </span>
                        <span className="h-full w-px bg-input lg:hidden"></span>
                      </div>
                      <div>
                        <h3 className="mb-1 font-medium lg:mt-4">
                          {item.title}
                        </h3>
                        <div
                          className="text-sm"
                          dangerouslySetInnerHTML={{ __html: item.description || '' }}
                        />
                      </div>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
