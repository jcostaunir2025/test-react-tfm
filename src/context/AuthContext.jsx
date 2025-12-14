import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const MOCK_USER = {
  username: "jcosta",
  password: "1234",
  mfa: "unir"
};

const TOKEN_EXP_HOURS = 8;

const createToken = () => {
  const payload = {
    sub: MOCK_USER.username,
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXP_HOURS * 60 * 60
  };
  return btoa(JSON.stringify(payload));
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      const decoded = JSON.parse(atob(token));
      if (decoded.exp * 1000 < Date.now()) logout();
      else setUser({ username: decoded.sub });
    }
  }, [token]);

  const loginStepOne = ({ username, password }) => {
    if (username === MOCK_USER.username && password === MOCK_USER.password) {
      return true;
    }
    throw new Error("Credenciales inválidas");
  };

  const validateMFA = (code) => {
    if (code === MOCK_USER.mfa) {
      const newToken = createToken();
      setToken(newToken);
      return true;
    }
    throw new Error("Código MFA incorrecto");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loginStepOne, validateMFA, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);