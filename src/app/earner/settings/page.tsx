"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, Notification01Icon, LockIcon, SecurityLockIcon, Logout01Icon, ArrowRight01Icon, CheckmarkCircle01Icon, Camera01Icon, Mail01Icon, SmartPhone01Icon, Location01Icon, Building04Icon, StarIcon, Target01Icon, ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import TopBar from "@/components/layout/TopBar";

type Section = "profile" | "demographics" | "notifications" | "password" | "privacy";

const INTEREST_OPTIONS = [
  "Technology", "Finance", "Health", "Education", "Food & Beverage",
  "Travel", "E-commerce", "Productivity", "Gaming", "Social Media",
  "Fashion", "Real Estate", "Sports", "Entertainment",
];

const NOTIFICATION_SETTINGS = [
  { id: "new_survey", label: "New surveys available", description: "When surveys matching your profile drop", on: true },
  { id: "reward_credited", label: "Reward credited", description: "When a survey payment hits your wallet", on: true },
  { id: "survey_closing", label: "Survey closing soon", description: "Reminders for surveys about to close", on: false },
  { id: "weekly_digest", label: "Weekly earnings digest", description: "A summary of your week's activity", on: true },
  { id: "tips", label: "Tips & tricks", description: "How to improve your reliability score", on: false },
];

export default function EarnerSettingsPage() {
  const router = useRouter();
  const { user, logout, switchRole } = useAuthStore();
  const [section, setSection] = useState<Section>("profile");
  const [saved, setSaved] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATION_SETTINGS);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Technology", "Finance"]);
  const [privacySettings, setPrivacySettings] = useState([
    { id: "anon", label: "Anonymous responses", description: "Your identity is never revealed to survey creators", on: true },
    { id: "share_demo", label: "Share demographics for matching", description: "Helps us find better-paying surveys for you", on: true },
    { id: "allow_ai", label: "Allow data for AI training", description: "Helps improve Tiqra's truth-layer AI (anonymised)", on: false },
  ]);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "Aisha Bello",
    email: user?.email || "aisha@example.com",
    phone: "+234 802 345 6789",
    location: "Abuja, Nigeria",
    occupation: "Student",
  });

  const [demographics, setDemographics] = useState({
    age: "24",
    gender: "Female",
    incomeBracket: "₦50k–₦100k/month",
    education: "Bachelor's Degree",
    industry: "Education",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleInterest = (i: string) =>
    setSelectedInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );

  const toggleNotif = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, on: !n.on } : n)));

  const togglePrivacy = (id: string) =>
    setPrivacySettings((prev) => prev.map((p) => (p.id === id ? { ...p, on: !p.on } : p)));

  const navItems: { key: Section; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Edit Profile", icon: <HugeiconsIcon icon={UserIcon} size={20} /> },
    { key: "demographics", label: "Demographics", icon: <HugeiconsIcon icon={Target01Icon} size={20} /> },
    { key: "notifications", label: "Notifications", icon: <HugeiconsIcon icon={Notification01Icon} size={20} /> },
    { key: "password", label: "Password", icon: <HugeiconsIcon icon={LockIcon} size={20} /> },
    { key: "privacy", label: "Privacy", icon: <HugeiconsIcon icon={SecurityLockIcon} size={20} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Settings" subtitle="Manage your account and preferences." />

      {/* Mobile: horizontal tab bar */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 px-4 pt-4 lg:hidden">
        {navItems.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setSection(key)}
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex-shrink-0",
              section === key
                ? "bg-[#EDE9FE] text-brand-primary"
                : "bg-white border border-[#E5E7EB] text-text-secondary"
            )}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <div className="page-content flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Desktop Left nav */}
        <div className="hidden lg:flex w-72 flex-shrink-0 flex-col gap-2">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 p-6 bg-white border border-[#F3F4F6] rounded-2xl mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-[#EDE9FE] flex items-center justify-center">
                <span className="text-[32px] font-semibold text-brand-primary">
                  {getInitials(user?.name || "AB")}
                </span>
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center border-2 border-white">
                <HugeiconsIcon icon={Camera01Icon} size={14} className="text-white" />
              </button>
            </div>
            <div className="text-center">
              <p className="text-body font-semibold text-text-primary">{user?.name || "Aisha Bello"}</p>
              <p className="text-sm text-text-secondary capitalize">{user?.role || "Earner"}</p>
              {/* Reliability badge */}
              <div className="flex items-center gap-1 mt-1 justify-center">
                <HugeiconsIcon icon={StarIcon} size={14} className="text-[#D97706]" />
                <span className="text-sm font-medium text-[#D97706]">
                  {user?.reliabilityScore ?? 92}% reliable
                </span>
              </div>
            </div>
          </div>

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
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-auto opacity-50" />
            </button>
          ))}

          <div className="h-px bg-[#F3F4F6] my-2" />

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-body text-[#DC2626] hover:bg-[#FEE2E2] transition-all"
          >
            <HugeiconsIcon icon={Logout01Icon} size={20} /> Sign Out
          </button>
          <button
            onClick={() => {
              switchRole("founder");
              router.push("/founder/dashboard");
            }}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-body text-brand-primary hover:bg-[#EDE9FE] transition-all mt-4 border border-brand-primary/20"
          >
            <HugeiconsIcon icon={Building04Icon} size={20} /> Switch to Founder
          </button>
        </div>

        {/* Right content */}
        <div className="flex-1 max-w-2xl">

          {/* ── Profile ── */}
          {section === "profile" && (
            <div className="bg-white border border-[#F3F4F6] rounded-2xl p-5 lg:p-8 flex flex-col gap-5 lg:gap-6">
              <h2 className="text-[18px] lg:text-[24px] font-semibold text-text-primary">Edit Profile</h2>
              <div className="flex flex-col gap-4 lg:gap-5">
                {[
                  { label: "Full Name", key: "name", icon: <HugeiconsIcon icon={UserIcon} size={18} className="text-text-muted" />, type: "text", placeholder: "Your full name" },
                  { label: "Email Address", key: "email", icon: <HugeiconsIcon icon={Mail01Icon} size={18} className="text-text-muted" />, type: "email", placeholder: "you@example.com" },
                  { label: "Phone Number", key: "phone", icon: <HugeiconsIcon icon={SmartPhone01Icon} size={18} className="text-text-muted" />, type: "tel", placeholder: "+234 800 000 0000" },
                  { label: "Location", key: "location", icon: <HugeiconsIcon icon={Location01Icon} size={18} className="text-text-muted" />, type: "text", placeholder: "City, Country" },
                  { label: "Occupation", key: "occupation", icon: <HugeiconsIcon icon={Building04Icon} size={18} className="text-text-muted" />, type: "text", placeholder: "Your occupation" },
                ].map(({ label, key, icon, type, placeholder }) => (
                  <div key={key}>
                    <label className="tiqra-label">{label}</label>
                    <div className="relative">
                      <input
                        type={type}
                        value={profileForm[key as keyof typeof profileForm]}
                        onChange={(e) => setProfileForm((f) => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="tiqra-input pl-11"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2">{icon}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="btn-primary w-fit gap-2">
                {saved ? <><HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} /> Saved!</> : "Save Changes"}
              </button>
            </div>
          )}

          {/* ── Demographics ── */}
          {section === "demographics" && (
            <div className="bg-white border border-[#F3F4F6] rounded-2xl p-8 flex flex-col gap-6">
              <div>
                <h2 className="text-[24px] font-semibold text-text-primary">My Demographics</h2>
                <p className="text-body text-text-secondary mt-1">
                  This helps us match you with relevant, higher-paying surveys.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="tiqra-label">Age</label>
                  <input
                    value={demographics.age}
                    onChange={(e) => setDemographics((d) => ({ ...d, age: e.target.value }))}
                    type="number"
                    className="tiqra-input"
                    placeholder="Your age"
                  />
                </div>
                <div>
                  <label className="tiqra-label">Gender</label>
                  <select
                    value={demographics.gender}
                    onChange={(e) => setDemographics((d) => ({ ...d, gender: e.target.value }))}
                    className="tiqra-input"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="tiqra-label">Monthly Income</label>
                  <select
                    value={demographics.incomeBracket}
                    onChange={(e) => setDemographics((d) => ({ ...d, incomeBracket: e.target.value }))}
                    className="tiqra-input"
                  >
                    <option>Below ₦50k/month</option>
                    <option>₦50k–₦100k/month</option>
                    <option>₦100k–₦300k/month</option>
                    <option>₦300k+/month</option>
                  </select>
                </div>
                <div>
                  <label className="tiqra-label">Education Level</label>
                  <select
                    value={demographics.education}
                    onChange={(e) => setDemographics((d) => ({ ...d, education: e.target.value }))}
                    className="tiqra-input"
                  >
                    <option>Secondary School</option>
                    <option>Bachelor&apos;s Degree</option>
                    <option>Master&apos;s Degree</option>
                    <option>PhD</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="tiqra-label mb-3 block">Your Interests</label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                        selectedInterests.includes(interest)
                          ? "bg-brand-primary border-brand-primary text-white"
                          : "bg-white border-[#E5E7EB] text-text-secondary hover:border-brand-primary"
                      )}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleSave} className="btn-primary w-fit gap-2">
                {saved ? <><HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} /> Saved!</> : "Save Demographics"}
              </button>
            </div>
          )}

          {/* ── Notifications ── */}
          {section === "notifications" && (
            <div className="bg-white border border-[#F3F4F6] rounded-2xl p-8 flex flex-col gap-6">
              <h2 className="text-[24px] font-semibold text-text-primary">Notification Preferences</h2>
              <div className="flex flex-col gap-1">
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
                      <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm", notif.on ? "translate-x-7" : "translate-x-1")} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="btn-primary w-fit gap-2">
                {saved ? <><HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} /> Saved!</> : "Save Preferences"}
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
                    <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
                      {showCurrentPw ? <HugeiconsIcon icon={ViewOffIcon} size={18} /> : <HugeiconsIcon icon={ViewIcon} size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="tiqra-label">New Password</label>
                  <div className="relative">
                    <input type={showNewPw ? "text" : "password"} className="tiqra-input pr-12" placeholder="Min. 8 characters" />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
                      {showNewPw ? <HugeiconsIcon icon={ViewOffIcon} size={18} /> : <HugeiconsIcon icon={ViewIcon} size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="tiqra-label">Confirm New Password</label>
                  <input type="password" className="tiqra-input" placeholder="Repeat new password" />
                </div>
              </div>
              <button onClick={handleSave} className="btn-primary w-fit gap-2">
                {saved ? <><HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} /> Updated!</> : "Update Password"}
              </button>
            </div>
          )}

          {/* ── Privacy ── */}
          {section === "privacy" && (
            <div className="bg-white border border-[#F3F4F6] rounded-2xl p-8 flex flex-col gap-6">
              <h2 className="text-[24px] font-semibold text-text-primary">Privacy Settings</h2>
              {privacySettings.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b border-[#F3F4F6] last:border-0">
                  <div>
                    <p className="text-body font-medium text-text-primary">{item.label}</p>
                    <p className="text-sm text-text-secondary mt-0.5">{item.description}</p>
                  </div>
                  <button onClick={() => togglePrivacy(item.id)} className={cn("relative w-12 h-6 rounded-full transition-colors flex-shrink-0", item.on ? "bg-brand-primary" : "bg-[#E5E7EB]")}>
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
          {/* Mobile: Logout & Switch */}
          <div className="mt-4 lg:hidden flex flex-col gap-3">
            <button
              onClick={() => {
                switchRole("founder");
                router.push("/founder/dashboard");
              }}
              className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-body text-brand-primary hover:bg-[#EDE9FE] transition-all w-full border border-brand-primary/20"
            >
              <HugeiconsIcon icon={Building04Icon} size={20} /> Switch to Founder
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-body text-[#DC2626] hover:bg-[#FEE2E2] transition-all w-full border border-[#FEE2E2]"
            >
              <HugeiconsIcon icon={Logout01Icon} size={20} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
