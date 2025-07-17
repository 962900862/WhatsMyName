const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function investigateWhatsMyNameRobust() {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500,
    args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  // Set longer timeout
  page.setDefaultTimeout(60000);
  
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
    screenshots: [],
    networkRequests: [],
    attempts: []
  };
  
  // Monitor network requests
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
  
  try {
    console.log('🚀 Starting robust investigation of whatsmyname.me...');
    
    // Try different loading strategies
    const loadingStrategies = [
      { waitUntil: 'load', timeout: 30000 },
      { waitUntil: 'domcontentloaded', timeout: 20000 },
      { waitUntil: 'networkidle', timeout: 45000 },
      { waitUntil: 'commit', timeout: 15000 }
    ];
    
    let pageLoaded = false;
    let loadError = null;
    
    for (const strategy of loadingStrategies) {
      try {
        console.log(`📱 Trying to load with strategy: ${strategy.waitUntil}, timeout: ${strategy.timeout}ms`);
        
        await page.goto('https://whatsmyname.me/', { 
          waitUntil: strategy.waitUntil,
          timeout: strategy.timeout
        });
        
        pageLoaded = true;
        console.log(`✅ Successfully loaded with strategy: ${strategy.waitUntil}`);
        results.attempts.push({
          strategy: strategy.waitUntil,
          success: true,
          timeout: strategy.timeout
        });
        break;
        
      } catch (error) {
        console.log(`❌ Failed with strategy ${strategy.waitUntil}: ${error.message}`);
        loadError = error;
        results.attempts.push({
          strategy: strategy.waitUntil,
          success: false,
          error: error.message,
          timeout: strategy.timeout
        });
        
        // Wait a bit before trying next strategy
        await page.waitForTimeout(2000);
      }
    }
    
    if (!pageLoaded) {
      console.log('❌ All loading strategies failed. Trying alternative approaches...');
      
      // Try accessing the site directly without waiting
      try {
        await page.goto('https://whatsmyname.me/', { waitUntil: 'commit', timeout: 10000 });
        console.log('✅ Basic page load successful');
        pageLoaded = true;
      } catch (e) {
        console.log('❌ Basic page load also failed');
      }
    }
    
    if (pageLoaded) {
      // Take initial screenshot
      try {
        const initialScreenshot = 'initial-page.png';
        await page.screenshot({ path: path.join(screenshotsDir, initialScreenshot) });
        results.screenshots.push(initialScreenshot);
        console.log('📸 Initial screenshot captured');
      } catch (e) {
        console.log('❌ Could not take initial screenshot:', e.message);
      }
      
      // Get basic page info
      try {
        const title = await page.title();
        console.log(`Page title: ${title}`);
        results.pageTitle = title;
      } catch (e) {
        console.log('❌ Could not get page title:', e.message);
      }
      
      // Wait for page to settle
      await page.waitForTimeout(5000);
      
      // Try to get page content
      try {
        const pageText = await page.textContent('body');
        console.log(`Page text length: ${pageText?.length || 0} characters`);
        
        // Look for platform mentions in the page text
        const platformKeywords = [
          'twitter', 'github', 'instagram', 'facebook', 'linkedin', 'youtube', 'tiktok',
          'snapchat', 'pinterest', 'reddit', 'discord', 'telegram', 'whatsapp',
          'steam', 'spotify', 'soundcloud', 'behance', 'dribbble', 'medium',
          'twitch', 'vimeo', 'flickr', 'tumblr', 'quora', 'stackoverflow',
          'amazon', 'ebay', 'etsy', 'paypal', 'venmo', 'cashapp', 'zelle',
          'onlyfans', 'patreon', 'ko-fi', 'gofundme', 'kickstarter',
          'gitlab', 'bitbucket', 'codepen', 'replit', 'glitch',
          'mastodon', 'bluesky', 'threads', 'clubhouse', 'signal'
        ];
        
        const foundPlatforms = [];
        if (pageText) {
          platformKeywords.forEach(keyword => {
            if (pageText.toLowerCase().includes(keyword)) {
              foundPlatforms.push(keyword);
            }
          });
        }
        
        results.detectedPlatforms = foundPlatforms;
        results.totalPlatforms = foundPlatforms.length;
        console.log(`🔍 Found ${foundPlatforms.length} platform mentions in page text`);
        
      } catch (e) {
        console.log('❌ Could not analyze page text:', e.message);
      }
      
      // Look for search functionality
      try {
        console.log('🔍 Looking for search functionality...');
        
        // Look for various input types
        const inputs = await page.$$('input');
        console.log(`Found ${inputs.length} input elements`);
        
        for (let i = 0; i < inputs.length; i++) {
          const input = inputs[i];
          try {
            const type = await input.getAttribute('type');
            const placeholder = await input.getAttribute('placeholder');
            const name = await input.getAttribute('name');
            const id = await input.getAttribute('id');
            const className = await input.getAttribute('class');
            
            console.log(`Input ${i}: type=${type}, placeholder="${placeholder}", name="${name}", id="${id}", class="${className}"`);
            
            // If this looks like a search input, try to use it
            if (type === 'text' || type === 'search' || 
                (placeholder && placeholder.toLowerCase().includes('username')) ||
                (placeholder && placeholder.toLowerCase().includes('search')) ||
                (name && name.toLowerCase().includes('username')) ||
                (id && id.toLowerCase().includes('username'))) {
              
              console.log(`✅ Found potential search input: Input ${i}`);
              
              try {
                await input.fill('testuser123');
                console.log('✅ Successfully filled search input with testuser123');
                
                // Take screenshot after filling
                const filledScreenshot = 'search-input-filled.png';
                await page.screenshot({ path: path.join(screenshotsDir, filledScreenshot) });
                results.screenshots.push(filledScreenshot);
                
                // Look for submit button
                const buttons = await page.$$('button, input[type="submit"]');
                console.log(`Found ${buttons.length} buttons`);
                
                for (let j = 0; j < buttons.length; j++) {
                  const button = buttons[j];
                  try {
                    const text = await button.textContent();
                    const type = await button.getAttribute('type');
                    const className = await button.getAttribute('class');
                    console.log(`Button ${j}: text="${text}", type="${type}", class="${className}"`);
                    
                    if (type === 'submit' || 
                        (text && (text.toLowerCase().includes('search') || 
                                  text.toLowerCase().includes('check') || 
                                  text.toLowerCase().includes('go') ||
                                  text.toLowerCase().includes('find')))) {
                      
                      console.log(`🔍 Clicking search button: ${text}`);
                      await button.click();
                      
                      // Wait for search results
                      await page.waitForTimeout(10000);
                      
                      // Take screenshot of results
                      const resultsScreenshot = 'search-results.png';
                      await page.screenshot({ path: path.join(screenshotsDir, resultsScreenshot) });
                      results.screenshots.push(resultsScreenshot);
                      
                      // Try to capture results
                      const resultElements = await page.$$('*');
                      const searchResults = [];
                      
                      for (const element of resultElements) {
                        try {
                          const text = await element.textContent();
                          const tagName = await element.tagName();
                          const className = await element.getAttribute('class');
                          
                          if (text && text.length > 0 && text.length < 500) {
                            const lowerText = text.toLowerCase();
                            if (lowerText.includes('found') || 
                                lowerText.includes('available') || 
                                lowerText.includes('taken') ||
                                lowerText.includes('exists') ||
                                lowerText.includes('not found') ||
                                lowerText.includes('twitter.com') ||
                                lowerText.includes('github.com') ||
                                lowerText.includes('instagram.com') ||
                                lowerText.includes('facebook.com') ||
                                lowerText.includes('testuser123')) {
                              
                              searchResults.push({
                                tagName,
                                className,
                                text: text.substring(0, 200)
                              });
                            }
                          }
                        } catch (e) {
                          // Skip this element
                        }
                      }
                      
                      results.searchResults = searchResults;
                      console.log(`📊 Found ${searchResults.length} search result elements`);
                      
                      break; // Found and used search button
                    }
                  } catch (e) {
                    console.log(`❌ Error with button ${j}: ${e.message}`);
                  }
                }
                
                break; // Found and used search input
              } catch (e) {
                console.log(`❌ Error using input ${i}: ${e.message}`);
              }
            }
          } catch (e) {
            console.log(`❌ Error analyzing input ${i}: ${e.message}`);
          }
        }
        
      } catch (e) {
        console.log('❌ Error looking for search functionality:', e.message);
      }
      
      // Final screenshot
      try {
        const finalScreenshot = 'final-state.png';
        await page.screenshot({ path: path.join(screenshotsDir, finalScreenshot) });
        results.screenshots.push(finalScreenshot);
        console.log('📸 Final screenshot captured');
      } catch (e) {
        console.log('❌ Could not take final screenshot:', e.message);
      }
    }
    
    // Save network requests
    results.networkRequests = networkRequests;
    console.log(`🌐 Captured ${networkRequests.length} network requests`);
    
    // Analyze network requests for platform data
    const jsonRequests = networkRequests.filter(req => 
      req.url.includes('.json') || 
      req.url.includes('/api/') ||
      (req.headers && req.headers['content-type'] && req.headers['content-type'].includes('json'))
    );
    
    console.log(`📋 Found ${jsonRequests.length} potential JSON/API requests`);
    results.jsonRequests = jsonRequests;
    
    // Try to fetch JSON data
    for (const jsonReq of jsonRequests) {
      try {
        console.log(`📥 Attempting to fetch JSON data from: ${jsonReq.url}`);
        const response = await page.goto(jsonReq.url, { timeout: 10000 });
        if (response && response.status() === 200) {
          try {
            const jsonData = await response.json();
            results.jsonData = results.jsonData || {};
            results.jsonData[jsonReq.url] = jsonData;
            console.log(`✅ Successfully fetched JSON data from ${jsonReq.url}`);
          } catch (e) {
            console.log(`❌ Could not parse JSON from ${jsonReq.url}: ${e.message}`);
          }
        }
      } catch (e) {
        console.log(`❌ Could not fetch ${jsonReq.url}: ${e.message}`);
      }
    }
    
    console.log('✅ Investigation completed successfully!');
    
  } catch (error) {
    console.error('❌ Critical error during investigation:', error);
    results.error = error.message;
  }
  
  // Save results
  const reportPath = path.join(__dirname, 'whatsmyname-investigation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📄 Report saved to: ${reportPath}`);
  
  await browser.close();
  return results;
}

// Run the investigation
investigateWhatsMyNameRobust().then(results => {
  console.log('\n🎉 Investigation Complete!');
  console.log('📊 Summary:');
  console.log(`- Page Load Attempts: ${results.attempts?.length || 0}`);
  console.log(`- Screenshots: ${results.screenshots?.length || 0}`);
  console.log(`- Network Requests: ${results.networkRequests?.length || 0}`);
  console.log(`- JSON Requests: ${results.jsonRequests?.length || 0}`);
  console.log(`- Detected Platforms: ${results.detectedPlatforms?.length || 0}`);
  console.log(`- Search Results: ${results.searchResults?.length || 0}`);
  
  if (results.detectedPlatforms?.length > 0) {
    console.log('\n🔍 Detected Platforms:');
    results.detectedPlatforms.forEach(platform => {
      console.log(`  - ${platform}`);
    });
  }
  
  if (results.attempts?.length > 0) {
    console.log('\n📱 Load Attempts:');
    results.attempts.forEach((attempt, index) => {
      console.log(`  ${index + 1}. ${attempt.strategy} (${attempt.timeout}ms): ${attempt.success ? '✅' : '❌'}`);
    });
  }
  
  console.log('\n📁 Files generated:');
  console.log('  - whatsmyname-investigation-report.json');
  console.log('  - screenshots/ directory with captured images');
  
}).catch(error => {
  console.error('❌ Investigation failed:', error);
});