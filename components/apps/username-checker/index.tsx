'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Users,
  Globe,
  Sparkles,
  Download,
  History,
  Heart,
  BarChart3,
  Zap,
  Target,
  TrendingUp,
  Eye,
  ShieldCheck
} from 'lucide-react';
import RealTimeResults from './RealTimeResults';

interface Site {
  name: string;
  uri_check: string;
  e_code: number;
  e_string: string;
  m_string: string;
  m_code: number;
  known: string[];
  cat: string;
}

interface CheckResult {
  site: Site;
  status: 'pending' | 'checking' | 'found' | 'not_found' | 'error';
  url: string;
  error?: string;
  timestamp?: number;
  responseTime?: number;
}

interface SearchStats {
  total: number;
  completed: number;
  found: number;
  notFound: number;
  errors: number;
  avgResponseTime: number;
}

const CATEGORY_ICONS: { [key: string]: React.ReactNode } = {
  social: <Users className="h-4 w-4" />,
  gaming: <Target className="h-4 w-4" />,
  tech: <Zap className="h-4 w-4" />,
  business: <BarChart3 className="h-4 w-4" />,
  dating: <Heart className="h-4 w-4" />,
  music: <Sparkles className="h-4 w-4" />,
  video: <Eye className="h-4 w-4" />,
  coding: <ShieldCheck className="h-4 w-4" />,
  all: <Globe className="h-4 w-4" />
};

const CATEGORY_COLORS: { [key: string]: string } = {
  social: 'bg-blue-100 text-blue-800 border-blue-200',
  gaming: 'bg-blue-100 text-blue-800 border-blue-200',
  tech: 'bg-green-100 text-green-800 border-green-200',
  business: 'bg-orange-100 text-orange-800 border-orange-200',
  dating: 'bg-pink-100 text-pink-800 border-pink-200',
  music: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  video: 'bg-red-100 text-red-800 border-red-200',
  coding: 'bg-teal-100 text-teal-800 border-teal-200',
  all: 'bg-gray-100 text-gray-800 border-gray-200'
};

export default function UsernameChecker() {
  const [username, setUsername] = useState('');
  const [sites, setSites] = useState<Site[]>([]);
  const [results, setResults] = useState<CheckResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStats, setSearchStats] = useState<SearchStats>({
    total: 0,
    completed: 0,
    found: 0,
    notFound: 0,
    errors: 0,
    avgResponseTime: 0
  });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('found');
  const [searchStartTime, setSearchStartTime] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Load sites data
    fetch('/wmn-data.json')
      .then(res => res.json())
      .then(data => {
        setSites(data.sites);
        setCategories(['all', ...data.categories.filter((cat: string) => cat !== 'xx NSFW xx')]);
      })
      .catch(err => console.error('Failed to load sites data:', err));

    // Load search history from localStorage
    const savedHistory = localStorage.getItem('search-history');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const filteredSites = selectedCategory === 'all'
    ? sites
    : sites.filter(site => site.cat === selectedCategory);

  // WhatsMyName.me backup workers (fetched from their main site)
  const backupWorkers = [
    'https://raspy-river-da26.z3674313.workers.dev/',
    'https://dry-term-0e04.ssdx027.workers.dev/',
    'https://quiet-snow-a4c1.youtubtowav.workers.dev/',
    'https://steep-brook-3b01.ssdx027-708.workers.dev/',
    'https://gentle-night-f413.grhuang87.workers.dev/',
    'https://mute-moon-4afa.hjiayu799.workers.dev/'
  ];

  const getRandomWorker = () => {
    return backupWorkers[Math.floor(Math.random() * backupWorkers.length)];
  };

  const checkUsername = async (username: string, site: Site, useBackup = false): Promise<CheckResult> => {
    const startTime = Date.now();
    const url = site.uri_check.replace('{account}', username);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), useBackup ? 10000 : 15000);

    try {
      if (useBackup) {
        // Backup method: Direct check with CORS proxy
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          },
          signal: controller.signal,
          mode: 'cors',
        });

        clearTimeout(timeoutId);
        
        const responseTime = Date.now() - startTime;
        
        // Simple heuristic check
        if (response.status === 200) {
          const text = await response.text();
          
          // Check for common "not found" patterns
          const notFoundPatterns = [
            'user not found',
            'profile not found', 
            'account not found',
            'page not found',
            'does not exist',
            'not available',
            'suspended',
            'deactivated'
          ];
          
          const lowerText = text.toLowerCase();
          const hasNotFoundPattern = notFoundPatterns.some(pattern => 
            lowerText.includes(pattern)
          );
          
          if (hasNotFoundPattern) {
            return { site, status: 'not_found', url, timestamp: Date.now(), responseTime };
          }
          
          // Check for positive indicators
          const positivePatterns = [
            'profile', 'posts', 'followers', 'following', 'about', 'bio', 'joined', 'member since'
          ];
          
          const hasPositivePattern = positivePatterns.some(pattern => 
            lowerText.includes(pattern)
          );
          
          if (hasPositivePattern) {
            return { site, status: 'found', url, timestamp: Date.now(), responseTime };
          }
          
          // Default to found if no clear negative indicators
          return { site, status: 'found', url, timestamp: Date.now(), responseTime };
        } else if (response.status === 404) {
          return { site, status: 'not_found', url, timestamp: Date.now(), responseTime };
        } else {
          return { site, status: 'error', url, error: `HTTP ${response.status}`, timestamp: Date.now(), responseTime };
        }
      } else {
        // Use local API
        const apiUrl = `/api/check-username?url=${encodeURIComponent(url)}&site=${encodeURIComponent(site.name)}`;
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          const responseTime = Date.now() - startTime;
          return { site, status: 'error', url, error: errorData.error || `HTTP ${response.status}`, timestamp: Date.now(), responseTime };
        }

        const data = await response.json();
        const responseTime = Date.now() - startTime;

        if (data.error) {
          return { site, status: 'error', url, error: data.error, timestamp: Date.now(), responseTime };
        }

        const status = data.exists ? 'found' : 'not_found';
        return { site, status, url, timestamp: Date.now(), responseTime };
      }
    } catch (error) {
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Network error';
      return { site, status: 'error', url, error: errorMessage, timestamp: Date.now(), responseTime };
    }
  };

  const handleRetryWithBackup = async (result: CheckResult) => {
    // Update the result to show it's retrying
    setResults(prev => prev.map(r => 
      r.site.name === result.site.name ? { ...r, status: 'checking', error: undefined } : r
    ));

    try {
      const retryResult = await checkUsername(username, result.site, true);
      
      // Update the result with the backup response
      setResults(prev => {
        const updated = prev.map(r => 
          r.site.name === result.site.name ? { ...retryResult, timestamp: Date.now() } : r
        );
        updateSearchStats(updated);
        return updated;
      });
    } catch (error) {
      // If backup also fails, show error
      setResults(prev => prev.map(r => 
        r.site.name === result.site.name ? { 
          ...r, 
          status: 'error', 
          error: 'Both primary and backup failed',
          timestamp: Date.now()
        } : r
      ));
    }
  };  
const updateSearchStats = useCallback((results: CheckResult[]) => {
    const completed = results.filter(r => r.status !== 'pending' && r.status !== 'checking').length;
    const found = results.filter(r => r.status === 'found').length;
    const notFound = results.filter(r => r.status === 'not_found').length;
    const errors = results.filter(r => r.status === 'error').length;

    const completedResults = results.filter(r => r.responseTime);
    const avgResponseTime = completedResults.length > 0
      ? completedResults.reduce((sum, r) => sum + (r.responseTime || 0), 0) / completedResults.length
      : 0;

    setSearchStats({
      total: results.length,
      completed,
      found,
      notFound,
      errors,
      avgResponseTime
    });
  }, []);

  // Popular sites for priority checking (using exact names from wmn-data.json)
  // Ordered by TRUE importance - mainstream platforms first
  const popularSites = [
    // TOP PRIORITY - Major social media platforms that users care about most
    'YouTube Channel', 'YouTube User', 'YouTube User2',
    'Instagram', 'Instagram (Imginn)', 'Instagram_archives',
    'Facebook',
    'TikTok',
    'Twitter archived profile', 'Twitter archived tweets',
    'Reddit',
    
    // HIGH PRIORITY - Professional platforms
    'GitHub', 'GitHub Gists',
    
    // MEDIUM PRIORITY - Entertainment and gaming
    'Steam', 'SteamGifts',
    'Spotify',
    'SoundCloud',
    'Snapchat',
    'Pinterest',
    
    // LOWER PRIORITY - Other platforms
    'Medium',
    'Dribbble',
    'Discord Users', 'Discord Invites', // Moved to lower priority
    'Telegram'
  ];

  const handleSearch = async () => {
    if (!username.trim()) return;

    setIsSearching(true);
    setSearchStartTime(Date.now());
    setActiveTab('all');

    // Add to search history
    const newHistory = [username, ...searchHistory.filter(h => h !== username)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('search-history', JSON.stringify(newHistory));

    // FIRST: Sort ALL sites to prioritize popular ones BEFORE limiting
    const sortedSites = [...filteredSites].sort((a, b) => {
      const aIsPopular = popularSites.includes(a.name);
      const bIsPopular = popularSites.includes(b.name);

      if (aIsPopular && !bIsPopular) return -1;
      if (!aIsPopular && bIsPopular) return 1;

      // If both are popular, sort by popularity index
      if (aIsPopular && bIsPopular) {
        return popularSites.indexOf(a.name) - popularSites.indexOf(b.name);
      }

      return 0;
    });

    // THEN: Take the first 150 sites (now popular sites are guaranteed to be first)
    const sitesToCheck = sortedSites.slice(0, 150);
    
    // Log sorted sites for debugging
    console.log('First 10 sorted sites:', sitesToCheck.slice(0, 10).map(s => s.name));
    console.log('Popular sites list:', popularSites);
    console.log('Total sites to check:', sitesToCheck.length);
    console.log('Sites matching popular list:', sitesToCheck.filter(site => popularSites.includes(site.name)).map(s => s.name));

    // sitesToCheck is already sorted with popular sites first, no need to reorder
    // Initialize results with pending status
    const initialResults: CheckResult[] = sitesToCheck.map(site => ({
      site,
      status: 'pending',
      url: site.uri_check.replace('{account}', username)
    }));

    setResults(initialResults);
    updateSearchStats(initialResults);
    
    console.log('=== POPULAR SITES DEBUGGING ===');
    console.log('Popular sites in order:', popularSites.slice(0, 10));
    console.log('First 10 sites to process:', sitesToCheck.slice(0, 10).map(s => s.name));
    console.log('Popular sites found:', sitesToCheck.filter(site => popularSites.includes(site.name)).slice(0, 10).map(s => s.name));
    
    // Process sites in batches - popular sites are already first
    const batchSize = 5;
    let processedCount = 0;

    for (let i = 0; i < sitesToCheck.length; i += batchSize) {
      const batch = sitesToCheck.slice(i, i + batchSize);
      const isPopularBatch = batch.some(site => popularSites.includes(site.name));

      // 立即标记为检查中
      batch.forEach((site) => {
        setResults(prev => prev.map(result => {
          return result.site.name === site.name ? { ...result, status: 'checking' } : result;
        }));
      });

      // 并行处理批次
      const promises = batch.map(site => checkUsername(username, site));

      try {
        const batchResults = await Promise.all(promises);

        // Check for errors and potentially retry with backup
        const retryPromises: Promise<CheckResult>[] = [];
        
        batchResults.forEach((result) => {
          if (result.status === 'error' && Math.random() < 0.3) { // 30% chance to auto-retry with backup
            retryPromises.push(checkUsername(username, result.site, true));
          }
        });

        // If we have retries, wait for them
        if (retryPromises.length > 0) {
          try {
            const retryResults = await Promise.all(retryPromises);
            
            // Merge retry results with original results
            const finalResults = batchResults.map(originalResult => {
              const retryResult = retryResults.find(r => r.site.name === originalResult.site.name);
              return retryResult && retryResult.status !== 'error' ? retryResult : originalResult;
            });
            
            // Update with final results
            finalResults.forEach((result) => {
              setResults(prev => {
                const updated = prev.map(prevResult => {
                  return prevResult.site.name === result.site.name ? result : prevResult;
                });
                updateSearchStats(updated);
                return updated;
              });
            });
          } catch (retryError) {
            // If retry fails, use original results
            batchResults.forEach((result) => {
              setResults(prev => {
                const updated = prev.map(prevResult => {
                  return prevResult.site.name === result.site.name ? result : prevResult;
                });
                updateSearchStats(updated);
                return updated;
              });
            });
          }
        } else {
          // No retries needed, use original results
          batchResults.forEach((result) => {
            setResults(prev => {
              const updated = prev.map(prevResult => {
                return prevResult.site.name === result.site.name ? result : prevResult;
              });
              updateSearchStats(updated);
              return updated;
            });
          });
        }

        processedCount += batch.length;
      } catch (error) {
        console.error('Batch check error:', error);
      }

      // 热门网站批次延迟更短
      const delay = isPopularBatch ? 50 : 200;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    setIsSearching(false);
  };

  const ResultsGrid = ({ results }: { results: CheckResult[] }) => {
    if (results.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No results to display
        </div>
      );
    }

    // 排序：找到的结果优先，然后热门网站优先
    const sortedResults = [...results].sort((a, b) => {
      const aIsPopular = popularSites.includes(a.site.name);
      const bIsPopular = popularSites.includes(b.site.name);
      
      // 1. 首先按状态排序：found > checking > not_found > error > pending
      const statusOrder = { 'found': 0, 'checking': 1, 'not_found': 2, 'error': 3, 'pending': 4 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      
      // 2. 相同状态内，热门网站优先
      if (aIsPopular && !bIsPopular) return -1;
      if (!aIsPopular && bIsPopular) return 1;
      
      // 3. 都是热门网站，按优先级排序
      if (aIsPopular && bIsPopular) {
        return popularSites.indexOf(a.site.name) - popularSites.indexOf(b.site.name);
      }
      
      return 0;
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedResults.map((result, index) => {
          const isPopular = popularSites.includes(result.site.name);
          const statusColorClass = getStatusColor(result.status);
          
          return (
            <Card 
              key={index} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                isPopular ? 'ring-2 ring-blue-200 bg-gradient-to-br from-blue-50 to-white' : 'hover:shadow-md'
              } ${
                result.status === 'found' ? 'border-l-4 border-l-green-500' : 
                result.status === 'error' ? 'border-l-4 border-l-red-500' : 
                result.status === 'checking' ? 'border-l-4 border-l-blue-500' : ''
              }`}
            >
              <CardContent className="p-5">
                {/* Header with status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getStatusIcon(result.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate text-sm">
                        {result.site.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          {CATEGORY_ICONS[result.site.cat] || CATEGORY_ICONS.all}
                          <span className="capitalize">{result.site.cat}</span>
                        </div>
                        {isPopular && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200 px-2 py-0.5">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge className={`${statusColorClass} text-xs font-medium px-2.5 py-1 flex-shrink-0`}>
                    {result.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                {/* Actions and info */}
                <div className="space-y-3">
                  {result.status === 'found' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(result.url, '_blank')}
                      className={`w-full font-medium ${
                        isPopular ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700' : ''
                      }`}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Profile
                    </Button>
                  )}
                  
                  {result.status === 'error' && result.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700 mb-2">{result.error}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetryWithBackup(result)}
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Retry with Backup
                      </Button>
                    </div>
                  )}
                  
                  {result.responseTime && (
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span>Response time</span>
                      <span className="font-medium">{result.responseTime}ms</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const getStatusIcon = (status: CheckResult['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      case 'checking':
        return <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'found':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'not_found':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: CheckResult['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'checking':
        return 'bg-blue-100 text-blue-700 border-blue-200 animate-pulse';
      case 'found':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'not_found':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'error':
        return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const foundResults = results.filter(r => r.status === 'found');
  const notFoundResults = results.filter(r => r.status === 'not_found');
  const errorResults = results.filter(r => r.status === 'error');
  const allResults = results.filter(r => r.status !== 'pending');

  const progress = searchStats.total > 0 ? (searchStats.completed / searchStats.total) * 100 : 0;

  const exportResults = () => {
    const data = {
      username,
      searchTime: new Date().toISOString(),
      stats: searchStats,
      results: foundResults.map(r => ({
        platform: r.site.name,
        category: r.site.cat,
        url: r.url,
        status: r.status
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `username-${username}-results.json`;
    a.click();
    URL.revokeObjectURL(url);
  }; 
 return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Search Header */}
        <div className="relative">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-blue-600/5 to-cyan-600/5" />
            <div className="p-8 relative">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-4 mb-4">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                    <Search className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                      WhatsMyName Works
                    </h1>
                    <p className="text-xl text-gray-600 mt-2">
                      Discover your digital footprint across 500+ platforms instantly
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                      <span className="text-sm text-gray-500">Popular sites (YouTube, Instagram, GitHub, etc.) checked first</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Search Input - 统一宽度容器 */}
              <div className="w-full max-w-5xl mx-auto space-y-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex gap-4 relative z-10">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Enter username to check..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="h-16 text-lg pl-16 pr-32 border-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg focus:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/30 text-gray-900 font-medium placeholder:text-gray-500 focus:bg-white"
                      />
                      <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-600" />
                      {username && (
                        <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
                          <div className="text-sm text-gray-500 font-medium hidden sm:block">{username.length}/50</div>
                          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full animate-pulse" />
                          {isSearching && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={handleSearch} 
                      disabled={!username.trim() || isSearching}
                      className="h-16 px-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[140px]"
                    >
                      {isSearching ? (
                        <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                      ) : (
                        <Sparkles className="h-6 w-6 mr-3" />
                      )}
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                  </div>
                </div> 
               {/* Search History */}
                {searchHistory.length > 0 && (
                  <div className="flex flex-wrap gap-3 items-center animate-in fade-in duration-300">
                    <span className="text-sm text-gray-500 flex items-center gap-2 font-medium">
                      <History className="h-4 w-4" />
                      Recent searches:
                    </span>
                    {searchHistory.slice(0, 5).map((term, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setUsername(term)}
                        className="text-sm bg-white/60 backdrop-blur-sm border-gray-200/50 hover:bg-white hover:shadow-md transition-all duration-200 rounded-xl px-4 py-2"
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Stats and Progress */}
                {username && results.length > 0 && (
                  <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                          <Globe className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">
                            Searching {filteredSites.length} platforms
                          </div>
                          <div className="text-sm text-gray-500">
                            for: <span className="font-medium text-blue-600">{username}</span>
                          </div>
                          {isSearching && (
                            <div className="flex items-center gap-2 mt-1">
                              <Sparkles className="h-4 w-4 text-blue-500" />
                              <span className="text-xs text-blue-600">Checking popular sites first...</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {foundResults.length > 0 && (
                        <Button
                          onClick={exportResults}
                          variant="outline"
                          size="sm"
                          className="bg-white/60 backdrop-blur-sm border-gray-200/50 hover:bg-white hover:shadow-md transition-all duration-200 rounded-xl"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export Results
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{searchStats.completed}</div>
                        <div className="text-sm text-gray-500 font-medium">Checked</div>
                      </div>
                      <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                        <div className="text-3xl font-bold text-green-600 mb-2">{searchStats.found}</div>
                        <div className="text-sm text-gray-500 font-medium">Found</div>
                      </div>
                      <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                        <div className="text-3xl font-bold text-red-600 mb-2">{searchStats.notFound}</div>
                        <div className="text-sm text-gray-500 font-medium">Not Found</div>
                      </div>
                      <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                        <div className="text-3xl font-bold text-yellow-600 mb-2">{searchStats.errors}</div>
                        <div className="text-sm text-gray-500 font-medium">Errors</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-600">Progress: {Math.round(progress)}%</span>
                        <span className="text-gray-600">{searchStats.avgResponseTime.toFixed(0)}ms avg response</span>
                      </div>
                      <div className="relative">
                        <Progress value={progress} className="h-4 bg-gray-200/50 rounded-full" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-20 animate-pulse" style={{width: `${progress}%`}} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>  
      {/* Results */}
        {results.length > 0 && (
          <div className="w-full max-w-5xl mx-auto space-y-8">
            {/* Filter Tabs */}
            <div className="flex items-center justify-center">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg h-auto max-w-2xl mx-auto">
                  <TabsTrigger value="all" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 text-sm font-medium py-3 px-3">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">All</span>
                    <span className="bg-black/10 text-xs px-2 py-1 rounded-full">({allResults.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="found" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 text-sm font-medium py-3 px-3">
                    <CheckCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Found</span>
                    <span className="bg-black/10 text-xs px-2 py-1 rounded-full">({foundResults.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="not_found" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 text-sm font-medium py-3 px-3">
                    <XCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Not Found</span>
                    <span className="bg-black/10 text-xs px-2 py-1 rounded-full">({notFoundResults.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="errors" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200 text-sm font-medium py-3 px-3">
                    <AlertCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Errors</span>
                    <span className="bg-black/10 text-xs px-2 py-1 rounded-full">({errorResults.length})</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-8">
                  <ResultsGrid results={allResults} />
                </TabsContent>
                
                <TabsContent value="found" className="mt-8">
                  <ResultsGrid results={foundResults} />
                </TabsContent>
                
                <TabsContent value="not_found" className="mt-8">
                  <ResultsGrid results={notFoundResults} />
                </TabsContent>
                
                <TabsContent value="errors" className="mt-8">
                  <ResultsGrid results={errorResults} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && !isSearching && (
          <div className="w-full max-w-5xl mx-auto text-center py-16 space-y-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <Search className="h-12 w-12 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Ready to Search
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg">
                Enter a username above to check its availability across 500+ social media platforms and websites.
              </p>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Real-time results</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Lightning fast</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                <span>Secure & private</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}