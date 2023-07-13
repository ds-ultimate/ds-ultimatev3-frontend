import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp, faEquals} from "@fortawesome/free-solid-svg-icons";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {Placement} from "react-bootstrap/types";

export const nf = new Intl.NumberFormat("de-DE")

export function DecodeName({name}: {name: string}) {
  return (
      <>
        {decodeURIComponent(name).replaceAll("+", " ")}
      </>
  )
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

export function ShowHistory({name, o_dat, n_dat, invert, tsd_format}: {name: string, o_dat?: number, n_dat: number, invert?: boolean, tsd_format?: boolean}): JSX.Element {
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
      {delayShow?: number, delayHide?: number, overlay: JSX.Element, placement?: Placement, children: JSX.Element}) {
  const delS = delayShow ?? 200
  const delH = delayHide ?? 400
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
  const d = date.getDate();
  const m = date.getMonth() + 1; //Month from 0 to 11
  const y = date.getFullYear();
  return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

export function dateFormatLocal(date: Date) {
  const d = date.getDate();
  const m = date.getMonth() + 1; //Month from 0 to 11
  const y = date.getFullYear();
  return '' + (d <= 9 ? '0' + d : d) + '.' + (m<=9 ? '0' + m : m) + '.' + y;
}
