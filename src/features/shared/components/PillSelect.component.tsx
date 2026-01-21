'use client';

import { useState, useEffect, useMemo } from 'react';
import { PillSelectProps, PillSelectOption } from '../types/pillSelect.type';
import styles from '../styles/PillSelect.module.css';

export function PillSelect({
  options,
  selectedValues,
  onSelectionChange,
  multiple = false,
  searchable = false,
  maxVisible = 5,
  onSearch,
  placeholder = 'Seleccionar...',
  searchPlaceholder = 'Buscar...',
  className = '',
}: PillSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PillSelectOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const visibleOptions = useMemo(() => {
    if (searchable && searchQuery.trim() !== '') {
      return searchResults;
    }
    return options;
  }, [options, searchResults, searchQuery, searchable]);

  const displayedOptions = useMemo(() => {
    if (showAll || visibleOptions.length <= maxVisible) {
      return visibleOptions;
    }
    return visibleOptions.slice(0, maxVisible);
  }, [visibleOptions, maxVisible, showAll]);

  const hasMoreOptions = visibleOptions.length > maxVisible && !showAll;

  useEffect(() => {
    if (searchable && searchQuery.trim() !== '' && onSearch) {
      setIsSearching(true);
      const searchPromise = onSearch(searchQuery);
      
      if (searchPromise instanceof Promise) {
        searchPromise
          .then((results) => {
            setSearchResults(results);
            setIsSearching(false);
          })
          .catch(() => {
            setSearchResults([]);
            setIsSearching(false);
          });
      } else {
        setSearchResults(searchPromise);
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, onSearch, searchable]);

  const handlePillClick = (value: string) => {
    if (multiple) {
      const isSelected = selectedValues.includes(value);
      if (isSelected) {
        onSelectionChange(selectedValues.filter(v => v !== value));
      } else {
        onSelectionChange([...selectedValues, value]);
      }
    } else {
      onSelectionChange([value]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowAll(false);
  };

  const handleShowMore = () => {
    setShowAll(true);
  };

  const handleShowLess = () => {
    setShowAll(false);
  };

  const isSelected = (value: string) => selectedValues.includes(value);

  return (
    <div className={`${styles.container} ${className}`}>
      {searchable && (
        <div className={styles.searchContainer}>
          <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {isSearching && (
            <span className={`material-symbols-outlined ${styles.loadingIcon}`}>hourglass_empty</span>
          )}
        </div>
      )}

      {displayedOptions.length === 0 && !isSearching ? (
        <div className={styles.emptyState}>
          {searchable && searchQuery.trim() !== '' ? 'No se encontraron resultados' : placeholder}
        </div>
      ) : (
        <>
          <div className={styles.pillsContainer}>
            {displayedOptions.map((option) => {
              const selected = isSelected(option.value);
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`${styles.pill} ${selected ? styles.pillSelected : styles.pillUnselected}`}
                  onClick={() => handlePillClick(option.value)}
                  aria-pressed={selected}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {hasMoreOptions && (
            <button
              type="button"
              className={styles.showMoreButton}
              onClick={handleShowMore}
            >
              Ver más ({visibleOptions.length - maxVisible})
            </button>
          )}

          {showAll && visibleOptions.length > maxVisible && (
            <button
              type="button"
              className={styles.showLessButton}
              onClick={handleShowLess}
            >
              Ver menos
            </button>
          )}
        </>
      )}
    </div>
  );
}

