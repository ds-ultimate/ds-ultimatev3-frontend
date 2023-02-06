'use client';
import {useState} from "react";
import NavbarClient from "@/app/(main_app)/navbar.client";

let setServerWorld: (value: {serverCode?: string, worldName?: string}) => void

export default function NavbarClientWrapper({children}: {children: JSX.Element}) {
  const [{serverCode, worldName}, internalSetServerWorld] = useState<{serverCode?: string, worldName?: string}>({})
  setServerWorld = internalSetServerWorld

  return (
      <NavbarClient serverCode={serverCode} worldName={worldName}>
        {children}
      </NavbarClient>
  )
}

export {setServerWorld}
