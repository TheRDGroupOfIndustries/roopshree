import { headers } from "next/headers";
import React from "react";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>Header</header>
      <main>{children}</main>
      <footer>footer</footer>
    </>
  );
}
