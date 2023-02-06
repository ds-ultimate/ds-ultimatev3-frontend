import React, {ReactNode} from 'react';

import {Link} from "react-router-dom";

export default function DropdownItem({children, to, disabled}: {children: ReactNode, to: string, disabled?: boolean}) {
  return (
      <li>
        <Link to={disabled?"#":to} className={disabled?"disabled":""}>
          {children}
        </Link>
      </li>
  )
}
