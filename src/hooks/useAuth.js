import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../api/firebase";

/**
 * Custom hook untuk mendapatkan status autentikasi pengguna secara real-time.
 * Hook ini akan menyediakan objek 'user' jika pengguna sudah login,
 * atau 'null' jika belum.
 *
 * @returns {object|null} Objek pengguna Firebase atau null.
 */
const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return currentUser;
};

export default useAuth;
