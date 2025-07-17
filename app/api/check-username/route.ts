export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const siteName = searchParams.get('site');

  if (!url || !siteName) {
    return NextResponse.json({ error: 'URL and site name are required' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    const text = await response.text();
    const statusCode = response.status;

    // Load the site data to get the detection rules
    const siteDataResponse = await fetch(`${request.nextUrl.origin}/wmn-data.json`, {
      headers: {
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
    
    if (!siteDataResponse.ok) {
      throw new Error('Failed to load site data');
    }
    
    const siteData = await siteDataResponse.json();
    const site = siteData.sites.find((s: any) => s.name === siteName);

    if (!site) {
      return NextResponse.json({ error: 'Site not found in database' }, { status: 404 });
    }

    // Check if the username exists based on the site's detection rules
    let exists = false;

    // Enhanced detection logic
    if (statusCode === site.e_code) {
      // If we got the expected "exists" status code, check the content
      if (site.e_string) {
        // Support multiple detection strings
        const detectionStrings = Array.isArray(site.e_string) ? site.e_string : [site.e_string];
        exists = detectionStrings.some((str: string) => text.includes(str));
      } else {
        // If no content check is required, just the status code is enough
        exists = true;
      }
    } else if (statusCode === site.m_code) {
      // If we got the expected "missing" status code, check the content
      if (site.m_string) {
        const missingStrings = Array.isArray(site.m_string) ? site.m_string : [site.m_string];
        exists = !missingStrings.some((str: string) => text.includes(str));
      } else {
        // If no content check is required, just the status code is enough
        exists = false;
      }
    } else {
      // For unexpected status codes, try to determine based on content
      if (site.e_string) {
        const detectionStrings = Array.isArray(site.e_string) ? site.e_string : [site.e_string];
        exists = detectionStrings.some((str: string) => text.includes(str));
      } else if (site.m_string) {
        const missingStrings = Array.isArray(site.m_string) ? site.m_string : [site.m_string];
        exists = !missingStrings.some((str: string) => text.includes(str));
      } else {
        // Handle common HTTP status codes
        switch (statusCode) {
          case 200:
          case 201:
          case 202:
            exists = true;
            break;
          case 404:
          case 403:
          case 410:
            exists = false;
            break;
          default:
            // For other status codes, assume it doesn't exist
            exists = false;
        }
      }
    }

    // Additional heuristics for better detection
    if (!exists && statusCode === 200) {
      // Check for common "not found" patterns in the content
      const notFoundPatterns = [
        'user not found',
        'profile not found',
        'account not found',
        'page not found',
        'does not exist',
        'not available',
        'suspended',
        'deactivated',
        'deleted',
        'removed'
      ];
      
      const lowerText = text.toLowerCase();
      const hasNotFoundPattern = notFoundPatterns.some(pattern => 
        lowerText.includes(pattern)
      );
      
      if (!hasNotFoundPattern) {
        // Check for positive indicators
        const positivePatterns = [
          'profile',
          'posts',
          'followers',
          'following',
          'about',
          'bio',
          'joined',
          'member since'
        ];
        
        const hasPositivePattern = positivePatterns.some(pattern => 
          lowerText.includes(pattern)
        );
        
        if (hasPositivePattern) {
          exists = true;
        }
      }
    }

    return NextResponse.json({
      exists,
      statusCode,
      site: siteName,
      url,
      contentLength: text.length,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Error checking username:', error);
    
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json({ error: 'Request timeout' }, { status: 408 });
      }
      
      if (error.message.includes('fetch')) {
        return NextResponse.json({ error: 'Network error' }, { status: 503 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to check username', 
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    }, { status: 500 });
  }
}