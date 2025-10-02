import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // fake premium başlangıçta false
  const [isPremium, setIsPremium] = useState(false);

  return (
    <UserContext.Provider value={{ isPremium, setIsPremium }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
