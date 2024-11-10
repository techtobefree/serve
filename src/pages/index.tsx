import { useEffect } from "react";
import { useNavigate } from "../router";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/home')
    }, 1)
  }, [navigate])

  return (
    <div>
      Redirecting to /home
    </div>
  )
}
