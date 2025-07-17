const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function investigateWhatsMyName() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const findings = {
    dataSources: [],
    apiEndpoints: [],
    networkRequests: [],
    uiElements: [],
    documentation: [],
    screenshots: []
  };

  // Monitor network requests
  page.on('request', request => {
    const url = request.url();
    findings.networkRequests.push({
      url: url,
      method: request.method(),
      resourceType: request.resourceType(),
      headers: request.headers()
    });
  });

  page.on('response', response => {
    const url = response.url();
    if (url.includes('api') || url.includes('data') || url.includes('.json') || url.includes('.xml')) {
      findings.apiEndpoints.push({
        url: url,
        status: response.status(),
        headers: response.headers()
      });
    }
  });

  try {
    console.log('🔍 Navigating to https://whatsmyname.me/...');
    await page.goto('https://whatsmyname.me/', { waitUntil: 'networkidle' });
    
    // Take screenshot of main page
    await page.screenshot({ path: 'screenshots/main-page.png', fullPage: true });
    findings.screenshots.push('screenshots/main-page.png');
    
    console.log('📸 Screenshot taken of main page');
    
    // Look for data source mentions in the page content
    const pageContent = await page.content();
    const dataSourceKeywords = [
      'data source', 'database', 'API', 'endpoint', 'github', 'repository',
      'source code', 'powered by', 'uses', 'based on', 'from', 'collected from'
    ];
    
    for (const keyword of dataSourceKeywords) {
      const regex = new RegExp(keyword, 'gi');
      const matches = pageContent.match(regex);
      if (matches) {
        findings.dataSources.push({
          keyword: keyword,
          occurrences: matches.length,
          context: 'Found in page content'
        });
      }
    }
    
    // Look for GitHub links or mentions
    const githubLinks = await page.$$eval('a[href*="github.com"]', links => 
      links.map(link => ({ href: link.href, text: link.textContent.trim() }))
    );
    
    if (githubLinks.length > 0) {
      findings.dataSources.push({
        type: 'GitHub Repository',
        links: githubLinks,
        context: 'Found GitHub links on page'
      });
    }
    
    // Look for about/documentation sections
    const aboutSelectors = [
      'a[href*="about"]', 
      'a[href*="docs"]', 
      'a[href*="documentation"]',
      'a[href*="help"]',
      'a[href*="faq"]',
      'a[href*="source"]',
      'a[href*="info"]'
    ];
    
    for (const selector of aboutSelectors) {
      const elements = await page.$$(selector);
      if (elements.length > 0) {
        for (const element of elements) {
          const href = await element.getAttribute('href');
          const text = await element.textContent();
          findings.documentation.push({
            type: 'Navigation Link',
            href: href,
            text: text?.trim()
          });
        }
      }
    }
    
    // Look for footer information
    const footer = await page.$('footer');
    if (footer) {
      const footerContent = await footer.textContent();
      findings.uiElements.push({
        type: 'Footer Content',
        content: footerContent
      });
    }
    
    // Look for any username input to see how the search works
    const searchInput = await page.$('input[type="text"], input[placeholder*="username"], input[placeholder*="search"]');
    if (searchInput) {
      console.log('🔍 Found search input, testing username search...');
      await searchInput.fill('testuser123');
      
      // Look for search button
      const searchButton = await page.$('button[type="submit"], button:has-text("Search"), button:has-text("Check")');
      if (searchButton) {
        await searchButton.click();
        await page.waitForTimeout(3000); // Wait for results
        
        // Take screenshot of results
        await page.screenshot({ path: 'screenshots/search-results.png', fullPage: true });
        findings.screenshots.push('screenshots/search-results.png');
        
        console.log('📸 Screenshot taken of search results');
      }
    }
    
    // Check for any visible data source attributions
    const attributions = await page.$$eval('*', elements => {
      const attributionTexts = [];
      elements.forEach(el => {
        const text = el.textContent || '';
        if (text.includes('powered by') || text.includes('data from') || text.includes('source:') || text.includes('based on')) {
          attributionTexts.push(text.trim());
        }
      });
      return attributionTexts;
    });
    
    if (attributions.length > 0) {
      findings.dataSources.push({
        type: 'Page Attributions',
        attributions: attributions
      });
    }
    
    // Look for any visible API documentation or links
    const apiLinks = await page.$$eval('a', links => 
      links.filter(link => {
        const href = link.href || '';
        const text = link.textContent || '';
        return href.includes('api') || text.toLowerCase().includes('api') || 
               href.includes('swagger') || href.includes('openapi');
      }).map(link => ({ href: link.href, text: link.textContent.trim() }))
    );
    
    if (apiLinks.length > 0) {
      findings.apiEndpoints.push({
        type: 'API Documentation Links',
        links: apiLinks
      });
    }
    
    // Try to find the source of the username checking data
    console.log('🔍 Analyzing network requests for data sources...');
    
    // Filter network requests for potential data sources
    const dataRequests = findings.networkRequests.filter(req => 
      req.url.includes('.json') || 
      req.url.includes('/api/') || 
      req.url.includes('data') ||
      req.url.includes('username') ||
      req.url.includes('check') ||
      req.url.includes('search')
    );
    
    findings.dataSources.push({
      type: 'Network Data Requests',
      requests: dataRequests
    });
    
    console.log('✅ Investigation complete');
    
  } catch (error) {
    console.error('❌ Error during investigation:', error);
    findings.errors = [error.message];
  } finally {
    await browser.close();
  }
  
  return findings;
}

// Create screenshots directory
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Run the investigation
investigateWhatsMyName().then(findings => {
  console.log('\n📋 INVESTIGATION FINDINGS:');
  console.log('==========================');
  
  // Save findings to file
  const reportPath = path.join(__dirname, 'whatsmyname-investigation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(findings, null, 2));
  
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  console.log(`📸 Screenshots saved to: ${screenshotsDir}`);
  
  // Display key findings
  console.log('\n🔍 DATA SOURCES FOUND:');
  if (findings.dataSources.length > 0) {
    findings.dataSources.forEach((source, index) => {
      console.log(`${index + 1}. ${source.type || 'Unknown'}: ${JSON.stringify(source, null, 2)}`);
    });
  } else {
    console.log('No explicit data sources found in UI');
  }
  
  console.log('\n🌐 API ENDPOINTS DISCOVERED:');
  if (findings.apiEndpoints.length > 0) {
    findings.apiEndpoints.forEach((endpoint, index) => {
      console.log(`${index + 1}. ${endpoint.url || JSON.stringify(endpoint)}`);
    });
  } else {
    console.log('No API endpoints discovered');
  }
  
  console.log('\n📡 NETWORK REQUESTS SUMMARY:');
  console.log(`Total requests: ${findings.networkRequests.length}`);
  const uniqueDomains = [...new Set(findings.networkRequests.map(req => new URL(req.url).hostname))];
  console.log(`Unique domains: ${uniqueDomains.join(', ')}`);
  
}).catch(error => {
  console.error('❌ Investigation failed:', error);
});