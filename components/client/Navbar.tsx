'use client'
import { faGear } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Image } from "next/dist/client/image-component";
import logo from "@/public/images/investigatorlogo.png"
import { signOut } from "next-auth/react";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // weird font awesome thing that prevents size issues

//add options modal
export default function NavBar() {
    return (
        <nav className="h-[10dvh] w-full flex p-4 items-center text-xl font-extrabold shadow-sm shadow-gray-300 bg-gray-100 fixed z-20">
            <div className="w-1/3 flex justify-start">
                <button >
                    <FontAwesomeIcon icon={faGear} width={30} height={30} color="gray" className="hover:text-gray-400" />
                </button>
            </div>
            <div className="w-1/3 flex justify-center">
                <Image src={logo} alt="logo" width={60} height={60} />
            </div>
            <div className="w-1/3 flex justify-end">
                <button className="text-blue-400 hover:text-blue-300" onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
            </div>
        </nav>
    )
}