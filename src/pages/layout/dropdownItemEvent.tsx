import React, {MouseEventHandler, ReactNode} from 'react';

export default function DropdownItemEvent({children, onclick, disabled}: {children: ReactNode,
  onclick?: MouseEventHandler<HTMLButtonElement>, disabled?: boolean}) {
  return (
      <li>
        <button onClick={onclick}>
          {children}
        </button>
      </li>
  )
}
