import { clientSupabase } from "../db/clientSupabase";

export async function requestOTP(phoneNumber: string) {
  const { error } = await clientSupabase.auth.signInWithOtp({ phone: phoneNumber });
  if (error) {
    console.error("Error sending OTP:", error.message);
  } else {
    console.log("OTP sent successfully!");
  }
}

export async function verifyOTP(phoneNumber: string, otp: string, onError: () => void) {
  const { data, error } = await clientSupabase.auth.verifyOtp({
    phone: phoneNumber,
    token: otp,
    type: 'sms',
  });

  if (error) {
    console.error("Error verifying OTP:", error.message);
    onError();
  } else {
    console.log("Logged in successfully!", data);
  }
}

export async function logout() {
  const { error } = await clientSupabase.auth.signOut()

  if (error) {
    console.error("Error logging out:", error.message);
  } else {
    console.log("Logged out successfully!");
  }
}
