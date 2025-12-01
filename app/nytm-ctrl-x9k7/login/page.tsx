import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminLoginForm from "./login-form";

export default async function AdminLoginPage() {
  const authenticated = await isAuthenticated();
  
  if (authenticated) {
    redirect("/nytm-ctrl-x9k7");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/25">
              <span className="text-white font-bold text-3xl">N</span>
            </div>
            <h1 className="text-3xl font-bold text-[var(--admin-text)]">Welcome Back</h1>
            <p className="text-[var(--admin-muted)] mt-2">
              Sign in to access the admin panel
            </p>
          </div>
          
          {/* Login Card */}
          <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-8 shadow-xl">
            <AdminLoginForm />
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-[var(--admin-muted)] mt-6">
            Protected area. Unauthorized access prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
