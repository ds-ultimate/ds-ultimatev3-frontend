import {CommandList, NewCommandListItem} from "./CommandList"
import {StateUpdater} from "../../util/customTypes"
import {useCallback, useContext} from "react"
import {LoadingScreenContext} from "../../pages/layout/LoadingScreen"

// TODO actually implement the API
// TODO fix the massive amount of warnings

export function useUpdateTitle() {
  const setLoading = useContext(LoadingScreenContext)

  return useCallback((list: CommandList, updateList: StateUpdater<CommandList>, newTitle: string) => {
    updateList(() => {
      setLoading(true, "commandTitleUpdate")
      // TODO actually save the title here
      fakeAPI()
          .then(() => setLoading(false, "commandTitleUpdate"))
      return {...list, title: newTitle}
    })

    console.log(newTitle)
  }, [setLoading])
}

export function usePerformInitialImport() {
  return useCallback((list: CommandList, updateList: StateUpdater<CommandList>, addedCommands: NewCommandListItem[]) => {
    return new Promise(resolve => {
      updateList(() => {
        // TODO actually save the commands here
        fakeAPI()
            .then(() => {
              resolve(true)
            })
        const idAddedCmd = addedCommands.map(value => ({...value, id: idGenerator()}))
        return {...list, items: [...list.items, ...idAddedCmd]}
      })
    })
  }, [])
}

export function usePerformImport() {
  const setLoading = useContext(LoadingScreenContext)

  return useCallback((list: CommandList, updateList: StateUpdater<CommandList>, addedCommands: NewCommandListItem[]) => {
    return new Promise(resolve => {
      updateList(() => {
        setLoading(true, "commandImport")
        // TODO actually save the commands here
        fakeAPI()
            .then(() => {
              setLoading(false, "commandImport")
              resolve(true)
            })
        const idAddedCmd = addedCommands.map(value => ({...value, id: idGenerator()}))
        return {...list, items: [...list.items, ...idAddedCmd]}
      })
    })
  }, [setLoading])
}

export function useCreateCommandListItem() {
  const setLoading = useContext(LoadingScreenContext)

  return useCallback((list: CommandList, updateList: StateUpdater<CommandList>, newCommand: NewCommandListItem) => {
    return new Promise(resolve => {
      updateList(() => {
        setLoading(true, "commandAdd")
        // TODO actually save the command here
        fakeAPI()
            .then(() => {
              setLoading(false, "commandAdd")
              resolve(true)
            })
        const idCmd = {...newCommand, id: idGenerator()}
        return {...list, items: [...list.items, idCmd]}
      })
    })
  }, [setLoading])
}

export function useRemoveFromCommandList() {
  const setLoading = useContext(LoadingScreenContext)

  return useCallback((list: CommandList, updateList: StateUpdater<CommandList>, removals: number[]) => {
    return new Promise(resolve => {
      updateList(() => {
        setLoading(true, "commandRemove")
        // TODO actually delete the commands here
        fakeAPI()
            .then(() => {
              setLoading(false, "commandRemove")
              resolve(true)
            })
        const newItems = list.items.filter(value => !removals.includes(value.id))
        return {...list, items: [...newItems]}
      })
    })
  }, [setLoading])
}

export function useEmptyCommandList() {
  const remove = useRemoveFromCommandList()
  return useCallback((list: CommandList, updateList: StateUpdater<CommandList>) => {
    const remIds = list.items.map(value => value.id)
    return remove(list, updateList, remIds)
  }, [remove])
}

export function useRemoveOutdated() {
  const remove = useRemoveFromCommandList()
  return useCallback((list: CommandList, updateList: StateUpdater<CommandList>) => {
    const curTime = (new Date()).getTime()
    const remIds = list.items
        .filter(value => value.sendTimestamp < curTime)
        .map(value => value.id)
    return remove(list, updateList, remIds)
  }, [remove])
}

export function useRemoveSent() {
  const remove = useRemoveFromCommandList()
  return useCallback((list: CommandList, updateList: StateUpdater<CommandList>) => {
    const remIds = list.items
        .filter(value => !value.sent)
        .map(value => value.id)
    return remove(list, updateList, remIds)
  }, [remove])
}

let curId = 0
function idGenerator() {
  return curId++
}

function fakeAPI() {
  return new Promise<boolean>(resolve => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}
