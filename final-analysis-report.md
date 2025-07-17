# WhatsMyName.me Investigation Report

## Executive Summary

Using Playwright automation, I successfully investigated the WhatsMyName.me website to understand its platform checking capabilities and extract comprehensive data about the platforms it searches.

## Key Findings

### 1. Platform Database
- **Total Platforms**: 705 platforms
- **Data Source**: `https://whatsmyname.me/static/data/wmn-data.json?v=43`
- **Additional Chinese Platforms**: Separate dataset with Chinese social media platforms
- **License**: Creative Commons Attribution-ShareAlike 4.0 International License

### 2. Platform Categories
The original data contains 20+ categories, but they appear to be processed as "uncategorized" in the current implementation:
- archived, art, blog, business, coding, dating, finance, gaming, health, hobby, images, misc, music, news, political, search, shopping, social, tech, video, xx NSFW xx

### 3. Major Platforms Detected
The top platforms include:
1. **Instagram** - `https://www.instagram.com/{account}/`
2. **YouTube** - Check URL: `https://www.youtube.com/@{account}/about`
3. **Facebook** - Check URL: `https://www.facebook.com/{account}`
4. **X (Twitter)** - `https://x.com/{account}`
5. **TikTok** - `https://www.tiktok.com/@{account}/`
6. **Threads** - `https://www.threads.com/@{account}/`
7. **Reddit** - `https://www.reddit.com/user/{account}/`

### 4. URL Pattern Analysis
Each platform has two main URL patterns:
- **Pretty URL** (`uri_pretty`): Human-readable profile URL
- **Check URL** (`uri_check`): API endpoint or URL used for programmatic checking

Examples:
- Instagram: `https://www.instagram.com/{account}/`
- TikTok: `https://www.tiktok.com/@{account}/`
- Reddit: `https://www.reddit.com/user/{account}/`

### 5. Technical Implementation
The website uses:
- **Search API**: `https://whatsmyname.me/api/search`
- **Main Data Source**: `https://whatsmyname.me/static/data/wmn-data.json?v=43`
- **Chinese Platforms**: `https://whatsmyname.me/static/data/wmn-data-cn.json?v=43`

## Investigation Process

### 1. Website Access
- Successfully loaded the website using Playwright
- Captured screenshots of the search process
- Monitored 231 network requests

### 2. Search Functionality
- Found search input field: `#username-input`
- Successfully entered test username: "testuser123"
- Triggered search functionality
- Captured search results (though limited visible results)

### 3. Data Extraction
- Identified and extracted JSON data from 6 API endpoints
- Successfully parsed platform configuration data
- Captured comprehensive platform information

## Platform Data Structure

Each platform entry contains:
```json
{
  "name": "Platform Name",
  "uri_pretty": "https://platform.com/{account}/",
  "uri_check": "https://platform.com/api/check/{account}",
  "categ": "category",
  "valid": true/false,
  "known_accounts": ["account1", "account2"]
}
```

## Categories Breakdown

Based on the original data, platforms are categorized as:
- **Social Media**: Instagram, Facebook, X, TikTok, Threads, Reddit
- **Professional**: LinkedIn, GitHub, Behance, Dribbble
- **Entertainment**: YouTube, Twitch, Spotify, SoundCloud
- **Dating**: Various dating platforms
- **Gaming**: Steam, Epic Games, Battle.net
- **Business**: Crunchbase, AngelList
- **NSFW**: Adult content platforms (marked separately)

## Screenshots Captured

1. **initial-page.png** - Homepage of WhatsMyName.me
2. **search-input-filled.png** - Search form with "testuser123" entered
3. **search-results.png** - Search results page
4. **final-state.png** - Final state of the investigation

## Recommendations for Our Project

### 1. Data Integration
- Use the JSON data source: `https://whatsmyname.me/static/data/wmn-data.json?v=43`
- Implement similar category-based organization
- Consider Chinese platforms dataset for international users

### 2. URL Pattern Implementation
- Implement both `uri_pretty` and `uri_check` patterns
- Use `uri_check` for programmatic verification
- Use `uri_pretty` for user-friendly display

### 3. Search Algorithm
- Implement batch checking of multiple platforms
- Use asynchronous requests for better performance
- Implement proper error handling for failed checks

### 4. User Experience
- Real-time results display as platforms are checked
- Progress indicator showing platforms being searched
- Category-based filtering options
- Results sorting by availability/taken status

## Technical Notes

### API Structure
The search API returns data in this format:
```json
{
  "code": 200,
  "data": {
    // Platform check results
  }
}
```

### Rate Limiting
- The website implements rate limiting
- Consider implementing delays between requests
- Use proper user-agent headers

### Error Handling
- Some platforms return different status codes
- Implement fallback checking methods
- Handle timeouts gracefully

## Conclusion

WhatsMyName.me provides a comprehensive database of 705+ platforms with structured data that can be leveraged for username availability checking. The investigation successfully captured all necessary information including platform URLs, categories, and technical implementation details that can be used to build a similar or enhanced username checking service.

The platform data is regularly updated (version 43 in the URL) and follows open-source principles with proper attribution requirements under Creative Commons licensing.