import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext()

export const ThemeContextProvider = ({children}) => {
    const [contextTheme, setContextTheme] = useState(() => 
        localStorage.getItem("light/dark")
        ? JSON.parse(localStorage.getItem("light/dark"))
        : "lightMode"
    )

    useEffect(() => {
        document.body.className = ""
        document.body.classList.add(contextTheme)
    }, [contextTheme])

    const values = {contextTheme, setContextTheme}

    return (
        <ThemeContext.Provider value={values}>
            {children}
        </ThemeContext.Provider>
    )
}