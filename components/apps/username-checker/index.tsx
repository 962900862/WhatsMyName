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
  Filter,
  BarChart3,
  Zap,
  Target,
  TrendingUp,
  Eye,
  ShieldCheck
} from 'lucide-react';

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
  gaming: 'bg-purple-100 text-purple-800 border-purple-200',
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
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

  const checkUsername = async (username: string, site: Site): Promise<CheckResult> => {
    const startTime = Date.now();
    const url = site.uri_check.replace('{account}', username);
    
    try {
      const response = await fetch(`/api/check-username?url=${encodeURIComponent(url)}&site=${encodeURIComponent(site.name)}`);
      const data = await response.json();
      const responseTime = Date.now() - startTime;
      
      if (data.error) {
        return { site, status: 'error', url, error: data.error, timestamp: Date.now(), responseTime };
      }
      
      const status = data.exists ? 'found' : 'not_found';
      return { site, status, url, timestamp: Date.now(), responseTime };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return { site, status: 'error', url, error: 'Network error', timestamp: Date.now(), responseTime };
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

  const handleSearch = async () => {
    if (!username.trim()) return;
    
    setIsSearching(true);
    setSearchStartTime(Date.now());
    setActiveTab('all');
    
    // Add to search history
    const newHistory = [username, ...searchHistory.filter(h => h !== username)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('search-history', JSON.stringify(newHistory));
    
    const sitesToCheck = filteredSites.slice(0, 100); // Increased limit
    
    // Initialize results with pending status
    const initialResults: CheckResult[] = sitesToCheck.map(site => ({
      site,
      status: 'pending',
      url: site.uri_check.replace('{account}', username)
    }));
    
    setResults(initialResults);
    updateSearchStats(initialResults);
    
    // Process sites in smaller batches with real-time updates
    const batchSize = 5;
    let processedCount = 0;
    
    for (let i = 0; i < sitesToCheck.length; i += batchSize) {
      const batch = sitesToCheck.slice(i, i + batchSize);
      
      // Mark batch as checking
      setResults(prev => prev.map(result => {
        const inBatch = batch.find(site => site.name === result.site.name);
        return inBatch ? { ...result, status: 'checking' } : result;
      }));
      
      // Process batch
      const promises = batch.map(site => checkUsername(username, site));
      
      try {
        const batchResults = await Promise.all(promises);
        
        setResults(prev => {
          const updated = prev.map(result => {
            const updatedResult = batchResults.find(r => r.site.name === result.site.name);
            return updatedResult || result;
          });
          updateSearchStats(updated);
          return updated;
        });
        
        processedCount += batch.length;
      } catch (error) {
        console.error('Batch check error:', error);
      }
      
      // Small delay between batches to prevent overwhelming
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsSearching(false);
  };

  const getStatusIcon = (status: CheckResult['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />;
      case 'checking':
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'found':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'not_found':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: CheckResult['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'checking':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'found':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'not_found':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'error':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
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
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Search Header */}
      <div className="relative">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Search className="h-6 w-6 text-white" />
              </div>
              Username Checker Pro
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Discover your digital footprint across 500+ platforms instantly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Input */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="Enter username to check..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-12 text-lg pl-12 pr-4 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                <Button 
                  onClick={handleSearch} 
                  disabled={!username.trim() || isSearching}
                  className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
                >
                  {isSearching ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-5 w-5 mr-2" />
                  )}
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <History className="h-4 w-4" />
                  Recent:
                </span>
                {searchHistory.slice(0, 5).map((term, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setUsername(term)}
                    className="text-xs bg-white/50 border-gray-200 hover:bg-white"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            )}

            {/* Stats and Progress */}
            {username && results.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-700">
                      Searching {filteredSites.length} platforms for: <strong>{username}</strong>
                    </span>
                  </div>
                  {foundResults.length > 0 && (
                    <Button
                      onClick={exportResults}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white/60 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-blue-600">{searchStats.completed}</div>
                    <div className="text-sm text-gray-500">Checked</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-green-600">{searchStats.found}</div>
                    <div className="text-sm text-gray-500">Found</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-red-600">{searchStats.notFound}</div>
                    <div className="text-sm text-gray-500">Not Found</div>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-yellow-600">{searchStats.errors}</div>
                    <div className="text-sm text-gray-500">Errors</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {Math.round(progress)}%</span>
                    <span>{searchStats.avgResponseTime.toFixed(0)}ms avg</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Search Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  All ({allResults.length})
                </TabsTrigger>
                <TabsTrigger value="found" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Found ({foundResults.length})
                </TabsTrigger>
                <TabsTrigger value="not_found" className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Not Found ({notFoundResults.length})
                </TabsTrigger>
                <TabsTrigger value="errors" className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Errors ({errorResults.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-2 max-h-96 overflow-y-auto">
                {allResults.map((result, index) => (
                  <ResultCard key={index} result={result} />
                ))}
              </TabsContent>
              
              <TabsContent value="found" className="space-y-2 max-h-96 overflow-y-auto">
                {foundResults.map((result, index) => (
                  <ResultCard key={index} result={result} />
                ))}
              </TabsContent>
              
              <TabsContent value="not_found" className="space-y-2 max-h-96 overflow-y-auto">
                {notFoundResults.map((result, index) => (
                  <ResultCard key={index} result={result} />
                ))}
              </TabsContent>
              
              <TabsContent value="errors" className="space-y-2 max-h-96 overflow-y-auto">
                {errorResults.map((result, index) => (
                  <ResultCard key={index} result={result} />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {results.length === 0 && !isSearching && (
        <Card className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100">
          <CardContent className="space-y-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
              <Search className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Ready to Search</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Enter a username above to check its availability across 500+ social media platforms and websites.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ResultCard({ result }: { result: CheckResult }) {
  const categoryIcon = CATEGORY_ICONS[result.site.cat] || CATEGORY_ICONS.all;
  const categoryColor = CATEGORY_COLORS[result.site.cat] || CATEGORY_COLORS.all;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {getStatusIcon(result.status)}
          <div className="flex items-center gap-2">
            {categoryIcon}
            <span className="font-medium text-gray-800">{result.site.name}</span>
          </div>
        </div>
        <Badge className={`${categoryColor} text-xs`}>
          {result.site.cat}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={`${getStatusColor(result.status)} border`}>
          {result.status.replace('_', ' ')}
        </Badge>
        {result.responseTime && (
          <span className="text-xs text-gray-500">
            {result.responseTime}ms
          </span>
        )}
        {result.status === 'found' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(result.url, '_blank')}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function getStatusIcon(status: CheckResult['status']) {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-gray-400" />;
    case 'checking':
      return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    case 'found':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'not_found':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
  }
}

function getStatusColor(status: CheckResult['status']) {
  switch (status) {
    case 'pending':
      return 'bg-gray-100 text-gray-600 border-gray-200';
    case 'checking':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'found':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'not_found':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'error':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  }
}