import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
type Props = {
  children: React.ReactNode;
};
type ContextProps = {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  logout: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
const StateContext = createContext<ContextProps>({
  user: null,
  setUser: () => {},
  logout: () => {},
  loading: false,
  setLoading: () => {},
});

const AuthContext = ({ children }: Props) => {
  const [user, setUser] = useState<any | any>(null);
  const [loading, setLoading] = useState(false);
  const getUser = async () => {
    setLoading(true);
    const users = await AsyncStorage.getItem('user');
    setUser(JSON.parse(users!));
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  const logout = async () => {
    setLoading(true);
    await AsyncStorage.removeItem('user');
    setUser(null);
    setLoading(false);
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <StateContext.Provider value={{ user, setUser, logout, setLoading, loading }}>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size={50} />
        </View>
      ) : (
        <>{children}</>
      )}
    </StateContext.Provider>
  );
};

export default AuthContext;
export const useAuthContext = () => useContext(StateContext);
