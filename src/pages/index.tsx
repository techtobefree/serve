import { useEffect } from "react";
import { useNavigate } from "../router";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/home')
  }, [navigate])

  return (
    <div>
      Redirecting to /home
    </div>
  )
}
