import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Admin',
    template: '%s | Admin — CodeIn4K',
  },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[rgb(var(--background))]">{children}</div>
}
