import React from 'react'
import { NavLink } from 'react-router-dom'

const Nav = () => {
    return (
        <>
            <nav className='nav bg-orange-300 top-0 left-0 fixed w-screen h-[12vh] flex items-center justify-around gap-6 px-8 z-100'>
                <NavLink to='/' className={({ isActive }) => isActive ? 'text-white font-bold underline' : 'text-black hover:text-white transition-colors'}>zajno®
                </NavLink>
                <NavLink to='/about' className={({ isActive }) => isActive ? 'text-white font-bold underline' : 'text-black hover:text-white transition-colors'}>About
                </NavLink>
            </nav>
        </>
    )
}

export default Nav
