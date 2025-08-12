import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faForward } from "@fortawesome/free-solid-svg-icons";

const ToggleButton = ({ label, isActive, onClick }) => {
  return (
    <button className="flex gap-x-2 items-center" onClick={onClick}>
      <h1 className="capitalize text-[13px] font-medium text-white">{label}</h1>
      <span
        className={`capitalize text-[13px] ${
          isActive ? "text-[#ffbade]" : "text-red-500"
        }`}
      >
        {isActive ? "on" : "off"}
      </span>
    </button>
  );
};

ToggleButton.propTypes = {
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

/**
 * Komponen untuk kontrol tambahan seperti auto-play, auto-next, dan navigasi episode.
 * @param {object} props
 * @param {boolean} props.autoPlay - Status auto-play aktif atau tidak.
 * @param {function} props.setAutoPlay - Fungsi untuk mengubah status auto-play.
 * @param {boolean} props.autoSkipIntro - Status auto-skip-intro aktif atau tidak.
 * @param {function} props.setAutoSkipIntro - Fungsi untuk mengubah status auto-skip-intro.
 * @param {boolean} props.autoNext - Status auto-next aktif atau tidak.
 * @param {function} props.setAutoNext - Fungsi untuk mengubah status auto-next.
 * @param {string} props.episodeId - ID episode yang sedang diputar.
 * @param {Array} props.episodes - Daftar semua episode.
 * @param {function} props.onButtonClick - Callback untuk menangani klik tombol next/previous.
 */
const WatchControls = ({
  autoPlay,
  setAutoPlay,
  autoSkipIntro,
  setAutoSkipIntro,
  autoNext,
  setAutoNext,
  episodeId,
  episodes = [],
  onButtonClick,
}) => {
  const currentEpisodeIndex = React.useMemo(() => {
    return episodes.findIndex((ep) => {
      const match = ep.id.match(/ep=(\d+)/);
      return match ? match[1] === episodeId : false;
    });
  }, [episodeId, episodes]);

  const handleNextClick = () => {
    if (currentEpisodeIndex < episodes.length - 1) {
      const nextEpisode = episodes[currentEpisodeIndex + 1];
      const nextEpId = nextEpisode.id.match(/ep=(\d+)/)?.[1];
      if (nextEpId) {
        onButtonClick(nextEpId);
      }
    }
  };

  const handlePrevClick = () => {
    if (currentEpisodeIndex > 0) {
      const prevEpisode = episodes[currentEpisodeIndex - 1];
      const prevEpId = prevEpisode.id.match(/ep=(\d+)/)?.[1];
      if (prevEpId) {
        onButtonClick(prevEpId);
      }
    }
  };

  return (
    <div className="bg-[#11101A] w-full flex justify-between flex-wrap px-4 pt-4 max-[1200px]:bg-[#14151A] max-[375px]:flex-col max-[375px]:gap-y-2">
      <div className="flex gap-x-6 max-[575px]:gap-x-4 max-[375px]:justify-end">
        <ToggleButton
          label="auto play"
          isActive={autoPlay}
          onClick={() => setAutoPlay((prev) => !prev)}
        />
        <ToggleButton
          label="auto skip intro"
          isActive={autoSkipIntro}
          onClick={() => setAutoSkipIntro((prev) => !prev)}
        />
        <ToggleButton
          label="auto next"
          isActive={autoNext}
          onClick={() => setAutoNext((prev) => !prev)}
        />
      </div>

      <div className="flex gap-x-2">
        <button onClick={handlePrevClick} disabled={currentEpisodeIndex <= 0}>
          <FontAwesomeIcon
            icon={faBackward}
            className="text-[20px] max-[575px]:text-[16px] text-white"
          />
        </button>
        <button
          onClick={handleNextClick}
          disabled={currentEpisodeIndex >= episodes.length - 1}
        >
          <FontAwesomeIcon
            icon={faForward}
            className="text-[20px] max-[575px]:text-[16px] text-white"
          />
        </button>
      </div>
    </div>
  );
};

WatchControls.propTypes = {
  autoPlay: PropTypes.bool.isRequired,
  setAutoPlay: PropTypes.func.isRequired,
  autoSkipIntro: PropTypes.bool.isRequired,
  setAutoSkipIntro: PropTypes.func.isRequired,
  autoNext: PropTypes.bool.isRequired,
  setAutoNext: PropTypes.func.isRequired,
  episodeId: PropTypes.string,
  episodes: PropTypes.array,
  onButtonClick: PropTypes.func.isRequired,
};

export default WatchControls;
