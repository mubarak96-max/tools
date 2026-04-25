export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-50">
      {/* Breadcrumb structured data is already in page.tsx */}
      {children}
    </div>
  );
}
