import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Ketika mengambil gambar dari luar sumber silahkan melakukan konfigurasi dibawah ini 
  images:{
    domains: ['static.uc.ac.id', 'asset.kompas.com']
  }
};

export default nextConfig;
