import { useEffect } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import useAuth from "../hooks/useAuth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

const LoginButton = () => {
  const user = useAuth();

  useEffect(() => {
    window.handleNativeLogin = (idToken) => {
      if (!idToken) {
        console.warn("Native login gagal, tidak ada token.");
        return;
      }

      console.log("Menerima idToken dari native, mencoba login ke Firebase...");
      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then((result) => {
          console.log(
            "Login Firebase via native BERHASIL!",
            result.user.displayName
          );
        })
        .catch((error) => {
          console.error("Firebase signInWithCredential GAGAL:", error);
        });
    };

    return () => {
      delete window.handleNativeLogin;
    };
  }, []);

  const handleGoogleLogin = async () => {
    if (
      window.Android &&
      typeof window.Android.performGoogleLogin === "function"
    ) {
      window.Android.performGoogleLogin();
    } else {
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.warn("Popup gagal, fallback ke redirect:", error);
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError) {
          console.error("Redirect login gagal:", redirectError);
        }
      }
    }
  };

  const handleLogout = () => {
    signOut(auth).catch(console.error);
  };

  return user ? (
    <div className="flex items-center justify-between w-full pl-2 sm:pl-1 pr-3 sm:pr-4">
      <div className="text-base sm:text-xl lg:text-2xl text-white font-semibold">
        <div className="sm:hidden">
          <div>👋 Halo {user.displayName || user.email}</div>
          <div>Selamat Datang!</div>
        </div>
        <div className="hidden sm:block">
          👋 Halo {user.displayName || user.email}, Selamat Datang!
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 sm:text-base rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  ) : (
    <button
      onClick={handleGoogleLogin}
      className="bg-blue-600 text-white px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base rounded hover:bg-blue-700 transition"
    >
      Login with Google
    </button>
  );
};

export default LoginButton;
