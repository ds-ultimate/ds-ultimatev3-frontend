import React from 'react';

type aVType = number | "center" | "top" | "bottom"
type aHType = number | "center" | "left" | "right"

enum EventType {
  MENU_OPEN_HOVER,
  MENU_OPEN_SUB_ELEMENT,
  MENU_OPEN_CLICK,
  MENU_CLOSE_HOVER,
  MENU_CLOSE_CLICK,
  MENU_CLOSE_CLICK_OUTSIDE,
  MENU_CLOSE_CHILD_CHOICE,
}

//TODO rewrite this based on final layout
export default function Dropdown({children, root, ...props}: {key?: string, children: Array<JSX.Element> | JSX.Element,
    root: JSX.Element, anchorVert?: aVType, anchorHoriz?: aHType, transformVert?: aVType, transformHoriz?: aHType,
    hover?: boolean}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [isOpen, setOpen] = React.useState<boolean>(false)
  const [isForceOpen, setForceOpen] = React.useState<boolean>(false)

  const handleEvent = (eventType: EventType, event: React.MouseEvent<HTMLElement>) => {
    if(eventType === EventType.MENU_OPEN_SUB_ELEMENT) {
      setOpen(true)
    } else if(eventType === EventType.MENU_OPEN_CLICK) {
      if (!isForceOpen) {
        setAnchorEl(event.currentTarget)
        setForceOpen(true)
      } else {
        handleEvent(EventType.MENU_CLOSE_CLICK, event)
      }
    } else if(eventType === EventType.MENU_OPEN_HOVER) {
      setAnchorEl(event.currentTarget)
      setOpen(true)
    } else if(eventType === EventType.MENU_CLOSE_CLICK) {
      setOpen(false)
      setForceOpen(false)
    } else if(eventType === EventType.MENU_CLOSE_CLICK_OUTSIDE) {
      setOpen(false)
      setForceOpen(false)
    } else if(eventType === EventType.MENU_CLOSE_HOVER) {
      setOpen(false)
    } else if(eventType === EventType.MENU_CLOSE_CHILD_CHOICE) {
      setOpen(false)
      setForceOpen(false)
    }
  }

  if(!Array.isArray(children)) {
    children = [children]
  }
  children = children.map(c => {
    return React.cloneElement(c, {
      onClick: handleEvent.bind(null, EventType.MENU_CLOSE_CHILD_CHOICE),
    })
  })

  let menuListener = {}
  let rootProps:any = {
    onClick: handleEvent.bind(null, EventType.MENU_OPEN_CLICK),
  }

  if(props.hover ?? false) {
    rootProps = {
      ...rootProps,
      onMouseEnter: handleEvent.bind(null, EventType.MENU_OPEN_HOVER),
      onMouseLeave: handleEvent.bind(null, EventType.MENU_CLOSE_HOVER),
    }
    menuListener = {
      onMouseEnter: handleEvent.bind(null, EventType.MENU_OPEN_SUB_ELEMENT),
      onMouseLeave: handleEvent.bind(null, EventType.MENU_CLOSE_HOVER),
    }
  }
  root = React.cloneElement(root, rootProps)

  return (
      <>
        {root}
        <ul
            className={(isOpen || isForceOpen)?"show":""}
            {...menuListener}
        >
          {children}
        </ul>
      </>
  )
}
