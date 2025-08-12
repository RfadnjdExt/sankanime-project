import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faRandom,
  faFilm,
} from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "../context/LanguageContext";

const toggleScrollbar = (isOpen) => {
  if (isOpen) {
    document.body.classList.add("overflow-y-hidden");
  } else {
    document.body.classList.remove("overflow-y-hidden");
  }
};

const Sidebar = ({ isOpen, onClose }) => {
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    toggleScrollbar(isOpen);
    return () => toggleScrollbar(false);
  }, [isOpen]);

  useEffect(() => {
    onClose();
  }, [location, onClose]);

  const mainNavLinks = [
    { name: "Home", path: "/home" },
    { name: "Latest Episode", path: "/recently-updated" },
    { name: "History", path: "/history" },
    { name: "Schedule", path: "/schedule" },
    { name: "Most Popular", path: "/most-popular" },
    { name: "Movies", path: "/movie" },
    { name: "TV Series", path: "/tv" },
    { name: "ONAs", path: "/ona" },
    { name: "Specials", path: "/special" },
    { name: "Api Sanka", path: "https://www.sankavollerei.com" },
  ];

  const iconLinks = [
    { icon: faRandom, label: "Random" },
    { icon: faFilm, label: "Movie" },
  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 bottom-0 right-0 w-screen h-screen transform transition-all duration-400 ease-in-out bg-black/80 ${
          isOpen ? "opacity-100 z-[100000]" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        style={{ zIndex: 1000000 }}
      />

      <div
        className={`fixed h-full top-0 left-0 z-[1000000] flex transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ zIndex: 1000000 }}
      >
        <div
          id="app-sidebar"
          className="bg-white/10 backdrop-blur-lg w-[260px] py-8 h-full flex flex-col items-start max-[575px]:w-56 overflow-y-auto"
          style={{ borderRight: "1px solid rgba(0, 0, 0, .1)" }}
        >
          <div className="px-4 w-full">
            <button
              onClick={onClose}
              className="flex gap-x-1 items-center text-white mt-8 w-full hover:text-[#ffbade]"
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="text-sm font-bold"
              />
              <p>Close menu</p>
            </button>
          </div>

          <div className="flex gap-x-7 w-full py-3 justify-center px-auto mt-8 bg-black/10 max-[575px]:gap-x-4 lg:hidden">
            {iconLinks.map((link) => (
              <Link
                key={link.label}
                to={`/${link.label.toLowerCase()}`}
                className="flex flex-col gap-y-1 items-center"
              >
                <FontAwesomeIcon
                  icon={link.icon}
                  className="text-[#ffbade] text-xl font-bold max-[575px]:text-[15px]"
                />
                <p className="text-[15px] max-[575px]:text-[13px] text-white">
                  {link.label}
                </p>
              </Link>
            ))}

            <div className="flex flex-col gap-y-1 items-center">
              <div className="flex">
                {["EN", "JP"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`px-1 py-[1px] text-xs font-bold ${
                      lang === "EN" ? "rounded-l-[3px]" : "rounded-r-[3px]"
                    } ${
                      language === lang
                        ? "bg-[#ffbade] text-black"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <p className="whitespace-nowrap text-[15px] max-[575px]:text-[13px] text-white">
                Anime name
              </p>
            </div>
          </div>

          <ul className="py-4 w-full font-semibold">
            {mainNavLinks.map((link) => (
              <li
                key={link.name}
                className="w-full"
                style={{ borderBottom: "1px solid rgba(255, 255, 255, .08)" }}
              >
                <Link
                  to={link.path}
                  className="px-4 hover:text-[#ffbade] hover:cursor-pointer w-fit line-clamp-1 block py-3 text-white text-[15px]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
