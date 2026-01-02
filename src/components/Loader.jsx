import React from 'react'

const Loader = ({ progress }) => {
    return (
        <>
            <div className="loaderScreen fixed top-0 left-0 overflow-hidden bg-[#ebebeb] text-black w-full h-screen flex items-center justify-center" style={{ zIndex: 9999 }}>
                <div className="percentage font-bold text-[13px]">{Math.round(progress)}%</div>
            </div>
        </>
    )
}

export default Loader
