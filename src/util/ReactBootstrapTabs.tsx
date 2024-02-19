/*
Copyright (c) 2023 extremecrazycoder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import {Nav, NavDropdown, Tab, Tabs} from "react-bootstrap"
import {ReactNode, useState} from "react"
import {useBreakpointDown} from "./bootrapBreakpoints"

type itemType = {
  key: string,
  title: string | null,
  element: ReactNode,
}

export default function ReactBootstrapTabs({defaultKey, items}: {defaultKey: string, items: itemType[]}) {
  const [currentKey, setCurrentKey] = useState<string>(defaultKey)
  const useDropdown = useBreakpointDown("lg")
  if(useDropdown) {
    const curItem = items.find(value => currentKey === value.key) ?? items[0]

    return (
        <>
          <Nav className={"nav-tabs mb-3"} onSelect={k => k!==null?setCurrentKey(k):undefined}>
            <NavDropdown title={curItem.title}>
              {items.map(({title, key, element}) => (
                  <NavDropdown.Item key={key} eventKey={key}>{title}</NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
          <Tab.Content>
            <Tab.Pane className={"active show"}>
              {curItem.element}
            </Tab.Pane>
          </Tab.Content>
        </>
    )
  } else {
    return (
        <Tabs activeKey={currentKey} className={"mb-3"} onSelect={k => k!==null?setCurrentKey(k):undefined}>
          {items.map(({title, key, element}) => (
              <Tab key={key} title={title} eventKey={key}>
                {currentKey === key && element}
              </Tab>
          ))}
        </Tabs>
    )
  }
}