import { useUserContext } from '@/hooks/UserContext'
import { FloatButton } from 'antd'
import React from 'react'
import cookies from "react-cookies"
export default function ThemeSwitcher() {
    const { theme, setTheme } = useUserContext()

    const handleClick = async () => {
        const themeChanged = theme === "dark" ? "light" : "dark"
        setTheme(themeChanged)
        cookies.save("theme", themeChanged, { path: "/" })
    }
    return (
        <FloatButton onClick={handleClick}
            style={{ fontSize: "1.2em" }}
            icon={theme === "dark" ? <i className="las la-sun"></i> : <i className="lar la-moon"></i>}
        />

    )
}
