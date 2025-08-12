import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClosedCaptioning,
  faMicrophone,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import BouncingLoader from "../UI/Loader";

const ServerGroup = ({
  label,
  icon,
  servers,
  activeServerId,
  activeServerName,
  onServerClick,
}) => (
  <div className="servers p-2 flex items-center flex-wrap ml-2 max-[600px]:py-2">
    <div className="flex items-center gap-x-2 w-fit">
      <FontAwesomeIcon icon={icon} className="text-[#ffbade] text-[13px]" />
      <p className="font-bold text-[14px]">{label}:</p>
    </div>
    <div className="flex gap-[7px] ml-4 flex-wrap">
      {servers.map((server, index) => (
        <div
          key={index}
          className={`px-6 py-[5px] rounded-lg cursor-pointer ${
            activeServerId === server.data_id &&
            activeServerName === server.serverName
              ? "bg-[#ffbade] text-black"
              : "bg-[#373646] text-white"
          } max-[700px]:px-3`}
          onClick={() => onServerClick(server)}
        >
          <p className="text-[13px] font-semibold">{server.serverName}</p>
        </div>
      ))}
    </div>
  </div>
);

ServerGroup.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  servers: PropTypes.array.isRequired,
  activeServerId: PropTypes.string,
  activeServerName: PropTypes.string,
  onServerClick: PropTypes.func.isRequired,
};

function Servers({
  servers,
  activeServerId,
  activeServerName,
  setActiveServerId,
  setActiveServerType,
  setActiveServerName,
  serverLoading,
  activeEpisodeNum,
}) {
  const rawServers = servers?.filter((server) => server.type === "raw") || [];
  const subServers = servers?.filter((server) => server.type === "sub") || [];
  const dubServers = servers?.filter((server) => server.type === "dub") || [];

  const handleServerClick = (server) => {
    setActiveServerId(server.data_id);
    setActiveServerType(server.type);
    setActiveServerName(server.serverName);
    localStorage.setItem("server_name", server.serverName);
    localStorage.setItem("server_type", server.type);
  };

  const totalGroups = [rawServers, subServers, dubServers].filter(
    (group) => group.length > 0
  ).length;

  return (
    <div
      className={`relative bg-[#11101A] p-4 w-full min-h-[100px] flex justify-center ${
        totalGroups === 1 ? "items-center" : "items-start"
      } max-[1200px]:bg-[#14151A]`}
    >
      {serverLoading ? (
        <div className="w-full h-full rounded-lg flex justify-center items-center">
          <BouncingLoader />
        </div>
      ) : servers ? (
        <div className="w-full h-full rounded-lg grid grid-cols-[minmax(0,30%),minmax(0,70%)] overflow-hidden max-[800px]:grid-cols-[minmax(0,40%),minmax(0,60%)] max-[600px]:flex max-[600px]:flex-col max-[600px]:rounded-none">
          <div className="h-full bg-[#ffbade] px-6 text-black flex flex-col justify-center items-center gap-y-2 max-[600px]:bg-transparent max-[600px]:h-1/2 max-[600px]:text-white max-[600px]:mb-4">
            <p className="text-center leading-5 font-medium text-[15px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
              You are watching
              <br />
              <span className="font-bold text-[14px]">
                Episode {activeEpisodeNum}
              </span>
            </p>
            <p className="text-center leading-5 font-medium text-[14px]">
              If the current server doesn’t work, please try other servers
              beside.
            </p>
          </div>
          <div className="bg-[#201F31] flex flex-col max-[600px]:h-full">
            {rawServers.length > 0 && (
              <ServerGroup
                label="RAW:"
                icon={faFile}
                servers={rawServers}
                activeServerId={activeServerId}
                activeServerName={activeServerName}
                onServerClick={handleServerClick}
              />
            )}
            {subServers.length > 0 && (
              <ServerGroup
                label="SUB:"
                icon={faClosedCaptioning}
                servers={subServers}
                activeServerId={activeServerId}
                activeServerName={activeServerName}
                onServerClick={handleServerClick}
              />
            )}
            {dubServers.length > 0 && (
              <ServerGroup
                label="DUB:"
                icon={faMicrophone}
                servers={dubServers}
                activeServerId={activeServerId}
                activeServerName={activeServerName}
                onServerClick={handleServerClick}
              />
            )}
          </div>
        </div>
      ) : (
        <p className="font-semibold max-[600px]:text-[#ffbade]">
          Could not load servers <br />
          Either reload or try again after sometime
        </p>
      )}
    </div>
  );
}

Servers.propTypes = {
  servers: PropTypes.array,
  activeServerId: PropTypes.string,
  activeServerName: PropTypes.string,
  setActiveServerId: PropTypes.func.isRequired,
  setActiveServerType: PropTypes.func.isRequired,
  setActiveServerName: PropTypes.func.isRequired,
  serverLoading: PropTypes.bool.isRequired,
  activeEpisodeNum: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Servers;
