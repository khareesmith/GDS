/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Markdown from 'markdown-to-jsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Copy, CheckCheck } from 'lucide-react';

const BriefDisplay = ({ brief }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
        await navigator.clipboard.writeText(brief.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        } catch (err) {
        console.error('Failed to copy:', err);
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
        <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Brief</CardTitle>
            <div className="flex space-x-2">
            <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
                {copied ? (
                <CheckCheck className="h-4 w-4 mr-2" />
                ) : (
                <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
                onClick={handleDownload}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
                <Download className="h-4 w-4 mr-2" />
                Download
            </button>
            </div>
        </CardHeader>
        
        <CardContent>
            {brief.trending_topics && brief.trending_topics.length > 0 && (
            <Alert className="mb-4">
                <AlertDescription>
                <strong>Trending Topics Used:</strong>{' '}
                {brief.trending_topics.join(', ')}
                </AlertDescription>
            </Alert>
            )}
            
            <div className="prose prose-blue max-w-none">
            <Markdown>{brief.content}</Markdown>
            </div>
        </CardContent>
        </Card>
    );
};

export default BriefDisplay;