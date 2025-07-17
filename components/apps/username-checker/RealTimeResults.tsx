'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  Zap,
  TrendingUp,
  Eye,
  Signal
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

interface RealTimeResultsProps {
  results: CheckResult[];
  isSearching: boolean;
  onResultClick: (result: CheckResult) => void;
}

export default function RealTimeResults({ results, isSearching, onResultClick }: RealTimeResultsProps) {
  const [visibleResults, setVisibleResults] = useState<CheckResult[]>([]);
  const [latestResults, setLatestResults] = useState<CheckResult[]>([]);

  useEffect(() => {
    // Show results as they come in
    const completedResults = results.filter(r => r.status !== 'pending');
    const sortedResults = completedResults.sort((a, b) => {
      if (a.status === 'found' && b.status !== 'found') return -1;
      if (a.status !== 'found' && b.status === 'found') return 1;
      return (b.timestamp || 0) - (a.timestamp || 0);
    });
    
    setVisibleResults(sortedResults.slice(0, 20)); // Show top 20 results
    
    // Track latest 5 results for animation
    const recentResults = sortedResults.slice(0, 5);
    setLatestResults(recentResults);
  }, [results]);

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
        return 'bg-blue-100 text-blue-700 border-blue-200 animate-pulse';
      case 'found':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'not_found':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'error':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social':
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      case 'gaming':
        return <div className="w-2 h-2 bg-purple-500 rounded-full"></div>;
      case 'tech':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'business':
        return <div className="w-2 h-2 bg-orange-500 rounded-full"></div>;
      case 'dating':
        return <div className="w-2 h-2 bg-pink-500 rounded-full"></div>;
      case 'music':
        return <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>;
      case 'video':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      case 'coding':
        return <div className="w-2 h-2 bg-teal-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  const checkingResults = results.filter(r => r.status === 'checking');
  const foundResults = results.filter(r => r.status === 'found');

  return (
    <div className="space-y-4">
      {/* Live Activity Feed */}
      {isSearching && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Signal className="h-5 w-5 text-blue-600 animate-pulse" />
              <span className="font-semibold text-blue-800">Live Search Activity</span>
            </div>
            
            {/* Currently Checking */}
            {checkingResults.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm text-blue-700 mb-2">
                  Currently checking {checkingResults.length} platform{checkingResults.length > 1 ? 's' : ''}...
                </div>
                <div className="flex flex-wrap gap-2">
                  {checkingResults.slice(0, 10).map((result, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 bg-white/70 rounded-full border border-blue-200 text-sm animate-pulse"
                    >
                      <div className="h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-blue-700">{result.site.name}</span>
                    </div>
                  ))}
                  {checkingResults.length > 10 && (
                    <div className="px-3 py-1 bg-white/70 rounded-full border border-blue-200 text-sm text-blue-700">
                      +{checkingResults.length - 10} more...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Latest Results */}
            {latestResults.length > 0 && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="text-sm text-blue-700 mb-2">Latest results:</div>
                <div className="space-y-2">
                  {latestResults.map((result, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 bg-white/70 rounded-lg border border-blue-200 animate-in slide-in-from-right duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(result.site.cat)}
                          <span className="font-medium text-gray-800">{result.site.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(result.status)} text-xs`}>
                          {result.status.replace('_', ' ')}
                        </Badge>
                        {result.status === 'found' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(result.url, '_blank')}
                            className="h-6 w-6 p-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Found Results Highlight */}
      {foundResults.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">
                Found on {foundResults.length} platform{foundResults.length > 1 ? 's' : ''}!
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {foundResults.slice(0, 6).map((result, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-green-200 hover:bg-white/90 transition-colors cursor-pointer group"
                  onClick={() => onResultClick(result)}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-800">{result.site.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{result.site.cat}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.responseTime && (
                      <span className="text-xs text-gray-500">
                        {result.responseTime}ms
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(result.url, '_blank');
                      }}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {foundResults.length > 6 && (
              <div className="mt-3 text-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-green-700 border-green-300 hover:bg-green-100"
                  onClick={() => onResultClick(foundResults[0])} // Scroll to results
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View all {foundResults.length} results
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Real-time Results Stream */}
      {visibleResults.length > 0 && (
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-gray-800">Real-time Results</span>
              <Badge variant="outline" className="text-xs">
                {visibleResults.length} shown
              </Badge>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {visibleResults.map((result, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer animate-in slide-in-from-left duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => onResultClick(result)}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(result.site.cat)}
                      <span className="font-medium text-gray-800">{result.site.name}</span>
                    </div>
                    <Badge className={`${getStatusColor(result.status)} text-xs`}>
                      {result.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.responseTime && (
                      <span className="text-xs text-gray-500">
                        {result.responseTime}ms
                      </span>
                    )}
                    {result.status === 'found' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(result.url, '_blank');
                        }}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}