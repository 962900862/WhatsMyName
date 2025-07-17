'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hero as HeroType } from "@/types/blocks/hero";
import Icon from "@/components/other/icon";
import Link from "next/link";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LeaderboardModal } from '@/components/common/LeaderboardModal';

export default function Hero({ hero, useH1 = false }: { hero: HeroType; useH1?: boolean }) {
  const [isMobile, setIsMobile] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  useEffect(() => {
    // Check if window width is less than 1024px (typical lg breakpoint)
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Check on initial mount
    checkIsMobile();

    // Listen for window resize events
    window.addEventListener('resize', checkIsMobile);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []); // Empty dependency array ensures effect runs only on mount and unmount

  if (hero.disabled) {
    return null;
  }

  const highlightText = hero.highlight_text;
  let texts = null;
  if (highlightText) {
    texts = hero.title?.split(highlightText, 2);
  }

  // Determine Title tag based on useH1 prop
  const TitleTag = useH1 ? 'h1' : 'h2';

  return (
    <>
      {/* Conditionally render HeroBg only on non-mobile */}
      {!isMobile}
      <section className="py-8">
        <div className="container">
          <div className="text-center">
            {hero.announcement && (
              <a
                href={hero.announcement.url}
                className="mx-auto mb-3 inline-flex items-center gap-3 rounded-full border px-2 py-1 text-sm"
              >
                {hero.announcement.label && (
                  <Badge>{hero.announcement.label}</Badge>
                )}
                {hero.announcement.title}
              </a>
            )}

            {texts && texts.length > 1 ? (
              <TitleTag className="mx-auto mb-3 mt-4 whitespace-nowrap text-4xl font-bold lg:mb-4 lg:text-7xl text-black dark:text-white">
                {texts[0]}
                <span className="text-primary">
                  {highlightText}
                </span>
                {texts[1]}
              </TitleTag>
            ) : (
              // Fallback 渲染：当 highlight_text 缺失时，使用简洁渐变标题，避免多重阴影导致的视觉问题
              <TitleTag className="mx-auto mb-5 mt-6 whitespace-nowrap text-4xl font-extrabold lg:mb-4 lg:text-7xl text-black dark:text-white">
                {hero.title}
              </TitleTag>
            )}

            {/* Description */}
            {/*
            <div
              className="mx-auto max-w-3xl text-muted-foreground lg:text-xl" // Removed potentially problematic 'm' class
              dangerouslySetInnerHTML={{ __html: hero.description || "" }}
            />
            */}

            {/* Buttons */}
            {hero.buttons && (
              <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
                {hero.buttons.map((item, i) => {
                  // Handle leaderboard button specially 
                  if (item.url === '#leaderboard' || item.title === 'View Leaderboard') {
                    return (
                      <Button
                        key={i}
                        
                        size="lg"
                        variant={item.variant || "default"}
                        onClick={() => setLeaderboardOpen(true)}
                      >
                        {item.title}
                        {item.icon && (
                          <Icon name={item.icon} className="ml-1" />
                        )}
                      </Button>
                    );
                  }
                  
                  // Regular buttons with links
                  return (
                    <Link
                      key={i}
                      href={item.url || ""}
                      target={item.target || ""}
                      className="flex items-center"
                    >
                      <Button
                        
                        size="lg"
                        variant={item.variant || "default"}
                      >
                        {item.title}
                        {item.icon && (
                          <Icon name={item.icon} className="ml-1" />
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Tip */}
            {hero.tip && (
              <div className="mt-8 text-md text-muted-foreground">{hero.tip}</div>
            )}

          </div>
        </div>
      </section>
      
      {/* Leaderboard Modal */}
      <LeaderboardModal 
        open={leaderboardOpen} 
        onOpenChange={setLeaderboardOpen} 
      />
    </>
  );
}
