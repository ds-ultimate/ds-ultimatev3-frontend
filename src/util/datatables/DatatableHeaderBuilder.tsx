import {Key, ReactNode} from "react";
import {Breakpoint, breakpoints} from "../bootrapBreakpoints";
import DatatableHeader from "./DatatableHeader";

type headerObject<T> = {
  colSpan?: number,
  title: string | ReactNode,
  sortBy?: string,
  sortCB?: ((data1: T, data2: T) => number)
  sortDescDefault?: boolean,
  showAt?: Breakpoint,
  useConcat?: boolean
}

type headerRow<T> = headerObject<T>[]

export default class DatatableHeaderBuilder<T> {
  data: DatatableRowBuilder<T>[] = []
  mainRow: DatatableRowBuilder<T> | undefined = undefined
  mainVisible: string[] | undefined = undefined

  addRow(rowBuilder: (row: DatatableRowBuilder<T>) => void): DatatableHeaderBuilder<T> {
    const builder = new DatatableRowBuilder()
    rowBuilder(builder)
    this.data.push(builder)
    return this
  }

  addMainRow(rowBuilder: (row: DatatableRowBuilder<T>) => void): DatatableHeaderBuilder<T> {
    const builder = new DatatableRowBuilder()
    rowBuilder(builder)
    this.data.push(builder)
    this.mainRow = builder
    return this
  }

  buildNodes(cellClasses: string[] | undefined) {
    const visibility = this.getVisibility()
    return (
        <thead>
        {this.data.map((value, idx) => value.buildNode(visibility, idx, cellClasses))}
        </thead>
    )
  }

  getVisibility() {
    if(! this.mainVisible) {
      if(! this.mainRow) {
        throw Error("No main row defined")
      }
      this.mainVisible = this.mainRow.getVisibilityMapping()
    }
    return this.mainVisible
  }

  getScreenVisibilityMapping() {
    return breakpoints.map((_val, idx) => {
      const slice = breakpoints.slice(0, idx + 1)
      return this.getVisibility()
          .map((value, idx) => [value, idx] as [string, number])
          .filter(showVal => slice.includes(showVal[0]))
          .map(value => value[1])
    })
  }

  getOffVisibilityMapping() {
    return breakpoints.map((_val, idx) => {
      const slice = breakpoints.slice(0, idx + 1)
      return this.getVisibility()
          .map((value, idx) => [value, idx] as [string, number])
          .filter(showVal => ! slice.includes(showVal[0]))
          .map(value => value[1])
    })
  }

  getNames() {
    const headerNamesSplit = this.data.map(value => {
      let result: ReactNode[] = []
      value.cells.forEach(celVal => {
        const dataVal = celVal.useConcat === false?null: (celVal.title ?? null)

        if(celVal.colSpan) {
          if(celVal.colSpan > 1) {
            result.push(...Array.from({length: celVal.colSpan}, () => dataVal))
          }
        } else {
          result.push(dataVal)
        }
      })
      return result
    })

    return Array.from({length: this.getVisibility().length}, (_v, idx) => {
      return (
          <>
            {headerNamesSplit.filter(value => value !== null).map(value => value[idx]).flatMap(value => [" ", value])}
          </>
      )
    })
  }

  getSortingCB() {
    return this.mainRow?.cells.map(value => value.sortCB)
  }
}

class DatatableRowBuilder<T> {
  cells: headerRow<T> = []

  addCell(cell: headerObject<T>): DatatableRowBuilder<T> {
    if(cell.sortBy && cell.sortCB) {
      throw new Error("sortby and sortcb cannot be used at the same time")
    }
    this.cells.push(cell)
    return this
  }

  getVisibilityMapping() {
    let result: Breakpoint[] = []
    this.cells.forEach(value => {
      if(value.colSpan) {
        if(value.colSpan > 1) {
          result.push(...Array.from({length: value.colSpan}, () => value.showAt ?? "xs"))
        }
      } else {
        result.push(value.showAt ?? "xs")
      }
    })
    return result
  }

  buildNode(visibility: string[], key: Key, cellClasses: string[] | undefined) {
    let index = 0
    return (
        <tr key={key}>
          {this.cells.map((value, idx) => {
            const len = value.colSpan ?? 1
            const visible = visibility.slice(index, index + len)
            const className = (len === 1 && cellClasses)?cellClasses[index]:undefined
            index += len
            let sortBy : string | number | undefined = value.sortBy
            if(value.sortCB) {
              sortBy = idx
            }

            return (
                <DatatableHeader
                    key={idx}
                    sortBy={sortBy}
                    sortDescDefault={value.sortDescDefault}
                    showAt={visible}
                    className={className}
                >
                  {value.title}
                </DatatableHeader>
            )
          })}
        </tr>
    )
  }
}
