"use client";
import { createContext, useContext } from "react";


export interface UserData {
    user_id: string ;
    userName: string;
}

export const UserContext = createContext<UserData| null>(null);

export const useData = () => {
    const context = useContext(UserContext);
    if(!context) throw new Error("useData must be used within a useProvider");

    return context;
}