import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase.config";

  
  export const AuthContext = createContext();
  
  const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();
  
    console.log(user)
  
    const createUser = (email, password) => {
      setLoading(true);
      return createUserWithEmailAndPassword(auth, email, password);
    };
  
    const login = (email, password) => {
      setLoading(true);
      return signInWithEmailAndPassword(auth, email, password);
    };
  
    const googleLogin = () => {
      setLoading(true);
      return signInWithPopup(auth, googleProvider);
    };
  
    const logOut = () => {
      setLoading(true);
      return signOut(auth);
    };
  
    useEffect(() => {
      const unSubscribe = onAuthStateChanged(auth, (user) => {
        setLoading(false);
        setUser(user);
        
      });
      return () => {
        unSubscribe();
      };
    }, []);
  
    const authInfo = {
      user,
      loading,
      createUser,
      login,
      googleLogin,
      logOut,
    };
    return (
      <AuthContext.Provider value={authInfo}>
        {children}
    </AuthContext.Provider>
    );
  };
  
  export default AuthProvider;