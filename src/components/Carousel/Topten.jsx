import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

import { useLanguage } from "../../context/LanguageContext";
import useToolTipPosition from "../../hooks/useTooltipPosition";
import Qtip from "../UI/Qtip";

const Topten = ({ data, className }) => {
  const [activeTab, setActiveTab] = useState("today");

  const [hoveredId, setHoveredId] = useState(null);
  const [tooltipTimeout, setTooltipTimeout] = useState(null);

  const navigate = useNavigate();

  const { language } = useLanguage();

  const currentData =
    activeTab === "today"
      ? data.today
      : activeTab === "week"
      ? data.week
      : data.month;

  const { tooltipPosition, tooltipHorizontalPosition, cardRefs } =
    useToolTipPosition(hoveredId, currentData);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleMouseEnter = (item, index) => {
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    setHoveredId(item.id + index);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredId(null);
    }, 300);
    setTooltipTimeout(timeout);
  };

  return (
    <div className={`flex flex-col space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl text-[#ffbade]">Top 10</h1>
        <ul className="flex justify-between w-fit bg-[#373646] rounded-[4px] text-sm font-bold">
          {["today", "week", "month"].map((tab) => (
            <li
              key={tab}
              className={`
                cursor-pointer p-2 px-3 
                ${
                  activeTab === tab
                    ? "bg-[#ffbade] text-[#555462]"
                    : "bg-[#2B2A3C] text-[#999] hover:text-[#ffbade]"
                }
                ${tab === "today" ? "rounded-l-[3px]" : ""}
                ${tab === "month" ? "rounded-r-[3px]" : ""}
              `}
              onClick={() => handleTabClick(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      <div>
        {currentData &&
          currentData.map((item, index) => (
            <div
              key={item.id + index}
              ref={(el) => (cardRefs.current[index] = el)}
              className="flex pb-4 relative container items-center"
              style={{
                borderBottom:
                  index + 1 < 10
                    ? "1px solid rgba(255, 255, 255, .075)"
                    : "none",
              }}
            >
              <h1
                className={`
                  text-[40px] text-white font-black max-[575px]:text-3xl
                  ${
                    index < 3
                      ? "pb-1 text-white border-b-[3px] border-[#ffbade]"
                      : "text-[#777682]"
                  }
                  ${index < 3 ? "glow-animation" : ""}
                `}
              >
                {(index + 1 < 10 ? "0" : "") + (index + 1)}
              </h1>

              <div className="flex items-center w-full">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-[60px] h-[75px] rounded-md object-cover flex-shrink-0 cursor-pointer ml-4"
                  onClick={() => navigate("/watch/" + item.id)}
                  onMouseEnter={() => handleMouseEnter(item, index)}
                  onMouseLeave={handleMouseLeave}
                />

                {hoveredId === item.id + index && window.innerWidth > 1024 && (
                  <div
                    className={`
                      absolute ${tooltipPosition} ${tooltipHorizontalPosition}
                      ${
                        tooltipPosition === "top-1/2"
                          ? "translate-y-[-50px]"
                          : "translate-y-[50px]"
                      }
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
                      }
                    `}
                    onMouseEnter={() => {
                      if (tooltipTimeout) clearTimeout(tooltipTimeout);
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Qtip id={item.id} />
                  </div>
                )}

                <div className="flex flex-col ml-4 space-y-2">
                  <Link
                    to={"/" + item.id}
                    className="text-[1em] font-[500] hover:cursor-pointer hover:text-[#ffbade] transform transition-all ease-out line-clamp-1 max-[478px]:line-clamp-2 max-[478px]:text-[14px]"
                  >
                    {language === "EN" ? item.title : item.japanese_title}
                  </Link>
                  <div className="flex flex-wrap items-center w-fit space-x-1 max-[350px]:gap-y-[3px]">
                    {item.tvInfo?.sub && (
                      <div className="flex space-x-1 justify-center items-center bg-[#B0E3AF] rounded-[4px] px-[4px] text-black py-[2px]">
                        <FontAwesomeIcon
                          icon={faClosedCaptioning}
                          className="text-[12px]"
                        />
                        <p className="text-[12px] font-bold">
                          {item.tvInfo.sub}
                        </p>
                      </div>
                    )}
                    {item.tvInfo?.dub && (
                      <div className="flex space-x-1 justify-center items-center bg-[#B9E7FF] rounded-[4px] px-[8px] text-black py-[2px]">
                        <FontAwesomeIcon
                          icon={faMicrophone}
                          className="text-[12px]"
                        />
                        <p className="text-[12px] font-bold">
                          {item.tvInfo.dub}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

Topten.propTypes = {
  data: PropTypes.shape({
    today: PropTypes.array.isRequired,
    week: PropTypes.array.isRequired,
    month: PropTypes.array.isRequired,
  }).isRequired,
  className: PropTypes.string,
};

export default React.memo(Topten);
