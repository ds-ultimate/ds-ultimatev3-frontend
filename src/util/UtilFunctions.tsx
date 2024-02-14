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

import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp, faEquals} from "@fortawesome/free-solid-svg-icons";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {Placement} from "react-bootstrap/types";
import React from "react"
import {OverlayChildren} from "react-bootstrap/Overlay"

export const nf = new Intl.NumberFormat("de-DE")

export function rawDecodeName(name: string) {
  return decodeURIComponent(name).replaceAll("+", " ")
}

export function DecodeName({name}: {name: string}) {
  return (
      <>
        {rawDecodeName(name)}
      </>
  )
}

export function truncate(dat: string, n: number){
  return (dat.length > n) ? dat.substring(0, n-1) + '&hellip;' : dat;
}

export function range(min: number, max: number, stepSize?: number, includeLast?: boolean) {
  const step = stepSize ?? 1
  const toAdd = includeLast?1:0
  let result = [...Array(toAdd + Math.round((max - min) / step)).keys()]
  return result.map(n => n * step + min)
}

const thousandsSuffixes = ['', 'K', 'M', 'G', 'T'];

export function thousandsFormat(num: number) {
  let exp = 0;
  while(num >= 1000) {
    exp++;
    num/= 1000;
  }

  const suffix = thousandsSuffixes[exp];
  const num_digits = Math.min(Math.max(Math.floor(Math.log10(num + 0.01)), 0), 2);
  const result = num.toFixed(2 - num_digits)
  return result + " " + suffix;
}

enum history_constants {
  UP,
  DOWN,
  EQUALS,
}

export function ShowHistory({name, o_dat, n_dat, invert, tsd_format}: {name: string, o_dat?: number, n_dat: number, invert?: boolean, tsd_format?: boolean}): React.ReactElement {
  const formatter = (tsd_format)?thousandsFormat:nf.format

  if(o_dat === undefined) {
    return (
        <>
          {formatter(n_dat)}
        </>
    )
  }

  let result: history_constants = history_constants.EQUALS
  if (n_dat !== o_dat){
    if (n_dat > o_dat){
      result = (invert)? history_constants.DOWN: history_constants.UP;
    }else{
      result = (invert)? history_constants.UP: history_constants.DOWN;
    }
  }

  let spanClass: string | undefined = undefined
  let fontIcon: IconProp
  switch (result){
    case history_constants.UP:
      spanClass = 'text-success'
      fontIcon = faCaretUp
      break
    case history_constants.DOWN:
      spanClass = 'text-danger'
      fontIcon = faCaretDown
      break
    case history_constants.EQUALS:
      fontIcon = faEquals
  }

  return (
      <CustomTooltip
          delayShow={0}
          delayHide={400}
          overlay={(
              <Tooltip>{name} {formatter(o_dat)}</Tooltip>
          )}>
        <span className={spanClass}>
          <FontAwesomeIcon className={"me-2"} icon={fontIcon} />
          {formatter(n_dat)}
        </span>
      </CustomTooltip>
  )
}

export function CustomTooltip({delayShow, delayHide, overlay, placement, children}:
      {delayShow?: number, delayHide?: number, overlay: OverlayChildren, placement?: Placement, children: React.ReactElement}) {
  const delS = delayShow ?? 0
  const delH = delayHide ?? 0
  const place = placement ?? "top"

  return (
      <OverlayTrigger
          delay={{show: delS, hide: delH}}
          placement={place}
          defaultShow={false}
          onHide={undefined}
          onToggle={undefined}
          trigger={["focus", "hover"]}
          popperConfig={undefined}
          overlay={overlay}>
        {children}
      </OverlayTrigger>
  )
}

export function dateFormatYMD(date: Date) {
  const { d, mon, y } = timeParameterFromDate(date)
  return `${y}-${mon}-${d}`
}

export function dateFormatLocal_DMY(date: Date) {
  const { d, mon, y } = timeParameterFromDate(date)
  return `${d}.${mon}.${y}`
}

export function dateFormatLocal_DMY_HMS(date: Date) {
  const { s, min, h, d, mon, y } = timeParameterFromDate(date)
  return `${d}.${mon}.${y} ${h}:${min}:${s}`
}

export function dateFormatYMD_HMS(date: Date) {
  const { s, min, h, d, mon, y } = timeParameterFromDate(date)
  return `${y}-${mon}-${d} ${h}:${min}:${s}`
}

function timeParameterFromDate(date: Date) {
  const s = date.getSeconds();
  const min = date.getMinutes();
  const h = date.getHours();
  const d = date.getDate();
  const mon = date.getMonth() + 1; //Month from 0 to 11
  const y = date.getFullYear();

  return {
    y: y,
    mon: (mon<=9 ? '0' + mon : mon),
    d: (d<=9 ? '0' + d : d),
    h: (h<=9 ? '0' + h : h),
    min: (min<=9 ? '0' + min : min),
    s: (s<=9 ? '0' + s : s),
  }
}
