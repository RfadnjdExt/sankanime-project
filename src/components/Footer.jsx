import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import {
  faTwitter,
  faDiscord,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-[#11101A] text-gray-400 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="container mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-white">
              Sanka<span className="text-[#ffbade]">nime</span>
            </Link>
            <p className="text-sm text-gray-500">
              Sankanime does not store any files on our server, we only share
              links from 3rd party services that are publicly available.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/home"
                  className="hover:text-[#ffbade] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/popular"
                  className="hover:text-[#ffbade] transition-colors"
                >
                  Popular
                </Link>
              </li>
              <li>
                <Link
                  to="/movie"
                  className="hover:text-[#ffbade] transition-colors"
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  to="/contactcs"
                  className="hover:text-[#ffbade] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://taplink.cc/sankavollerei"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ffbade] transition-colors"
                aria-label="Twitter"
              >
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ffbade] transition-colors"
                aria-label="Discord"
              >
                <FontAwesomeIcon icon={faDiscord} size="lg" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ffbade] transition-colors"
                aria-label="Telegram"
              >
                <FontAwesomeIcon icon={faTelegram} size="lg" />
              </a>
            </div>
            <a
              href="https://sociabuzz.com/sankanime/tribe"
              target="_blank"
              rel="noopener noreferrer"
              className="donate-button inline-flex items-center justify-center px-4 py-2 mt-6 font-bold text-white rounded-lg"
            >
              <FontAwesomeIcon icon={faHeart} className="mr-2 heart-icon" />
              Support Us
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Sankanime. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
