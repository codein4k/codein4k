import AdminNav from '@/components/admin/AdminNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  )
}
