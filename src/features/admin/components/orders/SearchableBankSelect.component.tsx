'use client';

import { useState, useRef, useEffect } from 'react';
import { Bank, VENEZUELAN_BANKS } from '@/features/admin/constants/banks.constants';
import styles from '@/features/admin/styles/SearchableBankSelect.module.css';

interface SearchableBankSelectProps {
  value: string;
  onChange: (bankId: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function SearchableBankSelect({
  value,
  onChange,
  placeholder = 'Buscar banco...',
  required = false,
}: SearchableBankSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedBank = VENEZUELAN_BANKS.find(bank => bank.id === value);

  const filteredBanks = VENEZUELAN_BANKS.filter(bank =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bank.id.includes(searchQuery)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setFocusedIndex(0);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && listRef.current && focusedIndex >= 0) {
      const items = listRef.current.children;
      if (items[focusedIndex]) {
        items[focusedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [focusedIndex, isOpen]);

  const handleSelect = (bank: Bank) => {
    onChange(bank.id);
    setIsOpen(false);
    setSearchQuery('');
    setFocusedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => Math.min(prev + 1, filteredBanks.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredBanks[focusedIndex]) {
      e.preventDefault();
      handleSelect(filteredBanks[focusedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
      setFocusedIndex(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setFocusedIndex(0);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery('');
      setFocusedIndex(0);
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div
        className={styles.select}
        onClick={handleToggle}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={selectedBank ? styles.selectedValue : styles.placeholder}>
          {selectedBank ? selectedBank.name : placeholder}
        </span>
        <span className={`material-symbols-outlined ${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}>
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.searchContainer}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
            <input
              ref={inputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Buscar banco..."
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className={styles.list} ref={listRef} role="listbox">
            {filteredBanks.length === 0 ? (
              <div className={styles.noResults}>No se encontraron bancos</div>
            ) : (
              filteredBanks.map((bank, index) => (
                <div
                  key={bank.id}
                  className={`${styles.option} ${value === bank.id ? styles.optionSelected : ''} ${index === focusedIndex ? styles.optionFocused : ''}`}
                  onClick={() => handleSelect(bank)}
                  role="option"
                  aria-selected={value === bank.id}
                >
                  <span className={styles.optionName}>{bank.name}</span>
                  <span className={styles.optionId}>{bank.id}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

