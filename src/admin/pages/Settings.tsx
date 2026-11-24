import { useEffect, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  Bell,
  Info,
  KeyRound,
  Lock,
  RotateCcw,
  Save,
  ShieldAlert,
  SlidersHorizontal,
  User,
  type LucideIcon,
} from "lucide-react";
import { useAdminData } from "../data/store";
import type { AdminProfile, PlatformSettings } from "../data/types";
import { useToast } from "../components/ui";
import {
  ConfirmDialog,
  Field,
  PageHeader,
  SectionCard,
  SuccessBanner,
  Toggle,
  cx,
  dangerBtn,
  inputClass,
  primaryBtn,
  secondaryBtn,
} from "../components/ui";

type Tab = "profile" | "notifications" | "platform" | "security";
type NotificationPrefs = Pick<PlatformSettings, "emailNotifications" | "smsNotifications" | "weeklyDigest">;
type PlatformForm = {
  siteName: string;
  supportEmail: string;
  currency: string;
  maxListingsPerOwner: string;
  minPrice: string;
  maxPrice: string;
  autoApproveListings: boolean;
  allowReviews: boolean;
  maintenanceMode: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEMO_PASSWORD = "Admin@123";

const tabs: Array<{ id: Tab; label: string; icon: LucideIcon }> = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "platform", label: "Platform", icon: SlidersHorizontal },
  { id: "security", label: "Security", icon: Lock },
];

function preferredTab(value: string | null): Tab {
  return value === "notifications" || value === "platform" || value === "security" ? value : "profile";
}

function toPlatformForm(settings: PlatformSettings): PlatformForm {
  return {
    siteName: settings.siteName,
    supportEmail: settings.supportEmail,
    currency: settings.currency,
    maxListingsPerOwner: String(settings.maxListingsPerOwner),
    minPrice: String(settings.minPrice),
    maxPrice: String(settings.maxPrice),
    autoApproveListings: settings.autoApproveListings,
    allowReviews: settings.allowReviews,
    maintenanceMode: settings.maintenanceMode,
  };
}

function Notice({ tone = "info", title, children }: { tone?: "info" | "warning"; title: string; children: ReactNode }) {
  const Icon = tone === "warning" ? AlertTriangle : Info;
  return (
    <div
      className={cx(
        "flex items-start gap-3 rounded-2xl shadow-card p-4",
        tone === "warning" ? "border border-amber-200 bg-[#FFF9EA]" : "border border-primary-100 bg-lav/60",
      )}
    >
      <Icon size={18} strokeWidth={2.4} className={tone === "warning" ? "mt-0.5 text-[#97650B]" : "mt-0.5 text-primary-700"} />
      <div>
        <p className="text-[13px] font-extrabold text-night">{title}</p>
        <p className="mt-1 text-[12px] font-medium leading-relaxed text-night/60">{children}</p>
      </div>
    </div>
  );
}

export default function Settings() {
  const { data, updateSettings, updateAdminProfile, resetDemoData, logActivity } = useAdminData();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = preferredTab(searchParams.get("tab"));

  function goToTab(next: Tab) {
    setSearchParams(next === "profile" ? {} : { tab: next }, { replace: true });
  }

  const [profile, setProfile] = useState<AdminProfile>(() => ({ ...data.adminProfile }));
  const [profileError, setProfileError] = useState("");

  const [prefs, setPrefs] = useState<NotificationPrefs>(() => ({
    emailNotifications: data.settings.emailNotifications,
    smsNotifications: data.settings.smsNotifications,
    weeklyDigest: data.settings.weeklyDigest,
  }));

  const [platform, setPlatform] = useState<PlatformForm>(() => toPlatformForm(data.settings));
  const [platformError, setPlatformError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => setProfile({ ...data.adminProfile }), [data.adminProfile]);
  useEffect(
    () =>
      setPrefs({
        emailNotifications: data.settings.emailNotifications,
        smsNotifications: data.settings.smsNotifications,
        weeklyDigest: data.settings.weeklyDigest,
      }),
    [data.settings.emailNotifications, data.settings.smsNotifications, data.settings.weeklyDigest],
  );
  useEffect(() => setPlatform(toPlatformForm(data.settings)), [data.settings]);

  function saveProfile() {
    const name = profile.name.trim();
    const email = profile.email.trim();
    if (!name || !email) {
      setProfileError("Name and email are required.");
      toast.error("Name and email are required.");
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setProfileError("Enter a valid email address.");
      toast.error("Enter a valid email address.");
      return;
    }
    setProfileError("");
    updateAdminProfile({
      name,
      email,
      phone: profile.phone.trim(),
      role: profile.role.trim(),
      location: profile.location.trim(),
    });
    toast.success("Admin profile saved.");
  }

  function savePrefs() {
    updateSettings(prefs);
    toast.success("Notification preferences saved.");
  }

  function savePlatform() {
    const maxListings = Number(platform.maxListingsPerOwner);
    const minPrice = Number(platform.minPrice);
    const maxPrice = Number(platform.maxPrice);

    if (!platform.siteName.trim() || !platform.currency.trim()) {
      setPlatformError("Site name and currency are required.");
      toast.error("Site name and currency are required.");
      return;
    }
    if (!EMAIL_PATTERN.test(platform.supportEmail.trim())) {
      setPlatformError("Enter a valid support email address.");
      toast.error("Enter a valid support email address.");
      return;
    }
    if (!Number.isInteger(maxListings) || maxListings <= 0 || minPrice <= 0 || maxPrice <= 0) {
      setPlatformError("Listing limit and price bounds must be positive numbers.");
      toast.error("Listing limit and price bounds must be positive numbers.");
      return;
    }
    if (minPrice >= maxPrice) {
      setPlatformError("Minimum price must be lower than maximum price.");
      toast.error("Minimum price must be lower than maximum price.");
      return;
    }

    setPlatformError("");
    updateSettings({
      siteName: platform.siteName.trim(),
      supportEmail: platform.supportEmail.trim(),
      currency: platform.currency.trim(),
      maxListingsPerOwner: maxListings,
      minPrice,
      maxPrice,
      autoApproveListings: platform.autoApproveListings,
      allowReviews: platform.allowReviews,
      maintenanceMode: platform.maintenanceMode,
    });
    toast.success("Platform settings saved.");
  }

  function changePassword() {
    setPasswordUpdated(false);
    if (currentPassword !== DEMO_PASSWORD) {
      setSecurityError("Current password is incorrect.");
      toast.error("Current password is incorrect.");
      return;
    }
    if (newPassword.length < 8) {
      setSecurityError("New password must be at least 8 characters.");
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityError("New password and confirmation do not match.");
      toast.error("New password and confirmation do not match.");
      return;
    }
    setSecurityError("");
    setPasswordUpdated(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Demo password updated (frontend only).");
    logActivity("Admin demo password updated (frontend only)", "system");
  }

  function confirmResetData() {
    resetDemoData();
    toast.success("All demo data has been reset to its original state.");
    setPasswordUpdated(false);
    setConfirmReset(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Settings" subtitle="Manage your profile, preferences and the demo platform configuration." />

      <div className="flex flex-wrap gap-2 border-b border-primary-100 pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => goToTab(id)}
            aria-current={tab === id ? "page" : undefined}
            className={cx(
              "inline-flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-[13px] font-bold transition",
              tab === id
                ? "bg-primary-700 text-white"
                : "text-night/55 hover:bg-lav hover:text-primary-700",
            )}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="space-y-5">
          <SectionCard title="Admin profile" subtitle="Update the details shown for the signed-in administrator.">
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <Field label="Full name" htmlFor="profile-name">
                <input
                  id="profile-name"
                  className={inputClass}
                  value={profile.name}
                  onChange={(event) => setProfile({ ...profile, name: event.target.value })}
                  placeholder="Administrator name"
                />
              </Field>
              <Field label="Email address" htmlFor="profile-email">
                <input
                  id="profile-email"
                  type="email"
                  className={inputClass}
                  value={profile.email}
                  onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                  placeholder="admin@bodima.lk"
                />
              </Field>
              <Field label="Phone" htmlFor="profile-phone">
                <input
                  id="profile-phone"
                  type="tel"
                  className={inputClass}
                  value={profile.phone}
                  onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
                  placeholder="+94 11 234 5678"
                />
              </Field>
              <Field label="Role" htmlFor="profile-role">
                <input
                  id="profile-role"
                  className={inputClass}
                  value={profile.role}
                  onChange={(event) => setProfile({ ...profile, role: event.target.value })}
                  placeholder="Super Admin"
                />
              </Field>
              <Field label="Location" htmlFor="profile-location" hint="Shown in the admin sidebar and profile.">
                <input
                  id="profile-location"
                  className={inputClass}
                  value={profile.location}
                  onChange={(event) => setProfile({ ...profile, location: event.target.value })}
                  placeholder="Colombo, Sri Lanka"
                />
              </Field>
              {profileError && <p className="self-end text-[13px] font-bold text-red-600 sm:col-span-2">{profileError}</p>}
              <div className="flex justify-end sm:col-span-2">
                <button type="button" className={primaryBtn} onClick={saveProfile}>
                  <Save size={16} /> Save profile
                </button>
              </div>
            </div>
          </SectionCard>
          <Notice title="Demo credentials are fixed">
            Sign in with <strong>admin@bodima.lk</strong> / <strong>Admin@123</strong>. Editing this profile only changes
            the local demo data — it does not change the hard-coded login credentials.
          </Notice>
        </div>
      )}

      {tab === "notifications" && (
        <div className="space-y-5">
          <SectionCard title="Notification preferences" subtitle="Choose which admin alerts are enabled in this demo.">
            <div className="p-5 sm:p-6">
              <Toggle
                checked={prefs.emailNotifications}
                onChange={(checked) => setPrefs({ ...prefs, emailNotifications: checked })}
                label="Email notifications"
                description="Receive platform alerts and moderation summaries by email."
              />
              <Toggle
                checked={prefs.smsNotifications}
                onChange={(checked) => setPrefs({ ...prefs, smsNotifications: checked })}
                label="SMS notifications"
                description="Receive urgent alerts by SMS."
              />
              <Toggle
                checked={prefs.weeklyDigest}
                onChange={(checked) => setPrefs({ ...prefs, weeklyDigest: checked })}
                label="Weekly digest"
                description="Get a weekly summary of registrations, listings and reports."
              />
              <div className="mt-4 flex justify-end border-t border-primary-100 pt-4">
                <button type="button" className={primaryBtn} onClick={savePrefs}>
                  <Save size={16} /> Save preferences
                </button>
              </div>
            </div>
          </SectionCard>
          <Notice title="Frontend-only preferences">
            These switches update local demo data only. No emails, SMS messages or digests are actually sent.
          </Notice>
        </div>
      )}

      {tab === "platform" && (
        <div className="space-y-5">
          {platform.maintenanceMode && (
            <Notice tone="warning" title="Maintenance mode is enabled">
              The public site would be unavailable to visitors while this demo setting is on. Turn it off below and save
              to restore normal access.
            </Notice>
          )}
          <SectionCard title="Platform configuration" subtitle="Site identity, listing limits and moderation defaults.">
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <Field label="Site name" htmlFor="site-name">
                <input
                  id="site-name"
                  className={inputClass}
                  value={platform.siteName}
                  onChange={(event) => setPlatform({ ...platform, siteName: event.target.value })}
                />
              </Field>
              <Field label="Support email" htmlFor="support-email">
                <input
                  id="support-email"
                  type="email"
                  className={inputClass}
                  value={platform.supportEmail}
                  onChange={(event) => setPlatform({ ...platform, supportEmail: event.target.value })}
                />
              </Field>
              <Field label="Currency" htmlFor="currency">
                <input
                  id="currency"
                  className={inputClass}
                  value={platform.currency}
                  onChange={(event) => setPlatform({ ...platform, currency: event.target.value })}
                />
              </Field>
              <Field label="Max listings per owner" htmlFor="max-listings">
                <input
                  id="max-listings"
                  type="number"
                  min={1}
                  className={inputClass}
                  value={platform.maxListingsPerOwner}
                  onChange={(event) => setPlatform({ ...platform, maxListingsPerOwner: event.target.value })}
                />
              </Field>
              <Field label="Minimum price (LKR)" htmlFor="min-price">
                <input
                  id="min-price"
                  type="number"
                  min={1}
                  className={inputClass}
                  value={platform.minPrice}
                  onChange={(event) => setPlatform({ ...platform, minPrice: event.target.value })}
                />
              </Field>
              <Field label="Maximum price (LKR)" htmlFor="max-price">
                <input
                  id="max-price"
                  type="number"
                  min={1}
                  className={inputClass}
                  value={platform.maxPrice}
                  onChange={(event) => setPlatform({ ...platform, maxPrice: event.target.value })}
                />
              </Field>

              <div className="sm:col-span-2">
                <div className="rounded-xl border border-primary-100 px-4">
                  <Toggle
                    checked={platform.autoApproveListings}
                    onChange={(checked) => setPlatform({ ...platform, autoApproveListings: checked })}
                    label="Auto-approve listings"
                    description="New owner submissions go live without admin review."
                  />
                  <Toggle
                    checked={platform.allowReviews}
                    onChange={(checked) => setPlatform({ ...platform, allowReviews: checked })}
                    label="Allow reviews"
                    description="Let seekers post reviews on boarding listings."
                  />
                  <Toggle
                    checked={platform.maintenanceMode}
                    onChange={(checked) => setPlatform({ ...platform, maintenanceMode: checked })}
                    label="Maintenance mode"
                    description="Show a maintenance notice to visitors."
                  />
                </div>
              </div>

              {platformError && <p className="text-[13px] font-bold text-red-600 sm:col-span-2">{platformError}</p>}
              <div className="flex justify-end sm:col-span-2">
                <button type="button" className={primaryBtn} onClick={savePlatform}>
                  <Save size={16} /> Save platform settings
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {tab === "security" && (
        <div className="space-y-5">
          <Notice title="Frontend-only demo security">
            This admin console is not production authentication. Data is stored in your browser's localStorage, nothing
            is sent to a server, and login uses hard-coded demo credentials. Password changes here do not update the
            real login credential.
          </Notice>

          <SectionCard title="Change demo password" subtitle="Simulate a password change for the demo session.">
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <Field label="Current password" htmlFor="current-password" hint="Demo password: Admin@123">
                <input
                  id="current-password"
                  type="password"
                  className={inputClass}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Enter current password"
                />
              </Field>
              <Field label="New password" htmlFor="new-password" hint="At least 8 characters.">
                <input
                  id="new-password"
                  type="password"
                  className={inputClass}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Enter new password"
                />
              </Field>
              <Field label="Confirm new password" htmlFor="confirm-password">
                <input
                  id="confirm-password"
                  type="password"
                  className={inputClass}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat new password"
                />
              </Field>
              {securityError && <p className="self-end text-[13px] font-bold text-red-600 sm:col-span-2">{securityError}</p>}
              <div className="flex justify-end sm:col-span-2">
                <button type="button" className={primaryBtn} onClick={changePassword}>
                  <KeyRound size={16} /> Update password
                </button>
              </div>
              {passwordUpdated && (
                <div className="sm:col-span-2">
                  <SuccessBanner>
                    Demo password updated (frontend only). The real login still uses the hard-coded demo credential.
                  </SuccessBanner>
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Danger zone" subtitle="Destructive demo actions.">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-600">
                  <ShieldAlert size={19} />
                </span>
                <div>
                  <p className="text-[14px] font-extrabold text-night">Reset all demo data</p>
                  <p className="mt-1 text-[13px] font-medium text-night/60">
                    Restore users, listings, reports, reviews, messages and settings to their original seeded state.
                  </p>
                </div>
              </div>
              <button type="button" className={dangerBtn} onClick={() => setConfirmReset(true)}>
                <RotateCcw size={16} /> Reset demo data
              </button>
            </div>
          </SectionCard>
        </div>
      )}

      <div className="flex justify-end">
        <button type="button" className={secondaryBtn} onClick={() => goToTab("profile")}>
          Back to profile
        </button>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset all demo data?"
        message="Every change you made in this browser will be discarded and the original demo dataset will be restored. This cannot be undone."
        confirmLabel="Reset demo data"
        danger
        onConfirm={confirmResetData}
      />
    </div>
  );
}
