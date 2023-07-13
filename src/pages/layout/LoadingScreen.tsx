import styles from "./LoadingScreen.module.scss"
import {createContext, CSSProperties, useCallback, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";


export const LoadingScreenContext = createContext<(val: boolean, id: string) => void>((b, id) => {})

export default function LoadingScreen({children, style, darken}: {children: JSX.Element, style?: CSSProperties, darken?: boolean}) {
  const [loading, setLoading] = useState<string[]>([])
  const loadingHelper = useCallback((val: boolean, id: string) => {
    if(val) {
      setLoading((prevState) => {
        const newState = prevState.slice()
        if(!newState.includes(id)) {
          newState.push(id)
        }
        return newState
      })
    } else {
      setLoading((prevState) => prevState.filter(v => v !== id))
    }
  }, [setLoading]);

  return (
      <div className={styles.loadingContainer} style={style}>
        {loading.length > 0 && <div className={styles.loadingDiv + " pt-5" + (darken?" " + styles.loadingDivDarken:"")}>
          <div className={styles.loadingSpin}>
            <FontAwesomeIcon icon={faSpinner} spin/>
          </div>
        </div>}
        <LoadingScreenContext.Provider value={loadingHelper}>
          {children}
        </LoadingScreenContext.Provider>
      </div>
  )
}


export function ForcedLoadingScreen({style, darken}: {style?: CSSProperties, darken?: boolean}) {
  return (
      <div className={styles.loadingContainer} style={style}>
        {<div className={styles.loadingDiv + " pt-5" + (darken?" " + styles.loadingDivDarken:"")}>
          <div className={styles.loadingSpin}>
            <FontAwesomeIcon icon={faSpinner} spin/>
          </div>
        </div>}
      </div>
  )
}