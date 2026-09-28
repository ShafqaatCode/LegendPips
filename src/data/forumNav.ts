export const FORUM_SUBMENU = [
  { to: "/forum/latest", label: "Latest posts" },
  { to: "/forum", label: "Forum", end: true },
] as const;

export const FORUM_NESTED_PATHS = new Set<string>(FORUM_SUBMENU.map((i) => i.to));
