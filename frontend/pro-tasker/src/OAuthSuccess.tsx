// OAuthSuccess.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";

function OAuthSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = new URLSearchParams(
      window.location.search
    ).get("token");

    if (token) {
      login(token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);

  return <h1>Signing you in...</h1>;
}

export default OAuthSuccess;