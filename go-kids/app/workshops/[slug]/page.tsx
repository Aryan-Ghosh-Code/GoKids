import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getWorkshopBySlug } from "@/lib/data/workshops";
import WorkshopDetailClient from "@/components/workshops/WorkshopDetailClient";

// Pre-render all 5 workshop slugs at build time.
// TODO: Replace with DB query when MongoDB is ready:
//   const workshops = await WorkshopModel.find({}, "slug").lean();
//   return workshops.map((w) => ({ slug: w.slug }));
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// Per-workshop SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const workshop = getWorkshopBySlug(slug);
  if (!workshop) return { title: "Workshop Not Found — Go Kids India" };

  return {
    title: `${workshop.title} — Go Kids India`,
    description: workshop.shortDescription,
    openGraph: {
      title: workshop.title,
      description: workshop.shortDescription,
      images: [workshop.thumbnail],
    },
  };
}

export default async function WorkshopDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workshop = getWorkshopBySlug(slug);
  if (!workshop) notFound();

  return <WorkshopDetailClient workshop={workshop} />;
}
