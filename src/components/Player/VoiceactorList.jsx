import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { fetchVoiceActorInfo } from "../../api/animeApi";
import VoiceActorlistLoader from "./VoiceActorlistLoader";
import PageSlider from "../UI/PageSlider";
import Error from "../../pages/Error";
import { toggleScrollbar } from "../../utils/dom";
import { cleanupScrollbar } from "../../utils/dom";

function VoiceactorList({ id, isOpen, onClose }) {
  const navigate = useNavigate();

  const [voiceActors, setVoiceActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isOpen) return;

    const getVoiceActors = async () => {
      setLoading(true);
      try {
        const response = await fetchVoiceActorInfo(id, page);
        if (response && response.data) {
          setVoiceActors(response.data);
          setTotalPages(response.totalPages);
        } else {
          throw new Error("Data tidak ditemukan");
        }
      } catch (err) {
        console.error("Gagal mengambil info pengisi suara:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getVoiceActors();
  }, [id, page, isOpen]);

  useEffect(() => {
    toggleScrollbar(isOpen);
    return () => {
      cleanupScrollbar();
    };
  }, [isOpen]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (!isOpen) {
    return null;
  }

  if (error) {
    navigate("/error-page");
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-screen h-screen overflow-y-auto bg-black/80 z-50 flex justify-center py-10 max-[575px]:py-3">
      <div className="w-[920px] h-fit flex flex-col relative backdrop-blur-[10px] rounded-lg p-6 bg-white/10 max-[1000px]:w-[80vw] max-md:w-[90vw] max-[480px]:p-3">
        {!loading && (
          <h2 className="text-2xl font-bold col-span-2 max-[480px]:text-lg">
            Characters & Voice Actors
          </h2>
        )}

        {loading ? (
          <VoiceActorlistLoader />
        ) : (
          <div className="w-full grid grid-cols-2 gap-4 mt-5 max-[1000px]:grid-cols-1">
            {voiceActors.map((item, index) => (
              <div
                key={index}
                className="flex p-4 items-center justify-between py-2 bg-[#444445] rounded-lg h-[80px] max-[480px]:p-1 max-[480px]:bg-transparent max-[480px]:rounded-none max-[480px]:border-b-[1px] border-dotted max-[480px]:h-[60px] max-[480px]:pb-4"
              >
                <div className="flex gap-x-2 items-center w-[50%] overflow-hidden">
                  {item.character.poster && (
                    <img
                      src={item.character.poster}
                      className="w-[45px] h-[45px] rounded-full flex-shrink-0 object-cover hover:cursor-pointer max-[480px]:w-[30px] max-[480px]:h-[30px]"
                      onError={(e) => {
                        e.target.src =
                          "https://i.postimg.cc/HnHKvHpz/no-avatar.jpg";
                      }}
                    />
                  )}
                  <div className="flex flex-col text-left gap-y-1 w-full">
                    {item.character.name && (
                      <h1 className="text-[13px] font-semibold max-[480px]:text-[11px]">
                        {item.character.name}
                      </h1>
                    )}
                    {item.character.cast && (
                      <p className="text-[12px] font-light max-[480px]:text-[10px]">
                        {item.character.cast}
                      </p>
                    )}
                  </div>
                </div>

                {item.voiceActors &&
                  item.voiceActors.length > 0 &&
                  (item.voiceActors.length > 1 ? (
                    <div className="flex flex-wrap gap-x-[4px] items-center justify-end w-[50%] max-sm:flex-nowrap max-sm:overflow-auto max-[350px]:justify-start max-sm:py-3">
                      {item.voiceActors.map((va, vaIndex) => (
                        <img
                          key={vaIndex}
                          src={va.poster}
                          className="w-[41px] h-[41px] opacity-70 cursor-pointer rounded-full flex-shrink-0 object-cover grayscale hover:grayscale-0 hover:opacity-100 max-[480px]:w-[30px] max-[480px]:h-[30px] transition-all duration-300 ease-in-out"
                          title={va.name}
                          style={{
                            border: "4px solid rgba(105, 108, 117, 0.8)",
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://i.postimg.cc/HnHKvHpz/no-avatar.jpg";
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-x-2 w-[50%] overflow-hidden max-[480px]:flex-wrap max-[480px]:flex-col-reverse max-[480px]:items-end max-[480px]:gap-y-1">
                      {item.voiceActors[0]?.name && (
                        <p className="text-right text-[13px] max-[480px]:text-[11px]">
                          {item.voiceActors[0].name}
                        </p>
                      )}
                      <img
                        src={item.voiceActors[0].poster}
                        alt={item.voiceActors[0].name}
                        title={item.voiceActors[0].name}
                        loading="lazy"
                        className="w-[45px] h-[45px] rounded-full opacity-70 flex-shrink-0 object-cover grayscale hover:grayscale-0 hover:opacity-100 max-[480px]:w-[30px] max-[480px]:h-[30px] transition-all duration-300 ease-in-out"
                        onError={(e) => {
                          e.target.src =
                            "https://i.postimg.cc/HnHKvHpz/no-avatar.jpg";
                        }}
                      />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white w-[30px] h-[30px] p-2 rounded-full text-3xl absolute z-[1000] top-[-14px] right-[-14px] hover:text-[#FFBADE] cursor-pointer transform transition-all ease-in-out duration-300 flex items-center justify-center hover:bg-[#ffbade] max-md:top-0 max-md:right-0 max-md:rounded-none max-md:rounded-bl-lg max-md:rounded-tr-lg">
          <button
            className="text-black mb-[6px] font-semibold"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <PageSlider
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          start={true}
          style={{ marginTop: "10px" }}
        />
      </div>
    </div>
  );
}

VoiceactorList.propTypes = {
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VoiceactorList;
