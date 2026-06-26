import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkshopBySlug } from "@/lib/data/workshops";
import WorkshopDetailClient from "@/components/workshops/WorkshopDetailClient";

// Dynamic rendering — page is generated on-demand, not at build time.
// This means new workshops added to MongoDB are immediately available.
export const dynamic = "force-dynamic";

// Per-workshop SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const workshop = await getWorkshopBySlug(slug);
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
  const workshop = await getWorkshopBySlug(slug);
  if (!workshop) notFound();

  return <WorkshopDetailClient workshop={workshop} />;
}
