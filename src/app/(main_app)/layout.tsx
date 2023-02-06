import {useRouter} from "next/router";
import React from "react";

export default function MainLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const {server, world} = router.query
  return (
      <section>
        <nav>NAV {server} {world} NAV</nav>

        {children}
      </section>
  )
}