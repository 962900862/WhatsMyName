"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Header as HeaderType } from "@/types/blocks/header";
import Icon from "@/components/other/icon";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import ThemeToggle from "@/components/other/theme/toggle";
import LanguageToggle from "@/components/admin/navigation/language/toggle";
import { cn } from "@/lib/utils";

export default function Header({ header }: { header: HeaderType }) {
  if (header.disabled) {
    return null;
  }

  return (
    <section className="py-3">
      <div className="md:max-w-7xl mx-auto px-4">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <a
              href={header.brand?.url || ""}
              className="flex items-center gap-2"
            >
              {header.brand?.logo?.src && (
                <Image
                  src={header.brand.logo.src}
                  alt={header.brand.logo.alt || header.brand.title || "Logo"}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                  priority
                />
              )}
              {header.brand?.title && (
                <span className="text-xl text-primary font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {header.brand?.title || ""}
                </span>
              )}
            </a>
            <div className="flex items-center">
              <NavigationMenu delayDuration={1000000}>
                <NavigationMenuList>
                  {header.nav?.items?.map((item, i) => {
                    if (item.children && item.children.length > 0) {
                      return (
                        <NavigationMenuItem
                          key={i}
                          className="text-muted-foreground"
                        >
                          <NavigationMenuTrigger>
                            {item.icon && (
                              <Icon
                                name={item.icon}
                                className="size-4 shrink-0 mr-2"
                              />
                            )}
                            <span>{item.title}</span>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="w-80 p-3">
                              <NavigationMenuLink>
                                {item.children.map((iitem, ii) => (
                                  <li key={ii}>
                                    <a
                                      className={cn(
                                        "flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                      )}
                                      href={iitem.url}
                                      target={iitem.target}
                                    >
                                      {iitem.icon && (
                                        <Icon
                                          name={iitem.icon}
                                          className="size-5 shrink-0"
                                        />
                                      )}
                                      <div>
                                        <div className="text-sm font-semibold">
                                          {iitem.title}
                                        </div>
                                        <p className="text-sm leading-snug text-muted-foreground">
                                          {iitem.description}
                                        </p>
                                      </div>
                                    </a>
                                  </li>
                                ))}
                              </NavigationMenuLink>
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    }

                    return (
                      <NavigationMenuItem key={i}>
                        <a
                          className={cn(
                            "text-muted-foreground",
                            navigationMenuTriggerStyle,
                            buttonVariants({
                              variant: "ghost",
                            })
                          )}
                          href={item.url}
                          target={item.target}
                        >
                          {item.icon && (
                            <Icon
                              name={item.icon}
                              className="size-4 shrink-0 mr-0"
                            />
                          )}
                          {item.title}
                        </a>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="shrink-0 flex gap-2 items-center">
            {header.show_locale && <LanguageToggle />}
            {header.show_theme && <ThemeToggle />}

            {header.buttons?.map((item, i) => {
              return (
                <Button key={i} variant={item.variant}>
                  <Link
                    href={item.url || ""}
                    target={item.target || ""}
                    className="flex items-center gap-1"
                  >
                    {item.title}
                    {item.icon && (
                      <Icon name={item.icon} className="size-4 shrink-0" />
                    )}
                  </Link>
                </Button>
              );
            })}
          </div>
        </nav>

        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {header.brand?.logo?.src && (
                <Image
                  src={header.brand.logo.src}
                  alt={header.brand.logo.alt || header.brand.title || "Logo"}
                  width={32}
                  height={32}
                  className="w-8 h-8"
                  priority
                />
              )}
              {header.brand?.title && (
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {header.brand?.title || ""}
                </span>
              )}
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default" size="icon">
                  <Menu className="size-2" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      {header.brand?.logo?.src && (
                        <img
                          src={header.brand.logo.src}
                          alt={header.brand.logo.alt || header.brand.title}
                          className="w-8"
                        />
                      )}
                      {header.brand?.title && (
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                          {header.brand?.title || ""}
                        </span>
                      )}
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 pb-5 flex flex-col gap-6">
                  <Accordion type="single" collapsible>
                    {header.nav?.items?.map((item, i) => {
                      if (item.children && item.children.length > 0) {
                        return (
                          <AccordionItem value={`item-${i}`} key={i}>
                            <AccordionTrigger className="flex items-center">
                              {item.icon && (
                                <Icon
                                  name={item.icon}
                                  className="size-5 shrink-0 mr-2"
                                />
                              )}
                              <span>{item.title}</span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="flex flex-col">
                                {item.children.map((iitem, ii) => (
                                  <a
                                    key={ii}
                                    className="flex items-start gap-4 py-3 border-b border-border"
                                    href={iitem.url}
                                    target={iitem.target}
                                  >
                                    {iitem.icon && (
                                      <Icon
                                        name={iitem.icon}
                                        className="size-5 shrink-0"
                                      />
                                    )}
                                    <div>
                                      <div className="text-sm font-semibold">
                                        {iitem.title}
                                      </div>
                                      <p className="text-sm leading-snug text-muted-foreground">
                                        {iitem.description}
                                      </p>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      }

                      return (
                        <a
                          key={i}
                          href={item.url}
                          target={item.target}
                          className="flex items-center text-lg py-3 font-semibold"
                        >
                          {item.icon && (
                            <Icon name={item.icon} className="size-5 shrink-0" />
                          )}
                          <span>{item.title}</span>
                        </a>
                      );
                    })}
                  </Accordion>
                  <div className="flex flex-col gap-3">
                    {header.buttons?.map((item, i) => {
                      return (
                        <Button key={i} variant={item.variant}>
                          <Link
                            href={item.url || ""}
                            target={item.target || ""}
                            className="flex items-center gap-1"
                          >
                            {item.title}
                            {item.icon && (
                              <Icon
                                name={item.icon}
                                className="size-4 shrink-0"
                              />
                            )}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center pt-5">
                    {header.show_locale && <LanguageToggle />}
                    {header.show_theme && <ThemeToggle />}

                  </div>
                </div>
                <div className="absolute w-full bottom-0 left-0 p-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    {header.show_locale && <LanguageToggle />}
                    {header.show_theme && <ThemeToggle />}

                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}
