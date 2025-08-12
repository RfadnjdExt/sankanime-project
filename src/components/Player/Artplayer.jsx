import { useEffect, useRef, useState, memo } from "react";
import PropTypes from "prop-types";
import Artplayer from "artplayer";
import Hls from "hls.js";
import artplayerPluginHlsControl from "artplayer-plugin-hls-control";

import { getServers, getStreamInfo } from "../../api/animeApi";
import Loader from "../UI/Loader";

const artplayerPluginChapter = (options) => (art) => {
  console.log(
    "artplayerPluginChapter loaded with options:",
    options,
    "and artplayer instance:",
    art
  );
};

const ArtplayerComponent = memo(
  ({ animeId, episodeId, poster, title, episodeTitle, onNextEpisode }) => {
    const artRef = useRef(null);
    const instanceRef = useRef(null);

    const [servers, setServers] = useState([]);
    const [activeServer, setActiveServer] = useState(null);
    const [streamInfo, setStreamInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const watchHistoryKey = `continueWatching-${animeId}-${episodeId}`;

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        setStreamInfo(null);

        try {
          const availableServers = await getServers(animeId, episodeId);
          if (!availableServers || availableServers.length === 0) {
            throw new Error("Tidak ada server streaming yang tersedia.");
          }
          setServers(availableServers);

          const lastServer = localStorage.getItem(`lastServer-${animeId}`);
          const defaultServer =
            availableServers.find((s) => s.serverName === lastServer) ||
            availableServers[0];
          setActiveServer(defaultServer);

          const info = await getStreamInfo(
            animeId,
            episodeId,
            defaultServer.serverName,
            defaultServer.type
          );
          if (!info || !info.streamingLink?.sources?.[0]?.url) {
            throw new Error("Gagal memuat informasi streaming dari server.");
          }
          setStreamInfo(info);
        } catch (err) {
          console.error("Error fetching stream data:", err);
          setError(err.message || "Gagal memuat video.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [animeId, episodeId]);

    useEffect(() => {
      if (streamInfo && artRef.current) {
        const options = {
          container: artRef.current,
          url: streamInfo.streamingLink.sources[0].url,
          poster: poster,
          title: episodeTitle || title,
          type: "m3u8",
          customType: {
            m3u8: function playM3u8(video, url, art) {
              if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(url);
                hls.attachMedia(video);
                art.hls = hls;
              } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
              } else {
                art.notice.show =
                  "Format streaming HLS tidak didukung di browser ini.";
              }
            },
          },
          autoplay: true,
          autoMini: true,
          setting: true,
          hotkey: true,
          fullscreen: true,
          subtitle: {
            url:
              streamInfo.streamingLink.subtitles?.find(
                (s) => s.lang.toLowerCase() === "english"
              )?.url || "",
            type: "vtt",
            style: {
              color: "#FFFFFF",
              "font-size": "20px",
              "text-shadow": "1px 1px 2px rgba(0,0,0,0.7)",
            },
          },
          quality: streamInfo.streamingLink.sources.map((source) => ({
            html: source.quality,
            url: source.url,
            default: source.quality === "auto",
          })),
          plugins: [
            artplayerPluginHlsControl(),
            artplayerPluginChapter({
              chapters: [
                ...(streamInfo.streamingLink.intro
                  ? [
                      {
                        time: streamInfo.streamingLink.intro.start,
                        end: streamInfo.streamingLink.intro.end,
                        html: "Intro",
                      },
                    ]
                  : []),
                ...(streamInfo.streamingLink.outro
                  ? [
                      {
                        time: streamInfo.streamingLink.outro.start,
                        end: streamInfo.streamingLink.outro.end,
                        html: "Outro",
                      },
                    ]
                  : []),
              ],
            }),
          ],
        };

        instanceRef.current = new Artplayer(options);
        const art = instanceRef.current;

        art.on("ready", () => {
          const lastWatched = JSON.parse(localStorage.getItem(watchHistoryKey));
          if (lastWatched && lastWatched.currentTime > 5) {
            art.seek = lastWatched.currentTime;
            art.notice.show = `Melanjutkan dari ${new Date(
              lastWatched.currentTime * 1000
            )
              .toISOString()
              .substr(11, 8)}`;
          }
        });

        art.on("video:timeupdate", () => {
          if (art.currentTime > 0 && art.duration > 0) {
            const progress = {
              currentTime: art.currentTime,
              duration: art.duration,
            };
            localStorage.setItem(watchHistoryKey, JSON.stringify(progress));
          }
        });

        art.on("video:ended", () => {
          if (onNextEpisode) {
            onNextEpisode();
          }
        });

        art.on("destroy", () => {
          if (art.currentTime > 0 && art.duration > 0) {
            const progress = {
              currentTime: art.currentTime,
              duration: art.duration,
            };
            localStorage.setItem(watchHistoryKey, JSON.stringify(progress));
          }
        });
      }

      return () => {
        if (instanceRef.current) {
          instanceRef.current.destroy(false);
        }
      };
    }, [
      streamInfo,
      onNextEpisode,
      animeId,
      episodeId,
      poster,
      title,
      episodeTitle,
    ]);

    const handleServerChange = async (server) => {
      if (activeServer && activeServer.serverName === server.serverName) return;

      setLoading(true);
      setError(null);
      setActiveServer(server);
      localStorage.setItem(`lastServer-${animeId}`, server.serverName);

      try {
        const info = await getStreamInfo(
          animeId,
          episodeId,
          server.serverName,
          server.type
        );
        if (!info || !info.streamingLink?.sources?.[0]?.url) {
          throw new Error("Gagal memuat informasi streaming dari server ini.");
        }
        setStreamInfo(info);
      } catch (err) {
        setError(err.message || "Gagal memuat video.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="w-full h-full bg-black flex flex-col">
        <div className="w-full h-[56.25vw] max-h-[calc(100vh-150px)] min-h-[200px] relative">
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center">
              <Loader />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex justify-center items-center text-white p-4 text-center">
              {error}
            </div>
          )}
          <div ref={artRef} className="w-full h-full"></div>
        </div>
        <div className="p-2 md:p-4 bg-[#11101A] text-white">
          <h3 className="text-sm font-semibold mb-2">Pilih Server:</h3>
          <div className="flex flex-wrap gap-2">
            {servers.map((server) => (
              <button
                key={server.serverName}
                onClick={() => handleServerChange(server)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors duration-200 ${
                  activeServer?.serverName === server.serverName
                    ? "bg-[#ffbade] text-black"
                    : "bg-[#373646] hover:bg-[#4a4961]"
                }`}
              >
                {server.serverName} ({server.type.toUpperCase()})
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

ArtplayerComponent.displayName = "ArtplayerComponent";

ArtplayerComponent.propTypes = {
  animeId: PropTypes.string.isRequired,
  episodeId: PropTypes.string,
  poster: PropTypes.string,
  title: PropTypes.string,
  episodeTitle: PropTypes.string,
  onNextEpisode: PropTypes.func,
};

export default ArtplayerComponent;
