import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Artplayer from "artplayer";
import Hls from "hls.js";
import artplayerPluginChapter from "artplayer-plugin-chapter";

import Skeleton from "../components/UI/Skeleton";
import Voiceactor from "../components/Player/Voiceactor";
import CategoryCard from "../components/UI/CategoryCard";
import Loader from "../components/Loader";
import Error from "./NotFound";
import Episodelist from "../components/Player/Episodelist";
import Servers from "../components/Player/Servers";
import WatchControls from "../components/Player/WatchControls.jsx";
import Sidecard from "../components/UI/Sidecard";
import AnimeInfoCard from "../components/Player/AnimeInfoCard";

import {
  fetchAnimeInfo,
  getEpisodes,
  getServers,
  getStreamInfo,
  getNextEpisodeSchedule,
} from "../api/animeApi";

import useAuth from "../hooks/useAuth.js";
import { db } from "../api/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { useHomeInfo } from "../context/HomeInfoContext";

function Watch() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const episodeIdFromUrl = searchParams.get("ep");
  const user = useAuth();
  const { homeInfo } = useHomeInfo();

  const [animeInfo, setAnimeInfo] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [servers, setServers] = useState([]);
  const [streamInfo, setStreamInfo] = useState(null);
  const [nextEpisodeSchedule, setNextEpisodeSchedule] = useState(null);

  const [activeEpisodeId, setActiveEpisodeId] = useState(null);
  const [activeServerId, setActiveServerId] = useState(null);
  const [activeServerType, setActiveServerType] = useState("sub");
  const [loading, setLoading] = useState(true);
  const [streamLoading, setStreamLoading] = useState(true);
  const [error, setError] = useState(null);

  const [autoPlay, setAutoPlay] = useState(
    () => JSON.parse(localStorage.getItem("autoPlay")) || true
  );
  const [autoSkipIntro, setAutoSkipIntro] = useState(
    () => JSON.parse(localStorage.getItem("autoSkipIntro")) || true
  );
  const [autoNext, setAutoNext] = useState(
    () => JSON.parse(localStorage.getItem("autoNext")) || true
  );

  const artplayerRef = useRef(null);
  const watchTimeRef = useRef(0);
  const hasFetchedStream = useRef(false);
  const [isFullOverview, setIsFullOverview] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [animeData, episodesData] = await Promise.all([
          fetchAnimeInfo(id),
          getEpisodes(id),
        ]);

        if (!animeData || !episodesData?.episodes?.length) {
          throw new Error("Anime or episodes not found");
        }

        setAnimeInfo(animeData);
        setEpisodes(episodesData.episodes);

        const continueWatching = JSON.parse(
          localStorage.getItem("continueWatching") || "[]"
        ).find((item) => item.id === id);
        const initialEpisode =
          episodeIdFromUrl ||
          continueWatching?.episodeId ||
          episodesData.episodes[0]?.id;
        setActiveEpisodeId(initialEpisode);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Failed to load anime data. Please try again later.");
        navigate("/404-not-found-page");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id, navigate]);

  useEffect(() => {
    if (!activeEpisodeId) return;

    const fetchServersAndStream = async () => {
      setStreamLoading(true);
      hasFetchedStream.current = false;
      try {
        const serverData = await getServers(id, activeEpisodeId);
        if (!serverData?.length) throw new Error("No servers available");
        setServers(serverData);

        const savedServer = localStorage.getItem("server_name");
        const defaultServer =
          serverData.find((s) => s.serverName === savedServer) ||
          serverData.find((s) => s.serverName === "vidcloud") ||
          serverData[0];

        setActiveServerId(defaultServer.data_id);
        setActiveServerType(defaultServer.type);
      } catch (err) {
        console.error("Error fetching servers:", err);
        setError("Could not load streaming servers for this episode.");
      }
    };

    fetchServersAndStream();
  }, [id, activeEpisodeId]);

  useEffect(() => {
    if (!activeServerId || !activeServerType || hasFetchedStream.current)
      return;

    const fetchStream = async () => {
      setStreamLoading(true);
      try {
        const streamData = await getStreamInfo(
          id,
          activeEpisodeId,
          activeServerId,
          activeServerType
        );
        if (!streamData?.streamingLink?.file)
          throw new Error("Could not retrieve stream link.");

        setStreamInfo(streamData);
        hasFetchedStream.current = true;
      } catch (err) {
        console.error("Error fetching stream info:", err);
        setError("Failed to get video stream. Please try another server.");
      } finally {
        setStreamLoading(false);
      }
    };

    fetchStream();
  }, [id, activeEpisodeId, activeServerId, activeServerType]);

  useEffect(() => {
    getNextEpisodeSchedule(id).then(setNextEpisodeSchedule);
  }, [id]);

  const saveWatchHistory = useCallback(() => {
    if (!animeInfo || !activeEpisodeId || watchTimeRef.current < 1) return;

    const activeEpisode = episodes.find((ep) => ep.id === activeEpisodeId);
    if (!activeEpisode) return;

    const historyEntry = {
      id: animeInfo.id,
      title: animeInfo.title,
      japanese_title: animeInfo.japanese_title,
      poster: animeInfo.poster,
      episodeId: activeEpisodeId,
      episodeNum: activeEpisode.episode_no,
      watchTime: watchTimeRef.current,
      duration: artplayerRef.current?.duration || 0,
      timestamp: Date.now(),
    };

    let history = JSON.parse(localStorage.getItem("continueWatching") || "[]");
    history = history.filter((item) => item.id !== animeInfo.id);
    history.unshift(historyEntry);
    localStorage.setItem(
      "continueWatching",
      JSON.stringify(history.slice(0, 50))
    );
    if (user) {
      const userHistoryRef = doc(db, "history", user.uid);
      getDoc(userHistoryRef).then((docSnap) => {
        const existingData = docSnap.exists() ? docSnap.data().data : [];
        const updatedData = existingData.filter(
          (item) => item.id !== animeInfo.id
        );
        updatedData.unshift(historyEntry);
        setDoc(userHistoryRef, { data: updatedData.slice(0, 100) });
      });
    }
  }, [animeInfo, activeEpisodeId, episodes, user]);

  useEffect(() => {
    return () => {
      saveWatchHistory();
      watchTimeRef.current = 0;
    };
  }, [activeEpisodeId, saveWatchHistory]);

  useEffect(() => {
    if (!streamInfo || !artplayerRef.current) return;

    const art = new Artplayer({
      container: artplayerRef.current,
      url: streamInfo.streamingLink.file,
      poster: animeInfo.poster,
      title: `${animeInfo.title} - Episode ${
        episodes.find((ep) => ep.id === activeEpisodeId)?.episode_no || ""
      }`,
      volume: 0.7,
      isLive: false,
      muted: false,
      autoplay: autoPlay,
      pip: true,
      autoSize: true,
      setting: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      miniProgressBar: true,
      playsInline: true,
      lock: true,
      fastForward: true,
      autoOrientation: true,
      airplay: true,
      theme: "#ffbade",
      lang: "en",
      customType: {
        m3u8: function (video, url) {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
          } else {
            video.src = url;
          }
        },
      },
      subtitle: {
        url:
          streamInfo.streamingLink.subtitles?.find(
            (s) => s.label.toLowerCase() === "english"
          )?.file || "",
        type: "vtt",
        style: { color: "#fff", "font-size": "20px" },
        encoding: "utf-8",
      },
      plugins: [
        artplayerPluginChapter({
          chapters: [
            ...(streamInfo.streamingLink.intro
              ? [
                  {
                    start: streamInfo.streamingLink.intro.start,
                    end: streamInfo.streamingLink.intro.end,
                    title: "Intro",
                  },
                ]
              : []),
            ...(streamInfo.streamingLink.outro
              ? [
                  {
                    start: streamInfo.streamingLink.outro.start,
                    end: streamInfo.streamingLink.outro.end,
                    title: "Outro",
                  },
                ]
              : []),
          ].sort((a, b) => a.start - b.start),
        }),
      ],
    });

    art.on("ready", () => {
      const continueWatching = JSON.parse(
        localStorage.getItem("continueWatching") || "[]"
      ).find((item) => item.id === id);
      if (
        continueWatching &&
        continueWatching.episodeId === activeEpisodeId &&
        continueWatching.watchTime > 0
      ) {
        art.seek = continueWatching.watchTime;
        art.notice.show = `Melanjutkan dari ${new Date(
          continueWatching.watchTime * 1000
        )
          .toISOString()
          .substr(14, 5)}`;
      }
    });

    art.on("video:timeupdate", () => {
      watchTimeRef.current = art.currentTime;
      if (autoSkipIntro && streamInfo.streamingLink.intro) {
        if (
          art.currentTime >= streamInfo.streamingLink.intro.start &&
          art.currentTime < streamInfo.streamingLink.intro.end
        ) {
          art.seek = streamInfo.streamingLink.intro.end;
        }
      }
    });

    art.on("video:ended", () => {
      if (autoNext) {
        const currentIndex = episodes.findIndex(
          (ep) => ep.id === activeEpisodeId
        );
        if (currentIndex < episodes.length - 1) {
          setActiveEpisodeId(episodes[currentIndex + 1].id);
        }
      }
    });

    return () => {
      art.destroy(false);
    };
  }, [streamInfo]);

  if (loading) {
    return <Loader type="animeInfo" />;
  }

  if (error) {
    return <Error error={error} />;
  }

  const activeEpisodeNum = episodes.find(
    (ep) => ep.id === activeEpisodeId
  )?.episode_no;

  return (
    <div className="w-full mt-[64px] max-md:mt-[50px]">
      <div className="w-full relative px-4 grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-x-6 max-[1200px]:flex max-[1200px]:flex-col">
        <div className="w-full flex flex-col gap-y-8">
          <div className="player w-full h-fit bg-black flex flex-col">
            <div className="w-full relative h-[480px] max-[1200px]:h-[48vw] max-[600px]:h-[65vw]">
              {streamLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <div ref={artplayerRef} className="w-full h-full"></div>
              )}
            </div>
            <WatchControls
              autoPlay={autoPlay}
              setAutoPlay={setAutoPlay}
              autoSkipIntro={autoSkipIntro}
              setAutoSkipIntro={setAutoSkipIntro}
              autoNext={autoNext}
              setAutoNext={setAutoNext}
              episodes={episodes}
              episodeId={activeEpisodeId}
              onButtonClick={setActiveEpisodeId}
            />
            <Servers
              servers={servers}
              activeEpisodeNum={activeEpisodeNum}
              activeServerId={activeServerId}
              activeServerType={activeServerType}
              setActiveServerId={setActiveServerId}
              setActiveServerType={setActiveServerType}
              serverLoading={streamLoading}
            />
          </div>
          <AnimeInfoCard
            animeInfo={animeInfo}
            nextEpisodeSchedule={nextEpisodeSchedule}
            isFullOverview={isFullOverview}
            setIsFullOverview={setIsFullOverview}
          />
          <Voiceactor animeInfo={animeInfo} />
          {animeInfo.related_data?.length > 0 && (
            <CategoryCard
              label="Related Anime"
              data={animeInfo.related_data}
              showViewMore={false}
            />
          )}
        </div>

        <div className="flex flex-col gap-y-10">
          <Episodelist
            episodes={episodes}
            currentEpisode={activeEpisodeId}
            onEpisodeClick={setActiveEpisodeId}
            totalEpisodes={episodes.length}
          />
          {homeInfo?.most_popular && (
            <Sidecard
              label="Most Popular"
              data={homeInfo.most_popular.slice(0, 10)}
              limit={10}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Watch;
