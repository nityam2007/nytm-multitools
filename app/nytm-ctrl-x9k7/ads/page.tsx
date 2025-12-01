"use client";

import { useState, useEffect } from "react";
import { 
  AdConfig, 
  AdSlot, 
  AdSize, 
  AdPosition,
  adDimensions,
  defaultAdConfig,
  loadAdConfig,
  saveAdConfig 
} from "@/lib/ads-config";

const adSizes: AdSize[] = ["banner", "rectangle", "skyscraper", "mobile", "large-banner", "billboard", "square", "custom"];
const adPositions: AdPosition[] = ["header", "footer", "sidebar", "in-content", "tool-top", "tool-bottom", "between-sections"];

export default function AdsManagementPage() {
  const [config, setConfig] = useState<AdConfig>(defaultAdConfig);
  const [editingSlot, setEditingSlot] = useState<AdSlot | null>(null);
  const [showNewSlotForm, setShowNewSlotForm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setConfig(loadAdConfig());
  }, []);

  const handleSave = () => {
    saveAdConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSlot = (updatedSlot: AdSlot) => {
    setConfig({
      ...config,
      slots: config.slots.map(s => s.id === updatedSlot.id ? updatedSlot : s),
    });
    setEditingSlot(null);
  };

  const addNewSlot = (slot: AdSlot) => {
    setConfig({
      ...config,
      slots: [...config.slots, slot],
    });
    setShowNewSlotForm(false);
  };

  const deleteSlot = (id: string) => {
    if (!confirm("Are you sure you want to delete this ad slot?")) return;
    setConfig({
      ...config,
      slots: config.slots.filter(s => s.id !== id),
    });
  };

  const toggleSlotEnabled = (id: string) => {
    setConfig({
      ...config,
      slots: config.slots.map(s => 
        s.id === id ? { ...s, enabled: !s.enabled } : s
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--admin-text)]">Ads Management</h2>
          <p className="text-[var(--admin-muted)]">Configure ad placements across the site</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            {saved ? "✓ Saved!" : "💾 Save Changes"}
          </button>
        </div>
      </div>

      {/* Global Settings */}
      <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-6">
        <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Global Ad Settings</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--admin-bg)]">
            <div>
              <p className="font-medium text-[var(--admin-text)]">Ads Enabled</p>
              <p className="text-xs text-[var(--admin-muted)]">Master switch for all ads</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.globalEnabled}
                onChange={(e) => setConfig({ ...config, globalEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--admin-border)] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--admin-bg)]">
            <div>
              <p className="font-medium text-[var(--admin-text)]">Show to Free Users</p>
              <p className="text-xs text-[var(--admin-muted)]">Display ads for free tier</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.showToFreeUsers}
                onChange={(e) => setConfig({ ...config, showToFreeUsers: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--admin-border)] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--admin-bg)]">
            <div>
              <p className="font-medium text-[var(--admin-text)]">Show to Premium</p>
              <p className="text-xs text-[var(--admin-muted)]">Display ads for paid users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.showToPremiumUsers}
                onChange={(e) => setConfig({ ...config, showToPremiumUsers: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--admin-border)] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--admin-bg)]">
            <div>
              <p className="font-medium text-[var(--admin-text)]">Test Mode</p>
              <p className="text-xs text-[var(--admin-muted)]">Show placeholder ads</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.testMode}
                onChange={(e) => setConfig({ ...config, testMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[var(--admin-border)] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Ad Slots */}
      <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--admin-text)]">Ad Slots ({config.slots.length})</h3>
          <button
            onClick={() => setShowNewSlotForm(true)}
            className="px-4 py-2 rounded-xl bg-[var(--admin-hover)] hover:bg-violet-500/20 text-[var(--admin-text)] transition-colors flex items-center gap-2"
          >
            <span>+</span>
            Add New Slot
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[var(--admin-muted)] text-sm">
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium">Name</th>
                <th className="pb-4 font-medium">Position</th>
                <th className="pb-4 font-medium">Size</th>
                <th className="pb-4 font-medium">Visibility</th>
                <th className="pb-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[var(--admin-text)]">
              {config.slots.map((slot) => (
                <tr key={slot.id} className="border-t border-[var(--admin-border)]">
                  <td className="py-4">
                    <button
                      onClick={() => toggleSlotEnabled(slot.id)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        slot.enabled ? "bg-emerald-500" : "bg-[var(--admin-muted)]"
                      }`}
                      title={slot.enabled ? "Enabled" : "Disabled"}
                    />
                  </td>
                  <td className="py-4">
                    <div>
                      <p className="font-medium">{slot.name}</p>
                      <p className="text-xs text-[var(--admin-muted)]">{slot.id}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="px-2 py-1 rounded-lg bg-[var(--admin-bg)] text-xs capitalize">
                      {slot.position}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-sm">
                      {adDimensions[slot.size].width}x{adDimensions[slot.size].height}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      {slot.showOnDesktop && (
                        <span className="text-xs px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400">
                          Desktop
                        </span>
                      )}
                      {slot.showOnMobile && (
                        <span className="text-xs px-2 py-1 rounded-lg bg-green-500/20 text-green-400">
                          Mobile
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingSlot(slot)}
                        className="p-2 rounded-lg hover:bg-[var(--admin-hover)] transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteSlot(slot.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ad Code Snippets Reference */}
      <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-6">
        <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-4">📋 Ad Code Examples</h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-[var(--admin-muted)] mb-2">Google AdSense Example:</p>
            <pre className="p-3 rounded-lg bg-[var(--admin-bg)] text-[var(--admin-text)] overflow-x-auto">
{`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXX"
     data-ad-slot="XXXXXXX"
     data-ad-format="auto"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`}
            </pre>
          </div>
          <div>
            <p className="text-[var(--admin-muted)] mb-2">Custom Iframe Example:</p>
            <pre className="p-3 rounded-lg bg-[var(--admin-bg)] text-[var(--admin-text)] overflow-x-auto">
{`<iframe src="https://your-ad-server.com/ad/123" 
        width="728" height="90" 
        frameborder="0" scrolling="no"></iframe>`}
            </pre>
          </div>
        </div>
      </div>

      {/* Edit Slot Modal */}
      {editingSlot && (
        <SlotEditorModal
          slot={editingSlot}
          onSave={updateSlot}
          onClose={() => setEditingSlot(null)}
        />
      )}

      {/* New Slot Modal */}
      {showNewSlotForm && (
        <NewSlotModal
          onSave={addNewSlot}
          onClose={() => setShowNewSlotForm(false)}
        />
      )}
    </div>
  );
}

// Slot Editor Modal
function SlotEditorModal({
  slot,
  onSave,
  onClose,
}: {
  slot: AdSlot;
  onSave: (slot: AdSlot) => void;
  onClose: () => void;
}) {
  const [editedSlot, setEditedSlot] = useState<AdSlot>(slot);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--admin-text)]">Edit Ad Slot</h3>
          <button onClick={onClose} className="p-2 hover:bg-[var(--admin-hover)] rounded-lg">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">Name</label>
            <input
              type="text"
              value={editedSlot.name}
              onChange={(e) => setEditedSlot({ ...editedSlot, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">Position</label>
              <select
                value={editedSlot.position}
                onChange={(e) => setEditedSlot({ ...editedSlot, position: e.target.value as AdPosition })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]"
              >
                {adPositions.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">Size</label>
              <select
                value={editedSlot.size}
                onChange={(e) => setEditedSlot({ ...editedSlot, size: e.target.value as AdSize })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]"
              >
                {adSizes.map((size) => (
                  <option key={size} value={size}>
                    {size} ({adDimensions[size].width}x{adDimensions[size].height})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--admin-bg)]">
              <span className="text-sm text-[var(--admin-text)]">Show on Desktop</span>
              <input
                type="checkbox"
                checked={editedSlot.showOnDesktop}
                onChange={(e) => setEditedSlot({ ...editedSlot, showOnDesktop: e.target.checked })}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--admin-bg)]">
              <span className="text-sm text-[var(--admin-text)]">Show on Mobile</span>
              <input
                type="checkbox"
                checked={editedSlot.showOnMobile}
                onChange={(e) => setEditedSlot({ ...editedSlot, showOnMobile: e.target.checked })}
                className="w-4 h-4"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">
              Ad Code (HTML/Script/Iframe)
            </label>
            <textarea
              value={editedSlot.code}
              onChange={(e) => setEditedSlot({ ...editedSlot, code: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)] font-mono text-sm"
              placeholder="Paste your ad code here (Google AdSense, custom iframe, etc.)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">Priority (0-10)</label>
            <input
              type="number"
              value={editedSlot.priority || 0}
              onChange={(e) => setEditedSlot({ ...editedSlot, priority: parseInt(e.target.value) })}
              min={0}
              max={10}
              className="w-full px-4 py-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[var(--admin-border)] text-[var(--admin-text)] hover:bg-[var(--admin-hover)]"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(editedSlot)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// New Slot Modal
function NewSlotModal({
  onSave,
  onClose,
}: {
  onSave: (slot: AdSlot) => void;
  onClose: () => void;
}) {
  const [newSlot, setNewSlot] = useState<AdSlot>({
    id: `slot-${Date.now()}`,
    name: "",
    size: "rectangle",
    position: "in-content",
    enabled: true,
    code: "",
    showOnMobile: true,
    showOnDesktop: true,
    priority: 5,
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[var(--admin-text)]">Create New Ad Slot</h3>
          <button onClick={onClose} className="p-2 hover:bg-[var(--admin-hover)] rounded-lg">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">Slot ID</label>
            <input
              type="text"
              value={newSlot.id}
              onChange={(e) => setNewSlot({ ...newSlot, id: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]"
              placeholder="unique-slot-id"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">Name</label>
            <input
              type="text"
              value={newSlot.name}
              onChange={(e) => setNewSlot({ ...newSlot, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]"
              placeholder="Header Banner"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">Position</label>
              <select
                value={newSlot.position}
                onChange={(e) => setNewSlot({ ...newSlot, position: e.target.value as AdPosition })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]"
              >
                {adPositions.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">Size</label>
              <select
                value={newSlot.size}
                onChange={(e) => setNewSlot({ ...newSlot, size: e.target.value as AdSize })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]"
              >
                {adSizes.map((size) => (
                  <option key={size} value={size}>
                    {size} ({adDimensions[size].width}x{adDimensions[size].height})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--admin-bg)]">
              <span className="text-sm text-[var(--admin-text)]">Show on Desktop</span>
              <input
                type="checkbox"
                checked={newSlot.showOnDesktop}
                onChange={(e) => setNewSlot({ ...newSlot, showOnDesktop: e.target.checked })}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--admin-bg)]">
              <span className="text-sm text-[var(--admin-text)]">Show on Mobile</span>
              <input
                type="checkbox"
                checked={newSlot.showOnMobile}
                onChange={(e) => setNewSlot({ ...newSlot, showOnMobile: e.target.checked })}
                className="w-4 h-4"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">
              Ad Code (HTML/Script/Iframe)
            </label>
            <textarea
              value={newSlot.code}
              onChange={(e) => setNewSlot({ ...newSlot, code: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)] font-mono text-sm"
              placeholder="Paste your ad code here..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[var(--admin-border)] text-[var(--admin-text)] hover:bg-[var(--admin-hover)]"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(newSlot)}
            disabled={!newSlot.name || !newSlot.id}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white disabled:opacity-50"
          >
            Create Slot
          </button>
        </div>
      </div>
    </div>
  );
}
