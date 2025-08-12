import axios from "axios";

const apiClient = axios.create({
  baseURL: "/sankanime/api",
});
/**
 * Helper untuk menangani request API dan error secara terpusat.
 * @param {Function} apiCall - Fungsi panggilan Axios yang akan dieksekusi.
 * @param {string} errorMessage - Pesan error kustom untuk logging.
 * @returns {Promise<any>} Hasil data dari API.
 * @throws {Error} Melempar error jika request gagal.
 */
const handleApiRequest = async (apiCall, errorMessage) => {
  try {
    const response = await apiCall();
    return response.data?.results ?? response.data;
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
};

const CACHE_VERSION = "1.0";
const CACHE_KEY = `homeInfoCache_v${CACHE_VERSION}`;
const CACHE_DURATION = 24 * 60 * 60 * 1000;

let requestPromise = null;

/**
 * Mengambil data yang dibutuhkan untuk halaman utama.
 * Menggunakan cache dari localStorage untuk mengurangi permintaan berulang.
 * @returns {Promise<object|null>} Data untuk halaman utama.
 */
export const getHomeInfo = () => {
  if (requestPromise) {
    console.log("Permintaan data home sedang berjalan, menunggu hasil...");
    return requestPromise;
  }

  requestPromise = new Promise((resolve, reject) => {
    (async () => {
      try {
        const cachedItem = localStorage.getItem(CACHE_KEY);
        if (cachedItem) {
          const cached = JSON.parse(cachedItem);
          if (
            cached &&
            cached.timestamp &&
            cached.data &&
            Date.now() - cached.timestamp < CACHE_DURATION
          ) {
            console.log("Mengambil data home dari cache localStorage.");
            return cached.data;
          }
        }
      } catch (error) {
        console.warn("Gagal mem-parse cache, mengambil data baru.", error);
        localStorage.removeItem(CACHE_KEY);
      }

      console.log("Mengambil data dari API home.");
      const results = await handleApiRequest(
        () => apiClient.get("/"),
        "Gagal mengambil data home dari API:"
      );

      if (results) {
        const cacheToStore = { data: results, timestamp: Date.now() };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheToStore));
        return results;
      } else {
        throw new Error("Data dari API kosong.");
      }
    })()
      .then(resolve)
      .catch(reject);
  }).finally(() => {
    requestPromise = null;
  });

  return requestPromise;
};

/**
 * Mengambil informasi detail dari sebuah anime berdasarkan ID-nya.
 * @param {string} id - ID anime.
 * @param {boolean} [isRandom=false] - Jika true, akan mengambil anime acak.
 * @returns {Promise<object>} Data detail anime.
 */
export const fetchAnimeInfo = async (id, isRandom = false) => {
  if (isRandom) {
    const randomData = await handleApiRequest(
      () => apiClient.get("/random/id"),
      "Gagal mengambil ID anime acak:"
    );
    return handleApiRequest(
      () => apiClient.get("/info", { params: { id: randomData } }),
      `Gagal mengambil info anime untuk ID acak: ${randomData}`
    );
  }
  return handleApiRequest(
    () => apiClient.get("/info", { params: { id } }),
    `Gagal mengambil info anime untuk ID: ${id}`
  );
};

/**
 * Mengambil daftar episode dari sebuah anime.
 * @param {string} id - ID anime.
 * @returns {Promise<Array>} Daftar episode.
 */
export const getEpisodes = async (id) => {
  return handleApiRequest(
    () => apiClient.get(`/episodes/${id}`),
    `Gagal mengambil episode untuk ID: ${id}`
  );
};

/**
 * Mengambil daftar server streaming untuk sebuah episode.
 * @param {string} id - ID anime.
 * @param {string} episodeId - ID episode.
 * @returns {Promise<Array>} Daftar server.
 */
export const getServers = async (id, episodeId) => {
  return handleApiRequest(
    () => apiClient.get(`/servers/${id}`, { params: { ep: episodeId } }),
    `Gagal mengambil server untuk episode: ${episodeId}`
  );
};

/**
 * Mengambil informasi stream (link video) dari server tertentu.
 * @param {string} id - ID anime.
 * @param {string} episodeId - ID episode.
 * @param {string} server - Nama server.
 * @param {string} type - Tipe (sub/dub).
 * @returns {Promise<object>} Informasi stream.
 */
export const getStreamInfo = async (id, episodeId, server, type) => {
  return handleApiRequest(
    () =>
      apiClient.get("/stream", { params: { id, ep: episodeId, server, type } }),
    `Gagal mengambil stream info untuk episode: ${episodeId}`
  );
};

/**
 * Mengambil data untuk tooltip (Qtip) berdasarkan ID.
 * ID sering kali perlu diproses (misal: 'trending-123' menjadi '123').
 * @param {string} id - ID item.
 * @returns {Promise<object>} Data untuk tooltip.
 */
export const getQtip = async (id) => {
  const processedId = id.split("-").pop();
  return handleApiRequest(
    () => apiClient.get(`/qtip/${processedId}`),
    `Gagal mengambil data Qtip untuk ID: ${id}`
  );
};

/**
 * Mengambil saran pencarian berdasarkan kata kunci.
 * @param {string} keyword - Kata kunci yang diketik pengguna.
 * @returns {Promise<Array>} Daftar saran.
 */
export const getSearchSuggestion = async (keyword) => {
  return handleApiRequest(
    () => apiClient.get("/search/suggest", { params: { keyword } }),
    "Gagal mengambil saran pencarian:"
  );
};

/**
 * Mengambil jadwal anime untuk tanggal tertentu.
 * @param {string} date - Tanggal dengan format YYYY-MM-DD.
 * @returns {Promise<Array>} Daftar jadwal.
 */
export const getSchedInfo = async (date) => {
  return handleApiRequest(
    () => apiClient.get("/schedule", { params: { date } }),
    `Gagal mengambil jadwal untuk tanggal: ${date}`
  );
};

/**
 * Mengambil informasi jadwal episode berikutnya untuk sebuah anime.
 * @param {string} id - ID anime.
 * @returns {Promise<object|null>} Objek berisi data jadwal, atau null jika tidak ada.
 */
export const getNextEpisodeSchedule = async (id) => {
  return handleApiRequest(
    () => apiClient.get(`/schedule/${id}`),
    `Gagal mengambil jadwal episode berikutnya untuk ID: ${id}`
  );
};

/**
 * Mengambil daftar karakter dan pengisi suara untuk sebuah anime.
 * @param {string} id - ID anime.
 * @param {number} page - Nomor halaman.
 * @returns {Promise<object>} Objek berisi data dan info halaman.
 */
export const fetchVoiceActorInfo = async (id, page) => {
  return handleApiRequest(
    () => apiClient.get(`/character/list/${id}`, { params: { page } }),
    `Gagal mengambil info pengisi suara untuk ID: ${id}`
  );
};

/**
 * Mengambil daftar anime untuk kategori tertentu dengan paginasi.
 * @param {string} path - Path kategori (misal: 'genre/action', 'top-airing').
 * @param {number} [page=1] - Nomor halaman untuk paginasi.
 * @returns {Promise<object>} Objek yang berisi daftar anime dan informasi halaman.
 */
export const getCategoryInfo = async (path, page = 1) => {
  return handleApiRequest(
    () => apiClient.get(`/${path}`, { params: { page } }),
    `Gagal mengambil data kategori untuk path: ${path}`
  );
};

/**
 * Melakukan pencarian anime berdasarkan kata kunci dan halaman.
 * Fungsi ini mengambil semua hasil dari backend tanpa caching karena hasil pencarian sering berubah.
 * @param {string} keyword - Kata kunci untuk pencarian.
 * @param {number} [page=1] - Nomor halaman hasil pencarian.
 * @returns {Promise<object>} Objek berisi hasil pencarian (`data`) dan informasi halaman (`totalPages`).
 */
export const getSearch = async (keyword, page = 1) => {
  return handleApiRequest(
    () => apiClient.get("/search", { params: { keyword, page } }),
    `Gagal mengambil hasil pencarian untuk: ${keyword}`
  );
};
