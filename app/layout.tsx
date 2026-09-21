import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import logo from "@/assets/nihon.jpg";

export const metadata: Metadata = {
  title: "Nihongo | Learn Japanese with intention",
  description: "A calm, structured path from first kana to confident Japanese.",
  icons: { icon: logo.src },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <Link className="wordmark" href="/" aria-label="Nihongo home">
              <span className="wordmark-mark">日</span>
              <span>Nihongo</span>
            </Link>
            <nav aria-label="Primary navigation">
              <Link href="/levels/n5">N5 path</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">Nihongo · Learn steadily, one clear step at a time.</footer>
      </body>
    </html>
  );
}
