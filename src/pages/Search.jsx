import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { getSearch } from "../api/animeApi";

import CategoryCard from "../components/Carousel/CategoryCard";
import Sidecard from "../components/Carousel/Sidecard";
import PageSlider from "../components/UI/PageSlider";
import Loader from "../components/Loader";

import SidecardLoader from "../components/Loader/SidecardLoader";
import Top10 from "../components/Carousel/Topten";

import { useHomeInfo } from "../context/HomeInfoContext";

function Search() {
  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const currentPage = parseInt(searchParams.get("page"), 10) || 1;

  const { homeInfo, homeInfoLoading } = useHomeInfo();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!keyword) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getSearch(keyword, currentPage);
        if (response && response.data && Array.isArray(response.data)) {
          setResults(response.data);
          setTotalPages(response.totalPage || 1);
        } else {
          setResults([]);
          setTotalPages(0);
        }
      } catch (err) {
        console.error("Error fetching search data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    window.scrollTo(0, 0);
  }, [keyword, currentPage]);

  const handlePageChange = (page) => {
    setSearchParams({ keyword, page: page.toString() });
  };

  if (loading) {
    return <Loader type="category" />;
  }

  if (error) {
    navigate("/error-page");
    return null;
  }

  if (!keyword) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-white">
        Please enter a search keyword.
      </div>
    );
  }

  return (
    <div className="w-full px-4 mt-[128px] grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-x-6 max-[1200px]:flex max-[1200px]:flex-col max-[1200px]:gap-y-10 max-custom-md:mt-[80px] max-[478px]:mt-[60px]">
      <div className="w-full flex flex-col gap-y-10">
        {results.length > 0 ? (
          <>
            <CategoryCard
              label={`Search results for: ${keyword}`}
              data={results}
              showViewMore={false}
              className="mt-0"
              categoryPage={true}
            />
            {totalPages > 1 && (
              <PageSlider
                page={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div>
            <h1 className="font-bold text-2xl text-[#ffbade] max-[478px]:text-[18px]">
              Search results for: {keyword}
            </h1>
            <p className="text-gray-400 mt-2">No results found.</p>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col gap-y-10">
        {homeInfoLoading ? (
          <SidecardLoader />
        ) : (
          <>
            {homeInfo?.most_popular && (
              <Sidecard
                data={homeInfo.most_popular}
                className="mt-0"
                label="Most Popular"
              />
            )}
            {homeInfo?.topten && <Top10 data={homeInfo.topten} />}
          </>
        )}
      </div>
    </div>
  );
}

export default Search;
