import { supabase } from "../db/supabaseClient";

export async function requestOTP(phoneNumber: string) {
  const { error } = await supabase.auth.signInWithOtp({ phone: phoneNumber });
  if (error) {
    console.error("Error sending OTP:", error.message);
  } else {
    console.log("OTP sent successfully!");
  }
}

export async function verifyOTP(phoneNumber: string, otp: string, onError: () => void) {
  const { data, error } = await supabase.auth.verifyOtp({
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
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error logging out:", error.message);
  } else {
    console.log("Logged out successfully!");
  }
}
