import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

import { FaHistory, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import useAuth from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";
import { db } from "../api/firebase";

function History() {
  const [historyItems, setHistoryItems] = useState([]);
  const { language } = useLanguage();
  const location = useLocation();
  const user = useAuth();

  const isHistoryPage = location.pathname === "/history";

  useEffect(() => {
    const syncHistory = async () => {
      let localHistory = JSON.parse(
        localStorage.getItem("continueWatching") || "[]"
      );

      if (user) {
        try {
          const historyDocRef = doc(db, "history", user.uid);
          const docSnap = await getDoc(historyDocRef);

          if (docSnap.exists()) {
            const firestoreHistory = docSnap.data().data || [];

            const mergedHistoryMap = new Map();
            [...localHistory, ...firestoreHistory].forEach((item) => {
              const existing = mergedHistoryMap.get(item.id);
              if (
                !existing ||
                (item.episodeNum || 0) > (existing.episodeNum || 0) ||
                ((item.episodeNum || 0) === (existing.episodeNum || 0) &&
                  (item.watchTime || 0) > (existing.watchTime || 0))
              ) {
                mergedHistoryMap.set(item.id, item);
              }
            });

            localHistory = Array.from(mergedHistoryMap.values());
            localStorage.setItem(
              "continueWatching",
              JSON.stringify(localHistory)
            );
          }
        } catch (error) {
          console.error("Gagal mengambil history dari Firebase:", error);
        }
      }

      setHistoryItems(localHistory);
    };

    syncHistory();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const historyDocRef = doc(db, "history", user.uid);
    const unsubscribe = onSnapshot(historyDocRef, (docSnap) => {
      if (!docSnap.exists()) return;

      const firestoreHistory = docSnap.data().data || [];
      const localHistory = JSON.parse(
        localStorage.getItem("continueWatching") || "[]"
      );

      const mergedHistoryMap = new Map();
      [...localHistory, ...firestoreHistory].forEach((item) => {
        const existing = mergedHistoryMap.get(item.id);
        if (
          !existing ||
          (item.episodeNum || 0) > (existing.episodeNum || 0) ||
          ((item.episodeNum || 0) === (existing.episodeNum || 0) &&
            (item.watchTime || 0) > (existing.watchTime || 0))
        ) {
          mergedHistoryMap.set(item.id, item);
        }
      });

      const newHistory = Array.from(mergedHistoryMap.values());
      localStorage.setItem("continueWatching", JSON.stringify(newHistory));
      setHistoryItems(newHistory);
    });

    return () => unsubscribe();
  }, [user]);

  const handleRemoveItem = async (episodeId) => {
    const updatedHistory = historyItems.filter(
      (item) => item.episodeId !== episodeId
    );
    setHistoryItems(updatedHistory);
    localStorage.setItem("continueWatching", JSON.stringify(updatedHistory));

    if (user) {
      try {
        const historyDocRef = doc(db, "history", user.uid);
        await setDoc(historyDocRef, { data: updatedHistory });
      } catch (error) {
        console.error("Gagal update Firebase saat hapus:", error);
      }
    }
  };

  const handleClearAll = () => {
    if (confirm("Hapus seluruh riwayat?")) {
      setHistoryItems([]);
      localStorage.removeItem("continueWatching");
      if (user) {
        const historyDocRef = doc(db, "history", user.uid);
        setDoc(historyDocRef, { data: [] });
      }
    }
  };

  const renderHistoryItem = (item, index) => (
    <div
      key={index}
      className="w-full h-auto pb-[140%] relative group rounded-md overflow-hidden"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveItem(item.episodeId);
        }}
        className="absolute top-2 right-2 bg-black/60 text-white px-3 py-2 rounded-full text-sm z-20 font-extrabold hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 max-[450px]:opacity-100"
      >
        ✖
      </button>
      <Link
        to={`/watch/${item.id}?ep=${item.episodeId}`}
        className="absolute left-0 top-0 w-full h-full"
      >
        <img
          src={item.poster}
          alt={item.title}
          className="w-full h-full object-cover transition-all group-hover:blur-sm"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FontAwesomeIcon icon={faPlay} className="text-[50px] text-white" />
        </div>
      </Link>
      <div className="absolute bottom-0 left-0 right-0 p-2 pt-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-y-2">
        <p className="text-white text-md font-bold text-left truncate">
          {language === "EN" ? item.title : item.japanese_title}
        </p>
        <p className="text-gray-300 text-sm font-semibold text-left">
          Episode {item.episodeNum}
        </p>
      </div>
    </div>
  );

  if (historyItems.length === 0) {
    if (isHistoryPage) {
      return (
        <div className="text-center text-gray-400 mt-10 min-h-[50vh] flex items-center justify-center">
          Riwayat tontonan Anda kosong.
        </div>
      );
    }
    return null;
  }

  return (
    <div className="mt-6 max-[1200px]:px-6 max-md:px-0">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4 pl-2 sm:pl-0">
        <div className="flex items-center gap-x-2">
          <FaHistory className="text-[#ffbade]" />
          <h1 className="text-[#ffbade] text-2xl font-bold">
            {isHistoryPage ? "History" : "Continue Watching"}
          </h1>
        </div>
        {isHistoryPage && (
          <button
            onClick={handleClearAll}
            className="bg-red-600 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-red-700"
          >
            Clear All
          </button>
        )}
      </div>

      {isHistoryPage ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {historyItems.map(renderHistoryItem)}
        </div>
      ) : (
        <div className="relative mt-4 overflow-hidden">
          <Swiper
            slidesPerView={3}
            spaceBetween={15}
            modules={[Navigation]}
            navigation={{
              nextEl: ".btn-next-continue",
              prevEl: ".btn-prev-continue",
            }}
            breakpoints={{
              640: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
              1300: { slidesPerView: 7 },
            }}
          >
            {historyItems.map((item, index) => (
              <SwiperSlide key={index}>
                {renderHistoryItem(item, index)}
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 z-10 hidden md:block">
            <button className="btn-prev-continue bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600">
              <FaChevronLeft />
            </button>
          </div>
          <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 z-10 hidden md:block">
            <button className="btn-next-continue bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600">
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
