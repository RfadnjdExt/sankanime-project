import {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import PropTypes from "prop-types";

export const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [isFocused, setIsFocused] = useState(false);

  const [debouncedValue, setDebouncedValue] = useState("");

  const suggestionRefs = useRef([]);

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
      if (
        suggestionRefs.current.every(
          (ref) => ref && !ref.contains(event.target)
        )
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addSuggestionRef = useCallback((node) => {
    if (node && !suggestionRefs.current.includes(node)) {
      suggestionRefs.current.push(node);
    }
  }, []);

  const value = {
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

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
