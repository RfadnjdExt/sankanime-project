import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { useSearch } from "../hooks/useSearch";
import Suggestion from "./Suggestion";

export const WebSearch = () => {
  const navigate = useNavigate();

  const {
    searchValue,
    setSearchValue,
    isFocused,
    setIsFocused,
    debouncedValue,
    addSuggestionRef,
  } = useSearch();

  const handleSearch = useCallback(() => {
    if (searchValue.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
      setIsFocused(false);
    }
  }, [searchValue, navigate, setIsFocused]);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 100);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className="flex items-center relative w-[380px] max-[600px]:w-fit"
      ref={addSuggestionRef}
    >
      <input
        type="text"
        className="bg-white px-4 py-2 text-black focus:outline-none w-full max-[600px]:hidden"
        placeholder="Search anime..."
        value={searchValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      <button
        className="text-lg text-black hover:text-[#ffbade] max-[600px]:text-white max-[600px]:text-2xl max-[575px]:text-xl max-[600px]:mt-[7px]"
        onClick={handleSearch}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>

      {searchValue && isFocused && (
        <div
          ref={addSuggestionRef}
          className="absolute z-[100000] top-full w-full"
        >
          <Suggestion keyword={debouncedValue} />
        </div>
      )}
    </div>
  );
};
