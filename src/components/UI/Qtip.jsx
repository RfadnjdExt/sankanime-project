import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faPlay,
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";

import { getQtip } from "../../api/animeApi";

import BouncingLoader from "./BouncingLoader";

/**
 * Komponen Qtip menampilkan tooltip informasi detail anime saat di-hover.
 * @param {string} id - ID unik dari anime yang akan ditampilkan informasinya.
 */
const Qtip = ({ id }) => {
  const [animeInfo, setAnimeInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQtipData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getQtip(id);
        setAnimeInfo(data);
      } catch (err) {
        console.error("Error fetching anime info", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchQtipData();
    }
  }, [id]);

  if (isLoading || error || !animeInfo) {
    return (
      <div className="w-[320px] h-fit p-4 flex justify-center items-center">
        <BouncingLoader />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-start gap-y-2">
      <h1 className="text-xl font-semibold text-white leading-6">
        {animeInfo.title}
      </h1>

      {/* Bagian Info Rating, Kualitas, Sub/Dub */}
      <div className="w-full flex items-center relative mt-2">
        {animeInfo.rating && (
          <div className="flex gap-x-2 items-center">
            <FontAwesomeIcon icon={faStar} className="text-[#ffc107]" />
            <p className="text-[13px] font-semibold">{animeInfo.rating}</p>
          </div>
        )}

        <div className="flex ml-4 gap-x-1 overflow-hidden rounded-md items-center h-fit">
          {animeInfo.quality && (
            <div className="bg-[#ffbade] px-2 w-fit flex justify-center items-center py-0.5 text-black">
              <p className="text-[12px] font-semibold">{animeInfo.quality}</p>
            </div>
          )}

          <div className="flex gap-x-0.5 w-fit items-center py-0.5">
            {animeInfo.subCount && (
              <div className="flex gap-x-1 justify-center items-center bg-[#B0E3AF] px-2 text-black">
                <FontAwesomeIcon
                  icon={faClosedCaptioning}
                  className="text-[13px]"
                />
                <p className="text-xs font-semibold">{animeInfo.subCount}</p>
              </div>
            )}
            {animeInfo.dubCount && (
              <div className="flex gap-x-1 justify-center items-center bg-[#B9E7FF] px-2 text-black">
                <FontAwesomeIcon icon={faMicrophone} className="text-[13px]" />
                <p className="text-xs font-semibold">{animeInfo.dubCount}</p>
              </div>
            )}
            {animeInfo.type && (
              <div className="flex gap-x-1 justify-center items-center bg-[#a199a3] px-2 text-black">
                <p className="text-xs font-semibold">{animeInfo.type}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {animeInfo.description && (
        <p className="text-[#d7d7d8] text-[13px] leading-4 font-light line-clamp-3 mt-1">
          {animeInfo.description}
        </p>
      )}

      <div className="flex flex-col mt-1">
        {animeInfo.japaneseTitle && (
          <p className="text-[#b7b7b8] text-[13px]">
            <span className="font-semibold">Japanese: </span>
            {animeInfo.japaneseTitle}
          </p>
        )}
        {animeInfo.airedDate && (
          <p className="text-[#b7b7b8] text-[13px]">
            <span className="font-semibold">Aired: </span>
            {animeInfo.airedDate}
          </p>
        )}
        {animeInfo.status && (
          <p className="text-[#b7b7b8] text-[13px]">
            <span className="font-semibold">Status: </span>
            {animeInfo.status}
          </p>
        )}
        {animeInfo.genres && (
          <div className="flex flex-wrap gap-x-1 items-center">
            <span className="text-[#b7b7b8] text-[13px] font-semibold">
              Genres:{" "}
            </span>
            {animeInfo.genres.map((genre, index) => (
              <Link
                key={index}
                to={`/genre/${genre}`}
                className="text-[13px] hover:text-[#ffbade]"
              >
                {genre}
                {index === animeInfo.genres.length - 1 ? "" : ", "}
              </Link>
            ))}
          </div>
        )}
      </div>

      <Link
        to={animeInfo.watchLink}
        className="w-[80%] flex mt-4 justify-center items-center gap-x-2 bg-[#ffbade] py-2.5 rounded-3xl"
      >
        <FontAwesomeIcon icon={faPlay} className="text-[14px] text-black" />
        <p className="text-[14px] font-semibold text-black">Watch Now</p>
      </Link>
    </div>
  );
};

Qtip.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Qtip;
