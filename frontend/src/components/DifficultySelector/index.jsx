import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const DifficultySelector = ({ 
  difficulties, 
  selectedDifficulty, 
  specificDifficulty,
  onDifficultyChange,
  onSpecificDifficultyChange 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Object.entries(difficulties).map(([level, { color, description, min, max }]) => (
        <Card
          key={level}
          className={`relative p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
            selectedDifficulty === level
              ? 'border-2 border-primary shadow-md'
              : 'border hover:border-primary/50'
          }`}
          onClick={() => onDifficultyChange(level)}
        >
          {/* Selected indicator */}
          {selectedDifficulty === level && (
            <div className="absolute top-4 right-4">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
          )}

          {/* Card content */}
          <div className="space-y-4">
            <div className="space-y-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                {level}
              </span>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            {/* Specific difficulty slider for selected card */}
            {selectedDifficulty === level && (
              <div className="pt-4 border-t">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Specific Level ({min}-{max}):
                </label>
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={specificDifficulty}
                  onChange={(e) => onSpecificDifficultyChange(e.target.value)}
                  className="w-full accent-primary"
                />
                <div className="text-sm text-primary font-medium text-center mt-2">
                  Level {specificDifficulty}
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DifficultySelector;