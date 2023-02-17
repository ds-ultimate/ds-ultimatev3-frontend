import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp, faEquals} from "@fortawesome/free-solid-svg-icons";

const nf = new Intl.NumberFormat("de-DE")

const DecodeName = ({name}: {name: string}) => {
  return (
      <>
        {decodeURIComponent(name).replaceAll("+", " ")}
      </>
  )
}

enum history_constants {
  UP,
  DOWN,
  EQUALS,
}

const ShowHistory = ({name, o_dat, n_dat, invert}: {name: string, o_dat?: number, n_dat: number, invert?: boolean}): JSX.Element => {
  if(o_dat === undefined) {
    return (
        <>
          {nf.format(n_dat)}
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

  // TODO use ui.old.nodata if o_dat is null inside popup
  return (
      <span className={spanClass}>
        Popup: {name} {nf.format(o_dat)}
        <FontAwesomeIcon icon={fontIcon} />
        {nf.format(n_dat)}
      </span>
  )
}

function dateFormatYMD(date: Date) {
  const d = date.getDate();
  const m = date.getMonth() + 1; //Month from 0 to 11
  const y = date.getFullYear();
  return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

export {nf, DecodeName, ShowHistory, dateFormatYMD}
