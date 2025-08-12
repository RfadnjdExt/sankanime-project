import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Komponen untuk navigasi halaman.
 * @param {{
 *   page: number;
 *   totalPages: number;
 *   handlePageChange: (page: number) => void;
 *   start?: boolean;
 *   style?: React.CSSProperties;
 * }} props
 */
const PageSlider = ({
  page,
  totalPages,
  handlePageChange,
  start = false,
  style,
}) => {
  const generatePageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 1) {
      return null;
    }

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (page === 1) {
        pageNumbers.push(1, 2, 3);
      } else if (page === 2) {
        pageNumbers.push(1, 2, 3, 4);
      } else if (page === totalPages) {
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
      } else if (page === totalPages - 1) {
        pageNumbers.push(
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(page - 2, page - 1, page, page + 1, page + 2);
      }
    }

    return pageNumbers.map((p) => (
      <button
        key={p}
        onClick={() => handlePageChange(p)}
        className={`w-[40px] text-[15px] mx-1 flex justify-center items-center p-2 rounded-full font-bold ${
          page === p
            ? "bg-[#ffbade] text-[#2B2A3C] cursor-default"
            : `${
                start ? "bg-[#353537]" : "bg-[#2B2A3C]"
              } text-[#999] hover:text-[#ffbade]`
        }`}
      >
        {p}
      </button>
    ));
  };

  const buttonStyle = `w-[40px] mx-1 p-2 ${
    start ? "bg-[#353537]" : "bg-[#2B2A3C]"
  } rounded-full text-[#999] text-[8px] hover:text-[#ffbade]`;

  return (
    <div
      className={`flex ${
        start ? "justify-start" : "justify-center"
      } items-center mt-12 overflow-hidden`}
      style={style}
    >
      <div className="w-fit flex justify-center items-center">
        {page > 1 && totalPages > 2 && (
          <button onClick={() => handlePageChange(1)} className={buttonStyle}>
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </button>
        )}

        {page > 1 && (
          <button
            onClick={() => page > 0 && handlePageChange(page - 1)}
            className={buttonStyle}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        )}

        {generatePageNumbers()}

        {page < totalPages && (
          <button
            onClick={() => page < totalPages && handlePageChange(page + 1)}
            className={buttonStyle}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        )}

        {page < totalPages && totalPages > 2 && (
          <button
            onClick={() => handlePageChange(totalPages)}
            className={buttonStyle}
          >
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </button>
        )}
      </div>
    </div>
  );
};

PageSlider.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  start: PropTypes.bool,
  style: PropTypes.object,
};

export default PageSlider;
