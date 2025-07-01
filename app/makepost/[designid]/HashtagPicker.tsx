'use client'

import React, { useState, useEffect } from 'react';
import styles from './makepost.module.css';

interface HashtagOption {
  label: string;
  value: string;
}

interface HashtagPickerProps {
  defaultTag: HashtagOption;
  suggestions: HashtagOption[];
  onChange: (tags: string[]) => void;
}

const HashtagPicker: React.FC<HashtagPickerProps> = ({ defaultTag, suggestions, onChange }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([defaultTag.value]);
  const [customInput, setCustomInput] = useState<string>('');

  // Initialize with default tag
  useEffect(() => {
    setSelectedTags([defaultTag.value]);
    onChange([defaultTag.value]);
  }, [defaultTag.value, onChange]);

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag) && selectedTags.length < 5) {
      const newTags = [...selectedTags, trimmedTag];
      setSelectedTags(newTags);
      onChange(newTags);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    // Don't allow removing the default tag
    if (tagToRemove === defaultTag.value) return;
    
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(newTags);
    onChange(newTags);
  };

  const handleCustomInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(customInput);
      setCustomInput('');
    }
  };

  const handleSuggestionClick = (suggestion: HashtagOption) => {
    handleAddTag(suggestion.value);
  };

  // Filter out already selected suggestions
  const availableSuggestions = suggestions.filter(suggestion => 
    !selectedTags.includes(suggestion.value)
  );

  // Helper function to get display name for a tag
  const getDisplayName = (tagValue: string) => {
    const suggestion = suggestions.find(s => s.value === tagValue);
    return suggestion ? suggestion.label : tagValue;
  };

  return (
    <div className={styles.hashtagPicker}>
      <label htmlFor="hashtags">Hashtags</label>
      
      {/* Custom input field */}


      {/* Selected hashtags display */}
      <div className={styles.selectedTags}>
        {selectedTags.map((tag, index) => (
          <span 
            key={index} 
            className={`${styles.hashtagChip} ${tag === defaultTag.value ? styles.defaultTag : ''}`}
            title={tag} // Show full value on hover
          >
            #{getDisplayName(tag)}
            {tag !== defaultTag.value && (
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className={styles.removeTag}
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>

      {/* Suggestions */}
      {availableSuggestions.length > 0 && (
        <div className={styles.suggestions}>
          <small>Popular hashtags:</small>
          <div className={styles.suggestionTags}>
            {availableSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={styles.suggestionTag}
                disabled={selectedTags.length >= 5}
                title={suggestion.value} // Show full value on hover
              >
                #{suggestion.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HashtagPicker; 