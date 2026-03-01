import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getSocket } from "../../../utils/socket";
import { getChatApiBaseUrl } from "@/utils/chatApiBase";

const LoginPage = ({ userID, setUserID, setFromID, setFromEmail, setUserRole }) => {
  const [loginID, setLoginID] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const handleLogin = async () => {
    const apiBaseUrl = getChatApiBaseUrl();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${apiBaseUrl}/api/users/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loginID,
          password
        })
      });

      // console.log("Response status:", res.status);

      const data = await res.json().catch(() => null);

      // console.log("Response body:", data.user);

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Invalid login credentials");
      }

      // console.log("Response body:", data.user.name);

      setUserID(data.user.name);
      setFromID(String(data.user.id));
      setFromEmail(data.user.email);
      setUserRole(data.user.role || null);

      if (typeof window !== "undefined") {
        sessionStorage.setItem("userID", data.user.name);
        sessionStorage.setItem("fromID", String(data.user.id));
        sessionStorage.setItem("fromEmail", data.user.email);
      }


    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userID != null) {
      const socket = getSocket();
      const savedFromEmail = typeof window !== "undefined" ? sessionStorage.getItem("fromEmail") : null;
      if (savedFromEmail) {
        socket.emit("register", savedFromEmail);
      }
    }
  }, [userID]);

  return (
    <Box display='flex' width='100%' height='100%' justifyContent='center' alignItems='center'>
      <Box display='flex' flexDirection='column' width='500px' gap={1.5} paddingX={2} paddingY={3} borderRadius={2} boxShadow={3} margin={1}>

        <Typography textAlign='center' fontSize={22} fontWeight={600}>
          WhatsApp Login
        </Typography>

        {error && (
          <Typography color="error" fontSize={14}>
            {error}
          </Typography>
        )}

        <Typography>Enter User ID</Typography>
        <TextField
          value={loginID}
          onChange={(e) => setLoginID(e.target.value)}
          disabled={loading}
        />

        <Typography>Enter Password</Typography>
        <TextField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <Button
          variant="contained"
          sx={{ marginTop: 1, backgroundColor: '#21c063' }}
          onClick={handleLogin}
          disabled={loading || !loginID || !password}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
