// import { useEffect } from "react";
// import { useNavigate } from "../router";
// import { supabase } from "../domains/db/supabaseClient";

// export default function Local() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const auth = async () => {
//       await supabase.auth.signInWithPassword({ email: 'XXXXXX', password: 'XXXXXXXXX' })
//       navigate('/')
//     }
//     void auth();
//   }, [navigate])
// }
