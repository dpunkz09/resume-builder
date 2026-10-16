"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOTP, sendVerificationOTP } from "@/app/actions/verification-actions";
import { initializeUserData } from "@/app/actions/auth-actions";
import { signIn } from "@/lib/auth-client";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await verifyOTP(emailParam, otp);

      if (!result.success) {
        setError(result.error || "Invalid verification code");
        setLoading(false);
        return;
      }

      // Email verified successfully
      // Redirect to login with success message so user can sign in
      router.push("/login?verified=true");
    } catch (_err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResending(true);

    try {
      const result = await sendVerificationOTP(emailParam);

      if (!result.success) {
        setError(result.error || "Failed to resend code");
      } else {
        setResendCooldown(60); // 60 second cooldown
      }
    } catch (_err) {
      setError("An unexpected error occurred");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-zinc-900">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={emailParam}
            disabled
            className="block w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3.5 py-2.5 text-base text-zinc-600"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="otp" className="block text-sm font-medium text-zinc-900">
            Verification Code
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            required
            maxLength={6}
            className={`block w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-center text-2xl font-mono tracking-widest text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-600 ${focusRing}`}
            placeholder="000000"
            autoComplete="one-time-code"
          />
          <p className="text-xs text-zinc-500">Enter the 6-digit code sent to your email</p>
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className={`w-full rounded-lg bg-zinc-900 px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-zinc-500">Didn't receive the code?</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleResend}
        disabled={resending || resendCooldown > 0}
        className={`w-full rounded-lg border border-zinc-300 bg-white px-6 py-3 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`}
      >
        {resending
          ? "Sending..."
          : resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : "Resend verification code"}
      </button>
    </div>
  );
}
