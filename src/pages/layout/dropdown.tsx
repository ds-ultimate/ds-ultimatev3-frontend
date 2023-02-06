import React from 'react';

import Menu from '@mui/material/Menu';

type aVType = number | "center" | "top" | "bottom"
type aHType = number | "center" | "left" | "right"
type menuLocation = {anchorVert?: aVType, anchorHoriz?: aHType, transformVert?: aVType, transformHoriz?: aHType, hover?: boolean}

const leftMenu: menuLocation = {
  anchorVert: "top",
  anchorHoriz: "left",
  transformVert: "top",
  transformHoriz: "right",
  hover: true,
}

const rightMenu: menuLocation = {
  anchorVert: "top",
  anchorHoriz: "right",
  transformVert: "top",
  transformHoriz: "left",
  hover: true,
}

enum EventType {
  MENU_OPEN_HOVER,
  MENU_OPEN_SUB_ELEMENT,
  MENU_OPEN_CLICK,
  MENU_CLOSE_HOVER,
  MENU_CLOSE_CLICK,
  MENU_CLOSE_CLICK_OUTSIDE,
  MENU_CLOSE_CHILD_CHOICE,
  MENU_PARENT_OPEN_CLICK,
}
type eventCallback = (type: EventType, event: React.MouseEvent<HTMLElement>) => void

export default function Dropdown({children, root, ...props}: {key?: string, children: Array<JSX.Element> | JSX.Element,
    root: JSX.Element, anchorVert?: aVType, anchorHoriz?: aHType, transformVert?: aVType, transformHoriz?: aHType,
    hover?: boolean, parentCallback?: eventCallback, childCallback?: (cb: eventCallback) => void}) {
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
        if(props.parentCallback) {
          props.parentCallback(EventType.MENU_PARENT_OPEN_CLICK, event)
        }
      } else {
        handleEvent(EventType.MENU_CLOSE_CLICK, event)
      }
    } else if(eventType === EventType.MENU_PARENT_OPEN_CLICK) {
      setForceOpen(true)
    } else if(eventType === EventType.MENU_OPEN_HOVER) {
      setAnchorEl(event.currentTarget)
      setOpen(true)
    } else if(eventType === EventType.MENU_CLOSE_CLICK) {
      setOpen(false)
      setForceOpen(false)
      childrenClose.forEach(c => c(EventType.MENU_CLOSE_CLICK, event))
    } else if(eventType === EventType.MENU_CLOSE_CLICK_OUTSIDE) {
      setOpen(false)
      setForceOpen(false)
      if(props.parentCallback) {
        props.parentCallback(EventType.MENU_CLOSE_CLICK_OUTSIDE, event)
      }
    } else if(eventType === EventType.MENU_CLOSE_HOVER) {
      setOpen(false)
    } else if(eventType === EventType.MENU_CLOSE_CHILD_CHOICE) {
      setOpen(false)
      setForceOpen(false)
      if(props.parentCallback) {
        props.parentCallback(EventType.MENU_CLOSE_CHILD_CHOICE, event)
      }
    }
  }

  let childrenClose: Array<eventCallback> = []

  if(props.childCallback) {
    props.childCallback(handleEvent)
  }

  if(!Array.isArray(children)) {
    children = [children]
  }
  children = children.map(c => {
    if(c.type.name === "Dropdown") {
      return React.cloneElement(c, {
        parentCallback: handleEvent,
        childCallback: (cb: eventCallback) => {
          childrenClose.push(cb)
        },
      })
    } else {
      return React.cloneElement(c, {
        onClick: handleEvent.bind(null, EventType.MENU_CLOSE_CHILD_CHOICE),
      })
    }
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
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: props.anchorVert ?? 'bottom',
              horizontal: props.anchorHoriz ?? 'center',
            }}
            keepMounted
            transformOrigin={{
              vertical: props.transformVert ?? 'top',
              horizontal: props.transformHoriz ?? 'center',
            }}
            open={isOpen || isForceOpen}
            onClose={handleEvent.bind(null, EventType.MENU_CLOSE_CLICK_OUTSIDE)}
            className={(props.hover && !isForceOpen)?"hover":""}
            {...menuListener}
        >
          {children}
        </Menu>
      </>
  )
}

export {leftMenu, rightMenu}
