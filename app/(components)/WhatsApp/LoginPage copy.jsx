import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getSocket } from "../../../utils/socket";

const LoginPage = ({ userID, setUserID, setFromID }) => {
  const [loginID, setLoginID] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("🔌 SOCKET CONNECTED →", socket.id);

      // Re-register user if already logged in
      const savedUser = sessionStorage.getItem("fromID");
      if (savedUser) {
        console.log("♻️ Re-registering user:", savedUser);
        socket.emit("register", savedUser);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 SOCKET DISCONNECTED");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);


  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loginID,
          password
        })
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Invalid credentials");
      }

      const user = data.user;

      // 👉 Save user
      setUserID(user.name);
      setFromID(user.id);

      sessionStorage.setItem("userID", user.name);
      sessionStorage.setItem("fromID", user.id);

      // 👉 REGISTER USER WITH SOCKET
      socket.emit("register", data.user.name);

      console.log("🟢 USER REGISTERED WITH SOCKET:", user.id);

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box display='flex' width='100%' height='100%' justifyContent='center' alignItems='center'>
      <Box display='flex' flexDirection='column' width='500px' gap={1.5}>

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