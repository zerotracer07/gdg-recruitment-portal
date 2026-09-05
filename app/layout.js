// Font
import { Inter, Space_Grotesk, Instrument_Serif } from "next/font/google";
// Providers
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SubmissionsProvider } from "@/components/SubmissionsProvider";
import BackgroundDecor from "@/components/BackgroundDecor";
import CursorTracker from "@/components/CursorTracker";
// Styling
import "./globals.css";
// Reduced-motion: framer-motion animations defer to the OS setting globally
import { MotionConfig } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif-accent",
});

export const metadata = {
  title: "GDG VITC | Recruitment Portal",
  description: "Recruitment portal for GDG VITC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${instrumentSerif.variable}`}>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MotionConfig reducedMotion="user">
            <SubmissionsProvider>
              <BackgroundDecor />
              {children}
              <Toaster />
              <CursorTracker />
            </SubmissionsProvider>
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
