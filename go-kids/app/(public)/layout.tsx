import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Go Kids: India's Future Readiness Platform for Kids",
  description:
    "Assessments, workshops, mentorship, and expert talks: everything your child needs to discover their strengths and thrive.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
