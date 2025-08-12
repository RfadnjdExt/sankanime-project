import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../context/LanguageContext";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Trending = ({ trending }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  if (!trending || trending.length === 0) {
    return (
      <div className="text-center text-gray-400">Loading trending anime...</div>
    );
  }

  return (
    <div className="mt-6 max-[1200px]:px-4 max-md:px-0">
      <div className="flex justify-between items-center mb-4 max-md:pl-4">
        <h1 className="font-bold text-2xl text-[#ffbade] max-md:text-xl">
          Trending
        </h1>
        <div className="flex space-x-2">
          <button className="button-prev w-10 h-10 text-white bg-[#383747] rounded-md flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-[#ffbade] hover:text-[#383747]">
            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
          </button>
          <button className="button-next w-10 h-10 text-white bg-[#383747] rounded-md flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-[#ffbade] hover:text-[#383747]">
            <FontAwesomeIcon icon={faChevronRight} size="sm" />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".button-next",
          prevEl: ".button-prev",
        }}
        spaceBetween={15}
        slidesPerView={3}
        breakpoints={{
          479: { slidesPerView: 3, spaceBetween: 15 },
          640: { slidesPerView: 4, spaceBetween: 15 },
          900: { slidesPerView: 5, spaceBetween: 15 },
          1300: { slidesPerView: 6, spaceBetween: 15 },
        }}
        className="pr-[60px] relative mx-auto overflow-hidden z-[1] max-[759px]:pr-0"
      >
        {trending.map((item, index) => (
          <SwiperSlide
            key={item.id || index}
            className="w-[170px] h-fit text-left transform transition-transform hover:scale-[1.03]"
            onClick={() => navigate(`/watch/${item.id}`)}
          >
            <div className="w-full h-auto pb-[140%] relative inline-block overflow-hidden rounded-lg cursor-pointer">
              <div className="inline-block bg-[#2a2c31] absolute w-auto left-[-15px] top-[15px] z-[9]">
                <span className="text-center flex text-[18px] justify-center items-center w-[40px] h-[40px] text-white font-semibold">
                  {index + 1}
                </span>
              </div>

              <div className="w-[150px] h-fit text-left transform -rotate-90 absolute bottom-[100px] left-[-55px] leading-[40px] text-ellipsis whitespace-nowrap overflow-hidden text-white text-[16px] font-medium">
                {language === "EN" ? item.title : item.japanese_title}
              </div>

              <img
                src={item.poster}
                alt={item.title}
                className="block w-full h-full object-cover absolute top-0 left-0"
                loading="lazy"
              />

              <div className="overlay absolute inset-0 bg-gradient-to-t from-[#201f31] via-transparent to-transparent z-[50]" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

Trending.propTypes = {
  trending: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      poster: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      japanese_title: PropTypes.string,
    })
  ).isRequired,
};

export default Trending;
