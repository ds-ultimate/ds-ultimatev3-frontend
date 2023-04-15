import {AsyncPaginate} from 'react-select-async-paginate';
import {ActionMeta} from "react-select/dist/declarations/src/types";
import {useCallback, useState} from "react";
import axios from "axios";

import "./bootstrapSelect.scss"

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
        console.log(reason)
        //TODO error handling
      })
    })
  }, [api])

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
      />
  )
}
