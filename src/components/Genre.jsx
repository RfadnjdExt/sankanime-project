import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const GENRE_COLORS = [
  "#FFBADE",
  "#B0E3AF",
  "#B9E7FF",
  "#FFC107",
  "#ABCCD8",
  "#85E1CD",
  "#B7C996",
];

/**
 * Komponen untuk menampilkan daftar genre dalam bentuk grid.
 * Memiliki fungsionalitas "Show more" untuk menampilkan lebih banyak genre.
 * @param {{ data: string[] }} props - Menerima array string yang berisi daftar genre.
 */
function Genre({ data }) {
  const [showAll, setShowAll] = useState(false);

  const handleToggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  const genresToDisplay = showAll ? data : data.slice(0, 24);

  return (
    <div className="flex flex-col w-full">
      <h1 className="font-bold text-2xl text-[#ffbade]">Genres</h1>
      <div className="bg-[#373646] py-6 px-4 mt-6 max-[478px]:bg-transparent max-[478px]:px-0">
        <div className="grid grid-cols-3 grid-rows-2 gap-x-4 gap-y-3 w-full max-[478px]:flex max-[478px]:flex-wrap max-[478px]:gap-2">
          {genresToDisplay.map((genre, index) => {
            const color = GENRE_COLORS[index % GENRE_COLORS.length];

            return (
              <Link
                key={index}
                to={`/genre/${genre.toLowerCase().replace(/\s/g, "-")}`}
                className="rounded-[4px] py-2 px-3 hover:bg-[#555462] hover:cursor-pointer max-[478px]:bg-[#373646] max-[478px]:py-[6px]"
                style={{ color: color }}
              >
                <div className="overflow-hidden text-left text-ellipsis text-nowrap font-bold">
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </div>
              </Link>
            );
          })}
        </div>

        {data.length > 24 && (
          <button
            onClick={handleToggleShowAll}
            className="w-full bg-[#555462d3] py-3 mt-4 hover:bg-[#555462] rounded-md font-bold transform transition-all ease-out"
          >
            {showAll ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
}

Genre.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default React.memo(Genre);
