import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { getSearchSuggestion } from "../api/animeApi";
import BouncingLoader from "./Loader";
import { FaChevronRight } from "react-icons/fa";

function Suggestion({ keyword, className }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!keyword) {
        setSuggestions([]);
        setHasFetched(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setHasFetched(false);

      try {
        const results = await getSearchSuggestion(keyword);
        setSuggestions(results || []);
        setHasFetched(true);
      } catch (err) {
        console.error("Error fetching search suggestion info", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [keyword]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-7">
          <BouncingLoader />
        </div>
      );
    }

    if (error) {
      return <p className="text-center py-7">Error fetching suggestions!</p>;
    }

    if (hasFetched && suggestions.length > 0) {
      return (
        <div className="w-full flex flex-col pt-2 overflow-y-auto">
          {suggestions.map((anime) => (
            <Link
              key={anime.id}
              to={`/${anime.id}`}
              className="group py-2 flex items-start gap-x-3 hover:bg-[#3c3a5e] cursor-pointer px-[10px]"
              style={{ borderBottom: "1px dashed rgba(255, 255, 255, .075)" }}
            >
              <img
                src={anime.poster}
                className="w-[50px] h-[75px] flex-shrink-0 object-cover"
                alt={anime.title}
                onError={(e) => {
                  e.target.src = "https://i.postimg.cc/HnHKvHpz/no-avatar.jpg";
                }}
              />
              <div className="flex flex-col gap-y-[2px]">
                <h1 className="line-clamp-1 leading-5 font-bold text-[15px] group-hover:text-[#ffbade]">
                  {anime.title || "N/A"}
                </h1>
                <h1 className="line-clamp-1 leading-5 text-[13px] font-light text-[#aaaaaa]">
                  {anime.japanese_title || "N/A"}
                </h1>
                <div className="flex gap-x-[5px] items-center w-full justify-start mt-[4px]">
                  <p className="text-[13px]">{anime.showType || "N/A"}</p>
                  <span className="dot" />
                  <p className="leading-5 text-[13px] font-light text-[#aaaaaa]">
                    {anime.releaseDate || "N/A"}
                  </p>
                  <span className="dot" />
                  <p className="text-[13px]">{anime.duration || "N/A"}</p>
                </div>
              </div>
            </Link>
          ))}
          <Link
            className="w-full flex py-4 justify-center items-center bg-[#ffbade]"
            to={`/search?keyword=${encodeURIComponent(keyword)}`}
          >
            <div className="flex w-fit items-center gap-x-2">
              <p className="text-[17px] font-light text-black">
                View all results
              </p>
              <FaChevronRight className="text-black text-[12px] font-black mt-[2px]" />
            </div>
          </Link>
        </div>
      );
    }

    if (hasFetched) {
      return <p className="text-center py-7">No results found!</p>;
    }

    return null;
  };

  return (
    <div
      className={`absolute z-[100000] top-full w-full bg-[#2d2b44] rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
        isLoading || (hasFetched && keyword)
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      } ${className}`}
      style={{ boxShadow: "0 20px 20px rgba(0, 0, 0, .3)" }}
    >
      {renderContent()}
    </div>
  );
}

Suggestion.propTypes = {
  keyword: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Suggestion;
