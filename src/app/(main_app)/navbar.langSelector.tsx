'use client';
import {useRouter} from "next/router";

export default function NavbarLangSelector({languages}: {languages: string[]}) {
  const router = useRouter()
  const { pathname, asPath, query } = router

  return (
      <>
        {languages.map(lang => {
          return (
              <a key={lang} onClick={() => router.push({pathname, query}, asPath, {locale: lang})}>{lang}</a>
          )
        })}
      </>
  )
}