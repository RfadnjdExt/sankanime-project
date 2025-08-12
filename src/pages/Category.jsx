import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { getCategoryInfo } from "../api/animeApi";
import { useHomeInfo } from "../context/HomeInfoContext";

import CategoryCard from "../components/Carousel/CategoryCard";
import PageSlider from "../components/UI/PageSlider";
import Loader from "../components/Loader";
import Error from "./NotFound";
import SidecardLoader from "../components/Loader/SidecardLoader";
import Topten from "../components/Carousel/Topten";

/**
 * Komponen Halaman Kategori.
 * Menampilkan daftar anime berdasarkan path yang diberikan (misal: 'top-airing', 'genre/action').
 * @param {object} props - Props yang dilewatkan dari Router.
 * @param {string} props.path - Path API untuk kategori (misal: 'top-airing').
 * @param {string} props.label - Label yang akan ditampilkan sebagai judul halaman (misal: 'Top Airing').
 */
function Category({ path, label }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { homeInfo, homeInfoLoading } = useHomeInfo();

  const [animeList, setAnimeList] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCategoryInfo(path, currentPage);
        if (data && data.data && data.data.length > 0) {
          setAnimeList(data.data);
          setTotalPages(data.totalPages);
        } else {
          navigate("/404-not-found-page");
        }
      } catch (err) {
        console.error("Error fetching category info:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
    window.scrollTo(0, 0);
  }, [path, currentPage, navigate]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  if (isLoading) {
    return <Loader type="category" />;
  }

  if (error) {
    return <Error />;
  }

  if (!animeList) {
    return <p>Nothing is here.</p>;
  }

  return (
    <div className="w-full px-4 mt-[100px] grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-x-6 max-[1200px]:flex max-[1200px]:flex-col">
      <div>
        <CategoryCard
          label={label
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())}
          data={animeList}
          showViewMore={false}
          className="mt-0"
          categoryPage={true}
        />
        <PageSlider
          page={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>

      <div className="w-full flex flex-col gap-y-10">
        {homeInfoLoading ? (
          <SidecardLoader />
        ) : (
          <>
            {homeInfo?.topten && (
              <Topten data={homeInfo.topten} className="mt-0" />
            )}
          </>
        )}
      </div>
    </div>
  );
}

Category.propTypes = {
  path: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default Category;
