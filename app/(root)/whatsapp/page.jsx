'use client';

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import LoginPage from "../../(components)/WhatsApp/LoginPage";
import { getSocket, disconnectSocket } from "@/utils/socket";
import Main from "../../(components)/WhatsApp/Main";

const WhatsApp = () => {

  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState(null);
  const [fromID, setFromID] = useState(null);
  const [fromEmail, setFromEmail] = useState(null);
  
  // ====== AUTO LOGIN USING COOKIE SESSION ======
  useEffect(() => {

    const checkLogin = async () => {

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API_BASE_URL || "http://localhost:5000"}/api/users/sessionLogin`, {
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
            />

          ) : (
            <>
              <Main
                loading={loading}
                setLoading={setLoading}
                userID={userID}
                fromID={fromID}
                fromEmail={fromEmail}
                setUserID={setUserID}
              />
            </>
          )}

        </Box>
      )}
    </>
  );
};

export default WhatsApp;
