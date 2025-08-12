import { useState, useEffect } from "react";
import Linkify from "react-linkify";
import { X } from "lucide-react";

const NoticeBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const title = <>Perhatian!!</>;

  const message = (
    <>
      Hai semua, kini Sankanime hadir dalam bentuk <strong>Aplikasi</strong>.
      klik Link di bawah ini
    </>
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const linkifyOptions = {
    target: {
      url: "https://cdn.sankavolereii.com/sankanime.apk",
    },
    attributes: {
      rel: "noopener noreferrer",
      className: "text-blue-600 underline hover:text-blue-800 font-semibold",
    },
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-[58px] sm:top-[70px] right-4 z-[999] w-[88vw] max-w-xs sm:max-w-sm bg-[#ffbade] text-black rounded-md shadow-lg animate-slideDown">
      <div className="flex flex-col gap-1 p-2 sm:p-3 relative">
        <div className="text-sm sm:text-sm font-semibold text-center">
          📣 <strong>{title}</strong>
          <br />
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-2 text-black hover:text-red-600"
        >
          <X size={16} />
        </button>

        <div className="text-xs sm:text-sm leading-snug text-left">
          <Linkify options={linkifyOptions}>{message}</Linkify>
        </div>
      </div>
    </div>
  );
};

export default NoticeBanner;
