import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faClock,
  faCalendar,
  faClosedCaptioning,
  faMicrophone,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../../context/LanguageContext";

const Banner = ({ item, index }) => {
  const { language } = useLanguage();

  return (
    <div className="spotlight relative w-full h-full">
      <img
        src={item.poster}
        alt={item.title}
        className="absolute top-0 left-0 object-cover h-full w-full"
      />

      <div className="spotlight-overlay"></div>

      <div
        className="absolute flex flex-col left-0 bottom-[50px] w-[55%] p-4 z-10 
        max-[1390px]:w-[45%] max-[1390px]:bottom-[10px] 
        max-[1300px]:w-[600px] max-[1120px]:w-[60%] max-md:w-[90%] max-[300px]:w-full"
      >
        <p className="text-[#ffbade] font-semibold text-[20px] w-fit max-[1300px]:text-[15px]">
          #{index + 1} Spotlight
        </p>

        <h3
          className="text-white line-clamp-2 text-5xl font-bold mt-6 text-left 
          max-[1390px]:text-[45px] max-[1300px]:text-3xl max-[1300px]:mt-4 
          max-md:text-2xl max-md:mt-1 max-[575px]:text-[22px] 
          max-sm:leading-6 max-sm:w-[80%] max-[320px]:w-full"
        >
          {language === "EN" ? item.title : item.japanese_title}
        </h3>

        <div className="flex items-center gap-x-3 mt-4 max-md:hidden">
          {item.tvInfo?.quality && (
            <div className="bg-[#ffbade] py-[1px] px-[6px] rounded-md w-fit text-[11px] text-black font-bold h-fit">
              {item.tvInfo.quality}
            </div>
          )}
          {item.tvInfo?.duration && (
            <div className="flex items-center gap-x-1">
              <FontAwesomeIcon
                icon={faClock}
                className="text-white text-[12px]"
              />
              <p className="text-white text-[14px]">{item.tvInfo.duration}</p>
            </div>
          )}
          {item.tvInfo?.releaseDate && (
            <div className="flex items-center gap-x-1">
              <FontAwesomeIcon
                icon={faCalendar}
                className="text-white text-[12px]"
              />
              <p className="text-white text-[14px]">
                {item.tvInfo.releaseDate}
              </p>
            </div>
          )}
          <div className="flex items-center gap-x-1">
            {item.tvInfo?.episodeInfo?.sub && (
              <div className="flex items-center gap-x-1 bg-[#B0E3AF] px-[4px] py-[1px] rounded-sm text-black">
                <FontAwesomeIcon
                  icon={faClosedCaptioning}
                  className="text-[12px]"
                />
                <p className="text-[12px] font-semibold">
                  {item.tvInfo.episodeInfo.sub}
                </p>
              </div>
            )}
            {item.tvInfo?.episodeInfo?.dub && (
              <div className="flex items-center gap-x-1 bg-[#B9E7FF] px-[4px] py-[1px] rounded-sm text-black">
                <FontAwesomeIcon icon={faMicrophone} className="text-[12px]" />
                <p className="text-[12px] font-semibold">
                  {item.tvInfo.episodeInfo.dub}
                </p>
              </div>
            )}
          </div>
        </div>

        <p
          className="text-white text-[17px] font-light mt-6 text-left line-clamp-3 
          max-[1200px]:line-clamp-2 max-[1300px]:w-[500px] 
          max-[1120px]:w-[90%] max-md:hidden"
        >
          {item.description}
        </p>

        <div className="flex gap-x-5 mt-10 max-md:mt-6 max-sm:w-full max-[320px]:flex-col max-[320px]:space-y-3">
          <Link
            to={`/watch/${item.id}`}
            className="flex justify-center items-center bg-[#ffbade] px-4 py-2 rounded-3xl gap-x-2 w-fit text-black"
          >
            <FontAwesomeIcon icon={faPlay} className="text-black text-[14px]" />
            <p className="text-[15px] font-semibold">Watch Now</p>
          </Link>
          <Link
            to={`/${item.id}`}
            className="flex justify-center items-center bg-[#3B3A52] px-4 py-2 rounded-3xl gap-x-2 w-fit text-white"
          >
            <p className="text-[15px] font-semibold">Detail</p>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="text-white text-[12px]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

Banner.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    poster: PropTypes.string.isRequired,
    title: PropTypes.string,
    japanese_title: PropTypes.string,
    description: PropTypes.string,
    tvInfo: PropTypes.shape({
      quality: PropTypes.string,
      duration: PropTypes.string,
      releaseDate: PropTypes.string,
      episodeInfo: PropTypes.shape({
        sub: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        dub: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    }),
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default Banner;
