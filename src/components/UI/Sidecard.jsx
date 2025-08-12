import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import Qtip from "./Qtip";
import { useLanguage } from "../../context/LanguageContext";
import useToolTipPosition from "../../hooks/useTooltipPosition";

/**
 * Sidecard Component
 * Menampilkan daftar vertikal ringkas dari item anime dengan judul dan tautan "View more".
 *
 * @param {object} props - Props komponen.
 * @param {string} props.label - Judul untuk sidecard (misal: "Most Popular").
 * @param {Array<object>} props.data - Array berisi data anime.
 * @param {string} props.path - Path untuk tautan "View more".
 */
export default function Sidecard({ label, data, path }) {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [hoveredId, setHoveredId] = useState(null);
  const [tooltipTimeout, setTooltipTimeout] = useState(null);

  const { tooltipPosition, tooltipHorizontalPosition, cardRefs } =
    useToolTipPosition(hoveredId, data);

  const handleMouseEnter = (item, index) => {
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    setTooltipTimeout(
      setTimeout(() => {
        setHoveredId(item.id + index);
      }, 400)
    );
  };

  // Fungsi untuk menyembunyikan tooltip
  const handleMouseLeave = () => {
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    setHoveredId(null);
  };

  const displayedData = data.slice(0, 5);

  return (
    <div className="flex flex-col w-1/4 space-y-7 max-[1200px]:w-full">
      <h1 className="font-bold text-2xl text-[#ffbade] max-md:text-xl">
        {label}
      </h1>
      <div className="w-full space-y-4 flex flex-col">
        {displayedData.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (cardRefs.current[index] = el)}
            style={{ borderBottom: "1px solid rgba(255, 255, 255, .075)" }}
            className="flex pb-4 items-center relative"
          >
            <img
              src={item.poster}
              alt={item.title}
              className="flex-shrink-0 w-[60px] h-[75px] rounded-md object-cover cursor-pointer"
              onClick={() => navigate(`/watch/${item.id}`)}
              onMouseEnter={() => handleMouseEnter(item, index)}
              onMouseLeave={handleMouseLeave}
            />

            {hoveredId === item.id + index && window.innerWidth > 1024 && (
              <div
                className={`absolute ${tooltipPosition} ${tooltipHorizontalPosition} 
                           ${
                             tooltipHorizontalPosition === "left-1/2"
                               ? "translate-x-[-100px]"
                               : "translate-x-[-200px]"
                           } 
                           z-[100000] transform transition-all duration-300 ease-in-out 
                           ${
                             hoveredId === item.id + index
                               ? "opacity-100 translate-y-0"
                               : "opacity-0 translate-y-2"
                           }`}
                onMouseEnter={() => {
                  if (tooltipTimeout) clearTimeout(tooltipTimeout);
                }}
                onMouseLeave={handleMouseLeave}
              >
                <Qtip id={item.id} />
              </div>
            )}

            <div className="flex flex-col ml-4 space-y-2 w-full">
              <Link
                to={`/${item.id}`}
                className="w-full line-clamp-2 text-[1em] font-[500] hover:cursor-pointer hover:text-[#ffbade] transform transition-all ease-out max-[1200px]:text-[14px]"
              >
                {language === "EN" ? item.title : item.japanese_title}
              </Link>
              <div className="flex items-center flex-wrap w-fit space-x-1">
                {item.tvInfo?.sub && (
                  <div className="flex space-x-1 justify-center items-center bg-[#B0E3AF] rounded-[4px] px-[4px] text-black py-[2px]">
                    <FontAwesomeIcon
                      icon={faClosedCaptioning}
                      className="text-[12px]"
                    />
                    <p className="text-[12px] font-bold">{item.tvInfo.sub}</p>
                  </div>
                )}
                {item.tvInfo?.dub && (
                  <div className="flex space-x-1 justify-center items-center bg-[#B9E7FF] rounded-[4px] px-[8px] text-black py-[2px]">
                    <FontAwesomeIcon
                      icon={faMicrophone}
                      className="text-[12px]"
                    />
                    <p className="text-[12px] font-bold">{item.tvInfo.dub}</p>
                  </div>
                )}
                <div className="flex items-center w-fit pl-1 gap-x-1">
                  <div className="dot"></div>
                  <p className="text-[14px] text-[#D2D2D3]">
                    {item.tvInfo.showType}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Link
          to={`/${path}`}
          className="flex w-fit items-baseline rounded-3xl gap-x-2 group"
        >
          <p className="text-white text-[17px] h-fit leading-4 group-hover:text-[#ffbade] transform transition-all ease-out">
            View more
          </p>
          <FontAwesomeIcon
            icon={faChevronRight}
            className="text-white text-[10px] group-hover:text-[#ffbade] transform transition-all ease-out"
          />
        </Link>
      </div>
    </div>
  );
}

Sidecard.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  path: PropTypes.string.isRequired,
};
