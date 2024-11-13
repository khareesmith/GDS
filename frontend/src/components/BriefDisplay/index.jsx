import React, { useState } from 'react';
import Markdown from 'markdown-to-jsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Copy, Check, Share, AlertCircle, Tag } from 'lucide-react';

const BriefDisplay = ({ brief }) => {
  const [copied, setCopied] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(brief.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Project Brief',
          text: brief.content,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      }
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([brief.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-brief.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      {/* Share Toast */}
      {showShareToast && (
        <div className="absolute top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <Alert className="bg-primary text-primary-foreground">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Link copied to clipboard!</AlertDescription>
          </Alert>
        </div>
      )}

      <Card className="border-2 border-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">Generated Brief</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your customized project brief is ready
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              <Share className="h-4 w-4 mr-2" />
              Share
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {brief.trending_topics && brief.trending_topics.length > 0 && (
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Trending Topics Used</h3>
              </div>
              <div className="flex flex-wrap gap-2 animate-in slide-in-from-right-1 duration-700 delay-300">
                {brief.trending_topics.map((topic, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20 transition-all duration-200 hover:scale-105 cursor-default"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="prose prose-primary prose-headings:font-bold prose-headings:text-primary prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-pre:bg-muted prose-pre:text-muted-foreground max-w-none">
            <Markdown
              options={{
                overrides: {
                  h1: {
                    component: ({ children, ...props }) => (
                      <h1 {...props} className="text-3xl font-bold text-primary mb-4">
                        {children}
                      </h1>
                    ),
                  },
                  h2: {
                    component: ({ children, ...props }) => (
                      <h2 {...props} className="text-2xl font-semibold text-primary mt-6 mb-4">
                        {children}
                      </h2>
                    ),
                  },
                  h3: {
                    component: ({ children, ...props }) => (
                      <h3 {...props} className="text-xl font-semibold text-primary mt-4 mb-2">
                        {children}
                      </h3>
                    ),
                  },
                  p: {
                    component: ({ children, ...props }) => (
                      <p {...props} className="mb-4 leading-relaxed">
                        {children}
                      </p>
                    ),
                  },
                  ul: {
                    component: ({ children, ...props }) => (
                      <ul {...props} className="list-disc pl-6 mb-4 space-y-2">
                        {children}
                      </ul>
                    ),
                  },
                  li: {
                    component: ({ children, ...props }) => (
                      <li {...props} className="text-muted-foreground">
                        {children}
                      </li>
                    ),
                  },
                  code: {
                    component: ({ children, ...props }) => (
                      <code {...props} className="rounded bg-muted px-1 py-0.5 text-sm font-mono">
                        {children}
                      </code>
                    ),
                  },
                },
              }}
            >
              {brief.content}
            </Markdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BriefDisplay;