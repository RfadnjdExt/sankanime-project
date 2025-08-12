import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import LoginButton from "./LoginButton";
import Sidebar from "./Sidebar";
import { WebSearch } from "./WebSearch";
import MobileSearch from "./MobileSearch";

import { useLanguage } from "../context/LanguageContext";
import { useSearch } from "../context/SearchContext";
import { logoTitle } from "../config/constants";

const NAV_LINKS = [
  { path: "/home", label: "Home" },
  { path: "/movie", label: "Movie" },
  { path: "/random", label: "Random" },
  { path: "/schedule", label: "Schedule" },
  { path: "/most-popular", label: "Most Popular" },
  { path: "/top-airing", label: "Top Airing" },
];

export const Navbar = () => {
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const { isSearchVisible } = useSearch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleRandomClick = (e) => {
    if (e.target.pathname === "/random") {
      window.location.reload();
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 flex p-4 items-center justify-between transition-all duration-300 ease-in-out ${
          isScrolled || isSidebarOpen
            ? "bg-[#201F31] shadow-lg backdrop-blur-md bg-opacity-90"
            : "bg-transparent"
        }`}
        style={{ height: "64px" }}
      >
        <div className="flex items-center gap-x-4">
          <button
            className="md:hidden text-white"
            onClick={handleSidebarToggle}
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
          <Link
            to="/home"
            className="text-2xl text-white font-bold cursor-pointer"
          >
            {logoTitle.slice(0, 5)}
            <span className="text-[#FFBADE]">{logoTitle.slice(5, 6)}</span>
            {logoTitle.slice(6)}
          </Link>
        </div>

        <div className="hidden lg:flex gap-x-7 items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={handleRandomClick}
              className={`text-[15px] font-semibold transition-colors ${
                location.pathname === link.path
                  ? "text-[#ffbade]"
                  : "text-white hover:text-[#ffbade]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-x-4">
          <div className="hidden sm:block">
            <WebSearch />
          </div>
          <div className="hidden md:flex items-center bg-[#373646] rounded-[4px] text-sm font-bold">
            {["EN", "JP"].map((lang) => (
              <button
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className={`px-3 py-[2px] transition-colors ${
                  language === lang
                    ? "bg-[#ffbade] text-black rounded-[3px]"
                    : "text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <LoginButton />
        </div>
      </nav>

      <div className="sm:hidden mt-16 px-4">
        {isSearchVisible && <MobileSearch />}
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};
