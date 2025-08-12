import { useHomeInfo } from "../context/HomeInfoContext";
import Spotlight from "../components/Carousel/Spotlight";
import ContinueWatching from "../components/ContinueWatching";
import Trending from "../components/Carousel/Trending";
import CategoryCard from "../components/Carousel/CategoryCard";
import Cart from "../components/Cart";
import Topten from "../components/Carousel/Topten";
import Schedule from "../components/Schedule";
import Genre from "../components/Genre";
import LoginButton from "../components/LoginButton";
import Loader from "../components/Loader";
import Error from "./NotFound";
import NoticeBanner from "../components/NoticeBanner";
import { website_name } from "../config/website";

const cartSections = [
  { label: "Top Airing", dataKey: "topAiring", path: "top-airing" },
  { label: "Most Popular", dataKey: "mostPopular", path: "most-popular" },
  { label: "Most Favorite", dataKey: "mostFavorite", path: "most-favorite" },
  { label: "Latest Completed", dataKey: "latestCompleted", path: "completed" },
];

const Home = () => {
  const { homeInfo, homeInfoLoading, error } = useHomeInfo();

  if (homeInfoLoading) {
    return <Loader type="home" />;
  }

  if (error || !homeInfo) {
    return <Error />;
  }

  return (
    <>
      <div className="px-4 w-full max-[1200px]:px-0">
        <Spotlight spotlights={homeInfo.spotlights || []} />

        <div className="pl-3 sm:pl-4 mt-2 mb-4">
          <LoginButton />
        </div>

        <ContinueWatching />

        <Trending trending={homeInfo.trending || []} />

        <CategoryCard
          label="Latest Episode"
          data={homeInfo.latestEpisode || []}
          className="mt-[60px]"
          path="recently-updated"
          limit={12}
        />

        <div className="mt-10 flex gap-6 max-[1200px]:px-4 max-[1200px]:grid max-[1200px]:grid-cols-2 max-[1200px]:mt-12 max-[1200px]:gap-y-10 max-[680px]:grid-cols-1">
          {cartSections.map((section) => (
            <Cart
              key={section.path}
              label={section.label}
              data={homeInfo[section.dataKey] || []}
              path={section.path}
            />
          ))}
        </div>

        <div className="w-full grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-x-6 max-[1200px]:flex max-[1200px]:flex-col max-[1200px]:px-4">
          <div>
            <CategoryCard
              label={`New On ${website_name}`}
              data={homeInfo.recently_added || []}
              className="mt-[60px]"
              path="recently-added"
              limit={12}
            />

            <Schedule />

            <CategoryCard
              label="Top Upcoming"
              data={homeInfo.top_upcoming || []}
              className="mt-[30px]"
              path="top-upcoming"
              limit={12}
            />
          </div>

          <div className="w-full mt-[60px]">
            <Genre data={homeInfo.genres || []} />
            <Topten data={homeInfo.topten || {}} className="mt-12" />
          </div>
        </div>
      </div>

      <NoticeBanner />
    </>
  );
};

export default Home;
