"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "../login/actions";

export default function SettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("general");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    siteName: "NYTM Tools",
    siteDescription: "Next-Gen Yield Tools & Modules",
    recordActivity: true,
    maxRecordsToKeep: 10000,
    autoDeleteAfterDays: 30,
    enableAnalytics: true,
    adminEmail: "",
    sessionTimeout: 24,
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => {
    await logoutAction();
    router.push("/nytm-ctrl-x9k7/login");
    router.refresh();
  };

  const sections = [
    { id: "general", icon: "⚙️", label: "General" },
    { id: "activity", icon: "📋", label: "Activity Logging" },
    { id: "security", icon: "🔐", label: "Security" },
    { id: "danger", icon: "⚠️", label: "Danger Zone" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--admin-text)]">Settings</h2>
        <p className="text-[var(--admin-muted)]">
          Manage your admin panel configuration
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-3 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left
                  ${activeSection === section.id
                    ? "bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-[var(--admin-primary)] border border-violet-500/30"
                    : "hover:bg-[var(--admin-hover)] text-[var(--admin-text)]"
                  }
                `}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          {activeSection === "general" && (
            <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-6">
              <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-6 flex items-center gap-2">
                <span>⚙️</span> General Settings
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)] focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)] focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">
                    Admin Email (for notifications)
                  </label>
                  <input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)] placeholder-[var(--admin-muted)] focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Activity Logging Settings */}
          {activeSection === "activity" && (
            <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-6">
              <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-6 flex items-center gap-2">
                <span>📋</span> Activity Logging
              </h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--admin-bg)]">
                  <div>
                    <p className="font-medium text-[var(--admin-text)]">Record Tool Activity</p>
                    <p className="text-sm text-[var(--admin-muted)]">Log all tool usage to the database</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.recordActivity}
                      onChange={(e) => setSettings({ ...settings, recordActivity: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[var(--admin-border)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--admin-bg)]">
                  <div>
                    <p className="font-medium text-[var(--admin-text)]">Enable Analytics</p>
                    <p className="text-sm text-[var(--admin-muted)]">Show analytics and statistics</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableAnalytics}
                      onChange={(e) => setSettings({ ...settings, enableAnalytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[var(--admin-border)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">
                    Max Records to Keep
                  </label>
                  <input
                    type="number"
                    value={settings.maxRecordsToKeep}
                    onChange={(e) => setSettings({ ...settings, maxRecordsToKeep: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)] focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <p className="text-xs text-[var(--admin-muted)] mt-1">Older records will be automatically deleted</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">
                    Auto-delete After (days)
                  </label>
                  <input
                    type="number"
                    value={settings.autoDeleteAfterDays}
                    onChange={(e) => setSettings({ ...settings, autoDeleteAfterDays: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)] focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <p className="text-xs text-[var(--admin-muted)] mt-1">Set to 0 to disable auto-deletion</p>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === "security" && (
            <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-6">
              <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-6 flex items-center gap-2">
                <span>🔐</span> Security Settings
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">
                    Session Timeout (hours)
                  </label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                    min={1}
                    max={168}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)] focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <p className="text-xs text-[var(--admin-muted)] mt-1">Auto logout after this period of inactivity</p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)]">
                  <p className="font-medium text-[var(--admin-text)] mb-2">Change Admin Password</p>
                  <p className="text-sm text-[var(--admin-muted)] mb-4">
                    Update the ADMIN_PASSWORD environment variable to change the password.
                  </p>
                  <code className="block p-3 rounded-lg bg-[var(--admin-card)] text-sm text-violet-400 font-mono">
                    ADMIN_PASSWORD=your_new_password
                  </code>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <p className="font-medium text-amber-400 mb-1">⚠️ Security Note</p>
                  <p className="text-sm text-[var(--admin-muted)]">
                    For production, always use a strong password and set AUTH_SECRET environment variable with a secure random string.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {activeSection === "danger" && (
            <div className="bg-[var(--admin-card)] rounded-2xl border border-red-500/30 p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-6 flex items-center gap-2">
                <span>⚠️</span> Danger Zone
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[var(--admin-text)]">Clear All Activity Logs</p>
                      <p className="text-sm text-[var(--admin-muted)]">Permanently delete all recorded activity</p>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                      Clear Logs
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[var(--admin-text)]">Reset Database</p>
                      <p className="text-sm text-[var(--admin-muted)]">Delete all data and start fresh</p>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                      Reset DB
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[var(--admin-text)]">End Session</p>
                      <p className="text-sm text-[var(--admin-muted)]">Log out of admin panel</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          {activeSection !== "danger" && (
            <div className="flex items-center justify-between">
              <p className={`text-sm ${saved ? "text-emerald-400" : "text-transparent"}`}>
                ✓ Settings saved successfully
              </p>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    💾 Save Settings
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
