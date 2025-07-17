const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function investigateWhatsMyName() {
  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 1000 // Slow down operations to better observe
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }
  
  const results = {
    timestamp: new Date().toISOString(),
    testUsername: 'testuser123',
    platforms: [],
    searchResults: [],
    categories: [],
    urlPatterns: [],
    totalPlatforms: 0,
    screenshots: []
  };
  
  try {
    console.log('🚀 Starting investigation of whatsmyname.me...');
    
    // Step 1: Visit the website
    console.log('📱 Navigating to whatsmyname.me...');
    await page.goto('https://whatsmyname.me/', { waitUntil: 'networkidle' });
    
    // Take initial screenshot
    const initialScreenshot = 'initial-page.png';
    await page.screenshot({ path: path.join(screenshotsDir, initialScreenshot) });
    results.screenshots.push(initialScreenshot);
    console.log('📸 Initial screenshot captured');
    
    // Wait for page to fully load
    await page.waitForTimeout(3000);
    
    // Step 2: Look for search input and search functionality
    console.log('🔍 Looking for search input...');
    
    // Try to find search input with various selectors
    const searchSelectors = [
      'input[type="text"]',
      'input[placeholder*="username"]',
      'input[placeholder*="search"]',
      'input[name*="username"]',
      'input[id*="username"]',
      'input[id*="search"]',
      '.search-input',
      '#search',
      '#username'
    ];
    
    let searchInput = null;
    for (const selector of searchSelectors) {
      try {
        searchInput = await page.$(selector);
        if (searchInput) {
          console.log(`✅ Found search input with selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!searchInput) {
      console.log('❌ No search input found, analyzing page structure...');
      
      // Get all input elements
      const allInputs = await page.$$('input');
      console.log(`Found ${allInputs.length} input elements`);
      
      for (let i = 0; i < allInputs.length; i++) {
        const input = allInputs[i];
        const type = await input.getAttribute('type');
        const placeholder = await input.getAttribute('placeholder');
        const name = await input.getAttribute('name');
        const id = await input.getAttribute('id');
        console.log(`Input ${i}: type=${type}, placeholder=${placeholder}, name=${name}, id=${id}`);
      }
      
      // Try to find any form or search-related elements
      const forms = await page.$$('form');
      console.log(`Found ${forms.length} form elements`);
      
      // Check for any buttons that might trigger search
      const buttons = await page.$$('button');
      console.log(`Found ${buttons.length} button elements`);
      
      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        const text = await button.textContent();
        const type = await button.getAttribute('type');
        const className = await button.getAttribute('class');
        console.log(`Button ${i}: text="${text}", type=${type}, class=${className}`);
      }
    }
    
    // Step 3: Analyze the page content and structure
    console.log('🔍 Analyzing page structure...');
    
    // Get page title
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Get all links to understand the structure
    const links = await page.$$eval('a', links => 
      links.map(link => ({
        href: link.href,
        text: link.textContent?.trim(),
        target: link.target
      })).filter(link => link.href && link.text)
    );
    
    console.log(`Found ${links.length} links`);
    results.links = links;
    
    // Look for any data or configuration that might contain platform information
    console.log('🔍 Looking for platform data...');
    
    // Try to find any JSON data or configuration
    const scripts = await page.$$eval('script', scripts => 
      scripts.map(script => script.textContent).filter(Boolean)
    );
    
    // Look for any data attributes or configuration
    const dataElements = await page.$$eval('[data-*]', elements => 
      elements.map(el => {
        const data = {};
        for (const attr of el.attributes) {
          if (attr.name.startsWith('data-')) {
            data[attr.name] = attr.value;
          }
        }
        return {
          tagName: el.tagName,
          className: el.className,
          data: data,
          text: el.textContent?.trim()?.substring(0, 100)
        };
      })
    );
    
    console.log(`Found ${dataElements.length} elements with data attributes`);
    results.dataElements = dataElements;
    
    // Step 4: Look for any API endpoints or network requests
    console.log('🌐 Monitoring network requests...');
    
    const networkRequests = [];
    page.on('request', request => {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType(),
        headers: request.headers()
      });
    });
    
    page.on('response', response => {
      const request = networkRequests.find(req => req.url === response.url());
      if (request) {
        request.status = response.status();
        request.statusText = response.statusText();
      }
    });
    
    // Step 5: Try to interact with the page to trigger search
    if (searchInput) {
      console.log('✍️ Attempting to search for test username...');
      
      // Clear and type the test username
      await searchInput.fill('testuser123');
      await page.screenshot({ path: path.join(screenshotsDir, 'search-input-filled.png') });
      results.screenshots.push('search-input-filled.png');
      
      // Look for search button
      const searchButtons = await page.$$('button[type="submit"], button:has-text("Search"), button:has-text("Check"), input[type="submit"]');
      
      if (searchButtons.length > 0) {
        console.log('🔍 Found search button, clicking...');
        await searchButtons[0].click();
        
        // Wait for search results
        await page.waitForTimeout(5000);
        
        // Take screenshot of search results
        await page.screenshot({ path: path.join(screenshotsDir, 'search-results.png') });
        results.screenshots.push('search-results.png');
        
        // Monitor for additional network requests during search
        await page.waitForTimeout(10000);
        
        // Try to capture search results
        const searchResults = await page.$$eval('*', elements => {
          const results = [];
          elements.forEach(el => {
            const text = el.textContent?.trim();
            if (text && (
              text.includes('Found') || 
              text.includes('Available') || 
              text.includes('Not found') ||
              text.includes('Taken') ||
              text.includes('twitter.com') ||
              text.includes('github.com') ||
              text.includes('instagram.com') ||
              text.includes('facebook.com')
            )) {
              results.push({
                tagName: el.tagName,
                className: el.className,
                text: text.substring(0, 200),
                href: el.href || null
              });
            }
          });
          return results;
        });
        
        results.searchResults = searchResults;
        console.log(`Found ${searchResults.length} potential search results`);
      }
    }
    
    // Step 6: Check for any external resources or APIs
    console.log('🔍 Analyzing external resources...');
    
    // Look for any external API calls or data sources
    const externalResources = networkRequests.filter(req => 
      !req.url.includes('whatsmyname.me') && 
      !req.url.includes('localhost') &&
      (req.resourceType === 'xhr' || req.resourceType === 'fetch')
    );
    
    results.externalResources = externalResources;
    console.log(`Found ${externalResources.length} external resources`);
    
    // Step 7: Look for any platform lists or configuration
    console.log('🔍 Looking for platform configuration...');
    
    // Check for any JSON files or data
    const jsonRequests = networkRequests.filter(req => 
      req.url.includes('.json') || 
      req.headers['content-type']?.includes('application/json')
    );
    
    results.jsonRequests = jsonRequests;
    console.log(`Found ${jsonRequests.length} JSON requests`);
    
    // Try to access any JSON data directly
    for (const jsonReq of jsonRequests) {
      try {
        const response = await page.goto(jsonReq.url);
        if (response && response.status() === 200) {
          const jsonData = await response.json();
          results.jsonData = results.jsonData || {};
          results.jsonData[jsonReq.url] = jsonData;
        }
      } catch (e) {
        console.log(`❌ Could not fetch JSON from ${jsonReq.url}: ${e.message}`);
      }
    }
    
    // Step 8: Final analysis and screenshot
    console.log('📸 Taking final screenshot...');
    await page.screenshot({ path: path.join(screenshotsDir, 'final-analysis.png') });
    results.screenshots.push('final-analysis.png');
    
    // Get final page content
    const pageContent = await page.content();
    const pageText = await page.textContent('body');
    
    // Analyze for platform mentions
    const platformKeywords = [
      'twitter', 'github', 'instagram', 'facebook', 'linkedin', 'youtube', 'tiktok',
      'snapchat', 'pinterest', 'reddit', 'discord', 'telegram', 'whatsapp',
      'steam', 'spotify', 'soundcloud', 'behance', 'dribbble', 'medium',
      'twitch', 'vimeo', 'flickr', 'tumblr', 'quora', 'stackoverflow'
    ];
    
    const foundPlatforms = [];
    platformKeywords.forEach(keyword => {
      if (pageText.toLowerCase().includes(keyword)) {
        foundPlatforms.push(keyword);
      }
    });
    
    results.detectedPlatforms = foundPlatforms;
    results.totalPlatforms = foundPlatforms.length;
    results.networkRequests = networkRequests;
    
    console.log(`✅ Analysis complete! Found ${foundPlatforms.length} platforms`);
    
  } catch (error) {
    console.error('❌ Error during investigation:', error);
    results.error = error.message;
  }
  
  // Step 9: Save results
  const reportPath = path.join(__dirname, 'whatsmyname-investigation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📄 Report saved to: ${reportPath}`);
  
  await browser.close();
  return results;
}

// Run the investigation
investigateWhatsMyName().then(results => {
  console.log('\n🎉 Investigation Complete!');
  console.log('📊 Summary:');
  console.log(`- Screenshots: ${results.screenshots.length}`);
  console.log(`- Network Requests: ${results.networkRequests?.length || 0}`);
  console.log(`- Detected Platforms: ${results.detectedPlatforms?.length || 0}`);
  console.log(`- Search Results: ${results.searchResults?.length || 0}`);
  console.log(`- External Resources: ${results.externalResources?.length || 0}`);
  
  if (results.detectedPlatforms?.length > 0) {
    console.log('\n🔍 Detected Platforms:');
    results.detectedPlatforms.forEach(platform => {
      console.log(`  - ${platform}`);
    });
  }
  
  console.log('\n📁 Files generated:');
  console.log('  - whatsmyname-investigation-report.json');
  console.log('  - screenshots/ directory with captured images');
  
}).catch(error => {
  console.error('❌ Investigation failed:', error);
});