import { supabase } from "../db/supabaseClient";
import { onLogin } from "./currentUser";

export async function requestOTP(phoneNumber: string) {
  const { error } = await supabase.auth.signInWithOtp({ phone: phoneNumber });
  if (error) {
    console.error("Error sending OTP:", error.message);
  } else {
    console.log("OTP sent successfully!");
  }
}

export async function verifyOTP(phoneNumber: string, otp: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: phoneNumber,
    token: otp,
    type: 'sms',
  });

  if (error) {
    console.error("Error verifying OTP:", error.message);
    onLogin()
  } else {
    console.log("Logged in successfully!", data);
    onLogin(data.session)
  }
}
