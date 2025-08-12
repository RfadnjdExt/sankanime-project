import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import AnimeInfo from "./pages/AnimeInfo";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import Category from "./pages/Category";
import AtoZ from "./pages/AtoZ";
import History from "./pages/History";
import ContactCS from "./pages/ContactCS";
import NotFound from "./pages/NotFound";

import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";

import { LanguageProvider } from "./context/LanguageContext";
import { HomeInfoProvider } from "./context/HomeInfoContext";
import { SearchProvider } from "./context/SearchContext";

import { Analytics } from "@vercel/analytics/react";

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container bg-[#201F31] text-white flex flex-col min-h-screen">
      <Navbar />
      <main className="content flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/info/:id" element={<AnimeInfo />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/search" element={<Search />} />
          <Route path="/history" element={<History />} />
          <Route path="/contactcs" element={<ContactCS />} />

          <Route
            path="/recently-updated"
            element={
              <Category path="recently-updated" label="Recently Updated" />
            }
          />
          <Route
            path="/most-popular"
            element={<Category path="most-popular" label="Most Popular" />}
          />
          <Route
            path="/top-airing"
            element={<Category path="top-airing" label="Top Airing" />}
          />
          <Route
            path="/completed"
            element={<Category path="completed" label="Completed" />}
          />
          <Route path="/genre/:genre" element={<Category />} />
          <Route path="/az-list/:letter" element={<AtoZ />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Analytics />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <HomeInfoProvider>
        <SearchProvider>
          <AppContent />
        </SearchProvider>
      </HomeInfoProvider>
    </LanguageProvider>
  );
}

export default App;
