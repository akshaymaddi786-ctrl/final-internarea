import Footer from "@/Components/Fotter";
import Navbar from "@/Components/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { store } from "../store/store";
import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { auth } from "@/firebase/firebase";
import { login, logout } from "@/Feature/Userslice";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LanguageProvider } from "@/context/LanguageContext";
import axios from "axios";

let cachedApiUrl: string | null = null;

async function getApiBaseUrl() {
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:5000/api";
  }
  
  if (cachedApiUrl) return cachedApiUrl;
  
  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/akshaymaddi786-ctrl/final-internarea/main/backend_url.txt?t=${Date.now()}`
    );
    const url = await response.text();
    cachedApiUrl = url.trim() + "/api";
    return cachedApiUrl;
  } catch (error) {
    console.error("Failed to fetch dynamic backend URL, falling back to default:", error);
    return "http://localhost:5000/api";
  }
}

if (typeof window !== "undefined") {
  axios.interceptors.request.use(async (config) => {
    if (config.url) {
      const baseUrl = await getApiBaseUrl();
      // Replace whatever host is currently in the absolute URL with the resolved base URL
      config.url = config.url.replace(/^https?:\/\/[^\/]+\/api/, baseUrl);
      
      // Add bypass header if it is a localtunnel URL
      if (config.url.includes("loca.lt") || config.url.includes("localtunnel")) {
        config.headers["Bypass-Tunnel-Reminder"] = "true";
      }
    }
    return config;
  });
}

export default function App({ Component, pageProps }: AppProps) {
  function AuthListener() {
    const dispatch = useDispatch();
    useEffect(() => {
      const guestUserStr = typeof window !== "undefined" ? localStorage.getItem("guestUser") : null;
      if (guestUserStr) {
        try {
          const guestUser = JSON.parse(guestUserStr);
          dispatch(login(guestUser));
          return;
        } catch (e) {
          localStorage.removeItem("guestUser");
        }
      }

      auth.onAuthStateChanged((authuser) => {
        if (authuser) {
          dispatch(
            login({
              uid: authuser.uid,
              photo: authuser.photoURL,
              name: authuser.displayName,
              email: authuser.email,
              phoneNumber: authuser.phoneNumber,
            })
          );
        } else {
          dispatch(logout());
        }
      });
    }, [dispatch]);
    return null;
  }

  return (
    <Provider store={store}>
      <LanguageProvider>
        <AuthListener />
        <div className="bg-white">
          <ToastContainer/>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
        </div>
      </LanguageProvider>
    </Provider>
  );
}
