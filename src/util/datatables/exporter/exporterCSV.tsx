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

import {Button, Col, InputGroup} from "react-bootstrap";
import React from "react";
import {useTranslation} from "react-i18next";
import {ExportDataEvent, exporterProps} from "./exporterBase";

const CSV_SEPARATOR = ";"
const LINE_SEPARATOR = "\n"
const numberFormatter = new Intl.NumberFormat("de-DE", {maximumFractionDigits:5})

export function ExporterCSV({exportHandler, leftAuto, fileName}: exporterProps) {
  const { t } = useTranslation("datatable")
  const fName = `${fileName}.csv`

  return (
    <Col xs={12} md={"auto"} className={(leftAuto?"ms-md-auto ":"") + "mb-2"}>
      <InputGroup>
        <Button onClick={() => exportHandler({exporterName: "csv", fileName: fName})}>{t('export.csv')}</Button>
      </InputGroup>
    </Col>
  )
}

export function generateCSVExport(event: ExportDataEvent, header: string[], data: Array<(string | number)[]>) {
  let result = ""
  header.forEach((h, i) => {
    if(i > 0) {
      result += CSV_SEPARATOR
    }
    result += h
  })
  result += LINE_SEPARATOR

  data.forEach(entry => {
    entry.forEach((element, i) => {
      if(i > 0) {
        result += CSV_SEPARATOR
      }
      if(typeof(element) === "number") {
        result += numberFormatter.format(element)
      } else {
        result += element
      }
    })
    result += LINE_SEPARATOR
  })

  return result
}
