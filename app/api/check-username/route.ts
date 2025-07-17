import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const siteName = searchParams.get('site');

  if (!url || !siteName) {
    return NextResponse.json({ error: 'URL and site name are required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    });

    const text = await response.text();
    const statusCode = response.status;

    // Load the site data to get the detection rules
    const siteDataResponse = await fetch(`${request.nextUrl.origin}/wmn-data.json`);
    const siteData = await siteDataResponse.json();
    const site = siteData.sites.find((s: any) => s.name === siteName);

    if (!site) {
      return NextResponse.json({ error: 'Site not found in database' }, { status: 404 });
    }

    // Check if the username exists based on the site's detection rules
    let exists = false;

    // Check based on status code
    if (statusCode === site.e_code) {
      // If we got the expected "exists" status code, check the content
      if (site.e_string && text.includes(site.e_string)) {
        exists = true;
      } else if (!site.e_string) {
        // If no content check is required, just the status code is enough
        exists = true;
      }
    } else if (statusCode === site.m_code) {
      // If we got the expected "missing" status code, check the content
      if (site.m_string && text.includes(site.m_string)) {
        exists = false;
      } else if (!site.m_string) {
        // If no content check is required, just the status code is enough
        exists = false;
      }
    } else {
      // For unexpected status codes, try to determine based on content
      if (site.e_string && text.includes(site.e_string)) {
        exists = true;
      } else if (site.m_string && text.includes(site.m_string)) {
        exists = false;
      } else {
        // If we can't determine, assume it doesn't exist
        exists = false;
      }
    }

    return NextResponse.json({
      exists,
      statusCode,
      site: siteName,
      url,
    });

  } catch (error) {
    console.error('Error checking username:', error);
    
    // Handle timeout errors
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 408 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to check username', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}