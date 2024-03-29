import styles from "./LoadingScreen.module.scss"
import {createContext, CSSProperties, ReactNode, useCallback, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";


export const LoadingScreenContext = createContext<(val: boolean, id: string) => void>((b, id) => {})

type screenProps = {
  children?: ReactNode[] | ReactNode,
  style?: CSSProperties,
  className?: string,
  darken?: boolean,
  big?: boolean
}

export default function LoadingScreen({children, style, className, darken, big}: screenProps) {
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
      <div className={styles.loadingContainer + (className?" "+className:"")} style={style}>
        {loading.length > 0 && <div className={styles.loadingDiv + " pt-5" + (darken?" " + styles.loadingDivDarken:"")}>
          <div className={big?styles.loadingSpinBig:styles.loadingSpin}>
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
