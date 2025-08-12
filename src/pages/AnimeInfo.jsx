import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

import { fetchAnimeInfo } from "../api/animeApi";
import AnimeInfoLoader from "../components/UI/Skeleton";
import ErrorComponent from "./NotFound";
import CategoryCard from "../components/Carousel/CategoryCard";
import Sidecard from "../components/Carousel/Sidecard";
import VoiceactorList from "../components/Player/VoiceactorList";
import Voiceactor from "../components/Player/Voiceactor";
import { useLanguage } from "../context/LanguageContext";
import { useHomeInfo } from "../context/HomeInfoContext";

function AnimeInfo() {
  const { id } = useParams();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [animeInfo, setAnimeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullOverview, setIsFullOverview] = useState(false);
  const [isVoiceActorListOpen, setVoiceActorListOpen] = useState(false);

  const { homeInfo } = useHomeInfo();

  useEffect(() => {
    const getAnimeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAnimeInfo(id);
        if (data) {
          setAnimeInfo(data);
        } else {
          navigate("/404-not-found-page");
        }
      } catch (err) {
        console.error("Error fetching anime info:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getAnimeData();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  useEffect(() => {
    if (animeInfo) {
      const title =
        language === "EN" ? animeInfo.title : animeInfo.japanese_title;
      document.title = `Watch ${title} | Sankanime`;
    }
  }, [animeInfo, language]);

  const toggleOverview = useCallback(() => {
    setIsFullOverview((prev) => !prev);
  }, []);

  if (loading) {
    return <AnimeInfoLoader />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!animeInfo) {
    return <ErrorComponent error={{ message: "Anime not found" }} />;
  }

  const {
    title,
    japanese_title,
    poster,
    description,
    tvInfo,
    seasons,
    related_data,
    recommended_data,
    charactersVoiceActors,
  } = animeInfo;
  const displayTitle = language === "EN" ? title : japanese_title;

  return (
    <>
      <div className="relative w-full h-[480px] max-[1200px]:h-[48vw] max-[600px]:h-[65vw] text-white overflow-hidden">
        <img
          src={poster}
          alt={`${title} Poster`}
          className="absolute inset-0 object-cover w-full h-full filter grayscale blur-lg z-[-900]"
        />
        <div className="absolute inset-0 bg-[#3a3948] bg-opacity-80 backdrop-blur-md z-[-800]"></div>

        <div className="flex items-start z-10 px-14 py-[70px] bg-[#252434] bg-opacity-70 gap-x-8 max-[1024px]:px-6 max-[575px]:flex-col max-[575px]:items-center">
          <img
            src={poster}
            alt={title}
            className="relative w-[180px] h-[270px] max-[575px]:w-[140px] max-[575px]:h-[200px] flex-shrink-0"
          />

          <div className="flex flex-col ml-4 gap-y-5 max-[575px]:items-center max-[575px]:mt-6 max-[1200px]:ml-0">
            <h1 className="text-4xl font-semibold max-[1200px]:text-3xl max-[575px]:text-2xl max-[575px]:text-center">
              {displayTitle}
            </h1>

            <div className="flex flex-wrap w-fit gap-x-2 mt-3">
              {tvInfo?.rating && (
                <span className="text-[14px] font-semibold px-2 py-[1px] border border-gray-400 rounded-2xl">
                  {tvInfo.rating}
                </span>
              )}
              {tvInfo?.quality && (
                <span className="text-[14px] font-semibold px-2 py-[1px] border border-gray-400 rounded-2xl">
                  {tvInfo.quality}
                </span>
              )}
              {tvInfo?.sub && (
                <span className="text-[14px] font-semibold px-2 py-[1px] border border-gray-400 rounded-2xl">
                  Sub: {tvInfo.sub}
                </span>
              )}
              {tvInfo?.dub && (
                <span className="text-[14px] font-semibold px-2 py-[1px] border border-gray-400 rounded-2xl">
                  Dub: {tvInfo.dub}
                </span>
              )}
            </div>

            <Link
              to={`/watch/${id}`}
              className="flex gap-x-2 px-6 py-2 bg-[#FFBADE] w-fit text-black items-center rounded-3xl mt-5"
            >
              <FontAwesomeIcon icon={faPlay} className="text-[14px] mt-[1px]" />
              <p className="text-lg font-medium">Watch Now</p>
            </Link>

            <p className="text-[14px] mt-2 max-[575px]:hidden">
              {description.length > 270 && !isFullOverview
                ? `${description.slice(0, 270)}... `
                : description}
              {description.length > 270 && (
                <span
                  onClick={toggleOverview}
                  className="cursor-pointer text-[#ffbade] font-bold"
                >
                  {isFullOverview ? " - Less" : "+ More"}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full px-4 grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-x-6 max-[1200px]:flex max-[1200px]:flex-col">
        <div className="flex flex-col gap-y-10 mt-8">
          {charactersVoiceActors?.length > 0 && (
            <Voiceactor animeInfo={animeInfo} />
          )}
          {related_data?.length > 0 && (
            <CategoryCard
              label="Related Anime"
              data={related_data}
              showViewMore={false}
            />
          )}
          {recommended_data?.length > 0 && (
            <CategoryCard
              label="Recommended for you"
              data={recommended_data}
              showViewMore={false}
            />
          )}
        </div>

        <div className="mt-8">
          {seasons?.length > 0 && (
            <Sidecard label="More Seasons" data={seasons} />
          )}
          {homeInfo?.most_popular && (
            <Sidecard
              label="Most Popular"
              data={homeInfo.most_popular.slice(0, 10)}
              className="mt-8"
            />
          )}
        </div>
      </div>

      {isVoiceActorListOpen && (
        <VoiceactorList
          id={id}
          isOpen={isVoiceActorListOpen}
          onClose={() => setVoiceActorListOpen(false)}
        />
      )}
    </>
  );
}

AnimeInfo.propTypes = {};

export default AnimeInfo;
