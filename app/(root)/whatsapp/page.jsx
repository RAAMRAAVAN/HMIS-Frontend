'use client';

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import LoginPage from "../../(components)/WhatsApp/LoginPage";
import { getSocket, disconnectSocket } from "@/utils/socket";
import { getChatApiBaseUrl } from "@/utils/chatApiBase";
import Main from "../../(components)/WhatsApp/Main";

const WhatsApp = () => {

  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null);
  const [fromID, setFromID] = useState(null);
  const [fromEmail, setFromEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userProfileImage, setUserProfileImage] = useState(null);
  
  // ====== AUTO LOGIN USING COOKIE SESSION ======
  useEffect(() => {

    const checkLogin = async () => {
      const apiBaseUrl = getChatApiBaseUrl();

      try {
        const res = await fetch(`${apiBaseUrl}/api/users/sessionLogin`, {
          credentials: "include"
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data.success) {
          setUserID(data.user.name);
          setFromID(String(data.user.id));
          setFromEmail(data.user.email);
          setUserRole(data.user.role || null);
          setUserProfileImage(data.user.profile_image_url || null);

          if (typeof window !== "undefined") {
            sessionStorage.setItem("userID", data.user.name);
            sessionStorage.setItem("fromID", String(data.user.id));
            sessionStorage.setItem("fromEmail", data.user.email);
          }

          const socket = getSocket();
          socket.emit("register", data.user.email);
        }

      } catch {
      } finally {
        setLoading(false);
      }
    };

    checkLogin();

    return () => disconnectSocket();
  }, []);

  return (
    <>
      {loading ? null : (
        <Box display='flex' width='100%' height='100vh'>

          {!userID ? (

            <LoginPage
              userID={userID}
              setUserID={setUserID}
              setFromID={setFromID}
              setFromEmail={setFromEmail}
              setUserRole={setUserRole}
              setUserProfileImage={setUserProfileImage}
            />

          ) : (
            <>
              <Main
                loading={loading}
                setLoading={setLoading}
                userID={userID}
                fromID={fromID}
                fromEmail={fromEmail}
                userRole={userRole}
                setUserID={setUserID}
                initialProfileImage={userProfileImage}
                setUserProfileImage={setUserProfileImage}
              />
            </>
          )}

        </Box>
      )}
    </>
  );
};

export default WhatsApp;
