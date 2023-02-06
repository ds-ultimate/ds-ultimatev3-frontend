import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {LinkPlayer, playerType} from "../../modelHelper/Player";
import {allyType, LinkAlly} from "../../modelHelper/Ally";
import {getWorldOverview, WORLD_OVERVIEW_DEFAULT} from "../../apiInterface/loadContent";
import {WorldDisplayName, worldType} from "../../modelHelper/World";
import {FormatNumber} from "../../util/UtilFunctions";

export default function WorldPage() {
  const {server, world} = useParams()
  const [worldOverview, setWorldOverview] = useState<{player: playerType[], ally: allyType[], world?: worldType}>(WORLD_OVERVIEW_DEFAULT)
  const { t } = useTranslation("ui")

  useEffect(() => {
    let mounted = true
    if(server === undefined || world === undefined) {
      setWorldOverview(WORLD_OVERVIEW_DEFAULT)
    } else {
      getWorldOverview(server, world)
          .then(data => {
            if(mounted) {
              setWorldOverview(data)
            }
          })
    }
    return () => {
      mounted = false
    }
  }, [server, world])
  const worldData = worldOverview.world

  return (
      <>
        <h1>{worldData && <WorldDisplayName world={worldData} />}</h1>
        <table>
          <thead>
          <tr>
            <th>{t('table.rank')}</th>
            <th>{t('table.name')}</th>
            <th>{t('table.points')}</th>
            <th>{t('table.villages')}</th>
          </tr>
          </thead>
          <tbody>
          {worldData && worldOverview.player.map(p => {
            return (
                <tr key={p.playerID}>
                  <th><FormatNumber n={p.rank} /></th>
                  <td><LinkPlayer player={p} world={worldData} withAlly /></td>
                  <th><FormatNumber n={p.points} /></th>
                  <th><FormatNumber n={p.village_count} /></th>
                </tr>
            )
          })}
          </tbody>
        </table>
        <table>
          <thead>
          <tr>
            <th>{t('table.rank')}</th>
            <th>{t('table.name')}</th>
            <th>{t('table.tag')}</th>
            <th>{t('table.points')}</th>
            <th>{t('table.members')}</th>
            <th>{t('table.villages')}</th>
          </tr>
          </thead>
          <tbody>
          {worldData && worldOverview.ally.map(a => {
            return (
                <tr key={a.allyID}>
                  <th><FormatNumber n={a.rank} /></th>
                  <td><LinkAlly ally={a} world={worldData} /></td>
                  <td><LinkAlly ally={a} world={worldData} useTag /></td>
                  <th><FormatNumber n={a.points} /></th>
                  <th><FormatNumber n={a.member_count} /></th>
                  <th><FormatNumber n={a.village_count} /></th>
                </tr>
            )
          })}
          </tbody>
        </table>
      </>
  )
};
