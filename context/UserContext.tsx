import axios from "axios";
import React, { createContext, useState, useContext } from "react";

export interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  aboutMe: string;
  birthdate: string;
  interests: string;
  gender: string;
  jobTitle: string;
  company: string;
  school: string;
  profilePicture: string
}

const API_URL = "http://localhost:3000/api/users/me";
const UPDATE_API_URL = "http://localhost:3000/api/users/update";

interface UserContextType {
  user: User;
  loading: boolean;
  error: string | null;
  refreshUserData: () => void;
  updateUserData: (field : string, value: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>({
    id: "",
    email: "",
    fullName: "",
    username: "",
    aboutMe: "",
    birthdate: "",
    interests: "",
    gender: "",
    jobTitle: "",
    company: "",
    school: "",
    profilePicture: "",
  
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (): Promise<void> => {
    console.log("fetch called");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      console.log("Fetch response");
      console.log(response.data);
      if (response) {
        setUser(response.data);
      } else {
        setError(response.data || "Error fetching user data");
      }
    } catch (err) {
      setError("An error occurred while fetching user data");
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (field : string, value : string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      let body = {};
      body[field] = value;
      console.log(body)
      const response = await axios.put(UPDATE_API_URL, body);
      console.log('update', response.data);

      if (response.data) {
        setUser(response.data.user); 
      } else {
        setError(response.data.message || "Error updating user data");
      }
    } catch (err) {
      console.log(err)
      setError("An error occurred while updating user data");
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = (): void => {
    fetchUserData();
  };

  return (
    <UserContext.Provider
      value={{ user, loading, error, refreshUserData, updateUserData }}
    >
      {children}
    </UserContext.Provider>
  );
};
