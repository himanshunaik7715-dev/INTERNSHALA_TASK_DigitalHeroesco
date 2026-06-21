import type { Metadata } from "next";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ResumeMatch AI",
  description: "AI-powered resume matching and ATS scoring",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const text = "features pricing docs blog";
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          {/* ── NAV ── */}
          <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-8">
              <span className="font-extrabold text-base tracking-tight">
                Resume<span className="text-blue-600">Match AI</span>
              </span>
              <div className="flex items-center gap-7 flex-1">
                {text.split(" ").map((word, index) => (
                  <Link
                    key={index}
                    href={`${word}`}
                    className="text-sm text-gray-500 font-medium hover:text-gray-900 transition-colors"
                  >
                    {word}
                  </Link>
                ))}
              </div>
              <SignedOut>
                <SignInButton />
                <div className="items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
                  <SignUpButton />
                </div>
              </SignedOut>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </nav>

          {/* <div className="flex gap-3">
                
                  <SignInButton />
                  <SignUpButton />
                </SignedOut>

                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div> */}

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
