import PropTypes from "prop-types";
import Skeleton from "../UI/Skeleton";

const SidecardLoader = ({ className }) => {
  return (
    <div className={`flex flex-col space-y-6 ${className}`}>
      <Skeleton className="w-[200px] h-[15px]" />

      <div className="flex flex-col space-y-4 bg-[#2B2A3C] p-4 pt-8 w-full">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="flex pb-4 items-center"
            style={{
              borderBottom:
                index + 1 < 10 ? "1px solid rgba(255, 255, 255, .075)" : "none",
            }}
          >
            <div className="flex items-center gap-x-4 w-full">
              <Skeleton className="w-[60px] h-[75px] rounded-md flex-shrink-0" />

              <div className="flex flex-col ml-4 space-y-2 w-[60%]">
                <Skeleton className="w-[90%] h-[15px]" />

                <div className="flex flex-wrap items-center space-x-1">
                  <Skeleton className="w-[30%] h-[15px]" />
                  <Skeleton className="w-[30%] h-[15px]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

SidecardLoader.propTypes = {
  className: PropTypes.string,
};

export default SidecardLoader;
