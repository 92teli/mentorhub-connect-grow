// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { exchangeCodeForTokens } from "@/integrations/google/meet";
// import { supabase } from "@/integrations/supabase/client";

// export default function OAuth2Callback() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get("code");

//     async function handleOAuth() {
//       if (!code) return;

//       try {
//         // 1. Exchange code for tokens
//         const tokens = await exchangeCodeForTokens(code);
//         console.log('Google token response:', tokens);

//         if (!tokens.refreshToken) {
//           alert("No refresh token received. Please remove this app from your Google Account permissions (https://myaccount.google.com/permissions), then try connecting again.");
//           navigate("/dashboard");
//           return;
//         }

//         // 2. Store refresh token in Supabase
//         const { data: { user } } = await supabase.auth.getUser();
//         await supabase
//           .from("profiles")
//           .update({ google_refresh_token: tokens.refreshToken })
//           .eq("id", user.id);

//         alert("Google Calendar connected!");
//         navigate("/dashboard");
//       } catch (err) {
//         alert("Failed to connect Google Calendar");
//         navigate("/dashboard");
//       }
//     }

//     handleOAuth();
//   }, [navigate]);

//   return <div>Connecting your Google Calendar...</div>;
// } 