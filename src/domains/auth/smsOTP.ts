import { clientSupabase } from "../db/clientSupabase";
import { showToast } from "../ui/toast";

export async function requestOTP(phoneNumber: string) {
  const { error } = await clientSupabase.auth.signInWithOtp({ phone: phoneNumber });
  if (error) {
    showToast("Failed to send one-time password", { isError: true, duration: 5000 });
  } else {
    showToast("One-time password sent", { duration: 3000 });
  }
}

export async function verifyOTP(phoneNumber: string, otp: string, onError: () => void) {
  const { error } = await clientSupabase.auth.verifyOtp({
    phone: phoneNumber,
    token: otp,
    type: 'sms',
  });

  if (error) {
    showToast("Error verifying one-time password");
    onError();
  }
}

export async function logout() {
  const { error } = await clientSupabase.auth.signOut()

  if (error) {
    showToast("Error logging out", { isError: true, duration: 5000 });
    console.error("Error logging out:", error.message);
  } else {
    showToast("Successfully logged out", { duration: 3000 });
  }
}
