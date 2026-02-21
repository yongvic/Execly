import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminTopbar } from '@/components/admin/admin-topbar'
import { AuthProvider } from '@/lib/auth-context'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <AuthProvider>
                {/* Sidebar for desktop */}
                <div className="hidden lg:flex lg:flex-shrink-0">
                    <AdminSidebar />
                </div>

                {/* Main content area */}
                <div className="flex flex-col flex-1 w-full min-w-0 overflow-hidden">
                    <AdminTopbar />

                    <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-muted/30">
                        <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </AuthProvider>
        </div>
    )
}
