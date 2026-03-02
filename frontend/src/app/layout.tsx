import type { Metadata } from "next";
import "./globals.css";
import HomeLayout from "@/components/Layout/App";

export const metadata: Metadata = {
  title: "Birwal Weather App",
  description: "Check City's Weather and enjoy moment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <HomeLayout>
          {children}
        </HomeLayout>
      </body>
    </html>
  );
}