import { createContext, useContext, useState, useEffect } from "react";
import { getHomeInfo } from "../api/animeApi";
import PropTypes from "prop-types";

const HomeInfoContext = createContext();

export const HomeInfoProvider = ({ children }) => {
  const [homeInfo, setHomeInfo] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndSetHomeInfo = async () => {
      try {
        setLoading(true);
        const data = await getHomeInfo();
        setHomeInfo(data);
      } catch (err) {
        console.error("Error fetching home info:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetHomeInfo();
  }, []);

  const value = {
    homeInfo,
    homeInfoLoading: loading,
    error,
  };

  return (
    <HomeInfoContext.Provider value={value}>
      {children}
    </HomeInfoContext.Provider>
  );
};

HomeInfoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useHomeInfo = () => {
  return useContext(HomeInfoContext);
};
