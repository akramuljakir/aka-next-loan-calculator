"use client";

import Link from "next/link";
import React from "react";


const links = [
  {
    id: 1,
    title: "Home",
    url: "/",
  },
  {
    id: 2,
    title: "Loans",
    url: "/loans",
  },
  {
    id: 3,
    title: "Combined",
    url: "/combined",
  },
];

const Navbar = () => {
  return (
    <div className='container'>
      <Link href="/" className='logo'>
        Akramul Jakir
      </Link>
      <div className='links'>
        {links.map((link) => (
          <Link key={link.id} href={link.url} className='link'>
            {link.title}
          </Link>
        ))}

      </div>
    </div>
  );
};

export default Navbar;
