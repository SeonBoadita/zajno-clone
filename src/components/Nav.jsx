import React from 'react'
import { NavLink } from 'react-router-dom'

const Nav = () => {
    return (
        <>
            <nav style={{padding: "15px 15px"}} className='nav bg-transparent tracking-tighter top-0 left-0 relative w-screen h-[10vh] text-[12px] font-bold flex items-start justify-between px-8 z-100'>
                <div className="inner-section-heading">
                    <NavLink to='/' className='text-black hover:text-white transition-colors'>zajno®
                    </NavLink>
                </div>
                <div className="digital-studio">
                    <NavLink to='/about' className='text-black hover:text-white transition-colors'>digital studio
                    </NavLink>
                </div>

                <div className="work-studio-contact flex items-start justify-center flex-col whitespace-nowrap">
                    <NavLink to='/about' className='text-black hover:text-white transition-colors'>work
                    </NavLink>
                    <NavLink to='/about' className='text-black hover:text-white transition-colors'>studio
                    </NavLink>
                    <NavLink to='/about' className='text-black hover:text-white transition-colors'>contact
                    </NavLink>
                </div>
                <div className="social-media flex items-start justify-center flex-col whitespace-nowrap">
                    <NavLink to='/about' className='text-black hover:text-white transition-colors'>twitter
                    </NavLink>
                    <NavLink to='/about' className='text-black hover:text-white transition-colors'>instagram
                    </NavLink>
                </div>
                <div className="location">
                    <NavLink to='/about' className='text-black hover:text-white transition-colors'>los angeles, ca
                    </NavLink>
                </div>

            </nav>
        </>
    )
}

export default Nav
