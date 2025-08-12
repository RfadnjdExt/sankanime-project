import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChevronLeft } from "react-icons/fa";
import PropTypes from "prop-types";

const ErrorPage = ({ error }) => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        duration: 0.5,
      },
    },
  };

  return (
    <div className="bg-[#201F31] w-full min-h-screen flex flex-col justify-center items-center text-center p-4 overflow-hidden">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.img
          src="https://cdn.sankavollereii.my.id/seelen!me.png"
          alt="Error Illustration"
          className="w-80 h-80 mx-auto mb--1"
          variants={imageVariants}
        />
        <motion.h1
          className="text-white text-4xl font-bold mb-4"
          variants={itemVariants}
        >
          {error === "404"
            ? "404 - Halaman Tidak Ditemukan"
            : "Terjadi Kesalahan"}
        </motion.h1>
        <motion.p className="text-red-400 text-l mb-8" variants={itemVariants}>
          Maaf, kami tidak dapat menemukan halaman yang Anda cari.
        </motion.p>
        <motion.button
          onClick={() => navigate("/home")}
          className="bg-pink-400 text-white font-bold py-3 px-6 rounded-full flex items-center mx-auto"
          variants={itemVariants}
          whileHover={{ scale: 1.1, backgroundColor: "#ec4899" }}
          whileTap={{ scale: 0.95 }}
        >
          <FaChevronLeft className="mr-2" />
          Kembali ke Beranda
        </motion.button>
      </motion.div>
    </div>
  );
};

ErrorPage.propTypes = {
  error: PropTypes.string.isRequired,
};

export default ErrorPage;
