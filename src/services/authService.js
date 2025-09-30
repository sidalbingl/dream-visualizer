import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
  } from "firebase/auth";
  import { auth } from "../firebaseConfig";
  
  // Kullanıcı Kayıt (Register)
  export const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user; // başarılı olursa user objesini döner
    } catch (error) {
      throw error; // hata olursa üstte yakalayacağız
    }
  };
  
  // Kullanıcı Giriş (Login)
  export const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };
  
  // Kullanıcı Çıkış (Logout)
  export const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };