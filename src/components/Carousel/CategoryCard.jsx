import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faClosedCaptioning,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";

import Qtip from "../UI/Qtip";
import useToolTipPosition from "../../hooks/useTooltipPosition";
import { useLanguage } from "../../context/LanguageContext";
import Skeleton from "../UI/Skeleton";

import "swiper/css";
import "swiper/css/navigation";

const CategoryCard = ({ label, data, path, limit, className }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [tooltipTimeout, setTooltipTimeout] = useState(null);

  const { tooltipPosition, tooltipHorizontalPosition, cardRefs } =
    useToolTipPosition(hoveredItemId, data);

  const handleMouseEnter = (itemId) => {
    const timeout = setTimeout(() => {
      setHoveredItemId(itemId);
    }, 400);
    setTooltipTimeout(timeout);
  };

  const handleMouseLeave = () => {
    clearTimeout(tooltipTimeout);
    setHoveredItemId(null);
  };

  const limitedData = limit ? data.slice(0, limit) : data;

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl text-[#ffbade] max-md:text-xl capitalize">
          {label}
        </h1>
        {path && (
          <Link
            to={`/${path}`}
            className="flex w-fit items-baseline rounded-3xl gap-x-2 group"
          >
            <p className="text-white text-[12px] font-semibold h-fit leading-0 group-hover:text-[#ffbade] transition-all ease-out">
              View more
            </p>
          </Link>
        )}
      </div>

      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={15}
          slidesPerView={3}
          navigation={{
            nextEl: `.btn-next-${label.replace(/\s+/g, "-")}`,
            prevEl: `.btn-prev-${label.replace(/\s+/g, "-")}`,
          }}
          breakpoints={{
            640: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 6 },
            1300: { slidesPerView: 7 },
          }}
        >
          {limitedData.map((item, index) => (
            <SwiperSlide
              key={item.id || index}
              ref={(el) => (cardRefs.current[index] = el)}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
              <AnimeItemCard
                item={item}
                language={language}
                navigate={navigate}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div
          className={`btn-prev-${label.replace(/\s+/g, "-")} button-prev`}
        ></div>
        <div
          className={`btn-next-${label.replace(/\s+/g, "-")} button-next`}
        ></div>

        {hoveredItemId && (
          <div
            className={`absolute z-[100000] transform transition-all duration-300 ease-in-out ${tooltipPosition} ${tooltipHorizontalPosition} ${
              hoveredItemId
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
            onMouseEnter={() => handleMouseEnter(hoveredItemId)}
            onMouseLeave={handleMouseLeave}
          >
            <Qtip id={hoveredItemId} />
          </div>
        )}
      </div>
    </div>
  );
};

const AnimeItemCard = ({ item, language, navigate }) => {
  if (!item || !item.id) {
    return <Skeleton className="w-full h-[250px] object-cover rounded-md" />;
  }

  return (
    <div
      className="w-full relative group hover:cursor-pointer"
      onClick={() => navigate(`/watch/${item.id}`)}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 z-20">
        <FontAwesomeIcon icon={faPlay} className="text-[50px] text-white" />
      </div>

      <div className="w-full h-auto pb-[140%] relative overflow-hidden rounded-md">
        <img
          src={item.poster}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {item.adultContent && (
        <div className="absolute top-2 left-2 bg-[#FF5700] text-white text-sm font-bold px-2 rounded-md z-10">
          18+
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 pt-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-y-1">
        <h3 className="text-white font-semibold text-base line-clamp-2 group-hover:text-[#ffbade] transition-colors duration-300 min-h-[48px]">
          {language === "EN" ? item.title : item.japanese_title}
        </h3>

        <div className="flex items-center gap-x-2 w-full mt-1 overflow-hidden">
          {item.tvInfo?.sub && (
            <div className="flex space-x-1 justify-center items-center bg-[#B0E3AF] rounded-[2px] px-[4px] text-black py-[2px]">
              <FontAwesomeIcon
                icon={faClosedCaptioning}
                className="text-[12px]"
              />
              <p className="text-[12px] font-bold">{item.tvInfo.sub}</p>
            </div>
          )}
          {item.tvInfo?.dub && (
            <div className="flex space-x-1 justify-center items-center bg-[#B9E7FF] rounded-[2px] px-[8px] text-black py-[2px]">
              <FontAwesomeIcon icon={faMicrophone} className="text-[12px]" />
              <p className="text-[12px] font-bold">{item.tvInfo.dub}</p>
            </div>
          )}
          <div className="dot ml-[4px]" />
          <p className="text-gray-400 text-[14px] text-nowrap overflow-hidden text-ellipsis">
            {item.tvInfo?.showType}
          </p>
        </div>
      </div>
    </div>
  );
};

CategoryCard.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  path: PropTypes.string,
  limit: PropTypes.number,
  className: PropTypes.string,
};

AnimeItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    poster: PropTypes.string,
    title: PropTypes.string,
    japanese_title: PropTypes.string,
    adultContent: PropTypes.bool,
    tvInfo: PropTypes.shape({
      sub: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      dub: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      showType: PropTypes.string,
    }),
  }).isRequired,
  language: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default CategoryCard;
