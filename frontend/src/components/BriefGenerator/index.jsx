import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Code, Brain, Tag, Sparkles } from 'lucide-react';
import { generateBrief, getProjectTypes } from '@/services/api';
import BriefDisplay from '../BriefDisplay';
import DifficultySelector from '../DifficultySelector';

const DIFFICULTY_RANGES = {
  'Beginner (1-2)': {
    min: 1,
    max: 2,
    color: 'bg-green-100 text-green-800',
    description: 'Perfect for those just starting their coding journey'
  },
  'Novice (3-4)': {
    min: 3,
    max: 4,
    color: 'bg-blue-100 text-blue-800',
    description: 'For developers with basic programming knowledge'
  },
  'Intermediate (5-6)': {
    min: 5,
    max: 6,
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Suitable for those comfortable with programming concepts'
  },
  'Advanced (7-8)': {
    min: 7,
    max: 8,
    color: 'bg-orange-100 text-orange-800',
    description: 'For experienced developers seeking a challenge'
  },
  'Expert (9-10)': {
    min: 9,
    max: 10,
    color: 'bg-red-100 text-red-800',
    description: 'For seasoned developers ready for complex projects'
  }
};

const POPULAR_LANGUAGES = [
  'HTML + CSS', 'JavaScript', 'Python', 'Java', 'TypeScript', 'C#', 
  'PHP', 'Ruby', 'Go', 'Swift', 'Rust', 'C++'
];

const BriefGenerator = () => {
  const [formData, setFormData] = useState({
    difficulty: '',
    specificDifficulty: 1,
    language: '',
    projectType: '',
    useTrends: true
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [brief, setBrief] = useState(null);
  const [availableProjectTypes, setAvailableProjectTypes] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const languageInputRef = React.useRef(null);
  const suggestionsRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        languageInputRef.current && 
        !languageInputRef.current.contains(event.target) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedBrief = localStorage.getItem('lastGeneratedBrief');
    if (savedBrief) {
      try {
        setBrief(JSON.parse(savedBrief));
      } catch (e) {
        console.error('Error loading saved brief:', e);
      }
    }
  }, []);

  const handleDifficultyChange = async (selectedRange) => {
    const range = DIFFICULTY_RANGES[selectedRange];
    const specificDifficulty = formData.difficulty === selectedRange 
      ? formData.specificDifficulty 
      : range.min;
    
    setFormData(prev => ({
      ...prev,
      difficulty: selectedRange,
      specificDifficulty: Math.max(range.min, Math.min(range.max, specificDifficulty)),
      projectType: ''
    }));
    setError('');
    
    try {
      const projectTypes = await getProjectTypes(specificDifficulty);
      setAvailableProjectTypes(projectTypes);
    } catch (err) {
      console.error('Error fetching project types:', err);
    }
  };

  const handleSpecificDifficultyChange = async (value) => {
    const numValue = parseInt(value);
    setFormData(prev => ({
      ...prev,
      specificDifficulty: numValue,
      projectType: ''
    }));

    try {
      const projectTypes = await getProjectTypes(numValue);
      setAvailableProjectTypes(projectTypes);
    } catch (err) {
      console.error('Error fetching project types:', err);
    }
  };

  const handleLanguageClick = (language) => {
    setFormData(prev => ({ ...prev, language }));
    setShowSuggestions(false);
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
      const response = await generateBrief({
        difficulty: formData.specificDifficulty,
        language: formData.language,
        project_type: formData.projectType,
        use_trends: formData.useTrends
      });
      
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
      <Card className="border-2 border-primary/10 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <CardTitle>Project Brief Generator</CardTitle>
          </div>
          <CardDescription className="text-base">
            Generate a customized project brief based on your preferences
          </CardDescription>
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
            <div className="space-y-3">
              <label className="block text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Difficulty Level
              </label>
              <DifficultySelector 
                difficulties={DIFFICULTY_RANGES}
                selectedDifficulty={formData.difficulty}
                specificDifficulty={formData.specificDifficulty}
                onDifficultyChange={handleDifficultyChange}
                onSpecificDifficultyChange={handleSpecificDifficultyChange}
              />
            </div>

            {/* Programming Language Input */}
            <div className="space-y-3">
              <label className="block text-sm font-medium flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                Programming Language
              </label>
              <div className="relative">
                <input
                  ref={languageInputRef}
                  type="text"
                  value={formData.language}
                  onChange={(e) => {
                    setFormData({ ...formData, language: e.target.value });
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="e.g., Python, JavaScript, Java"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
                {showSuggestions && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg"
                  >
                    <div className="p-2 grid grid-cols-2 gap-1 max-h-48 overflow-y-auto">
                      {POPULAR_LANGUAGES
                        .filter(lang => 
                          lang.toLowerCase().includes(formData.language.toLowerCase()) ||
                          !formData.language
                        )
                        .map(lang => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => handleLanguageClick(lang)}
                            className="text-left px-3 py-1 rounded hover:bg-primary/10 text-sm"
                          >
                            {lang}
                          </button>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Project Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
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
                <p className="text-sm text-muted-foreground">
                  Select a difficulty level first
                </p>
              )}
            </div>

            {/* Include Trends Toggle */}
            <div className="flex items-center space-x-3 rounded-lg border p-4 bg-secondary/10">
              <input
                type="checkbox"
                id="useTrends"
                checked={formData.useTrends}
                onChange={(e) => setFormData({ ...formData, useTrends: e.target.checked })}
                className="h-4 w-4 rounded border-input"
              />
              <div className="flex-1">
                <label htmlFor="useTrends" className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  Include Trending Topics
                </label>
                <p className="text-sm text-muted-foreground mt-1">
                  Incorporate current trends into your project brief
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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