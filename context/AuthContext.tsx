import { Children, createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";

export interface User {
    id: string;
    name: string;
    email: string;
    followers: Number,
    following: Number,
    badge: string,
  }


interface AuthProps {
    authState?: { token : string | null; authenticated: boolean | null, loading: boolean }
    onRegister?: (email : string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogOut?: () => Promise<any>
    user: User ;
}

const TOKEN_KEY = "myToken"
export const API_URL = "http://localhost:3000/auth";

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children} : any) => {
    const [authState, setAuthState] = useState<{
        token: string | null,
        authenticated : boolean | null,
        loading: boolean
    }>({
        token: null,
        authenticated: null,
        loading: true
    });

    const [user, setUser] = useState<{
        id : String, 
        name: string,
        email: string;
        followers: Number,
        following: Number,
        badge: string,
    }>();

    useEffect(()=> {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log("Load Token Called ", token)    
            if(token)
            {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setAuthState({
                    token: token, 
                    authenticated: true,
                    loading: false
                })
                console.log("Auth State changed : loadToken")

                if(token)
                {
                    console.log("Trying to get user")
                    getUser(token)
                }
            }
        }

        loadToken();

    }, [])

    const getUser = async (token: string) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        try {
            const result = await axios.get(`http://localhost:3000/api/users/me`)
            console.log("User recv")
            console.log(result.data)
            
             
            
            setUser({
                id : result.data.id, 
                name: result.data.name,
                email: result.data.email,
                followers: 1,
                following: 1,
                badge: "string",
            })
        }
        catch(e){
            console.log((e as any).response.status)
            if((e as any).response.status === '404')
                router.navigate('/signin')


        //    logOut()

            return { error : true, msg : e};
        }
    }

    const register = async (email: string, password: string) => {
        console.log("reg")
        try{
            return await axios.post(`${API_URL}/signup`, {email, password});
        }
        catch(e){
            return { error : true, msg : e};
        }
    }

    const login = async (email: string, password: string) => {
        
        try{
            const result = await axios.post(`${API_URL}/signin`, { email, password});
            
            setAuthState({
                token: result.data.token,
                authenticated: true,
                loading: false
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`
            try{
                await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

            }
            catch(e)
            {
                console.log(e)
            }
            console.log("login called 1")
            
            console.log("item set")
            return result;
        }
        catch(e)
        {
            return { error: true, msg: (e as any). response.data.msg};
        }
    }

    const logOut = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        axios.defaults.headers.common['Authorization'] = '';
        setAuthState({
            token : null,
            authenticated: null,
            loading :false
        })
    }
    
    const value = {
        user : user,
        onRegister : register,
        onLogin: login,
        onLogOut: logOut,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}