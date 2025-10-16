import Header from "@/components/Header";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </>
  );
}
