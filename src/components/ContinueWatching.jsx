import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FaHistory, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { db } from "../api/firebase";
import useAuth from "../hooks/useAuth";
import { useLanguage } from "../context/LanguageContext";

const ContinueWatching = () => {
  const [watchList, setWatchList] = useState([]);
  const { language } = useLanguage();
  const swiperRef = useRef(null);
  const location = useLocation();
  const user = useAuth();
  const isHistoryPage = location.pathname === "/history";

  useEffect(() => {
    const loadWatchHistory = async () => {
      let localHistory = JSON.parse(
        localStorage.getItem("continueWatching") || "[]"
      );

      if (user) {
        try {
          const historyRef = doc(db, "history", user.uid);
          const historySnap = await getDoc(historyRef);

          if (historySnap.exists()) {
            const firebaseHistory = historySnap.data().data || [];
            const mergedHistory = [...localHistory];

            firebaseHistory.forEach((firebaseItem) => {
              const existingIndex = mergedHistory.findIndex(
                (item) => item.id === firebaseItem.id
              );

              const isFirebaseNewer =
                (firebaseItem.episodeNum || 0) >
                  (mergedHistory[existingIndex]?.episodeNum || 0) ||
                ((firebaseItem.episodeNum || 0) ===
                  (mergedHistory[existingIndex]?.episodeNum || 0) &&
                  (firebaseItem.watchTime || 0) >
                    (mergedHistory[existingIndex]?.watchTime || 0));

              if (existingIndex > -1 && isFirebaseNewer) {
                mergedHistory[existingIndex] = firebaseItem;
              } else if (existingIndex === -1) {
                mergedHistory.unshift(firebaseItem);
              }
            });

            localHistory = mergedHistory;
            localStorage.setItem(
              "continueWatching",
              JSON.stringify(mergedHistory)
            );
          }
        } catch (error) {
          console.error("Gagal ambil history dari Firebase:", error);
        }
      }

      setWatchList(localHistory);
    };

    loadWatchHistory();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const historyRef = doc(db, "history", user.uid);
    const unsubscribe = onSnapshot(
      historyRef,
      (doc) => {
        if (!doc.exists()) return;

        const firebaseHistory = doc.data()?.data || [];
        const localHistory = JSON.parse(
          localStorage.getItem("continueWatching") || "[]"
        );
        const mergedHistory = [...localHistory];

        firebaseHistory.forEach((firebaseItem) => {
          const existingIndex = mergedHistory.findIndex(
            (item) => item.id === firebaseItem.id
          );
          const isFirebaseNewer =
            (firebaseItem.episodeNum || 0) >
              (mergedHistory[existingIndex]?.episodeNum || 0) ||
            ((firebaseItem.episodeNum || 0) ===
              (mergedHistory[existingIndex]?.episodeNum || 0) &&
              (firebaseItem.watchTime || 0) >
                (mergedHistory[existingIndex]?.watchTime || 0));

          if (existingIndex > -1 && isFirebaseNewer) {
            mergedHistory[existingIndex] = firebaseItem;
          } else if (existingIndex === -1) {
            mergedHistory.unshift(firebaseItem);
          }
        });

        localStorage.setItem("continueWatching", JSON.stringify(mergedHistory));
        setWatchList(mergedHistory);
      },
      (error) => {
        console.error("Realtime listener error:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const saveToFirebase = async () => {
      if (!user || watchList.length === 0) return;
      try {
        const historyRef = doc(db, "history", user.uid);
        await setDoc(historyRef, { data: watchList });
      } catch (error) {
        console.error("[AutoSync] Gagal update Firebase:", error);
      }
    };
    saveToFirebase();
  }, [watchList, user]);

  const sortedWatchList = useMemo(() => watchList, [watchList]);

  const handleRemoveItem = async (episodeId) => {
    const updatedList = watchList.filter(
      (item) => item.episodeId !== episodeId
    );
    setWatchList(updatedList);
    localStorage.setItem("continueWatching", JSON.stringify(updatedList));
  };

  const handleClearAll = () => {
    if (window.confirm("Hapus seluruh riwayat?")) {
      localStorage.removeItem("continueWatching");
      setWatchList([]);
    }
  };

  const renderCard = (item, index) => (
    <div
      key={item.episodeId || index}
      className="w-full h-auto pb-[140%] relative group rounded-md overflow-hidden"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleRemoveItem(item.episodeId);
        }}
        className="absolute top-2 right-2 bg-black/60 text-white px-3 py-2 rounded-full text-sm z-20 font-extrabold hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 max-[450px]:opacity-100"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

      <Link
        to={`/watch/${item?.id}?ep=${item?.episodeId}`}
        className="absolute left-0 top-0 w-full h-full"
      >
        <img
          src={item?.poster}
          alt={item?.title}
          className="w-full h-full object-cover transition-all group-hover:blur-sm"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <FontAwesomeIcon
            icon={faPlay}
            className="text-[50px] text-white max-[450px]:text-[36px]"
          />
        </div>
      </Link>

      {item?.adultContent && (
        <div className="absolute top-2 left-2 bg-[#FF5700] text-white text-sm font-bold px-2 rounded-md z-10">
          18+
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 pt-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-y-2">
        <p className="text-white text-md font-bold text-left truncate max-[450px]:text-sm">
          {language === "EN" ? item.title : item.japanese_title}
        </p>
        <p className="text-gray-300 text-sm font-semibold text-left max-[450px]:text-[12px]">
          Episode {item.episodeNum}
        </p>
      </div>
    </div>
  );

  if (sortedWatchList.length === 0) {
    return isHistoryPage ? (
      <div className="text-center text-gray-400 mt-10 min-h-[50vh] flex items-center justify-center">
        Riwayat tontonan Anda kosong.
      </div>
    ) : null;
  }

  return (
    <div className="mt-6 max-[1200px]:px-6 max-md:px-0">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4 pl-2 sm:pl-0">
        {(isHistoryPage || sortedWatchList.length > 0) && (
          <div className="flex items-center gap-x-2">
            <FaHistory className="text-[#ffbade]" />
            <h1 className="text-[#ffbade] text-2xl font-bold max-[450px]:text-xl max-[450px]:mb-1 max-[350px]:text-lg">
              {isHistoryPage ? "History" : "Continue Watching"}
            </h1>
          </div>
        )}
      </div>
      {isHistoryPage && sortedWatchList.length > 0 && (
        <button
          onClick={handleClearAll}
          className="bg-red-600 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-red-700 mb-4"
        >
          Clear All
        </button>
      )}

      {isHistoryPage ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sortedWatchList.map(renderCard)}
        </div>
      ) : (
        <div className="relative mt-4 overflow-hidden">
          <Swiper
            ref={swiperRef}
            slidesPerView={3}
            spaceBetween={15}
            breakpoints={{
              640: { slidesPerView: 4 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 6 },
              1300: { slidesPerView: 7 },
            }}
            modules={[Navigation]}
            navigation={{
              nextEl: ".btn-next-continue",
              prevEl: ".btn-prev-continue",
            }}
          >
            {sortedWatchList.map((item, index) => (
              <SwiperSlide key={item.episodeId || index}>
                {renderCard(item, index)}
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
};

export default ContinueWatching;
