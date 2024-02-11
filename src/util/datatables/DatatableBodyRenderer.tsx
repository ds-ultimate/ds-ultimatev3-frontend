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

import React, {useState} from "react";
import {internalCellProps} from "./DatatableBase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleMinus, faCirclePlus} from "@fortawesome/free-solid-svg-icons";


interface bodyProps<T> extends internalCellProps<T> {
  data: T[] | undefined,
}

interface rowProps<T> extends Omit<internalCellProps<T>, "keyGen"> {
  d: T,
}

export default  function DatatableBodyRender<T>({data, keyGen, ...cellProps}: bodyProps<T>) {
  return (
      <>
        {data?.map(d => {
          return <DatatableRowRender key={keyGen(d)} d={d} {...cellProps}/>
        })}
      </>
  )
}

function DatatableRowRender<T>({d, cellClasses, rowClassGen, rowOnClick, visibleCells, invisibleCells, cells, headerNames}: rowProps<T>) {
  const [extended, setExtended] = useState(false)
  const extendEnabled = invisibleCells.length > 0
  const realExtended = extended && extendEnabled

  return (
      <>
        <tr className={rowClassGen?rowClassGen(d):undefined} onClick={rowOnClick?(evt => rowOnClick(d, evt)):undefined}>
          {visibleCells.map((cIdx, vIdx) => {
            if(vIdx === 0 && extendEnabled) {
              return (
                  <td key={cIdx}>
                  <span className={"pe-2 " + (extended?"text-danger":"text-info")} onClick={() => setExtended((old) => !old)}>
                    <FontAwesomeIcon icon={extended?faCirclePlus:faCircleMinus}/>
                  </span>
                    {cells[cIdx](d)}
                  </td>
              )
            }
            return <td key={cIdx} className={cellClasses?cellClasses[cIdx]:undefined}>{cells[cIdx](d)}</td>
          })}
        </tr>
        {realExtended && (
            <>
              <tr className={"d-none"}>{/* fake tr for striped cells */}</tr>
              <tr>
                <td colSpan={cells.length}>
                  {invisibleCells.map(cIdx => {
                    return (
                        <React.Fragment key={cIdx}>
                          {headerNames[cIdx]}: {cells[cIdx](d)}
                          <br />
                        </React.Fragment>
                    )
                  })}
                </td>
              </tr>
            </>
        )}
      </>
  )
}
