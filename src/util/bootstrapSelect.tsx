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

import {AsyncPaginate} from 'react-select-async-paginate';
import {ActionMeta} from "react-select/dist/declarations/src/types";
import {useCallback, useState} from "react";
import axios from "axios";

import "./bootstrapSelect.scss"
import {useErrorBoundary} from "react-error-boundary"

type OptionType = {
  value: number,
  label: string,
}

type additionalProps = {
  page: number,
}

type bootstrapSelectOptions = {
  onChange: (newValue: OptionType | null, actionMeta: ActionMeta<OptionType>) => void,
  api: string | undefined
  initialValue?: OptionType,
}

type loadType = {
  options: OptionType[],
  hasMore: boolean,
  additional: additionalProps,
}

export default function BootstrapSelect({onChange, api, initialValue}: bootstrapSelectOptions) {
  const [value, onChangeInt] = useState<OptionType | null>(initialValue ?? null);
  const { showBoundary } = useErrorBoundary()

  const loadOptions = useCallback((search: string, loadedOptions: any, additional: additionalProps | undefined) => {
    if(api === undefined) {
      return {
        options: [],
        hasMore: false,
      }
    }

    additional = additional ?? {page: 0}
    const {page} = additional
    let params: {page: number, search?: string} = {page}
    if(search !== "") {
      params.search = search
    }

    return  new Promise<loadType>((resolve) => {
      axios.get(api, {params}).then(resp => {
        resolve({
          options: resp.data.results,
          hasMore: resp.data.pagination.more,
          additional: {
            page: page + 1,
          },
        })
      }).catch(reason => {
        showBoundary(reason)
      })
    })
  }, [showBoundary, api])

  return (
      <AsyncPaginate
          loadOptions={loadOptions}
          debounceTimeout={200}
          loadOptionsOnMenuOpen={true}
          isClearable={true}
          value={value}
          onChange={(newValue, actionMeta) => {onChangeInt(newValue); onChange(newValue, actionMeta)}}
          additional={{
            page: 0,
          }}
          className={"bootstrap-select-custom"}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: "var(--bs-select-active-color-dark)",
              primary: "var(--bs-select-active-color-dark)",
              neutral80: "var(--bs-body-color)",
              neutral20: "var(--bs-select-opt-disabled-color)",
            }
          })}
      />
  )
}
