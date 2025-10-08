import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [session , setSession] = useState(undefined);

    const signUpNewUser = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: "https://notes-app-delta-azure-21.vercel.app/confirm" 
            }
       });
       if(error) {
        console.error("There was an error signing up the user:", error.message);
        return {success : false, error: error.message};
       }
         return {success : true, data};
    };

    const signInUser = async (email, password) => {
        try{
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
             });
             if(error){
                console.error("There was an error signing in the user:", error);
                return {success : false, error: error.message};
             }   

             const { data: sessionData } = await supabase.auth.getSession();
                setSession(sessionData?.session);

                console.log("Sign-in success:", data);
                return { success: true, data };
            } catch (err) {
                console.error("Unexpected error signing in the user:", err);
                return { success: false, error: err.message };
            }
        //     console.log("sign-in success:", data);
        //     return {success : true, data};
        // } catch(error) {
        //     console.error("There was an error signing in the user:", error);
        // }
    }
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }  , []);

    const signOut = () => {
        const { error } = supabase.auth.signOut();
        if(error) {
            console.error("Error signing out:", error);
        }
    }

    return(
        <AuthContext.Provider value={{session , signUpNewUser , signOut , signInUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext);
}