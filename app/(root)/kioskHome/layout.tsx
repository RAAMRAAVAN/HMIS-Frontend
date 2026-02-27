// app/layout.tsx or a similar layout file
import { ReactNode } from "react";
import type { Metadata } from "next";
import Footer from "../../(components)/Footer/Footer";
import HeaderPage from '../../(components)/Header/HeaderPage';
import AnimatedImages from "../../(components)/Animation";
import { StaticHospital } from "@/lib/fetchData";

// ✅ Layout Component
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderPage />
      {children}
      <Footer />
      {/* <AnimatedImages /> */}
    </>
  );
}
