import { Inter } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/Chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lexify - Simplify Legal Documents",
  description: "Make sense of privacy policies and legal documents in seconds. No legal degree required.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
