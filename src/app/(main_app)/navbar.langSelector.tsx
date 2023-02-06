'use client';
import {useRouter} from "next/router";
import Link from "next/link";

export default function NavbarLangSelector({languages}: {languages: string[]}) {

  /*
  const router = useRouter()
  const { pathname, asPath, query } = router
  <a key={lang} onClick={() => router.push({pathname, query}, asPath, {locale: lang})}>{lang}</a>
   */
  return (
      <>
        {languages.map(lang => {
          return (
              <Link key={lang} href={"/test"} locale={lang}>{lang}</Link>
          )
        })}
      </>
  )
}