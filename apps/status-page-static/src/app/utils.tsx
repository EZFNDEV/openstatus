import React from "react";

export function createProtectedCookieKey(value: string) {
  return `secured-${value}`;
}

export function getBaseUrl({
  slug,
  customDomain,
}: {
  slug: string;
  customDomain?: string;
}) {
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:3000/status-page/${slug}`;
  }
  if (customDomain) {
    return `https://${customDomain}`;
  }
  return `https://${slug}.openstatus.dev`;
}

export const useMounted = () => {
  const [mounted, setMounted] = React.useState<boolean>()
  // effects run only client-side
  // so we can detect when the component is hydrated/mounted
  // @see https://react.dev/reference/react/useEffect
  React.useEffect(() => {
      setMounted(true)
  }, [])
  return mounted
};