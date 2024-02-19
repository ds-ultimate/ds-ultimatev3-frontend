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

import {Accordion} from "react-bootstrap"
import {ReactNode, useCallback, useEffect, useState} from "react"
import {AccordionEventKey} from "react-bootstrap/AccordionContext"
import {delay} from "./UtilFunctions"

type itemType = {
  key: string,
  title: ReactNode,
  element: ReactNode,
}

export default function ReactBootstrapAccordion({defaultKey, items}: {defaultKey?: string, items: itemType[]}) {
  const [currentKey, setCurrentKey] = useState<AccordionEventKey>(defaultKey)
  const [lastKey, setLastKey] = useState<AccordionEventKey>(undefined)
  /**
   * Just to document this somewhere:
   * the currentKey can be:
   * - if the accordion is in single mode
   *   - null if nothing is open
   *   - string if something is open
   * - if the accordion is in multi mode (alwaysOpen={True}
   *   - empty array if nothing is open
   *   - array of strings if something is open
   *
   * Thus, the comparison of currentKey === key is correct as long as we are in single mode
   */

  const selectAccordion = useCallback((k: AccordionEventKey) => {
    setCurrentKey(old => {
      setLastKey(old)
      delay(500).then(() => setLastKey(undefined))
      return k
    })
  }, [setCurrentKey])

  return (
      <Accordion activeKey={currentKey} className={"mb-3"} onSelect={selectAccordion}>
        {items.map(({title, key, element}) => (
            <Accordion.Item key={key} eventKey={key}>
              <Accordion.Header>{title}</Accordion.Header>
              <Accordion.Body>
                {(currentKey === key || lastKey === key) && element}
              </Accordion.Body>
            </Accordion.Item>
        ))}
      </Accordion>
  )
}
