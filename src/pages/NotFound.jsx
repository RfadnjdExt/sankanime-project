import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChevronLeft } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        damping: 10,
      },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#201F31] text-white p-4 text-center overflow-hidden">
      <motion.div
        className="max-w-md w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.img
          src="https://cdn.sankavolereii.my.id/seelen!me.png"
          alt="404 Not Found"
          className="w-64 h-64 mx-auto mb-4"
          variants={imageVariants}
        />

        <motion.h1
          className="text-4xl font-bold text-[#FFBADE] mb-2"
          variants={itemVariants}
        >
          404 - Halaman Tidak Ditemukan
        </motion.h1>

        <motion.p
          className="text-lg text-gray-300 mb-8"
          variants={itemVariants}
        >
          Maaf, kami tidak dapat menemukan halaman yang Anda cari.
        </motion.p>

        <motion.button
          onClick={() => navigate("/home")}
          className="flex items-center justify-center mx-auto bg-[#FFBADE] text-black font-bold py-3 px-6 rounded-full shadow-lg hover:bg-opacity-80 transition-all duration-300 ease-in-out glow-animation"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaChevronLeft className="mr-2" />
          Kembali ke Beranda
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;
