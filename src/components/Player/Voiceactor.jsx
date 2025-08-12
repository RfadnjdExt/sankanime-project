import { useState } from "react";

import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import VoiceactorList from "./VoiceactorList";

const Voiceactor = ({ animeInfo, className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (
    !animeInfo ||
    !animeInfo.charactersVoiceActors ||
    animeInfo.charactersVoiceActors.length === 0
  ) {
    return null;
  }

  const previewCharacters = animeInfo.charactersVoiceActors.slice(0, 6);

  return (
    <div className={`w-full mt-8 flex flex-col gap-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl text-[#ffbade] max-[478px]:text-[18px] capitalize">
          Characters & Voice Actors
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex w-fit items-baseline h-fit rounded-3xl gap-x-1 group"
        >
          <p className="text-white text-[12px] font-semibold h-fit leading-0">
            View more
          </p>
          <FontAwesomeIcon
            icon={faChevronRight}
            className="text-white text-[10px]"
          />
        </button>
      </div>

      <div className="w-full grid grid-cols-3 max-[1024px]:grid-cols-2 max-[758px]:grid-cols-1 gap-4">
        {previewCharacters.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-3 py-4 rounded-md bg-[#373646]"
          >
            {item.character && (
              <div className="w-[50%] float-left overflow-hidden">
                <div className="flex gap-x-3 items-center">
                  {item.character.poster && (
                    <img
                      src={item.character.poster}
                      alt={item.character.name}
                      className="w-[45px] h-[45px] flex-shrink-0 rounded-full object-cover"
                    />
                  )}
                  <div className="flex flex-col justify-center">
                    {item.character.name && (
                      <h4 className="text-[13px] text-left leading-[1.3em] font-[400] mb-0 overflow-hidden -webkit-box -webkit-line-clamp-2 -webkit-box-orient-vertical">
                        {item.character.name}
                      </h4>
                    )}
                    {item.character.cast && (
                      <p className="text-[11px] mt-[3px]">
                        {item.character.cast}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {item.voiceActors &&
              item.voiceActors.length > 0 &&
              item.voiceActors[0] && (
                <div className="w-[50%] float-right overflow-hidden">
                  <div className="w-full flex justify-end gap-x-2">
                    <div className="flex flex-col justify-center text-right">
                      {item.voiceActors[0].name && (
                        <span className="text-[13px] text-right leading-[1.3em] font-[400] mb-0 overflow-hidden -webkit-box -webkit-line-clamp-2 -webkit-box-orient-vertical w-fit">
                          {item.voiceActors[0].name}
                        </span>
                      )}
                    </div>
                    {item.voiceActors[0].poster && (
                      <img
                        src={item.voiceActors[0].poster}
                        alt={item.voiceActors[0].name}
                        className="w-[45px] h-[45px] rounded-full object-cover flex-shrink-0"
                      />
                    )}
                  </div>
                </div>
              )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <VoiceactorList
          id={animeInfo.id}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

Voiceactor.propTypes = {
  className: PropTypes.string,
  animeInfo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    charactersVoiceActors: PropTypes.arrayOf(
      PropTypes.shape({
        character: PropTypes.shape({
          name: PropTypes.string,
          poster: PropTypes.string,
          cast: PropTypes.string,
        }),
        voiceActors: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            poster: PropTypes.string,
          })
        ),
      })
    ),
  }),
};

export default Voiceactor;
