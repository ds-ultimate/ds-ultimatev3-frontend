import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {WorldDisplayName, WorldState, worldType} from "../../modelHelper/World";
import {serverType} from "../../modelHelper/Server";
import {getWorldsOfServer, WORLDS_OF_SERVER_DEFAULT} from "../../apiInterface/loadContent";
import {useTranslation} from "react-i18next";
import {formatRoute} from "../../util/router";
import {WORLD, WORLD_ALLY_CUR, WORLD_PLAYER_CUR} from "../../util/routes";
import {FormatNumber} from "../../util/UtilFunctions";

function WorldTypeSection({data, header, server}: {data: worldType[], header: string, server?: serverType}) {
  const { t } = useTranslation("ui")
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const activeData = data.filter(w => w.active)
  const inactiveData = data.filter(w => !w.active)

  return (
      <>
        {activeData.length > 0 &&
          <>
            <h2>{header}:</h2>
            <WorldTable data={activeData} server={server}/>
          </>
        }
        {inactiveData.length > 0 &&
          <>
            <button onClick={() => setIsOpen(!isOpen)}>{t('showMoreWorlds')}</button>
            {isOpen &&
              <>
                <h2>{header + ' ' + t('archive')}:</h2>
                <WorldTable data={inactiveData} server={server}/>
              </>
            }
          </>
        }
      </>
  )
}

function WorldTable({data, server}: {data: worldType[], server?: serverType}) {
  const { t } = useTranslation("ui")
  return (
      <table>
        <thead>
        <tr>
          <th>{t('table.world')}</th>
          <th>{t('table.player')}</th>
          <th>{t('table.ally')}</th>
          <th>{t('table.village')}</th>
        </tr>
        </thead>
        <tbody>
        {data.map(w => {
          return (
              <tr key={w.server + w.name}>
                <td>
                  {server && <span className={"flag-icon flag-icon-" + server.flag}></span>}
                  <Link to={formatRoute(WORLD, {server: w.server, world: w.name})}><WorldDisplayName world={w} /></Link>
                  <small>({w.server + w.name})</small>
                  <WorldState world={w} />
                </td>
                <td><Link to={formatRoute(WORLD_PLAYER_CUR, {server: w.server, world: w.name})}>
                  <FormatNumber n={w.player_count} />
                </Link></td>
                <td><Link to={formatRoute(WORLD_ALLY_CUR, {server: w.server, world: w.name})}>
                  <FormatNumber n={w.ally_count} />
                </Link></td>
                <td><FormatNumber n={w.village_count} /></td>
              </tr>
          )
        })}
        </tbody>
      </table>
  )
}

export default function ServerPage() {
  const {server} = useParams()
  const [serverWorlds, setServerWorlds] = useState<{server?: serverType, worlds: worldType[]}>({worlds: []})
  const { t } = useTranslation("ui")

  useEffect(() => {
    let mounted = true
    if(server === undefined) {
      setServerWorlds(WORLDS_OF_SERVER_DEFAULT)
    } else {
      getWorldsOfServer(server)
          .then(data => {
            if(mounted) {
              setServerWorlds(data)
            }
          })
    }
    return () => {
      mounted = false
    }
  }, [server])

  return (
      <>
        <h1>{t('title.worldOverview')}</h1>
        <WorldTypeSection
            data={serverWorlds.worlds.filter(w => w.sortType === "world").sort((w1, w2) => parseInt(w2.name) - parseInt(w1.name))}
            header={t('table-title.normalWorlds')}
            server={serverWorlds.server}
        />
        <WorldTypeSection
            data={serverWorlds.worlds.filter(w => w.sortType !== "world").sort((w1, w2) => w2.id - w1.id)}
            header={t('table-title.specialWorlds')}
            server={serverWorlds.server}
        />
      </>
  )
};
