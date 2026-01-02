import React from 'react'

const Loader = ({progress}) => {
    return (
        <>
            <div className="loaderScreen overflow-hidden bg-[#ebebeb] text-black w-full h-screen flex items-center justify-center">
                <div className="percentage font-bold text-[13px]">{progress}</div>
            </div>
        </>
    )
}

export default Loader
