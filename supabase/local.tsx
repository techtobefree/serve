// import { useEffect } from "react";

// import { supabase } from "../domains/db/supabaseClient";
// import { useNavigate } from "../router";

// export default function Local() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const auth = async () => {
//       await supabase.auth.signInWithPassword({
//         email: 'XXXXXX',
//         password: 'XXXXXXXXX'
//       })
//       navigate('/')
//     }
//     void auth();
//   }, [navigate])
// }
