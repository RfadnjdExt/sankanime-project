import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { getSchedInfo } from "../api/animeApi";
import BouncingLoader from "./UI/BouncingLoader";

const Schedule = () => {
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeDayIndex, setActiveDayIndex] = useState(null);
  const [scheduledAnimes, setScheduledAnimes] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [currentTime] = useState(new Date());

  const dayRefs = useRef([]);
  const swiperRef = useRef(null);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const monthName = today.toLocaleString("default", { month: "short" });
  const daysCount = new Date(currentYear, currentMonth + 1, 0).getDate();
  const timeZone = `GMT ${
    new Date().getTimezoneOffset() > 0 ? "-" : "+"
  }${String(Math.floor(Math.abs(new Date().getTimezoneOffset()) / 60)).padStart(
    2,
    "0"
  )}:${String(Math.abs(new Date().getTimezoneOffset()) % 60).padStart(2, "0")}`;

  useEffect(() => {
    const days = [];
    for (let i = 1; i <= daysCount; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const dayName = date.toLocaleString("default", { weekday: "short" });
      const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(
        2,
        "0"
      )}-${String(i).padStart(2, "0")}`;
      days.push({ day: i, monthName, dayname: dayName, fulldate: fullDate });
    }
    setDaysInMonth(days);

    const todayIndex = days.findIndex(
      (d) =>
        d.fulldate ===
        `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
          today.getDate()
        ).padStart(2, "0")}`
    );
    if (todayIndex !== -1) {
      setActiveDayIndex(todayIndex);
    }
  }, []);

  useEffect(() => {
    if (activeDayIndex === null) return;

    const activeDate = daysInMonth[activeDayIndex].fulldate;

    const fetchSchedule = async (date) => {
      setIsLoading(true);
      setError(null);
      try {
        const cachedData = localStorage.getItem(`schedule-${date}`);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setScheduledAnimes(Array.isArray(parsedData) ? parsedData : []);
        } else {
          const data = await getSchedInfo(date);
          setScheduledAnimes(Array.isArray(data) ? data : []);
          localStorage.setItem(`schedule-${date}`, JSON.stringify(data || []));
        }
      } catch (err) {
        console.error("Error fetching schedule info", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule(activeDate);
  }, [activeDayIndex, daysInMonth]);

  const handleDayClick = (index) => {
    if (dayRefs.current[index]) {
      dayRefs.current.forEach((ref) => ref && ref.classList.remove("active"));
      dayRefs.current[index].classList.add("active");
    }
    setActiveDayIndex(index);
  };

  return (
    <>
      <div className="w-full mt-[60px] max-[480px]:mt-[40px]">
        <div className="flex flex-col justify-center items-center">
          <div className="font-bold text-2xl text-[#ffbade] max-[478px]:text-[18px]">
            Estimated Schedule
          </div>
          <p className="leading-[28px] px-[10px] bg-white text-black rounded-full my-[6px] text-[16px] font-bold max-[478px]:text-[12px] max-[275px]:text-[10px]">
            ({timeZone}) {currentTime.toLocaleDateString("en-GB")}{" "}
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="w-full overflow-x-scroll space-x-4 scrollbar-hide pt-10 px-6 max-[480px]:px-4 max-[478px]:pt-4">
        <div className="relative w-full">
          <Swiper
            slidesPerView={3}
            spaceBetween={10}
            breakpoints={{
              250: { slidesPerView: 3, spaceBetween: 10 },
              1300: {
                slidesPerView: 7,
                spaceBetween: 15,
              },
            }}
            modules={[Navigation]}
            navigation={{ nextEl: ".next", prevEl: ".prev" }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {daysInMonth.map((day, index) => (
              <SwiperSlide key={index}>
                <div
                  ref={(el) => (dayRefs.current[index] = el)}
                  onClick={() => handleDayClick(index)}
                  className={`h-[70px] flex flex-col justify-center items-center w-full text-center rounded-xl shadow-lg cursor-pointer ${
                    activeDayIndex === index
                      ? "bg-[#ffbade] text-black"
                      : "bg-white bg-opacity-5 text-[#ffffff] hover:bg-[#373646] transition-all duration-300 ease-in-out"
                  }`}
                >
                  <div className="text-[18px] font-bold max-[400px]:text-[14px] max-[350px]:text-[12px]">
                    {day.dayname}
                  </div>
                  <div
                    className={`text-[14px] max-[400px]:text-[12px] max-[350px]:text-[10px] ${
                      activeDayIndex === index ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {day.day} {day.monthName}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="next absolute top-1/2 right-[-15px] transform -translate-y-1/2 flex justify-center items-center cursor-pointer">
            <FontAwesomeIcon icon={faChevronRight} className="text-[12px]" />
          </button>
          <button className="prev absolute top-1/2 left-[-15px] transform -translate-y-1/2 flex justify-center items-center cursor-pointer">
            <FontAwesomeIcon icon={faChevronLeft} className="text-[12px]" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full h-[70px] flex justify-center items-center mt-5 text-xl">
          <BouncingLoader />
        </div>
      ) : !scheduledAnimes || scheduledAnimes.length === 0 ? (
        <div className="w-full h-[70px] flex justify-center items-center mt-5 text-xl">
          No data to display
        </div>
      ) : error ? (
        <div className="w-full h-[70px] flex justify-center items-center mt-5 text-xl">
          Something went wrong
        </div>
      ) : (
        <div className="flex flex-col mt-5 items-start">
          {(showAll ? scheduledAnimes : scheduledAnimes.slice(0, 7)).map(
            (item, index) => (
              <Link
                to={`/${item.id}`}
                key={item.id || index}
                className="w-full flex justify-between py-4 border-[#FFFFFF0D] border-b-[1px] group cursor-pointer max-[325px]:py-2"
              >
                <div className="flex items-center max-w-[500px] gap-x-7 max-[400px]:gap-x-2">
                  <div className="text-[18px] font-bold max-[400px]:text-[14px] max-[350px]:text-[12px]">
                    {item.time || "N/A"}
                  </div>
                  <h3 className="text-[17px] font-semibold line-clamp-1 group-hover:text-[#ffbade] transition-all duration-300 ease-in-out max-[600px]:text-[14px] max-[275px]:text-[12px]">
                    {item.title || "N/A"}
                  </h3>
                </div>
                <div className="max-w-[150px] flex items-center py-1 px-4 rounded-lg gap-x-2 group-hover:bg-[#ffbade] transition-all duration-300 ease-in-out">
                  <FontAwesomeIcon
                    icon={faPlay}
                    className="text-[14px] text-white group-hover:text-black transition-all duration-300 ease-in-out max-[275px]:text-[12px]"
                  />
                  <p className="text-[14px] text-white group-hover:text-black transition-all duration-300 ease-in-out max-[275px]:text-[12px]">
                    Episode {item.episode_no || "N/A"}
                  </p>
                </div>
              </Link>
            )
          )}
          {scheduledAnimes.length > 7 && (
            <div
              onClick={() => setShowAll(!showAll)}
              className="text-white py-4 hover:text-[#ffbade] font-semibold transition-all duration-300 ease-in-out max-sm:text-[13px]"
            >
              {showAll
                ? "Show Less"
                : `Show More (${scheduledAnimes.length - 7} more)`}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Schedule;
