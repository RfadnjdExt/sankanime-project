/**
 * Menemukan elemen pertama yang cocok dengan selector CSS di dalam parent.
 * @param {string} selector - Selector CSS yang akan dicari.
 * @param {Element} [parent=document] - Elemen induk untuk memulai pencarian.
 * @returns {Element|null} Elemen yang ditemukan atau null.
 */
export function query(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Menemukan semua elemen yang cocok dengan selector CSS di dalam parent.
 * @param {string} selector - Selector CSS yang akan dicari.
 * @param {Element} [parent=document] - Elemen induk untuk memulai pencarian.
 * @returns {Element[]} Array dari elemen yang ditemukan.
 */
export function queryAll(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/**
 * Menambahkan kelas CSS ke sebuah elemen.
 * @param {Element} element - Elemen target.
 * @param {string} className - Nama kelas yang akan ditambahkan.
 */
export function addClass(element, className) {
  element.classList.add(className);
}

/**
 * Menghapus kelas CSS dari sebuah elemen.
 * @param {Element} element - Elemen target.
 * @param {string} className - Nama kelas yang akan dihapus.
 */
export function removeClass(element, className) {
  element.classList.remove(className);
}

/**
 * Memeriksa apakah sebuah elemen memiliki kelas CSS tertentu.
 * @param {Element} element - Elemen target.
 * @param {string} className - Nama kelas yang akan diperiksa.
 * @returns {boolean}
 */
export function hasClass(element, className) {
  return element.classList.contains(className);
}

/**
 * Menambahkan atau menghapus kelas CSS dari elemen lain (siblings).
 * Berguna untuk menandai item yang aktif dalam sebuah daftar.
 * @param {Element} element - Elemen target yang akan diberi kelas.
 * @param {string} className - Nama kelas yang akan di-inverse.
 */
export function inverseClass(element, className) {
  siblings(element).forEach((el) => removeClass(el, className));
  addClass(element, className);
}

/**
 * Menambahkan elemen anak atau string HTML ke dalam elemen induk.
 * @param {Element} parent - Elemen induk.
 * @param {Element|string} child - Elemen atau string HTML yang akan ditambahkan.
 * @returns {Element} Elemen anak yang baru ditambahkan.
 */
export function append(parent, child) {
  if (child instanceof Element) {
    parent.appendChild(child);
  } else {
    parent.insertAdjacentHTML("beforeend", String(child));
  }
  return parent.lastElementChild || parent.lastChild;
}

/**
 * Menghapus sebuah elemen dari DOM.
 * @param {Element} element - Elemen yang akan dihapus.
 */
export function remove(element) {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

/**
 * Mengatur satu properti style pada sebuah elemen.
 * @param {Element} element - Elemen target.
 * @param {string} key - Properti CSS (misal: 'backgroundColor').
 * @param {string} value - Nilai properti CSS.
 */
export function setStyle(element, key, value) {
  element.style[key] = value;
}

/**
 * Mengatur beberapa properti style dari sebuah objek.
 * @param {Element} element - Elemen target.
 * @param {object} styles - Objek berisi pasangan properti dan nilai CSS.
 */
export function setStyles(element, styles) {
  for (const key in styles) {
    setStyle(element, key, styles[key]);
  }
}

/**
 * Mendapatkan nilai dari properti computed style sebuah elemen.
 * @param {Element} element - Elemen target.
 * @param {string} key - Properti CSS yang akan dibaca.
 * @returns {string} Nilai properti.
 */
export function getStyle(element, key) {
  return window.getComputedStyle(element, null).getPropertyValue(key);
}

/**
 * Menambahkan tooltip ke elemen, menggunakan kelas CSS dari library tooltip.
 * @param {Element} element - Elemen yang akan diberi tooltip.
 * @param {string} text - Teks tooltip.
 * @param {string} [position='top'] - Posisi tooltip.
 */
export function tooltip(element, text, position = "top") {
  element.setAttribute("aria-label", text);
  element.classList.add(`hint--${position}`, "hint--rounded");
}

/**
 * Mendapatkan semua elemen saudara (siblings) dari sebuah elemen.
 * @param {Element} element - Elemen target.
 * @returns {Element[]}
 */
export function siblings(element) {
  return Array.from(element.parentElement.children).filter(
    (el) => el !== element
  );
}

/**
 * Memeriksa apakah sebuah event terjadi di dalam atau pada elemen tertentu.
 * Menggunakan composedPath untuk menangani Shadow DOM.
 * @param {Event} event - Objek event.
 * @param {Element} element - Elemen induk yang akan diperiksa.
 * @returns {boolean}
 */
export function includeFromEvent(event, element) {
  if (event.composedPath) {
    return event.composedPath().indexOf(element) > -1;
  }
  return element.contains(event.target);
}

/**
 * Membuat elemen HTML dengan kelas CSS tertentu.
 * @param {string} tagName - Nama tag HTML (misal: 'div').
 * @param {string} [className] - Kelas CSS yang akan ditambahkan.
 * @returns {Element} Elemen yang baru dibuat.
 */
export function createElement(tagName, className) {
  const el = document.createElement(tagName);
  if (className) {
    el.className = className;
  }
  return el;
}

/**
 * Mengaktifkan atau menonaktifkan scrollbar pada elemen <body>. Juga menangani lebar scrollbar agar tidak terjadi "lompatan" visual.
 * @param {boolean} isActive - Jika true, scrollbar akan dihilangkan dan fixed; jika false, dikembalikan.
 */
export function toggleScrollbar(isActive) {
  const body = document.body;
  if (isActive) {
    // Menyimpan posisi scroll saat ini untuk mencegah halaman melompat
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    body.style.paddingRight = `${scrollBarWidth}px`;
  } else {
    body.style.overflow = "auto";
    body.style.paddingRight = "";
  }
}

/**
 * Fungsi cleanup yang menghapus style tambahan.
 */
export function cleanupScrollbar() {
  document.body.style.overflow = "auto";
  document.body.style.paddingRight = "";
}
