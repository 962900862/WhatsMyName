const https = require('https');
const http = require('http');

async function fetchWebsite(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    };

    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.abort();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function main() {
  try {
    console.log('🔍 Fetching https://whatsmyname.me/...');
    const result = await fetchWebsite('https://whatsmyname.me/');
    
    console.log('📊 Status Code:', result.statusCode);
    console.log('📋 Headers:', JSON.stringify(result.headers, null, 2));
    console.log('📄 Body length:', result.body.length);
    
    // Look for key information about data sources
    const keywords = ['github', 'WebBreacher', 'Micah', 'data', 'source', 'repository', 'WhatsMyName'];
    
    console.log('\n🔍 Looking for data source keywords...');
    keywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = result.body.match(regex);
      if (matches) {
        console.log(`- Found "${keyword}": ${matches.length} occurrences`);
      }
    });
    
    // Look for any JSON data references
    const jsonReferences = result.body.match(/\.json|wmn-data|data\.json/gi);
    if (jsonReferences) {
      console.log('\n📊 JSON References found:', jsonReferences);
    }
    
    // Look for any GitHub links
    const githubLinks = result.body.match(/github\.com[\/\w-]*/gi);
    if (githubLinks) {
      console.log('\n🔗 GitHub links found:', githubLinks);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();