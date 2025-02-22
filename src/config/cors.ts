const allowedDomains = process.env.ALLOWED_DOMAINS?.split(",") || [
  "http://localhost:3060", // default fallback
];

export function isAllowedOrigin(origin: string | null) {
  if (!origin) return true;
  return allowedDomains.includes(origin);
}
