export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-950">
      {/* Breadcrumb structured data is already in page.tsx */}
      {children}
    </div>
  );
}
