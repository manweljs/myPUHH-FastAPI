import React, { useEffect, useState, memo } from 'react'
import { FloatButton } from 'antd'
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import { kayulog } from '../misc/Icons'
import { useUserContext } from '@/hooks/UserContext'
import Image from 'next/image'
import "./navbar.css"
import { PAGE } from '@/consts'

function Navbar() {
    const { perusahaan, setPerusahaan, page, user, setUser } = useUserContext()

    const [minimize, setMinimize] = useState(false)

    useEffect(() => {
        if (minimize) {
            document.body.classList.add("min")
        } else {
            document.body.classList.remove("min")
        }
    }, [minimize])

    console.log('user di navbar', user)


    return (
        <div className="navbar">
            {perusahaan &&
                <div className="info-perusahaan">
                    < div className="logo-perusahaan">
                        <Image src={perusahaan.logo ? perusahaan.logo : "/images/office.png"}
                            width={minimize ? 40 : 50}
                            height={minimize ? 40 : 50}
                            alt="" loading="lazy"
                        />
                    </div>
                    {!minimize && <p>{perusahaan.nama}</p>}
                </div>
            }

            <div className="separator"></div>
            <Menu minimize={minimize} />

            <FloatButton
                onClick={() => setMinimize(prev => !prev)}
                type="default"
                style={{ left: minimize ? 40 : 160 }}
                className='minimize-button'
                icon={minimize ? <RightOutlined /> : <LeftOutlined />} />
        </div >
    )
}

export default memo(Navbar)

const Menu = (props: {
    minimize: boolean;
}) => {
    const { navigate, page } = useUserContext()
    const { minimize } = props

    console.log('page di navbar', page)
    return (
        <div className="menu-container">
            <div className={page === "Home" ? "menu active" : "menu"}
                title='Home'
                onClick={() => navigate("/")}
            >
                <i className="las la-home mr-2"></i>
                {minimize ? "" : "Home"}
            </div>
            <div className={page === "LHC" ? "menu active" : "menu"}
                title='Laporan Hasil Cruising (LHC)'
                onClick={() => navigate("/lhc")}
            >
                <i className="las la-tree mr-2"></i>
                {minimize ? "" : "LHC"}
            </div>

            <div className={page === "Rencana Tebang" ? "menu active" : "menu"}
                title='Rencana Tebang'
                onClick={() => navigate("/rencana-tebang")}
            >
                <i className="las la-clipboard-list"></i>
                {minimize ? "" : "Rencana Tebang"}
            </div>

            <div className={page === "Buku Ukur" ? "menu active" : "menu"}
                title='Buku Ukur'
                onClick={() => navigate("/buku-ukur")}
            >
                <i className="las la-ruler"></i>
                {minimize ? "" : "Buku Ukur"}
            </div>

            <div className={page === "LHP" ? "menu active" : "menu"}
                title='Laporan Hasil Produksi (LHP)'
                onClick={() => navigate("/lhp")}
            >
                <span className='mr-2'>{kayulog}</span>
                {minimize ? "" : "LHP"}
            </div>

            <div className={page === "Stok" ? "menu active" : "menu"}
                title='Stok'
                onClick={() => navigate("/stok")}
            >
                <i className="las la-warehouse"></i>
                {minimize ? "" : "Stok"}
            </div>


            <div className={page === "Pengangkutan" ? "menu active" : "menu"}
                title='Pengangkutan'
                onClick={() => navigate("/pengangkutan")}
            >
                <i className="las la-bus mr-2"></i>
                {minimize ? "" : "Pengangkutan"}

            </div>
            <div className={page === "Laporan" ? "menu active" : "menu"}
                title='Laporan'
                onClick={() => navigate("/laporan")}
            >
                <i className="las la-paste mr-2"></i>
                {minimize ? "" : "Laporan"}
            </div>

            <div className={page === PAGE.PARAMETER.TITLE ? "menu active" : "menu"}
                title={PAGE.PARAMETER.TITLE}
                onClick={() => navigate(PAGE.PARAMETER.URL)}
            >
                <i className="las la-tools mr-2"></i>
                {minimize ? "" : PAGE.PARAMETER.TITLE}
            </div>

            <div className={page === "Logout" ? "menu active" : "menu"}
                title='Logout'
                onClick={() => navigate("/logout")}
            >
                <i className="las la-sign-out-alt mr-2"></i>
                {minimize ? "" : "Logout"}
            </div>
            <div className="active-nav-bg" />

        </div>
    )
}
