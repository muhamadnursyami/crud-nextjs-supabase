import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return(
      <>
      {/* Setelah menggunakan toast dari menu admin untuk add data
      tambahin juga Toasya kedalam _app 
      */}
      <Toaster/>
      <Component {...pageProps} />;
      
      </>

  ) 
}
