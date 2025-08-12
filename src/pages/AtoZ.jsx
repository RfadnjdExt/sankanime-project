import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";

import { getCategoryInfo } from "../api/animeApi";
import CategoryCard from "../components/Carousel/CategoryCard";
import PageSlider from "../components/UI/PageSlider";
import Loader from "../components/Loader";
import Error from "./NotFound";

function AtoZ() {
  const { letter } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [animeList, setAnimeList] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const currentLetter = letter || "#";

  useEffect(() => {
    const fetchAnimeByLetter = async () => {
      setIsLoading(true);
      setError(null);
      window.scrollTo(0, 0);

      try {
        const path = letter ? `az-list/${letter}` : "az-list/%23";
        const result = await getCategoryInfo(path, currentPage);
        if (result && result.data) {
          setAnimeList(result.data);
          setTotalPages(result.totalPages);
        } else {
          setAnimeList([]);
          setTotalPages(0);
        }
      } catch (err) {
        console.error("Error fetching A-Z list:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnimeByLetter();
  }, [letter, currentPage]);

  const handlePageChange = (page) => {
    setSearchParams({ page });
  };

  const alphabet = [
    "#",
    ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
  ];

  if (isLoading) {
    return <Loader type="category" />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="max-w-[1260px] mx-auto px-[15px] flex flex-col mt-[100px] max-md:mt-[50px]">
      <ul className="flex gap-x-2 items-center w-fit">
        <li className="flex gap-x-3 items-center">
          <Link
            to="/home"
            className="text-white hover:text-[#ffbade] text-[17px] font-semibold"
          >
            Home
          </Link>
          <div className="dot mt-[1px] bg-white" />
        </li>
        <li className="text-[15px] font-light">A-Z List</li>
      </ul>

      <div className="flex flex-col gap-y-5 mt-6">
        <h1 className="font-bold text-2xl text-[#ffbade] max-[478px]:text-[18px]">
          Sort By Letters
        </h1>
        <div className="flex gap-x-[7px] flex-wrap justify-start gap-y-2 max-md:justify-start">
          {alphabet.map((char) => {
            const pathChar = char === "#" ? "other" : char.toLowerCase();
            const isActive = currentLetter.toLowerCase() === pathChar;
            return (
              <Link
                key={char}
                to={`/az-list/${pathChar}`}
                className={`text-md bg-[#373646] py-1 px-4 rounded-md font-bold hover:text-black hover:bg-[#FFBADE] hover:cursor-pointer transition-all ease-out ${
                  isActive ? "text-black bg-[#FFBADE]" : ""
                }`}
              >
                {char}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="w-full flex flex-col gap-y-10 mt-10">
        {animeList && animeList.length > 0 ? (
          <>
            <CategoryCard
              data={animeList}
              label={`${currentLetter.toUpperCase()} Anime`}
              showViewMore={false}
              className="mt-0"
              categoryPage
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
          <p className="text-center text-gray-400">Nothing is here.</p>
        )}
      </div>
    </div>
  );
}

export default AtoZ;
