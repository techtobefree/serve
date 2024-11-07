import { IonButton, IonIcon } from "@ionic/react";
import { useState } from "react";
import { requestOTP, verifyOTP } from "../../domains/auth/smsOTP";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useCountdown } from "../../hooks/useCountdown";
import { useNavigate } from "../../router";
import { closeOutline } from "ionicons/icons";

const LOCAL_STORAGE_PHONE_KEY = 'login-phone';

function formatPhoneNumber(phone: string) {
  if (phone.startsWith('+')) {
    return phone;
  }
  return `+${phone.length === 10 ? '1' : ''}${phone}`
}

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useLocalStorage('login-phone');
  const [nextCodeAvailableTime, setNextCodeAvailableTime] = useLocalStorage('next-phone')

  const nextCodeAvailableTimeMS = parseInt(nextCodeAvailableTime || '0');

  const [remainder] = useCountdown(nextCodeAvailableTimeMS);
  const [phoneInfo, setPhoneInfo] = useState("");
  const isError = phone.length < 10;

  const [otpCode, setCode] = useState("");
  const [otpVerifyWait, waitToReverify] = useCountdown();
  const [otpError, setOtpError] = useState("");

  const handlePhoneInputChange = (input: string) => {
    // Allow only digits and restrict length to 11 characters
    if (/^\d{0,11}$/.test(input)) {
      setPhone(input);
      localStorage.setItem(LOCAL_STORAGE_PHONE_KEY, input)
      let info = '';
      if (input.length < 10) {
        info = "Phone number must be 10 digits"
      } else if (input.length === 11) {
        info = `Using country code (${input.slice(0, 1)})`
      } else {
        info = `Using country code (1)`
      }
      setPhoneInfo(info);
    }
  };

  const handleOTPInputChange = (input: string) => {
    // Allow only digits and restrict length to 6 characters
    if (/^\d{0,6}$/.test(input)) {
      setCode(input);
      if (input.length === 6) {
        verifyAndDelayReverifyOTP(phone, otpCode)
      }
    }
  };

  const verifyAndDelayReverifyOTP = (phone: string, otpCode: string) => {
    setOtpError('')
    void verifyOTP(formatPhoneNumber(phone), otpCode, () => {
      setOtpError('Verification failed')
    })
    waitToReverify(3000)
  }

  return (
    <>
      {/* Modal Header */}
      <div className="flex justify-between items-center border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold">Not logged in</h2>


        {/* Close Button */}
        <button
          onClick={() => { navigate(-1) }}
          className="text-gray-400 hover:text-gray-600"
        >
          <IonIcon className="text-4xl text-blue-500" icon={closeOutline} />
        </button>
      </div>

      {/* Modal Content */}
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
          {<p className={`${isError ? 'text-red-500' : ''} text-sm`}>
            {isError ? phoneInfo : remainder ? `Please wait ${(Math.ceil(remainder / 1000)).toString()} seconds` : phoneInfo}
          </p>}
        </div>
        <div>
          <IonButton disabled={isError || nextCodeAvailableTimeMS > Date.now()} onClick={() => {
            void requestOTP(formatPhoneNumber(phone))
            const nextPhoneTime = Date.now() + 30 * 1000;
            setNextCodeAvailableTime(nextPhoneTime.toString()) // 60 seconds from now
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
          {<p className='text-sm'>Verification code is 6 digits</p>}
        </div>
        <div className="pt-6">
          <IonButton
            className="w-36"
            disabled={isError || otpCode.length !== 6 || !!otpVerifyWait}
            onClick={() => { verifyAndDelayReverifyOTP(phone, otpCode) }}
          >{otpCode.length === 6 && !!otpVerifyWait && !otpError ? 'Verifying' : 'Verify'}</IonButton>
        </div>
        {<p className='text-red-500 text-sm'>{otpError}</p>}
      </div>
    </>
  )
}
