import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OFFLINE_CLAUSES } from '@/constants';
import { Plus, X, Sparkles, List, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClauseSelectorProps {
  clauses: string[];
  onAddClause: (clause: string) => void;
  onRemoveClause: (index: number) => void;
}

type Mode = 'library' | 'manual';

export const ClauseSelector: React.FC<ClauseSelectorProps> = ({
  clauses,
  onAddClause,
  onRemoveClause,
}) => {
  const [mode, setMode] = useState<Mode>('library');
  const [manualClause, setManualClause] = useState('');

  const handleAddManual = () => {
    if (manualClause.trim()) {
      onAddClause(manualClause.trim());
      setManualClause('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Selected Clauses */}
      {clauses.length > 0 && (
        <div className="bg-card p-6 rounded-xl border border-border shadow-card">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            Selected Clauses ({clauses.length})
          </h3>
          <div className="space-y-2">
            {clauses.map((clause, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg group hover:bg-muted transition-colors"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <p className="flex-1 text-sm text-foreground">{clause}</p>
                <button
                  onClick={() => onRemoveClause(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
        <button
          onClick={() => setMode('library')}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
            mode === 'library'
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <List className="w-4 h-4" />
          Clause Library
        </button>
        <button
          onClick={() => setMode('manual')}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
            mode === 'manual'
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <PenLine className="w-4 h-4" />
          Write Custom
        </button>
      </div>

      {/* Library Mode */}
      {mode === 'library' && (
        <div className="space-y-6 animate-fade-up">
          {Object.entries(OFFLINE_CLAUSES).map(([category, categoryList]) => (
            <div key={category} className="bg-card p-5 rounded-xl border border-border shadow-card">
              <h4 className="text-sm font-semibold text-foreground mb-3">{category}</h4>
              <div className="space-y-2">
                {categoryList.map((clause, index) => (
                  <button
                    key={index}
                    onClick={() => onAddClause(clause)}
                    disabled={clauses.includes(clause)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border text-sm transition-all group flex items-start gap-2",
                      clauses.includes(clause)
                        ? "border-primary/30 bg-primary/5 text-muted-foreground cursor-not-allowed"
                        : "border-border hover:border-primary/50 hover:bg-primary/5 text-foreground"
                    )}
                  >
                    <Plus className={cn(
                      "w-4 h-4 mt-0.5 flex-shrink-0 transition-opacity",
                      clauses.includes(clause) ? "opacity-0" : "opacity-0 group-hover:opacity-100 text-primary"
                    )} />
                    <span>{clause}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Mode */}
      {mode === 'manual' && (
        <div className="bg-card p-6 rounded-xl border border-border shadow-card animate-fade-up">
          <p className="text-sm text-muted-foreground mb-3">
            Type any specific condition or rule you want to include.
          </p>
          <div className="flex gap-3">
            <Input
              value={manualClause}
              onChange={(e) => setManualClause(e.target.value)}
              placeholder="Enter your custom clause..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddManual()}
            />
            <Button onClick={handleAddManual} disabled={!manualClause.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
