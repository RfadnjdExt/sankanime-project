import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { FaChevronRight } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";
import Qtip from "../UI/Qtip";

const useToolTipPosition = (activeId, data) => {
  const cardRefs = useRef([]);
  const [tooltipPosition, setTooltipPosition] = useState("top-1/2");
  const [tooltipHorizontalPosition, setTooltipHorizontalPosition] =
    useState("left-1/2");

  useEffect(() => {
    const calculatePosition = () => {
      if (!activeId || !data) return;
      const index = data.findIndex((item) => item.id + index === activeId);
      const cardElement = cardRefs.current[index];

      if (cardElement) {
        const { top, height, left, width } =
          cardElement.getBoundingClientRect();
        const verticalCenter = top + height / 2;
        const horizontalCenter = left + width / 2;

        setTooltipPosition(
          window.innerHeight - verticalCenter > verticalCenter
            ? "top-1/2"
            : "bottom-1/2"
        );

        setTooltipHorizontalPosition(
          window.innerWidth - horizontalCenter > 320 ? "left-1/2" : "right-1/2"
        );
      }
    };

    calculatePosition();
    window.addEventListener("scroll", calculatePosition);
    return () => window.removeEventListener("scroll", calculatePosition);
  }, [activeId, data]);

  return { tooltipPosition, tooltipHorizontalPosition, cardRefs };
};

function Sidecard({ label, data, path }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipTimeout, setTooltipTimeout] = useState(null);

  const { tooltipPosition, tooltipHorizontalPosition, cardRefs } =
    useToolTipPosition(activeTooltip, data);

  const handleMouseEnter = (item, index) => {
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    setActiveTooltip(item.id + index);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveTooltip(null);
    }, 300);
    setTooltipTimeout(timeout);
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col w-1/4 space-y-7 max-[1200px]:w-full">
      <h1 className="font-bold text-2xl text-[#ffbade] max-md:text-xl">
        {label}
      </h1>
      <div className="w-full space-y-4 flex flex-col">
        {data.slice(0, 5).map((item, index) => (
          <div
            key={item.id}
            style={{ borderBottom: "1px solid rgba(255, 255, 255, .075)" }}
            className="flex pb-4 items-center relative"
            ref={(el) => (cardRefs.current[index] = el)}
          >
            <img
              src={item.poster}
              alt={item.title}
              className="flex-shrink-0 w-[60px] h-[75px] rounded-md object-cover cursor-pointer"
              onClick={() => navigate(`/watch/${item.id}`)}
              onMouseEnter={() => handleMouseEnter(item, index)}
              onMouseLeave={handleMouseLeave}
            />

            {activeTooltip === item.id + index && window.innerWidth > 1024 && (
              <div
                className={`absolute ${tooltipPosition} ${tooltipHorizontalPosition} w-[320px] h-fit rounded-xl p-4 flex justify-center items-center bg-[#3e3c50] bg-opacity-70 backdrop-blur-[10px] z-50 transform transition-all duration-300 ease-in-out ${
                  activeTooltip === item.id + index
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
                    {item.tvInfo?.showType}
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
          <FaChevronRight className="text-white text-[10px] group-hover:text-[#ffbade] transform transition-all ease-out" />
        </Link>
      </div>
    </div>
  );
}

Sidecard.propTypes = {
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      poster: PropTypes.string,
      title: PropTypes.string,
      japanese_title: PropTypes.string,
      tvInfo: PropTypes.shape({
        sub: PropTypes.string,
        dub: PropTypes.string,
        showType: PropTypes.string,
      }),
    })
  ).isRequired,
};

export default Sidecard;
