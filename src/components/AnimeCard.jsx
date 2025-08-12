import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../context/LanguageContext";
import Qtip from "./UI/Qtip";
import Skeleton from "./UI/Skeleton";

const AnimeCard = ({ anime }) => {
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const hoverTimeoutRef = useRef(null);

  const displayTitle = language === "EN" ? anime.title : anime.japanese_title;

  const handleMouseEnter = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 100);
  }, []);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/watch/${anime.id}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-[#2B2A3C] transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-pink-400/20">
          {!isImageLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}

          <img
            src={anime.poster}
            alt={displayTitle}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute top-2 right-2 flex flex-col items-end gap-y-1 text-xs font-bold z-10">
            {anime.tvInfo?.episodeInfo?.sub && (
              <span className="bg-pink-400 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                <FontAwesomeIcon icon={faClosedCaptioning} size="xs" />
                {anime.tvInfo.episodeInfo.sub}
              </span>
            )}
            {anime.tvInfo?.episodeInfo?.dub && (
              <span className="bg-sky-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                <FontAwesomeIcon icon={faMicrophone} size="xs" />
                {anime.tvInfo.episodeInfo.dub}
              </span>
            )}
          </div>
        </div>

        <div className="mt-2">
          <h3
            className="text-white font-semibold truncate"
            title={displayTitle}
          >
            {displayTitle}
          </h3>
          <p className="text-gray-400 text-sm">{anime.tvInfo?.showType}</p>
        </div>
      </Link>

      {isHovered && (
        <div className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-2 w-[320px] pointer-events-none opacity-0 animate-fade-in group-hover:opacity-100 transition-opacity duration-300">
          <Qtip id={anime.id} />
        </div>
      )}
    </div>
  );
};

AnimeCard.propTypes = {
  anime: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    poster: PropTypes.string.isRequired,
    title: PropTypes.string,
    japanese_title: PropTypes.string,
    tvInfo: PropTypes.shape({
      showType: PropTypes.string,
      episodeInfo: PropTypes.shape({
        sub: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        dub: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    }),
  }).isRequired,
};

export default AnimeCard;
