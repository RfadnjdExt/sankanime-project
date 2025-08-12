import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareAlt,
  faCalendarDays,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

const InfoTag = ({ text, bgColor, textColor = "black" }) => {
  if (!text) return null;
  return (
    <span
      className={`text-[12px] font-bold px-2 py-1 rounded-full ${bgColor} text-${textColor}`}
    >
      {text}
    </span>
  );
};

InfoTag.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bgColor: PropTypes.string.isRequired,
  textColor: PropTypes.string,
};

function AnimeInfoCard({ animeInfo }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!animeInfo) {
    return <div>Loading anime information...</div>;
  }

  const {
    title,
    japanese_title,
    poster,
    description,
    genres = [],
    rating,
    status,
    type,
    duration,
    releaseDate,
    tvInfo = {},
  } = animeInfo;

  const { quality, sub, dub } = tvInfo;
  const shortDescription =
    description && description.length > 250
      ? `${description.substring(0, 250)}...`
      : description;

  return (
    <div className="w-full bg-[#161625] p-6 rounded-xl flex gap-x-6 max-md:flex-col max-md:items-center">
      <div className="flex-shrink-0 w-[200px] max-md:w-[180px] max-md:mb-4">
        <img
          src={poster}
          alt={title}
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>

      <div className="flex-1 flex flex-col gap-y-3 text-white">
        <h1 className="text-3xl font-bold text-[#ffbade]">{title}</h1>
        <h2 className="text-lg font-medium text-gray-400 -mt-2">
          {japanese_title}
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          {rating && <InfoTag text={`⭐ ${rating}`} bgColor="bg-yellow-400" />}
          {status && <InfoTag text={status} bgColor="bg-sky-500" />}
          {type && <InfoTag text={type} bgColor="bg-green-500" />}
          {quality && <InfoTag text={quality} bgColor="bg-red-500" />}
          {sub && (
            <InfoTag
              text={`Sub: ${sub}`}
              bgColor="bg-gray-700"
              textColor="white"
            />
          )}
          {dub && (
            <InfoTag
              text={`Dub: ${dub}`}
              bgColor="bg-blue-500"
              textColor="white"
            />
          )}
        </div>

        <div className="mt-2 text-gray-300 text-[14px] leading-relaxed">
          <p>
            {isExpanded ? description : shortDescription}
            {description && description.length > 250 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[#ffbade] font-semibold ml-2 hover:underline"
              >
                {isExpanded ? "Show Less" : "Show More"}
              </button>
            )}
          </p>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm max-sm:grid-cols-1">
          {releaseDate && (
            <div className="flex items-center gap-x-2">
              <FontAwesomeIcon
                icon={faCalendarDays}
                className="text-gray-400"
              />
              <strong>Aired:</strong>
              <span className="text-gray-300">{releaseDate}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-x-2">
              <FontAwesomeIcon icon={faClock} className="text-gray-400" />
              <strong>Duration:</strong>
              <span className="text-gray-300">{duration}</span>
            </div>
          )}
        </div>

        {genres.length > 0 && (
          <div className="mt-2">
            <strong className="text-[15px]">Genres:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {genres.map((genre) => (
                <Link
                  key={genre}
                  to={`/genre/${genre.toLowerCase().replace(/ /g, "-")}`}
                  className="bg-[#373646] text-gray-300 text-xs font-medium px-3 py-1 rounded-full hover:bg-[#ffbade] hover:text-black transition-colors"
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <button className="bg-[#ffbade] text-black font-bold py-2 px-4 rounded-lg flex items-center gap-x-2 hover:bg-opacity-80 transition">
            <FontAwesomeIcon icon={faShareAlt} />
            Share Anime
          </button>
        </div>
      </div>
    </div>
  );
}

AnimeInfoCard.propTypes = {
  animeInfo: PropTypes.shape({
    title: PropTypes.string,
    japanese_title: PropTypes.string,
    poster: PropTypes.string,
    description: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.string),
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    type: PropTypes.string,
    duration: PropTypes.string,
    releaseDate: PropTypes.string,
    tvInfo: PropTypes.shape({
      quality: PropTypes.string,
      sub: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      dub: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  }),
};

export default AnimeInfoCard;
