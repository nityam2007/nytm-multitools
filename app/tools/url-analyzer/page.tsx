// URL Analyzer Tool | TypeScript
'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { getToolBySlug, getToolsByCategory } from '@/lib/tools-config';

interface UrlParts {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  username: string;
  password: string;
  origin: string;
  host: string;
}

interface QueryParam {
  key: string;
  value: string;
}

interface UrlAnalysis {
  isValid: boolean;
  parts: UrlParts | null;
  queryParams: QueryParam[];
  pathSegments: string[];
  isSecure: boolean;
  hasAuth: boolean;
  hasPort: boolean;
  hasQuery: boolean;
  hasFragment: boolean;
  domain: string;
  subdomain: string;
  tld: string;
  encodedUrl: string;
}

export default function UrlAnalyzerPage() {
  const tool = getToolBySlug('url-analyzer');
  const similarTools = getToolsByCategory('network').filter(t => t.slug !== 'url-analyzer').slice(0, 4);

  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<UrlAnalysis | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const analyzeUrl = () => {
    setError('');
    setAnalysis(null);

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    let urlToAnalyze = url.trim();
    
    // Add protocol if missing for parsing
    if (!urlToAnalyze.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//)) {
      urlToAnalyze = 'https://' + urlToAnalyze;
    }

    try {
      const parsed = new URL(urlToAnalyze);
      
      // Parse query parameters
      const queryParams: QueryParam[] = [];
      parsed.searchParams.forEach((value, key) => {
        queryParams.push({ key, value });
      });

      // Parse path segments
      const pathSegments = parsed.pathname.split('/').filter(segment => segment.length > 0);

      // Parse domain parts
      const hostParts = parsed.hostname.split('.');
      let tld = '';
      let domain = '';
      let subdomain = '';
      
      if (hostParts.length >= 2) {
        // Handle common compound TLDs
        const compoundTlds = ['co.uk', 'com.au', 'co.nz', 'co.jp', 'com.br', 'co.in', 'org.uk', 'net.au'];
        const lastTwo = hostParts.slice(-2).join('.');
        
        if (compoundTlds.includes(lastTwo) && hostParts.length >= 3) {
          tld = lastTwo;
          domain = hostParts[hostParts.length - 3];
          subdomain = hostParts.slice(0, -3).join('.');
        } else {
          tld = hostParts[hostParts.length - 1];
          domain = hostParts[hostParts.length - 2];
          subdomain = hostParts.slice(0, -2).join('.');
        }
      } else if (hostParts.length === 1) {
        domain = hostParts[0];
      }

      const parts: UrlParts = {
        protocol: parsed.protocol.replace(':', ''),
        hostname: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
        username: parsed.username,
        password: parsed.password,
        origin: parsed.origin,
        host: parsed.host,
      };

      setAnalysis({
        isValid: true,
        parts,
        queryParams,
        pathSegments,
        isSecure: parsed.protocol === 'https:',
        hasAuth: Boolean(parsed.username || parsed.password),
        hasPort: Boolean(parsed.port),
        hasQuery: queryParams.length > 0,
        hasFragment: Boolean(parsed.hash),
        domain,
        subdomain,
        tld,
        encodedUrl: encodeURI(urlToAnalyze),
      });
    } catch {
      setError('Invalid URL format');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      analyzeUrl();
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const loadExample = () => {
    setUrl('https://user:pass@subdomain.example.com:8080/path/to/page?param1=value1&param2=value2#section');
    setAnalysis(null);
    setError('');
  };

  if (!tool) return null;

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Input Section */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Enter URL to Analyze
            </label>
            <button
              onClick={loadExample}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Load Example
            </button>
          </div>
          
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com/path?query=value#hash"
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={analyzeUrl}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Analyze
            </button>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-4">
            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                analysis.isSecure 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
              }`}>
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {analysis.isSecure ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  )}
                </svg>
                {analysis.isSecure ? 'Secure (HTTPS)' : 'Not Secure (HTTP)'}
              </span>
              
              {analysis.hasAuth && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Contains Credentials
                </span>
              )}
              
              {analysis.hasPort && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                  Custom Port: {analysis.parts?.port}
                </span>
              )}
              
              {analysis.hasQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400">
                  {analysis.queryParams.length} Query Param{analysis.queryParams.length !== 1 ? 's' : ''}
                </span>
              )}
              
              {analysis.hasFragment && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400">
                  Has Fragment
                </span>
              )}
            </div>

            {/* URL Parts */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">URL Components</h3>
              
              <div className="space-y-3">
                {analysis.parts && Object.entries(analysis.parts).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex items-start gap-4 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <span className="w-28 flex-shrink-0 text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <code className="flex-1 text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-[#2A2A2A] px-3 py-1.5 rounded break-all">
                        {value}
                      </code>
                      <button
                        onClick={() => copyToClipboard(value, key)}
                        className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="Copy"
                      >
                        {copied === key ? (
                          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Domain Analysis */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Domain Analysis</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {analysis.subdomain && (
                  <div className="p-4 bg-gray-50 dark:bg-[#2A2A2A] rounded-lg">
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Subdomain</span>
                    <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{analysis.subdomain}</span>
                  </div>
                )}
                <div className="p-4 bg-gray-50 dark:bg-[#2A2A2A] rounded-lg">
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Domain</span>
                  <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{analysis.domain || '-'}</span>
                </div>
                {analysis.tld && (
                  <div className="p-4 bg-gray-50 dark:bg-[#2A2A2A] rounded-lg">
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">TLD</span>
                    <span className="text-lg font-medium text-gray-900 dark:text-gray-100">.{analysis.tld}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Path Segments */}
            {analysis.pathSegments.length > 0 && (
              <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Path Segments</h3>
                
                <div className="flex flex-wrap gap-2">
                  {analysis.pathSegments.map((segment, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-gray-400">/</span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-[#2A2A2A] text-gray-900 dark:text-gray-100 rounded text-sm">
                        {decodeURIComponent(segment)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Query Parameters */}
            {analysis.queryParams.length > 0 && (
              <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Query Parameters</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">Key</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">Value</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">Decoded Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.queryParams.map((param, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                          <td className="py-2 px-3">
                            <code className="text-blue-600 dark:text-blue-400">{param.key}</code>
                          </td>
                          <td className="py-2 px-3">
                            <code className="text-gray-600 dark:text-gray-300 break-all">{param.value}</code>
                          </td>
                          <td className="py-2 px-3">
                            <code className="text-gray-900 dark:text-gray-100 break-all">
                              {decodeURIComponent(param.value)}
                            </code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Encoded URL */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Encoded URL</h3>
                <button
                  onClick={() => copyToClipboard(analysis.encodedUrl, 'encoded')}
                  className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {copied === 'encoded' ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <code className="block text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#2A2A2A] p-4 rounded-lg break-all">
                {analysis.encodedUrl}
              </code>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">About URL Structure</h3>
          <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
            <p>
              A URL (Uniform Resource Locator) consists of several components that identify resources on the web.
            </p>
            <div className="bg-white dark:bg-[#1E1E1E] rounded-lg p-4 overflow-x-auto">
              <code className="text-xs text-gray-600 dark:text-gray-300">
                <span className="text-green-600 dark:text-green-400">protocol</span>://
                <span className="text-red-600 dark:text-red-400">user:pass</span>@
                <span className="text-blue-600 dark:text-blue-400">subdomain.domain.tld</span>:
                <span className="text-yellow-600 dark:text-yellow-400">port</span>
                <span className="text-purple-600 dark:text-purple-400">/path</span>
                <span className="text-orange-600 dark:text-orange-400">?query</span>
                <span className="text-pink-600 dark:text-pink-400">#fragment</span>
              </code>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <li><strong>Protocol:</strong> http, https, ftp, mailto, etc.</li>
              <li><strong>Auth:</strong> Optional username:password</li>
              <li><strong>Host:</strong> Domain name or IP address</li>
              <li><strong>Port:</strong> Optional (default: 80/443)</li>
              <li><strong>Path:</strong> Resource location on server</li>
              <li><strong>Query:</strong> Key-value parameters</li>
              <li><strong>Fragment:</strong> Section within the page</li>
              <li><strong>Origin:</strong> Protocol + host + port</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
