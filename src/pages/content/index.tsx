import {useEffect, useState} from "react";
import {serverType} from "../../modelHelper/Server";
import {newsType} from "../../modelHelper/News";
import {useTranslation} from "react-i18next";
import {getIndexPageData} from "../../apiInterface/loadContent";
import {Link} from "react-router-dom";
import {formatRoute} from "../../util/router";
import {SERVER} from "../../util/routes";

export default function IndexPage() {
  const [data, setData] = useState<{ servers: serverType[], news: newsType[] }>({servers: [], news: []})
  const [t, i18n] = useTranslation("ui")

  useEffect(() => {
    let mounted = true
    getIndexPageData()
        .then(data => {
          if(mounted) {
            setData(data)
          }
        })

    return () => {
      mounted = false
    }
  }, [])

  let news: JSX.Element | undefined = undefined
  if(data.news) {
    news = (
        <div className={"carousel"}>
          {data.news.map(n => {
            const n_content = (i18n.language === "de")?n.content_de:n.content_en
            return (
                <div key={n.id} className={"carousel-inner"} dangerouslySetInnerHTML={{__html: n_content}}>
                </div>
            )
          })}
        </div>
    )
  }

  let servers: JSX.Element[] | undefined = undefined
  if(data.servers) {
    servers = data.servers.map(s => {
      return (
          <tr key={s.code}>
            <td><span className={"flag-icon flag-icon-" + s.flag}></span></td>
            <td>{s.code}</td>
            <td><a href={s.url}>{s.url}</a></td>
            <td>{s.world_cnt}</td>
            <td><Link to={formatRoute(SERVER, {server: s.code})}>{t('server.show')}</Link></td>
          </tr>
      )
    })
  }

  return (
      <>
        <h1>DS-Ultimate</h1>
        {news}
        <div>
          {t("index.help")}
        </div>
        <div>
          <h2>{t("server.choose")}</h2>
          <table>
            <thead>
            <tr>
              <th></th>
              <th>{t('server.code')}</th>
              <th>{t('server.dsLink')}</th>
              <th>{t('server.worlds')}</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            {servers}
            </tbody>
          </table>
        </div>
      </>
  )
};
