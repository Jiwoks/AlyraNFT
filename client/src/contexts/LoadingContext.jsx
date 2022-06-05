import React, { createContext, useContext, useState } from "react";

const LoadingContext = createContext({
    loading: true,
    setLoading: ()=>{},
});

export function LoadingProvider({ children }) {
    const [loading, setLoading] = useState(true);

    return (
        <LoadingContext.Provider value={{loading, setLoading}}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within LoadingProvider");
    }
    return context;
}
