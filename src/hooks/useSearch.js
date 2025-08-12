import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";

export const useSearch = () => {
  const { isSearchVisible, setIsSearchVisible } = useContext(SearchContext);

  const [searchValue, setSearchValue] = useState("");

  const [debouncedValue, setDebouncedValue] = useState("");

  const [isFocused, setIsFocused] = useState(false);

  const suggestionRefs = useRef([]);

  const location = useLocation();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInside = suggestionRefs.current.some(
        (ref) => ref && ref.contains(event.target)
      );

      if (!isClickInside && document.activeElement !== event.target) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsSearchVisible(false);
    setSearchValue("");
    setDebouncedValue("");
  }, [location, setIsSearchVisible]);

  const addSuggestionRef = useCallback((el) => {
    if (el && !suggestionRefs.current.includes(el)) {
      suggestionRefs.current.push(el);
    }
  }, []);

  return {
    isSearchVisible,
    setIsSearchVisible,
    searchValue,
    setSearchValue,
    isFocused,
    setIsFocused,
    debouncedValue,
    suggestionRefs,
    addSuggestionRef,
  };
};
