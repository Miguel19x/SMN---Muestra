import React, { useRef, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import debounce from 'lodash/debounce';
import type { SearchBarProps } from '../type/types'
import { useLanguage } from '../additionals/scripts/i18n';

const SearchBar: React.FC<SearchBarProps> = ({ initialSearchTerm, onSearchTermChange, focusSearchInput }) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { translate } = useLanguage();

  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      onSearchTermChange(value);
    }, 300),
    [onSearchTermChange]
  );

  useEffect(() => {
    if (focusSearchInput && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [focusSearchInput, debouncedSetSearchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value);
  };

  return (
    <Input
      ref={searchInputRef}
      id="search-input"
      name="search"
      type="text"
      placeholder={translate('Component-3')}
      aria-label={translate('Component-3')}
      defaultValue={initialSearchTerm}
      onChange={handleInputChange}
      className="flex-grow"
    />
  );
};

export default React.memo(SearchBar);