"use client";

import React, {useState} from 'react'
import Link from 'next/link'
// import Image from 'next/Image';

const links = [
    { id: 1, title: "Home", url: "/" },
    { id: 2, title: "Menu", url: "/" },
    { id: 3, title: "Contact", url: "/" },
];

const Menu = () => {
    const [open,setOpen] = useState(false)
    // const user = false
    return (
      <>
      {open && (
        <div className="bg-red-500 text-white absolute left-0 top-24 w-full h-[calc(100vh-6rem)] flex flex-col gap-8 items-center justify-center text-3xl z-10">
          {links.map((item) => (
            <Link href={item.url} key={item.id} onClick={() => setOpen(false)}>
              {item.title}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)}>
            Login
          </Link>
        </div>
      )}
      </>
    );
}
export default Menu