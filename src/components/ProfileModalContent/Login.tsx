import { useEffect, useState } from "react";

const LOCAL_STORAGE_PHONE_KEY = 'login-phone';

export default function Login() {
  const [phone, setPhone] = useState("");
  const [phoneInfo, setPhoneInfo] = useState("");
  const [isError, setError] = useState(false);

  const [otpCode, setCode] = useState("");
  const [otpInfo, setInfo] = useState("");

  useEffect(() => {
    const localPhone = localStorage.getItem(LOCAL_STORAGE_PHONE_KEY);
    if (localPhone) {
      setPhone(localPhone)
    }
  }, [])

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
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
        setError(false);
      }
      setPhoneInfo(info);
    }
  };

  const handleOTPInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Allow only digits and restrict length to 6 characters
    if (/^\d{0,6}$/.test(input)) {
      setCode(input);
      if (input.length < 6) {
        setError(true);
        setInfo("Verification code is 6 digits");
      } else {
        setError(false);
        setInfo("Verifying");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-2 w-40 h-36">
        <label htmlFor="phone" className="text-gray-700">
          Phone Number
        </label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={handlePhoneInputChange}
          placeholder="1234567890"
          className="px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
        {phoneInfo && <p className={`${isError ? 'text-red-500' : ''} text-sm`}>{phoneInfo}</p>}
      </div>
      <div>
        Send OTP
      </div>
      <div>
        Verify
      </div>
      <div className="flex flex-col space-y-2 w-40 h-36">
        <label htmlFor="otp" className="text-gray-700">
          Verify
        </label>
        <input
          type="text"
          id="otp"
          value={otpCode}
          onChange={handleOTPInputChange}
          placeholder="123456"
          className="px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
        {otpInfo && <p className='text-sm'>{otpInfo}</p>}
      </div>
    </div>
  )
}
