"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import {
  User, Bell, Lock, LogOut, ChevronRight, Check, Camera,
  Mail, Phone, MapPin, Briefcase, Shield, Eye, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import TopBar from "@/components/layout/TopBar";

type SettingsSection = "profile" | "notifications" | "password" | "privacy";

const NOTIFICATION_SETTINGS = [
  { id: "survey_live", label: "Survey goes live", description: "When your survey is approved and published", on: true },
  { id: "response_milestone", label: "Response milestones", description: "At 25%, 50%, 75%, and 100% completion", on: true },
  { id: "ai_report", label: "AI report ready", description: "When your validation report is generated", on: true },
  { id: "low_balance", label: "Low wallet balance", description: "When your balance drops below ₦5,000", on: false },
  { id: "weekly_summary", label: "Weekly summary", description: "Weekly digest of your idea performance", on: false },
];

export default function FounderSettingsPage() {
  const { user, logout } = useAuthStore();
  const [section, setSection] = useState<SettingsSection>("profile");
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATION_SETTINGS);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "Haleemah A.",
    email: user?.email || "haleemah@example.com",
    phone: "+234 801 234 5678",
    location: "Lagos, Nigeria",
    company: "Tiqra Startup",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleNotif = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, on: !n.on } : n))
    );
  };

  const navItems: { key: SettingsSection; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Edit Profile", icon: <User size={20} /> },
    { key: "notifications", label: "Notifications", icon: <Bell size={20} /> },
    { key: "password", label: "Password & Security", icon: <Lock size={20} /> },
    { key: "privacy", label: "Privacy", icon: <Shield size={20} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Settings" subtitle="Manage your account preferences." />

      <div className="px-8 py-8 flex gap-8">
        {/* Left nav */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-2">
          {/* Avatar section */}
          <div className="flex flex-col items-center gap-3 p-6 bg-white border border-[#F3F4F6] rounded-2xl mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-[#EDE9FE] flex items-center justify-center">
                <span className="text-[32px] font-semibold text-brand-primary">
                  {getInitials(user?.name || "HA")}
                </span>
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center border-2 border-white">
                <Camera size={14} className="text-white" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-body font-semibold text-text-primary">{user?.name || "Haleemah A."}</p>
              <p className="text-sm text-text-secondary capitalize">{user?.role || "Founder"}</p>
            </div>
          </div>

          {/* Nav */}
          {navItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl text-body transition-all text-left w-full",
                section === key
                  ? "bg-[#EDE9FE] text-brand-primary font-medium"
                  : "text-text-secondary hover:bg-[#F8F9FC] hover:text-text-primary"
              )}
            >
              <span className={section === key ? "text-brand-primary" : "text-text-muted"}>{icon}</span>
              {label}
              <ChevronRight size={16} className="ml-auto opacity-50" />
            </button>
          ))}

          <div className="h-px bg-[#F3F4F6] my-2" />

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-body text-[#DC2626] hover:bg-[#FEE2E2] transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>

        {/* Right content */}
        <div className="flex-1 max-w-2xl">
          {/* ── Profile ── */}
          {section === "profile" && (
            <div className="bg-white border border-[#F3F4F6] rounded-2xl p-8 flex flex-col gap-6">
              <h2 className="text-[24px] font-semibold text-text-primary">Edit Profile</h2>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="tiqra-label">Full Name</label>
                  <div className="relative">
                    <input
                      value={profileForm.name}
                      onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                      className="tiqra-input pl-11"
                    />
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  </div>
                </div>
                <div>
                  <label className="tiqra-label">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                      className="tiqra-input pl-11"
                    />
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  </div>
                </div>
                <div>
                  <label className="tiqra-label">Phone Number</label>
                  <div className="relative">
                    <input
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                      className="tiqra-input pl-11"
                    />
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  </div>
                </div>
                <div>
                  <label className="tiqra-label">Location</label>
                  <div className="relative">
                    <input
                      value={profileForm.location}
                      onChange={(e) => setProfileForm((f) => ({ ...f, location: e.target.value }))}
                      className="tiqra-input pl-11"
                    />
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  </div>
                </div>
                <div>
                  <label className="tiqra-label">Company / Startup Name</label>
                  <div className="relative">
                    <input
                      value={profileForm.company}
                      onChange={(e) => setProfileForm((f) => ({ ...f, company: e.target.value }))}
                      className="tiqra-input pl-11"
                    />
                    <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  </div>
                </div>
              </div>
              <button onClick={handleSave} className="btn-primary w-fit gap-2">
                {saved ? <><Check size={18} /> Saved!</> : "Save Changes"}
              </button>
            </div>
          )}

          {/* ── Notifications ── */}
          {section === "notifications" && (
            <div className="bg-white border border-[#F3F4F6] rounded-2xl p-8 flex flex-col gap-6">
              <h2 className="text-[24px] font-semibold text-text-primary">Notification Preferences</h2>
              <div className="flex flex-col gap-4">
                {notifications.map((notif) => (
                  <div key={notif.id} className="flex items-center justify-between py-4 border-b border-[#F3F4F6] last:border-0">
                    <div>
                      <p className="text-body font-medium text-text-primary">{notif.label}</p>
                      <p className="text-sm text-text-secondary mt-0.5">{notif.description}</p>
                    </div>
                    <button
                      onClick={() => toggleNotif(notif.id)}
                      className={cn(
                        "relative w-12 h-6 rounded-full transition-colors flex-shrink-0",
                        notif.on ? "bg-brand-primary" : "bg-[#E5E7EB]"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm",
                          notif.on ? "translate-x-7" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="btn-primary w-fit gap-2">
                {saved ? <><Check size={18} /> Saved!</> : "Save Preferences"}
              </button>
            </div>
          )}

          {/* ── Password ── */}
          {section === "password" && (
            <div className="bg-white border border-[#F3F4F6] rounded-2xl p-8 flex flex-col gap-6">
              <h2 className="text-[24px] font-semibold text-text-primary">Password & Security</h2>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="tiqra-label">Current Password</label>
                  <div className="relative">
                    <input type={showCurrentPw ? "text" : "password"} className="tiqra-input pr-12" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
                      {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="tiqra-label">New Password</label>
                  <div className="relative">
                    <input type={showNewPw ? "text" : "password"} className="tiqra-input pr-12" placeholder="Min. 8 characters" />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
                      {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="tiqra-label">Confirm New Password</label>
                  <input type="password" className="tiqra-input" placeholder="Repeat new password" />
                </div>
              </div>
              <button onClick={handleSave} className="btn-primary w-fit gap-2">
                {saved ? <><Check size={18} /> Updated!</> : "Update Password"}
              </button>
            </div>
          )}

          {/* ── Privacy ── */}
          {section === "privacy" && (
            <div className="bg-white border border-[#F3F4F6] rounded-2xl p-8 flex flex-col gap-6">
              <h2 className="text-[24px] font-semibold text-text-primary">Privacy Settings</h2>
              {[
                { label: "Make my profile discoverable", description: "Allow earners to see your founder profile", on: true },
                { label: "Share anonymised survey data", description: "Help improve AI models (no personal data)", on: true },
                { label: "Receive product updates via email", description: "Tiqra feature announcements and updates", on: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-[#F3F4F6] last:border-0">
                  <div>
                    <p className="text-body font-medium text-text-primary">{item.label}</p>
                    <p className="text-sm text-text-secondary mt-0.5">{item.description}</p>
                  </div>
                  <button
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-colors flex-shrink-0",
                      item.on ? "bg-brand-primary" : "bg-[#E5E7EB]"
                    )}
                  >
                    <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", item.on ? "translate-x-7" : "translate-x-1")} />
                  </button>
                </div>
              ))}
              <div className="pt-4 border-t border-[#F3F4F6]">
                <button className="text-body text-[#DC2626] hover:underline">Delete Account</button>
                <p className="text-sm text-text-secondary mt-1">This action is permanent and cannot be undone.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
