'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
  status: 'checking' | 'found' | 'not_found' | 'error';
  url: string;
  error?: string;
}

export default function UsernameChecker() {
  const [username, setUsername] = useState('');
  const [sites, setSites] = useState<Site[]>([]);
  const [results, setResults] = useState<CheckResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Load sites data
    fetch('/wmn-data.json')
      .then(res => res.json())
      .then(data => {
        setSites(data.sites);
        setCategories(['all', ...data.categories]);
      })
      .catch(err => console.error('Failed to load sites data:', err));
  }, []);

  const filteredSites = selectedCategory === 'all' 
    ? sites 
    : sites.filter(site => site.cat === selectedCategory);

  const checkUsername = async (username: string, site: Site): Promise<CheckResult> => {
    const url = site.uri_check.replace('{account}', username);
    
    try {
      const response = await fetch(`/api/check-username?url=${encodeURIComponent(url)}&site=${encodeURIComponent(site.name)}`);
      const data = await response.json();
      
      if (data.error) {
        return { site, status: 'error', url, error: data.error };
      }
      
      const status = data.exists ? 'found' : 'not_found';
      return { site, status, url };
    } catch (error) {
      return { site, status: 'error', url, error: 'Network error' };
    }
  };

  const handleSearch = async () => {
    if (!username.trim()) return;
    
    setIsLoading(true);
    setResults([]);
    
    const sitesToCheck = filteredSites.slice(0, 50); // Limit to first 50 sites to avoid overwhelming
    
    // Initialize results with checking status
    const initialResults = sitesToCheck.map(site => ({
      site,
      status: 'checking' as const,
      url: site.uri_check.replace('{account}', username)
    }));
    
    setResults(initialResults);
    
    // Check sites in batches to avoid overwhelming the server
    const batchSize = 10;
    for (let i = 0; i < sitesToCheck.length; i += batchSize) {
      const batch = sitesToCheck.slice(i, i + batchSize);
      const promises = batch.map(site => checkUsername(username, site));
      
      try {
        const batchResults = await Promise.all(promises);
        
        setResults(prev => 
          prev.map(result => {
            const updatedResult = batchResults.find(r => r.site.name === result.site.name);
            return updatedResult || result;
          })
        );
      } catch (error) {
        console.error('Batch check error:', error);
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsLoading(false);
  };

  const getStatusIcon = (status: CheckResult['status']) => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin" />;
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
      case 'checking':
        return 'bg-blue-100 text-blue-800';
      case 'found':
        return 'bg-green-100 text-green-800';
      case 'not_found':
        return 'bg-red-100 text-red-800';
      case 'error':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const foundResults = results.filter(r => r.status === 'found');
  const notFoundResults = results.filter(r => r.status === 'not_found');
  const errorResults = results.filter(r => r.status === 'error');

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Username Checker
          </CardTitle>
          <CardDescription>
            Check if a username exists across multiple social media platforms and websites
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter username to check"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              <Button onClick={handleSearch} disabled={!username.trim() || isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search
              </Button>
            </div>
          </div>

          {username && (
            <div className="text-sm text-gray-600">
              Checking {filteredSites.length} sites for username: <strong>{username}</strong>
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="grid gap-4">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Search Results Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Badge variant="outline" className="text-green-600">
                  Found: {foundResults.length}
                </Badge>
                <Badge variant="outline" className="text-red-600">
                  Not Found: {notFoundResults.length}
                </Badge>
                <Badge variant="outline" className="text-yellow-600">
                  Errors: {errorResults.length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <div className="font-medium">{result.site.name}</div>
                        <div className="text-sm text-gray-500">{result.site.cat}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(result.status)}>
                        {result.status.replace('_', ' ')}
                      </Badge>
                      {result.status === 'found' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(result.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {results.length === 0 && !isLoading && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Enter a username and click search to check its availability across multiple platforms.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}