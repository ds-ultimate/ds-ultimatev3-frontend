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

import React from "react";
import {generateCSVExport} from "./exporterCSV";


export type exportConverterType<T> = [string[], (data: T) => (string | number)[]]
export type ExportDataEvent = {
  exporterName: string,
  fileName: string,
}

export type exporterProps = {
  exportHandler: (event: ExportDataEvent) => void,
  leftAuto: boolean,
  fileName: string,
}

export type exporterType = (params: exporterProps) => React.ReactElement<any, any>

export function handleExportEvent(event: ExportDataEvent, header: string[], data: Array<(string | number)[]> | undefined) {
  if(data === undefined) {
    throw Error("Data for export is undefined!")
  }

  let result = ""
  if(event.exporterName === "csv") {
    result = generateCSVExport(event, header, data)
  } else {
    throw Error("Unknown exporter " + event.exporterName)
  }

  if(result.length <= 0) {
    return
  }

  let element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result))
  element.setAttribute('download', `${event.fileName}`)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
