import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import PropTypes from "prop-types";

import Banner from "./Banner";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const Spotlight = ({ spotlights }) => {
  if (!spotlights || spotlights.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        No spotlights to show.
      </div>
    );
  }

  return (
    <div className="relative h-[600px] max-[1390px]:h-[530px] max-[1300px]:h-[500px] max-md:h-[420px] max-sm:h-[400px]">
      <div className="button-prev absolute left-[10px] top-1/2 -translate-y-1/2 z-20"></div>
      <div className="button-next absolute right-[10px] top-1/2 -translate-y-1/2 z-20"></div>

      <div className="swiper-pagination-custom absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2"></div>

      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        allowTouchMove={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          nextEl: ".button-next",
          prevEl: ".button-prev",
        }}
        pagination={{
          el: ".swiper-pagination-custom",
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} w-3 h-3 bg-white bg-opacity-50 rounded-full cursor-pointer"></span>`;
          },
        }}
        className="w-full h-full"
      >
        {spotlights.map((item, index) => (
          <SwiperSlide key={item.id || index}>
            <Banner item={item} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

Spotlight.propTypes = {
  spotlights: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
};

export default Spotlight;
