import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faAngleDown,
  faMagnifyingGlass,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const Episodelist = ({
  episodes,
  onEpisodeClick,
  currentEpisode,
  totalEpisodes,
}) => {
  const [activeEpisodeId, setActiveEpisodeId] = useState(currentEpisode);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [episodeRange, setEpisodeRange] = useState([1, 100]);
  const [selectedRangeLabel, setSelectedRangeLabel] = useState("1-100");
  const [searchedEpisode, setSearchedEpisode] = useState(null);

  const episodeContainerRef = useRef(null);
  const activeEpisodeRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (activeEpisodeRef.current && episodeContainerRef.current) {
      const container = episodeContainerRef.current;
      const activeElement = activeEpisodeRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();

      if (
        elementRect.top < containerRect.top ||
        elementRect.bottom > containerRect.bottom
      ) {
        container.scrollTop =
          activeElement.offsetTop -
          container.offsetTop -
          container.clientHeight / 2 +
          activeElement.clientHeight / 2;
      }
    }
  }, [activeEpisodeId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveEpisodeId(currentEpisode);
  }, [currentEpisode]);

  const generateRanges = (total) => {
    const ranges = [];
    for (let i = 0; i < total; i += 100) {
      const start = i + 1;
      const end = Math.min(i + 100, total);
      ranges.push(`${start}-${end}`);
    }
    return ranges;
  };

  const handleRangeChange = (rangeLabel) => {
    const [start, end] = rangeLabel.split("-").map(Number);
    setEpisodeRange([start, end]);
    setSelectedRangeLabel(rangeLabel);
    setIsDropdownOpen(false);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    if (value.trim() === "") {
      setSearchedEpisode(null);
    } else if (!isNaN(value)) {
      const episodeNumber = parseInt(value, 10);
      const foundEpisode = episodes.find(
        (ep) => ep?.episode_no === episodeNumber
      );
      if (foundEpisode) {
        const range = generateRanges(totalEpisodes).find((r) => {
          const [start, end] = r.split("-").map(Number);
          return episodeNumber >= start && episodeNumber <= end;
        });
        if (range) {
          handleRangeChange(range);
          setSearchedEpisode(foundEpisode?.id);
        }
      } else {
        setSearchedEpisode(null);
      }
    }
  };

  const episodesToDisplay =
    totalEpisodes > 30
      ? episodes.slice(episodeRange[0] - 1, episodeRange[1])
      : episodes;

  return (
    <div className="relative flex flex-col w-full h-full max-[1200px]:max-h-[500px]">
      <div className="sticky top-0 z-10 flex flex-col gap-y-[5px] justify-start px-3 py-4 bg-[#0D0D15]">
        <h1 className="text-xl font-bold text-[#ffbade]">List of episodes:</h1>
        {totalEpisodes > 100 && (
          <div className="flex justify-between w-fit bg-[#373646] rounded-[4px] text-sm font-bold">
            <div
              ref={dropdownRef}
              className="min-w-fit flex text-[13px] relative"
            >
              <div
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="border-[1px] border-[#ffffff34] rounded-sm py-[4px] px-[8px] flex items-center gap-x-[10px]"
              >
                <FontAwesomeIcon icon={faList} />
                <div className="flex justify-center items-center gap-x-2 ml-4">
                  <p className="font-bold text-[14px]">
                    EPS: {selectedRangeLabel}
                  </p>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="mt-[2px] text-[10px]"
                  />
                </div>
              </div>
              {isDropdownOpen && (
                <div className="absolute flex flex-col top-full mt-[10px] left-0 z-30 bg-white w-[150px] max-h-[200px] overflow-y-auto rounded-l-[8px]">
                  {generateRanges(totalEpisodes).map((range, index) => (
                    <div
                      key={index}
                      onClick={() => handleRangeChange(range)}
                      className={`hover:bg-gray-200 cursor-pointer text-black ${
                        range === selectedRangeLabel ? "bg-[#ffbade]" : ""
                      }`}
                    >
                      <p className="font-semibold text-[12px] p-3 flex justify-between items-center">
                        EPS: {range}
                        {range === selectedRangeLabel && (
                          <FontAwesomeIcon icon={faCheck} />
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex w-fit items-center ml-1">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-[13px] font-bold"
              />
              <input
                type="text"
                className="w-full bg-transparent focus:outline-none rounded-sm text-[13px] font-bold placeholder:text-[12px] placeholder:font-medium"
                placeholder="Number of Ep"
                onChange={handleSearch}
              />
            </div>
          </div>
        )}
      </div>

      <div ref={episodeContainerRef} className="w-full h-full overflow-y-auto">
        <div
          className={
            totalEpisodes > 30
              ? "p-3 grid grid-cols-5 gap-1 max-[1200px]:grid-cols-12 max-[860px]:grid-cols-10 max-[575px]:grid-cols-8 max-[478px]:grid-cols-6 max-[350px]:grid-cols-5"
              : ""
          }
        >
          {episodesToDisplay.map((ep) => {
            const episodeNumberMatch = ep?.id.match(/ep=(\d+)/);
            const episodeId = episodeNumberMatch ? episodeNumberMatch[1] : null;
            const isActive = activeEpisodeId === episodeId;
            const isSearched = searchedEpisode === ep.id;

            return (
              <div
                key={ep?.id}
                ref={isActive ? activeEpisodeRef : null}
                className={`flex items-center justify-center rounded-[3px] h-[30px] text-[13.5px] font-medium cursor-pointer group ${
                  ep?.filler
                    ? isActive
                      ? "bg-[#ffbade]"
                      : "bg-gradient-to-r from-[#5a4944] to-[#645a4b]"
                    : ""
                } md:hover:bg-[#67686F] md:hover:text-white ${
                  isActive
                    ? "bg-[#ffbade] text-black"
                    : "bg-[#35373D] text-gray-400"
                } ${isSearched ? "glow-animation" : ""}`}
                onClick={() => {
                  if (episodeId) {
                    onEpisodeClick(episodeId);
                    setActiveEpisodeId(episodeId);
                    setSearchedEpisode(null);
                  }
                }}
              >
                <span
                  className={
                    ep?.filler ? "text-white md:group-hover:text-[#ffbade]" : ""
                  }
                >
                  {ep.episode_no}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Episodelist.propTypes = {
  episodes: PropTypes.array,
  onEpisodeClick: PropTypes.func.isRequired,
  currentEpisode: PropTypes.string,
  totalEpisodes: PropTypes.number.isRequired,
};

export default Episodelist;
