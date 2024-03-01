//idea from https://github.com/react-bootstrap/react-bootstrap/issues/6530#issuecomment-1385471731

import * as React from "react";
import {createContext, MetaHTMLAttributes, useCallback, useContext, useEffect, useReducer} from "react";

/** @enum {string} */
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
}

const ThemeContext = createContext<[string, React.Dispatch<string> | null]>([THEME.LIGHT, null])

const getDefaultTheme = () => (
    window.matchMedia('(prefers-color-scheme: dark)').matches
        ? THEME.DARK
        : THEME.LIGHT
)

const getPreferredTheme = () => {
  const storedTheme = localStorage.getItem('theme')
  if (storedTheme) return storedTheme

  const defaultTheme = getDefaultTheme()
  localStorage.setItem('theme', defaultTheme)

  return defaultTheme
}

export function CustomThemeProvider({children, className}: {children: React.ReactNode, className?: string}) {
  const [theme, setTheme] = useReducer<(old_s: string, new_s: string) => string>((old_s, new_s) => {
    return new_s
  }, getPreferredTheme())

  useEffect(() => {
    document.head.childNodes.forEach(v => {
      if(v.nodeName === "META") {
        const vMeta = v as MetaHTMLAttributes<any>
        if(vMeta.name === "color-scheme") {
          vMeta.content = theme
        } else if(vMeta.name === "theme-color") {
          switch (theme) {
            case "light":
              vMeta.content = "#edd492"
              break
            case "dark":
              vMeta.content = "#202327"
              break
          }
        }
      }
    })
  }, [theme]);

  return (
      <div data-bs-theme={theme} className={className}>
        <ThemeContext.Provider value={[theme, setTheme]}>
          {children}
        </ThemeContext.Provider>
      </div>
  )
}

export function useSetTheme() {
  const [, themeDispatch] = useContext(ThemeContext)
  return (theme: string) => {
    if(themeDispatch) {
      themeDispatch(theme)
    }
    localStorage.setItem('theme', theme)
  }
}

export function useResetTheme() {
  const setTheme = useSetTheme()
  return () => {
    setTheme(getDefaultTheme())
  }
}

export function useToggleTheme() {
  const setTheme = useSetTheme()
  const getTheme = useGetCurrentTheme()
  return () => {
    const nextTheme =
        getTheme() === THEME.DARK
            ? THEME.LIGHT
            : THEME.DARK
    setTheme(nextTheme)
  }
}

export function useGetCurrentTheme() {
  const [theme, ] = useContext(ThemeContext)
  return useCallback(() => {
    return theme
  }, [theme])
}
