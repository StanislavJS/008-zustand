import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-vercel-domain.vercel.app";

export const metadata: Metadata = {
  title: "Page Not Found | NoteHub",
  description: "Oops! This page does not exist in NoteHub.",
  openGraph: {
    title: "Page Not Found | NoteHub",
    description: "Oops! This page does not exist in NoteHub.",
    url: `${SITE_URL}/not-found`,
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub 404 OG Image",
      },
    ],
  },
};

export default function NotFound() {
  return <h1>404 — Page Not Found</h1>;
}
