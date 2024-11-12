import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { generateBrief, getProjectTypes } from '../../services/api';
import BriefDisplay from './BriefDisplay';

// Map the display ranges to actual difficulty values
const DIFFICULTY_RANGES = {
    'Beginner (1-2)': 2,
    'Novice (3-4)': 4,
    'Intermediate (5-6)': 6,
    'Advanced (7-8)': 8,
    'Expert (9-10)': 10
};

const BriefGenerator = () => {
    const [formData, setFormData] = useState({
        difficulty: '',
        language: '',
        projectType: '',
        useTrends: true
    });
    
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [brief, setBrief] = useState(null);
    const [availableProjectTypes, setAvailableProjectTypes] = useState([]);

    // Load saved brief from localStorage
    React.useEffect(() => {
        const savedBrief = localStorage.getItem('lastGeneratedBrief');
        if (savedBrief) {
        try {
            setBrief(JSON.parse(savedBrief));
        } catch (e) {
            console.error('Error loading saved brief:', e);
        }
        }
    }, []);

    const handleDifficultyChange = async (e) => {
        const difficulty = e.target.value;
        setFormData(prev => ({ ...prev, difficulty, projectType: '' }));
        setError('');
        
        if (difficulty) {
        try {
            // Get the numeric difficulty value from the selected range
            const difficultyValue = DIFFICULTY_RANGES[difficulty];
            const projectTypes = await getProjectTypes(difficultyValue);
            setAvailableProjectTypes(projectTypes);
        } catch (err) {
            console.error('Error fetching project types:', err);
            // Don't show error until user actually tries to submit
        }
        } else {
        setAvailableProjectTypes([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.difficulty || !formData.language || !formData.projectType) {
        setError('Please fill in all required fields');
        return;
        }

        setIsLoading(true);
        try {
        const difficultyValue = DIFFICULTY_RANGES[formData.difficulty];
        const response = await generateBrief({
            difficulty: difficultyValue,
            language: formData.language,
            project_type: formData.projectType,
            use_trends: formData.useTrends
        });
        
        // Save to localStorage
        localStorage.setItem('lastGeneratedBrief', JSON.stringify(response));
        
        setBrief(response);
        } catch (err) {
        setError(err.message || 'Failed to generate brief');
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
        <Card>
            <CardHeader>
            <CardTitle>Project Brief Generator</CardTitle>
            <CardDescription>Generate a customized project brief based on your preferences</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                )}
                
                {/* Difficulty Level Selection */}
                <div className="space-y-2">
                <label className="block text-sm font-medium">
                    Difficulty Level
                </label>
                <select
                    value={formData.difficulty}
                    onChange={handleDifficultyChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                    <option value="">Select difficulty...</option>
                    {Object.keys(DIFFICULTY_RANGES).map((level) => (
                    <option key={level} value={level}>{level}</option>
                    ))}
                </select>
                </div>

                {/* Programming Language Input */}
                <div className="space-y-2">
                <label className="block text-sm font-medium">
                    Programming Language
                </label>
                <input
                    type="text"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    placeholder="e.g., Python, JavaScript, Java"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
                </div>

                {/* Project Type Selection */}
                <div className="space-y-2">
                <label className="block text-sm font-medium">
                    Project Type
                </label>
                <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    disabled={!formData.difficulty}
                >
                    <option value="">Select project type...</option>
                    {availableProjectTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                {!formData.difficulty && (
                    <p className="text-sm text-muted-foreground mt-1">
                    Select a difficulty level first
                    </p>
                )}
                </div>

                {/* Include Trends Toggle */}
                <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="useTrends"
                    checked={formData.useTrends}
                    onChange={(e) => setFormData({ ...formData, useTrends: e.target.checked })}
                    className="h-4 w-4 rounded border-input"
                />
                <label htmlFor="useTrends" className="text-sm font-medium">
                    Include Trending Topics
                </label>
                </div>

                {/* Submit Button */}
                <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {isLoading ? (
                    <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Generating...
                    </>
                ) : (
                    'Generate Brief'
                )}
                </button>
            </form>
            </CardContent>
        </Card>

        {brief && <BriefDisplay brief={brief} />}
        </div>
    );
};

export default BriefGenerator;