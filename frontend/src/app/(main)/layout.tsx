import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";

export default function Layout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
