'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export function Providers({ children }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Prevent crash if Client ID is missing, but Google Login won't work
  if (!clientId) {
    console.warn("⚠️ NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing in frontend/.env.local");
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
