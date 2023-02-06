import {ReactNode} from 'react';
import Link from "next/link";

export default function DropdownItem({children, to, disabled}: {children: ReactNode, to: string, disabled?: boolean}) {
  return (
      <li>
        <Link href={disabled?"#":to} className={disabled?"disabled":""}>
          {children}
        </Link>
      </li>
  )
}
