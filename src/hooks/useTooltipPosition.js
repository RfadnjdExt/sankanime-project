import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Custom hook untuk menghitung posisi tooltip yang optimal agar tidak keluar dari viewport.
 *
 * @param {Array} items - Daftar item yang akan memiliki tooltip (untuk menentukan indeks).
 * @returns {Object} - Mengembalikan state dan handler yang dibutuhkan.
 *  - cardRefs: Ref untuk menyimpan referensi ke semua elemen kartu.
 *  - hoveredId: ID dari item yang sedang di-hover.
 *  - tooltipPosition: Objek yang berisi kelas CSS untuk posisi (misal: 'top-1/2').
 *  - tooltipHorizontalPosition: Objek yang berisi kelas CSS untuk posisi (misal: 'left-1/2').
 *  - handleMouseEnter: Handler untuk saat mouse masuk ke elemen.
 *  - handleMouseLeave: Handler untuk saat mouse meninggalkan elemen.
 */
const useTooltipPosition = (items) => {
  const [hoveredId, setHoveredId] = useState(null);

  const [tooltipPosition, setTooltipPosition] = useState("top-1/2");
  const [tooltipHorizontalPosition, setTooltipHorizontalPosition] =
    useState("left-1/2");

  const cardRefs = useRef([]);

  const handleMouseEnter = useCallback((itemId) => {
    setHoveredId(itemId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  useEffect(() => {
    if (hoveredId === null) {
      return;
    }

    const itemIndex = items.findIndex((item) => item.id === hoveredId);
    if (itemIndex === -1) {
      return;
    }

    const cardElement = cardRefs.current[itemIndex];
    if (!cardElement) {
      return;
    }

    const rect = cardElement.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (rect.left + rect.width / 2 > viewportWidth / 2) {
      setTooltipHorizontalPosition("right-1/2");
    } else {
      setTooltipHorizontalPosition("left-1/2");
    }

    if (rect.top + rect.height / 2 > viewportHeight / 2) {
      setTooltipPosition("bottom-1/2");
    } else {
      setTooltipPosition("top-1/2");
    }
  }, [hoveredId, items]);

  return {
    cardRefs,
    hoveredId,
    tooltipPosition,
    tooltipHorizontalPosition,
    handleMouseEnter,
    handleMouseLeave,
  };
};

export default useTooltipPosition;
