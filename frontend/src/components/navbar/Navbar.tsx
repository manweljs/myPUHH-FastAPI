import React, { useEffect, useState, memo } from 'react'
import { FloatButton, Spin } from 'antd'
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import { useUserContext } from '@/hooks/UserContext'
import Image from 'next/image'
import style from "./navbar.module.sass"
import { PAGE } from '@/consts'
import { motion } from 'framer-motion'
import FIcon from '@/components/global/FIcon'

function Navbar() {
    const { perusahaan, setPerusahaan, page, user, setUser, minimizeSidebar, setMinimizeSidebar } = useUserContext()

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (minimizeSidebar) {
            document.body.classList.add("min")
        } else {
            document.body.classList.remove("min")
        }
    }, [minimizeSidebar])

    useEffect(() => {
        if (perusahaan) {
            setLoading(false)
        }
    }, [perusahaan]);


    return (
        <div className={minimizeSidebar ? `${style.navbar} ${style.navbar_min}` : style.navbar}>
            <div className={style.info_perusahaan}>
                {perusahaan ?
                    <>
                        < div className={style.logo_perusahaan}>
                            <Image
                                alt=""
                                src={perusahaan.logo ? perusahaan.logo : "/images/office.png"}
                                width={40}
                                height={40}
                                loading="lazy"
                            />
                        </div>
                        {!minimizeSidebar && <p>{perusahaan.nama}</p>}
                    </> :
                    <Spin />
                }
            </div>

            <div className={style.separator}></div>
            <Menu minimize={minimizeSidebar} />


            {!loading &&
                <FloatButton
                    onClick={() => setMinimizeSidebar(prev => !prev)}
                    type="default"
                    style={{ left: minimizeSidebar ? 40 : 160 }}
                    className={style.minimize_button}
                    icon={minimizeSidebar ? <RightOutlined /> : <LeftOutlined />}
                />
            }

        </div >
    )
}

export default memo(Navbar)

const menuItems = [
    { title: PAGE.DASHBOARD.TITLE, icon: "fi-rr-house-chimney", path: PAGE.DASHBOARD.URL },
    { title: PAGE.LHC.TITLE, icon: "fi-rr-trees-alt", path: PAGE.LHC.URL, tooltip: "Laporan Hasil Cruising (LHC)" },
    { title: PAGE.RENCANA_TEBANG.TITLE, icon: "fi-rr-inventory-alt", path: PAGE.RENCANA_TEBANG.URL },
    { title: PAGE.BUKU_UKUR.TITLE, icon: "fi-rr-ruler-combined", path: PAGE.BUKU_UKUR.URL },
    { title: PAGE.LHP.TITLE, icon: "fi-rr-supplier-alt", path: PAGE.LHP.URL },
    { title: PAGE.STOK.TITLE, icon: "fi-rr-warehouse-alt", path: PAGE.STOK.URL },
    { title: PAGE.PENGANGKUTAN.TITLE, icon: "fi-rr-truck-container", path: PAGE.PENGANGKUTAN.URL },
    { title: PAGE.LAPORAN.TITLE, icon: "fi-rr-curve-arrow", path: PAGE.LAPORAN.URL },
    { title: PAGE.PARAMETER.TITLE, icon: "fi-rr-tools", path: PAGE.PARAMETER.URL },
    { title: PAGE.LOGOUT.TITLE, icon: "fi-rr-sign-out-alt", path: PAGE.LOGOUT.URL }
];

const Menu = (props: { minimize: boolean }) => {
    const { navigate, page } = useUserContext();
    const { minimize } = props;

    const [yOffset, setYOffset] = useState(0);

    useEffect(() => {
        // Calculate the active index
        const activeIndex = menuItems.findIndex(item => item.title === page);
        const offset = activeIndex * 45; // Assuming each menu item has a height of 45px
        setYOffset(offset);
    }, [page]);

    // console.log('yOffset', yOffset)


    return (
        <div className={style.menu_container}>
            {menuItems.map((item, index) => (
                <div
                    key={index}
                    className={page === item.title ? `${style.menu} ${style.active} menu active` : `${style.menu} menu`}
                    title={item.tooltip || item.title}
                    onClick={() => navigate(item.path)}
                >
                    <FIcon name={item.icon} size={16} />
                    {minimize ? "" : item.title}
                </div>
            ))}
            <motion.div
                className={style.active_nav_bg}
                initial={{ y: yOffset }}
                animate={{ y: yOffset }}
                transition={{ type: "tween", duration: 0.05, ease: "easeInOut" }}
            />
        </div>
    );
}
