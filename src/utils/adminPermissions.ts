export type AdminPermission =
  | "dashboard"
  | "users"
  | "kyc"
  | "bulk_email"
  | "brokers"
  | "contests"
  | "signals"
  | "webinars"
  | "analysis"
  | "courses"
  | "feedback"
  | "activity"
  | "referrals"
  | "ib_change"
  | "live_accounts"
  | "rebates"
  | "traders"
  | "reports"
  | "settings"
  | "team";

export const ADMIN_PERMISSION_META: {
  key: AdminPermission;
  label: string;
  description: string;
}[] = [
  { key: "dashboard", label: "Dashboard", description: "View admin overview and charts" },
  { key: "users", label: "Users", description: "View and manage members" },
  { key: "kyc", label: "KYC records", description: "Review and approve identity documents" },
  { key: "bulk_email", label: "Bulk email", description: "Send emails to user segments" },
  { key: "brokers", label: "Brokers", description: "Manage Forex, Crypto, and Prop listings" },
  { key: "contests", label: "Contests", description: "Create and manage contests" },
  { key: "signals", label: "Signals", description: "Publish trading signals" },
  { key: "webinars", label: "Webinars", description: "Manage webinars" },
  { key: "analysis", label: "Analysis", description: "Manage market analysis posts" },
  { key: "courses", label: "Courses", description: "Manage education courses" },
  { key: "feedback", label: "Feedback inbox", description: "Read and manage feedback" },
  { key: "activity", label: "User activity", description: "View platform activity feed" },
  { key: "referrals", label: "Referrals", description: "Track friend invites members have sent" },
  { key: "ib_change", label: "IB change", description: "Handle broker / IB change requests" },
  {
    key: "live_accounts",
    label: "Live accounts",
    description: "Approve or reject live broker account setup submissions",
  },
  { key: "rebates", label: "Rebates", description: "Grant and view rebate credits" },
  { key: "traders", label: "Traders", description: "Verify trader profiles and copy requests" },
  { key: "reports", label: "Reports", description: "View and export reports" },
  { key: "settings", label: "Settings", description: "Platform branding, SEO, CMS" },
  { key: "team", label: "Admin team", description: "Add and manage staff access" },
];

export type AuthUserLike = {
  role?: string;
  isFullAdmin?: boolean;
  isStaffAdmin?: boolean;
  adminPermissions?: string[] | null;
};

/** Super admin has everything. Only accounts flagged as staff are limited. */
export function isFullAdmin(user?: AuthUserLike | null): boolean {
  if (!user || user.role !== "admin") return false;
  if (user.isFullAdmin === true) return true;
  if (user.isStaffAdmin === true) {
    return Array.isArray(user.adminPermissions) && user.adminPermissions.includes("*");
  }
  // Admin role without staff flag = full access
  return true;
}

export function hasPermission(user: AuthUserLike | null | undefined, ...needed: string[]): boolean {
  if (!user || user.role !== "admin") return false;
  if (isFullAdmin(user)) return true;
  if (!needed.length) return true;
  const have = new Set(user.adminPermissions || []);
  return needed.some((p) => have.has(p));
}

/** First allowed landing path for a staff/admin after login. */
export function firstAdminPath(user: AuthUserLike | null | undefined): string {
  if (!user || user.role !== "admin") return "/user-panel";
  if (isFullAdmin(user) || hasPermission(user, "dashboard")) return "/admin-panel";
  const map: [string, string][] = [
    ["kyc", "/admin-panel/kyc-records?filter=pending"],
    ["users", "/admin-panel/users"],
    ["brokers", "/admin-panel/brokers"],
    ["contests", "/admin-panel/contests"],
    ["signals", "/admin-panel/signals"],
    ["webinars", "/admin-panel/webinars"],
    ["analysis", "/admin-panel/analysis"],
    ["courses", "/admin-panel/courses"],
    ["feedback", "/admin-panel/feedback-inbox"],
    ["activity", "/admin-panel/user-activity"],
    ["referrals", "/admin-panel/referrals"],
    ["ib_change", "/admin-panel/ib-change"],
    ["live_accounts", "/admin-panel/live-accounts"],
    ["rebates", "/admin-panel/rebate-credits"],
    ["traders", "/admin-panel/traders"],
    ["reports", "/admin-panel/reports"],
    ["settings", "/admin-panel/settings"],
    ["team", "/admin-panel/team"],
    ["bulk_email", "/admin-panel/users/bulk-email"],
  ];
  for (const [perm, path] of map) {
    if (hasPermission(user, perm)) return path;
  }
  return "/admin-panel";
}

export const PERM_ROUTE_MAP: { pathPrefix: string; permissions: string[] }[] = [
  { pathPrefix: "/admin-panel/users/bulk-email", permissions: ["bulk_email"] },
  { pathPrefix: "/admin-panel/users", permissions: ["users"] },
  { pathPrefix: "/admin-panel/kyc-records", permissions: ["kyc"] },
  { pathPrefix: "/admin-panel/brokers", permissions: ["brokers"] },
  { pathPrefix: "/admin-panel/broker-reviews", permissions: ["brokers"] },
  { pathPrefix: "/admin-panel/signup-bonuses", permissions: ["brokers"] },
  { pathPrefix: "/admin-panel/performing-stocks", permissions: ["analysis"] },
  { pathPrefix: "/admin-panel/complaints", permissions: ["feedback", "brokers"] },
  { pathPrefix: "/admin-panel/contests", permissions: ["contests"] },
  { pathPrefix: "/admin-panel/signals", permissions: ["signals"] },
  { pathPrefix: "/admin-panel/webinars", permissions: ["webinars"] },
  { pathPrefix: "/admin-panel/analysis", permissions: ["analysis"] },
  { pathPrefix: "/admin-panel/courses", permissions: ["courses"] },
  { pathPrefix: "/admin-panel/feedback-inbox", permissions: ["feedback"] },
  { pathPrefix: "/admin-panel/user-activity", permissions: ["activity"] },
  { pathPrefix: "/admin-panel/referrals", permissions: ["referrals"] },
  { pathPrefix: "/admin-panel/ib-change", permissions: ["ib_change"] },
  { pathPrefix: "/admin-panel/live-accounts", permissions: ["live_accounts"] },
  { pathPrefix: "/admin-panel/rebate-credits", permissions: ["rebates"] },
  { pathPrefix: "/admin-panel/traders", permissions: ["traders"] },
  { pathPrefix: "/admin-panel/reports", permissions: ["reports"] },
  { pathPrefix: "/admin-panel/settings", permissions: ["settings"] },
  { pathPrefix: "/admin-panel/team", permissions: ["team"] },
];

export function canAccessPath(user: AuthUserLike | null | undefined, pathname: string): boolean {
  if (!user || user.role !== "admin") return false;
  if (isFullAdmin(user)) return true;
  if (pathname === "/admin-panel" || pathname === "/admin-panel/") {
    return hasPermission(user, "dashboard");
  }
  if (pathname === "/admin-panel/team" || pathname.startsWith("/admin-panel/team/")) {
    return isFullAdmin(user);
  }
  if (pathname === "/admin-panel/security" || pathname.startsWith("/admin-panel/security/")) {
    return user.role === "admin";
  }
  for (const row of PERM_ROUTE_MAP) {
    if (row.pathPrefix === "/admin-panel/team") continue;
    if (pathname === row.pathPrefix || pathname.startsWith(row.pathPrefix + "/")) {
      return hasPermission(user, ...row.permissions);
    }
  }
  return hasPermission(user, "dashboard");
}
