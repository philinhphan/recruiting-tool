import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserLevel, Personality } from '../types'; // Assuming Personality is defined in types

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  updateUserLevel: (level: UserLevel) => void;
  updateUserPersonality: (personality: Personality) => void;
  // Add other update functions as needed, e.g., for questions
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Optionally, try to load user from localStorage to persist session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        return JSON.parse(storedUser) as User;
      } catch (e) {
        localStorage.removeItem('currentUser'); // Clear corrupted data
        return null;
      }
    }
    return null;
  });

  const handleSetCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  const updateUserLevel = (level: UserLevel) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, level };
      handleSetCurrentUser(updatedUser);
    }
  };

  const updateUserPersonality = (personality: Personality) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, personality, level: UserLevel.PERSONALITY };
      handleSetCurrentUser(updatedUser);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser: handleSetCurrentUser, updateUserLevel, updateUserPersonality }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
