import "server-only"
import Link from "next/link";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

export default function Home() {
  return (
      <h1 className="text-3xl font-bold underline">
        Hello world!
        <Link href={'/de'}>DE</Link><br />
        <Link href={'/ch'}>CH</Link><br />
        <Link href={'/de/2111'}>DE 2111</Link><br />
        <Link href={'/de/210'}>DE 210</Link><br />
      </h1>
  )
}

export async function getServerSideProps({locale}: {locale: string}) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', [
        'ui',
      ])),
    },
  }
}
