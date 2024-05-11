import React from 'react'

interface Props {
    children: React.ReactNode;
    width?: string | number;
    close?: () => void;
}
export default function FormModal(props: Props) {
    const { width, close } = props
    return (
        <div className="modal form-modal">
            <div className="modal-box" style={{ width: width }}>
                {props.children}
            </div>
            <div className="overlay"
                onClick={close}
            ></div>
        </div>
    )
}



const Header = (props: { children: React.ReactNode }) => {
    return (
        <div className="modal-header">
            {props.children}
        </div>
    )
}

const Body = (props: { children: React.ReactNode }) => {

    return (
        <div className="modal-body" {...props}>
            {props.children}
        </div>
    )
}

const Footer = (props: Props) => {
    return (
        <div className="modal-footer">

        </div>
    )
}

FormModal.Header = Header;
FormModal.Body = Body;
FormModal.Footer = Footer;