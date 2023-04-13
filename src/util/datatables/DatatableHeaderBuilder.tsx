import {Key, ReactNode} from "react";
import {Breakpoint, breakpoints} from "../bootrapBreakpoints";
import DatatableHeader from "./DatatableHeader";

type headerObject = {
  colSpan?: number,
  title: string | ReactNode,
  sortBy?: string,
  sortDescDefault?: boolean,
  showAt?: Breakpoint,
  useConcat?: boolean
}

type headerRow = headerObject[]

export default class DatatableHeaderBuilder {
  data: DatatableRowBuilder[] = []
  mainRow: DatatableRowBuilder | undefined = undefined
  mainVisible: string[] | undefined = undefined

  addRow(rowBuilder: (row: DatatableRowBuilder) => void): DatatableHeaderBuilder {
    const builder = new DatatableRowBuilder()
    rowBuilder(builder)
    this.data.push(builder)
    return this
  }

  addMainRow(rowBuilder: (row: DatatableRowBuilder) => void): DatatableHeaderBuilder {
    const builder = new DatatableRowBuilder()
    rowBuilder(builder)
    this.data.push(builder)
    this.mainRow = builder
    return this
  }

  buildNodes() {
    const visibility = this.getVisibility()
    return (
        <thead>
        {this.data.map((value, idx) => value.buildNode(visibility, idx))}
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
}

class DatatableRowBuilder {
  cells: headerRow = []

  addCell(cell: headerObject): DatatableRowBuilder {
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

  buildNode(visibility: string[], key: Key) {
    let index = 0
    return (
        <tr key={key}>
          {this.cells.map((value, idx) => {
            const visible = visibility.slice(index, index + (value.colSpan ?? 1))
            index += value.colSpan ?? 1
            return (
                <DatatableHeader
                    key={idx}
                    sortBy={value.sortBy}
                    sortDescDefault={value.sortDescDefault}
                    showAt={visible}
                >
                  {value.title}
                </DatatableHeader>
            )
          })}
        </tr>
    )
  }
}
