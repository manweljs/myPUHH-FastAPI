import { useUser } from 'UserContext'
import { FloatButton } from 'antd'
import React from 'react'
import cookie from "react-cookies"
export default function ThemeSwitcher() {
    const { theme, setTheme } = useUser()
    const handleClick = async () => {
        const themeChanged = theme === "dark" ? "light" : "dark"
        setTheme(themeChanged)
        cookie.save("theme", themeChanged)
    }
    return (
        <FloatButton onClick={handleClick}
            style={{ fontSize: "1.2em" }}
            icon={theme === "dark" ? <i className="las la-sun"></i> : <i className="lar la-moon"></i>} />

    )
}
