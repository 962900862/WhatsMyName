const fs = require('fs');

// Read the investigation report
const data = JSON.parse(fs.readFileSync('whatsmyname-investigation-report.json', 'utf8'));

console.log('=== WhatsMyName Platform Data Analysis ===');
console.log('');

// Extract the main platform data
const wmnDataUrl = 'https://whatsmyname.me/static/data/wmn-data.json?v=43';
const wmnData = data.jsonData[wmnDataUrl];

if (wmnData && wmnData.sites) {
  console.log('📊 Total Platforms:', wmnData.sites.length);
  console.log('📝 License:', wmnData.license);
  console.log('👥 Authors:', wmnData.authors.join(', '));
  console.log('📂 Categories:', wmnData.categories.join(', '));
  console.log('');
  
  // Analyze platforms
  const platforms = wmnData.sites;
  const platformsByCategory = {};
  
  platforms.forEach(platform => {
    const category = platform.categ || 'uncategorized';
    if (!platformsByCategory[category]) {
      platformsByCategory[category] = [];
    }
    platformsByCategory[category].push(platform);
  });
  
  console.log('📊 Platforms by Category:');
  Object.keys(platformsByCategory).sort().forEach(category => {
    console.log(`  ${category}: ${platformsByCategory[category].length} platforms`);
  });
  console.log('');
  
  // Show detailed information for each category
  console.log('📋 Detailed Platform Information:');
  console.log('');
  
  Object.keys(platformsByCategory).sort().forEach(category => {
    console.log(`🗂️  ${category.toUpperCase()} (${platformsByCategory[category].length} platforms):`);
    console.log('');
    
    platformsByCategory[category].forEach((platform, index) => {
      console.log(`  ${index + 1}. ${platform.name}`);
      console.log(`     URL Pattern: ${platform.uri_pretty}`);
      console.log(`     Check URL: ${platform.uri_check}`);
      console.log(`     Valid: ${platform.valid}`);
      if (platform.known_accounts && platform.known_accounts.length > 0) {
        console.log(`     Known Accounts: ${platform.known_accounts.join(', ')}`);
      }
      console.log('');
    });
    console.log('');
  });
  
  // Create summary report
  const summaryReport = {
    totalPlatforms: platforms.length,
    categories: Object.keys(platformsByCategory).sort(),
    platformsByCategory: {},
    allPlatforms: platforms.map(p => ({
      name: p.name,
      category: p.categ || 'uncategorized',
      url: p.uri_pretty,
      checkUrl: p.uri_check,
      valid: p.valid,
      knownAccounts: p.known_accounts || []
    }))
  };
  
  Object.keys(platformsByCategory).forEach(category => {
    summaryReport.platformsByCategory[category] = platformsByCategory[category].length;
  });
  
  // Save summary report
  fs.writeFileSync('platform-summary-report.json', JSON.stringify(summaryReport, null, 2));
  console.log('📄 Summary report saved to: platform-summary-report.json');
  
  // Show some statistics
  console.log('📊 Statistics:');
  console.log(`  - Total platforms: ${platforms.length}`);
  console.log(`  - Categories: ${Object.keys(platformsByCategory).length}`);
  console.log(`  - Valid platforms: ${platforms.filter(p => p.valid).length}`);
  console.log(`  - Invalid platforms: ${platforms.filter(p => !p.valid).length}`);
  
  // Show most popular categories
  const sortedCategories = Object.entries(platformsByCategory)
    .sort(([,a], [,b]) => b.length - a.length)
    .slice(0, 10);
  
  console.log('');
  console.log('🏆 Top 10 Categories by Platform Count:');
  sortedCategories.forEach(([category, platforms], index) => {
    console.log(`  ${index + 1}. ${category}: ${platforms.length} platforms`);
  });
  
} else {
  console.log('❌ No platform data found in the investigation report');
}

// Also check Chinese data
console.log('');
console.log('=== Chinese Platform Data ===');
const wmnDataCnUrl = 'https://whatsmyname.me/static/data/wmn-data-cn.json?v=43';
const wmnDataCn = data.jsonData[wmnDataCnUrl];

if (wmnDataCn && wmnDataCn.sites) {
  console.log('📊 Chinese Platforms:', wmnDataCn.sites.length);
  console.log('📂 Chinese Categories:', wmnDataCn.categories.join(', '));
  
  // Show first 10 Chinese platforms
  console.log('');
  console.log('🔍 First 10 Chinese Platforms:');
  wmnDataCn.sites.slice(0, 10).forEach((platform, index) => {
    console.log(`  ${index + 1}. ${platform.name}`);
    console.log(`     URL: ${platform.uri_pretty}`);
    console.log(`     Category: ${platform.categ || 'N/A'}`);
    console.log('');
  });
}