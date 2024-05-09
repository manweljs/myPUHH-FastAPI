import React, { useEffect, useState, memo } from 'react'
import { FloatButton } from 'antd'
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import { kayulog } from '../misc/Icons'
import { useUserContext } from '@/hooks/UserContext'
import Image from 'next/image'
import style from "./navbar.module.sass"
import { PAGE } from '@/consts'
import { motion } from 'framer-motion'

function Navbar() {
    const { perusahaan, setPerusahaan, page, user, setUser, minimizeSidebar, setMinimizeSidebar } = useUserContext()


    useEffect(() => {
        if (minimizeSidebar) {
            document.body.classList.add("min")
        } else {
            document.body.classList.remove("min")
        }
    }, [minimizeSidebar])

    console.log('user di navbar', user)


    return (
        <div className={style.navbar}>
            {perusahaan &&
                <div className={style.info_perusahaan}>
                    < div className={style.logo_perusahaan}>
                        <Image src={perusahaan.logo ? perusahaan.logo : "/images/office.png"}
                            width={minimizeSidebar ? 40 : 50}
                            height={minimizeSidebar ? 40 : 50}
                            alt="" loading="lazy"
                        />
                    </div>
                    {!minimizeSidebar && <p>{perusahaan.nama}</p>}
                </div>
            }

            <div className="separator"></div>
            <Menu minimize={minimizeSidebar} />

            <FloatButton
                onClick={() => setMinimizeSidebar(prev => !prev)}
                type="default"
                style={{ left: minimizeSidebar ? 40 : 160 }}
                className={style.minimize_button}
                icon={minimizeSidebar ? <RightOutlined /> : <LeftOutlined />} />
        </div >
    )
}

export default memo(Navbar)

const Menu = (props: { minimize: boolean }) => {
    const { navigate, page } = useUserContext();
    const { minimize } = props;

    const menuItems = [
        { title: "Home", icon: "fi fi-tr-house-chimney", path: "/", alias: "Dashboard" },
        { title: "LHC", icon: "fi fi-tr-trees-alt", path: "/lhc", tooltip: "Laporan Hasil Cruising (LHC)" },
        { title: "Rencana Tebang", icon: "fi fi-tr-inventory-alt", path: "/rencana-tebang" },
        { title: "Buku Ukur", icon: "fi fi-tr-ruler-combined", path: "/buku-ukur" },
        { title: "LHP", icon: kayulog, path: "/lhp" },
        { title: "Stok", icon: "fi fi-tr-warehouse-alt", path: "/stok" },
        { title: "Pengangkutan", icon: "fi fi-tr-truck-container", path: "/pengangkutan" },
        { title: "Laporan", icon: "fi fi-tr-curve-arrow", path: "/laporan" },
        { title: PAGE.PARAMETER.TITLE, icon: "fi fi-tr-tools", path: PAGE.PARAMETER.URL },
        { title: "Logout", icon: "fi fi-tr-sign-out-alt", path: "/logout" }
    ];


    // Calculate the active index
    const activeIndex = menuItems.findIndex(item => item.title === page);

    // Calculate the y offset for active_nav_bg based on activeIndex
    const yOffset = activeIndex * 45; // Assuming each menu item has a height of 45px

    return (
        <div className={style.menu_container}>
            {menuItems.map((item) => (
                <div
                    key={item.title}
                    className={page === item.title ? `${style.menu} ${style.active} menu active` : `${style.menu} menu`}
                    title={item.tooltip || item.title}
                    onClick={() => navigate(item.path)}
                >
                    {item.icon === kayulog ? (
                        <span className='mr-2'>{item.icon}</span>
                    ) : (
                        <i className={`las ${item.icon} mr-2`}></i>

                    )}
                    {minimize ? "" : (item.alias || item.title)}
                </div>
            ))}
            <motion.div
                className={style.active_nav_bg}
                initial={{ y: 0 }}
                animate={{ y: yOffset }}
                transition={{ type: "tween", duration: 0.15, ease: "easeInOut" }}
            />
        </div>
    );
}
