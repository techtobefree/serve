import { IonButton } from "@ionic/react";
import { useEffect, useState } from "react";
import { requestOTP, verifyOTP } from "../../domains/auth/smsOTP";

const LOCAL_STORAGE_PHONE_KEY = 'login-phone';
const LOCAL_STORAGE_NEXT_PHONE_KEY = 'next-phone';

export default function Login() {
  const [phone, setPhone] = useState("");
  const [nextPhoneCodeAvailableTime, setNextPhoneTime] = useState(0);
  const [phoneInfo, setPhoneInfo] = useState("");
  const [isError, setError] = useState(true);

  const [otpCode, setCode] = useState("");
  const [otpInfo, setInfo] = useState("");

  useEffect(() => {
    const localPhone = localStorage.getItem(LOCAL_STORAGE_PHONE_KEY);
    if (localPhone) {
      handlePhoneInputChange(localPhone)
    }
    const localNext = localStorage.getItem(LOCAL_STORAGE_NEXT_PHONE_KEY);
    if (localNext) {
      setNextPhoneTime(parseInt(localNext))
    }
  }, [])

  useEffect(() => {
    if (nextPhoneCodeAvailableTime) {
      const timeoutId = setTimeout(() => {
        setNextPhoneTime(0)
      }, nextPhoneCodeAvailableTime)

      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [nextPhoneCodeAvailableTime])

  const handlePhoneInputChange = (input: string) => {
    // Allow only digits and restrict length to 11 characters
    if (/^\d{0,11}$/.test(input)) {
      setPhone(input);
      localStorage.setItem(LOCAL_STORAGE_PHONE_KEY, input)
      let info = '';
      if (input.length < 10) {
        info = "Phone number must be 10 digits"
        setError(true);
      } else if (input.length === 11) {
        info = `Using country code (${input.slice(0, 1)})`
        setError(false);
      } else {
        info = `Using country code (1)`
        setError(false);
      }
      setPhoneInfo(info);
    }
  };

  const handleOTPInputChange = (input: string) => {
    // Allow only digits and restrict length to 6 characters
    if (/^\d{0,6}$/.test(input)) {
      setCode(input);
      if (input.length < 6) {
        setInfo("Verification code is 6 digits");
      } else {
        setInfo("Verifying...");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-2 w-50 h-28">
        <label htmlFor="phone" className="text-gray-700">
          Phone Number
        </label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={e => { handlePhoneInputChange(e.target.value) }}
          placeholder="1234567890"
          className="px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 w-36"
        />
        {phoneInfo && <p className={`${isError ? 'text-red-500' : ''} text-sm`}>{phoneInfo}</p>}
      </div>
      <div>
        <IonButton disabled={isError || nextPhoneCodeAvailableTime > Date.now()} onClick={() => {
          const phoneNumber = `+${phone.length === 10 ? '1' : ''}${phone}`
          void requestOTP(phoneNumber)
          setNextPhoneTime(Date.now() + 60 * 1000) // 60 seconds from now
        }}>Send OTP</IonButton>
      </div>
      <p className="pt-6">
        Login with a One Time Password. We will text the number provided a 6 digit code. Texting charges apply.
      </p>
      <div className="flex flex-col space-y-2 w-50 h-36 pt-12">
        <label htmlFor="otp" className="text-gray-700">
          Verify
        </label>
        <input
          type="text"
          id="otp"
          value={otpCode}
          disabled={isError}
          onChange={e => { handleOTPInputChange(e.target.value) }}
          placeholder="123456"
          className="px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500 w-28"
        />
        {otpInfo && <p className='text-sm'>{otpInfo}</p>}
      </div>
      <div className="pt-6">
        <IonButton disabled={isError || otpCode.length !== 6} onClick={() => { void verifyOTP(phone, otpCode) }}>Verify</IonButton>
      </div>
    </div>
  )
}
