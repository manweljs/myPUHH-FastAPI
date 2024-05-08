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

// const Menu = (props: {
//     minimize: boolean;
// }) => {
//     const { navigate, page } = useUserContext()
//     const { minimize } = props

//     return (
//         <div className={style.menu_container}>
//             <div className={page === "Home" ? `${style.menu} ${style.active}` : `${style.menu}`}
//                 title='Home'
//                 onClick={() => navigate("/")}
//             >
//                 <i className="las la-home mr-2"></i>
//                 {minimize ? "" : "Home"}
//             </div>
//             <div className={page === "LHC" ? `${style.menu} ${style.active}` : `${style.menu}`}
//                 title='Laporan Hasil Cruising (LHC)'
//                 onClick={() => navigate("/lhc")}
//             >
//                 <i className="las la-tree mr-2"></i>
//                 {minimize ? "" : "LHC"}
//             </div>

//             <div className={page === "Rencana Tebang" ? `${style.menu} ${style.active}` : `${style.menu}}`}
//                 title='Rencana Tebang'
//                 onClick={() => navigate("/rencana-tebang")}
//             >
//                 <i className="las la-clipboard-list"></i>
//                 {minimize ? "" : "Rencana Tebang"}
//             </div>

//             <div className={page === "Buku Ukur" ? `${style.menu} ${style.active}` : `${style.menu}}`}
//                 title='Buku Ukur'
//                 onClick={() => navigate("/buku-ukur")}
//             >
//                 <i className="las la-ruler"></i>
//                 {minimize ? "" : "Buku Ukur"}
//             </div>

//             <div className={page === "LHP" ? `${style.menu} ${style.active}` : `${style.menu}`}
//                 title='Laporan Hasil Produksi (LHP)'
//                 onClick={() => navigate("/lhp")}
//             >
//                 <span className='mr-2'>{kayulog}</span>
//                 {minimize ? "" : "LHP"}
//             </div>

//             <div className={page === "Stok" ? `${style.menu} ${style.active}` : `${style.menu}`}
//                 title='Stok'
//                 onClick={() => navigate("/stok")}
//             >
//                 <i className="las la-warehouse"></i>
//                 {minimize ? "" : "Stok"}
//             </div>


//             <div className={page === "Pengangkutan" ? `${style.menu} ${style.active}` : `${style.menu}}`}
//                 title='Pengangkutan'
//                 onClick={() => navigate("/pengangkutan")}
//             >
//                 <i className="las la-bus mr-2"></i>
//                 {minimize ? "" : "Pengangkutan"}

//             </div>
//             <div className={page === "Laporan" ? `${style.menu} ${style.active}` : `${style.menu}}`}
//                 title='Laporan'
//                 onClick={() => navigate("/laporan")}
//             >
//                 <i className="las la-paste mr-2"></i>
//                 {minimize ? "" : "Laporan"}
//             </div>

//             <div className={page === PAGE.PARAMETER.TITLE ? `${style.menu} ${style.active}` : `${style.menu}}`}
//                 title={PAGE.PARAMETER.TITLE}
//                 onClick={() => navigate(PAGE.PARAMETER.URL)}
//             >
//                 <i className="las la-tools mr-2"></i>
//                 {minimize ? "" : PAGE.PARAMETER.TITLE}
//             </div>

//             <div className={page === "Logout" ? `${style.menu} ${style.active}` : `${style.menu}}`}
//                 title='Logout'
//                 onClick={() => navigate("/logout")}
//             >
//                 <i className="las la-sign-out-alt mr-2"></i>
//                 {minimize ? "" : "Logout"}
//             </div>
//             <div className="active-nav-bg" />

//         </div>
//     )
// }

const Menu = (props: { minimize: boolean }) => {
    const { navigate, page } = useUserContext();
    const { minimize } = props;

    const menuItems = [
        { title: "Home", icon: "la-home", path: "/" },
        { title: "LHC", icon: "la-tree", path: "/lhc", tooltip: "Laporan Hasil Cruising (LHC)" },
        { title: "Rencana Tebang", icon: "la-clipboard-list", path: "/rencana-tebang" },
        { title: "Buku Ukur", icon: "la-ruler", path: "/buku-ukur" },
        { title: "LHP", icon: kayulog, path: "/lhp" },
        { title: "Stok", icon: "la-warehouse", path: "/stok" },
        { title: "Pengangkutan", icon: "la-bus", path: "/pengangkutan" },
        { title: "Laporan", icon: "la-paste", path: "/laporan" },
        { title: PAGE.PARAMETER.TITLE, icon: "la-tools", path: PAGE.PARAMETER.URL },
        { title: "Logout", icon: "la-sign-out-alt", path: "/logout" }
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
                    {minimize ? "" : item.title}
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
