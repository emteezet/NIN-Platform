"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function VerifyBVNRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the unified verification hub
    router.replace("/verify?type=bvn");
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 text-accent-green animate-spin" />
      <p className="text-text-secondary font-medium animate-pulse">
        Redirecting to Verification Hub...
      </p>
    </div>
  );
}

