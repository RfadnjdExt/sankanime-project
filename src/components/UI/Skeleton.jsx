import PropTypes from "prop-types";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Komponen Skeleton untuk menampilkan placeholder saat loading.
 * Menerima props standar div dan beberapa props kustom.
 *
 * @param {string} className - Kelas CSS tambahan dari Tailwind untuk kustomisasi.
 * @param {boolean} [animation=true] - Mengaktifkan atau menonaktifkan animasi shimmer.
 * @param {object} props - Props lainnya yang akan diteruskan ke elemen div.
 * @returns {JSX.Element}
 */
const Skeleton = ({ className, animation = true, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white/10 rounded-md",

        animation && "shimmer-effect",

        className
      )}
      {...props}
    />
  );
};

Skeleton.propTypes = {
  className: PropTypes.string,
  animation: PropTypes.bool,
};

export default Skeleton;
