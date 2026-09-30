import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:5000/api";

const TOKEN_KEY = "skill_link_token";
const USER_KEY = "skill_link_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // LOAD AUTH DATA FROM LOCAL STORAGE
  // =========================================================
  useEffect(() => {
    try {
      const savedToken =
        localStorage.getItem(TOKEN_KEY);

      const savedUser =
        localStorage.getItem(USER_KEY);

      if (savedToken) {
        setToken(savedToken);
      }

      if (savedUser) {
        try {
          const parsedUser =
            JSON.parse(savedUser);

          setUser(parsedUser);

          console.log(
            "AUTH USER LOADED:",
            parsedUser
          );
        } catch (error) {
          console.error(
            "USER PARSE ERROR:",
            error
          );

          localStorage.removeItem(USER_KEY);
        }
      }
    } catch (error) {
      console.error(
        "AUTH LOAD ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // LOGIN
  // =========================================================
  const login = async (email, password) => {
    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "LOGIN STATUS:",
        response.status
      );

      console.log(
        "LOGIN RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed."
        );
      }

      // =====================================================
      // GET TOKEN
      // =====================================================
      const newToken =
        data.token ||
        data.accessToken;

      if (!newToken) {
        throw new Error(
          "Login successful but token was not received."
        );
      }

      // =====================================================
      // GET USER
      // =====================================================
      const loggedInUser =
        data.user ||
        data.data?.user ||
        data.data ||
        null;

      if (!loggedInUser) {
        throw new Error(
          "Login successful but user information was not received."
        );
      }

      // Normalize role
      const normalizedUser = {
        ...loggedInUser,

        role: String(
          loggedInUser.role || "customer"
        )
          .trim()
          .toLowerCase(),
      };

      console.log(
        "FINAL LOGIN USER:",
        normalizedUser
      );

      console.log(
        "FINAL LOGIN ROLE:",
        normalizedUser.role
      );

      // =====================================================
      // SAVE
      // =====================================================
      localStorage.setItem(
        TOKEN_KEY,
        newToken
      );

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(normalizedUser)
      );

      // =====================================================
      // UPDATE STATE
      // =====================================================
      setToken(newToken);
      setUser(normalizedUser);

      return {
        success: true,
        token: newToken,
        user: normalizedUser,
      };
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      throw error;
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);

    console.log("USER LOGGED OUT");
  };

  // =========================================================
  // AUTH STATUS
  // =========================================================
  const isAuthenticated =
    Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ===========================================================
// USE AUTH
// ===========================================================
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}

export default AuthContext;