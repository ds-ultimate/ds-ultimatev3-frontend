import {CommandList} from "../../../../modelHelper/Tool/CommandList"
import {useTranslation} from "react-i18next"
import {Button, Col, FormControl, Row} from "react-bootstrap"
import {BASE_PATH, formatRoute} from "../../../../util/router"
import {COMMAND_PLANNER_OVERVIEW} from "../../routes"
import {useWorldDataById} from "../../../../apiInterface/loaders/world"
import ErrorPage from "../../../layout/ErrorPage"
import {useCopyWithToast} from "../../../../util/UtilFunctions"


export default function CommandLinkTab({list}: {list: CommandList}) {
  const { t } = useTranslation("tool")
  const [worldErr, world] = useWorldDataById(list.world_id)
  const copyWithToast = useCopyWithToast()

  const editLink = world && (BASE_PATH + formatRoute(COMMAND_PLANNER_OVERVIEW, {
    server: world.server__code, world: world.name, id: ""+list.id, mode: "edit", key: list.edit_key
  }))
  const showLink = world && (BASE_PATH + formatRoute(COMMAND_PLANNER_OVERVIEW, {
    server: world.server__code, world: world.name, id: ""+list.id, mode: "show", key: list.show_key
  }))

  if(worldErr) return <ErrorPage error={worldErr} />

  return (
      <Row>
        <Col xs={12}>
          <Row>
            <Col md={2}>{t("commandPlanner.overview.link.editLink")}</Col>
            <Col md={1}>
              {editLink && <Button variant={"primary"} onClick={() => copyWithToast(editLink)}>{t("copy")}</Button>}
            </Col>
            <Col md={9}>
              {editLink && <FormControl disabled value={editLink} />}
              <small>{t("commandPlanner.overview.link.editLinkHelp")}</small>
            </Col>
          </Row>
        </Col>
        <Col xs={12} className={"mt-4"}>
          <Row>
            <Col md={2}>{t("commandPlanner.overview.link.showLink")}</Col>
            <Col md={1}>
              {showLink && <Button variant={"primary"} onClick={() => copyWithToast(showLink)}>{t("copy")}</Button>}
            </Col>
            <Col md={9}>
              {showLink && <FormControl disabled value={showLink} />}
              <small>{t("commandPlanner.overview.link.showLinkHelp")}</small>
            </Col>
          </Row>
        </Col>
      </Row>
  )
}
