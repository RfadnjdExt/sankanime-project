import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { useSearch } from "../context/SearchContext";
import Suggestion from "./Suggestion";

const MobileSearch = () => {
  const {
    isSearchVisible,
    searchValue,
    setSearchValue,
    isFocused,
    setIsFocused,
    debouncedValue,
    addSuggestionRef,
  } = useSearch();

  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  if (!isSearchVisible) {
    return null;
  }

  return (
    <div className="flex w-full mt-2 relative custom-md:hidden">
      <input
        type="text"
        className="bg-white px-4 py-2 text-black focus:outline-none w-full rounded-l-md"
        placeholder="Search anime..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
      />
      <button
        className="flex items-center justify-center p-2 bg-white rounded-r-md"
        onClick={handleSearch}
        aria-label="Search"
      >
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="text-black text-lg"
        />
      </button>

      {searchValue.trim() && isFocused && (
        <div
          ref={addSuggestionRef}
          className="absolute z-[100000] top-full w-full"
        >
          <Suggestion keyword={debouncedValue} className="w-full" />
        </div>
      )}
    </div>
  );
};

export default MobileSearch;
