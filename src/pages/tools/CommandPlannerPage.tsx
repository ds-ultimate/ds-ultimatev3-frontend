import {Link, useParams} from "react-router-dom";
import React, {useEffect} from "react";
import {useExtendedWorldData, useWorldData} from "../../apiInterface/loaders/world"
import {useTranslation} from "react-i18next";
import ErrorPage from "../layout/ErrorPage";
import {WorldDisplayName, worldDisplayNameRaw} from "../../modelHelper/World"
import {Card, Col, Row} from "react-bootstrap"
import {FrontendError} from "../layout/ErrorPages/ErrorTypes"
import {COMMAND_PLANNER, COMMAND_PLANNER_OVERVIEW} from "./routes"
import {formatRoute} from "../../util/router"
import MANUAL_PLANNER from "./CommandPlanner/images/att_manual.png"
import ATTACK_PLANNER from "./CommandPlanner/images/axe.png"
import SUPPORT_PLANNER from "./CommandPlanner/images/sword.png"


export default function CommandPlannerPage() {
  const {server, world} = useParams()
  const [worldErr, worldData] = useWorldData(server, world)
  const [worldExtendedErr, worldDataExtended] = useExtendedWorldData(server, world)
  const [tUi]  = useTranslation("ui")
  const { t } = useTranslation("tool")

  useEffect(() => {
    if(worldData !== undefined) {
      document.title = worldDisplayNameRaw(tUi, worldData) + ": " + t("commandPlanner.title")
    }
  }, [tUi, worldData, t])

  if(worldErr) return <ErrorPage error={worldErr} />
  if(worldExtendedErr) return <ErrorPage error={worldExtendedErr} />

  let worldConf = worldDataExtended?.config
  let worldUnit = worldDataExtended?.units
  if(worldConf === null || worldUnit === null) {
    const errData: FrontendError = {
      isFrontend: true,
      code: 404,
      k: "404.worldNotSupported",
      p: {},
    }
    return <ErrorPage error={errData} />
  }

  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-none d-lg-block"}>
            <h1 className={"fw-normal"}>
              {t("commandPlanner.title") + " "}
              [{worldData && <WorldDisplayName world={worldData} />}]
            </h1>
          </Col>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-lg-none"}>
            <h1 className={"fw-normal"}>
              {t("commandPlanner.title") + " "}
            </h1>
            <h4>
              [{worldData && <WorldDisplayName world={worldData} />}]
            </h4>
          </Col>
        </Col>
        <Col xs={12} className={"mt-2"}>
          <Card>
            <Card.Body>
              <Row>
                <PlannerSelectButton
                    title={t("commandPlanner.button.manual")}
                    description={t("commandPlanner.button.manual_desc")}
                    route={formatRoute(COMMAND_PLANNER_OVERVIEW, {server, world, id: "new", mode: "edit", key: "new"})}
                    image={MANUAL_PLANNER} />
                <PlannerSelectButton
                    title={t("commandPlanner.button.attack")}
                    description={t("commandPlanner.button.attack_desc")}
                    route={formatRoute(COMMAND_PLANNER, {server, world})}
                    image={ATTACK_PLANNER} />
                <PlannerSelectButton
                    title={t("commandPlanner.button.support")}
                    description={t("commandPlanner.button.support_desc")}
                    route={formatRoute(COMMAND_PLANNER, {server, world})}
                    image={SUPPORT_PLANNER} />
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
  )
}

function PlannerSelectButton({title, description, route, image}: {title: string | null, description: string | null, route: string, image: string}) {
  return (
      <Col style={{minWidth: "350px"}}>
        <div className={"text-center mb-4"}>
          <Link to={route} className={"btn btn-primary"}>
            <div className={"mb-2"}>
              {title}
            </div>
            <img src={image} alt={title!==null?title:""} />
          </Link>
        </div>
        <div>
          {description}
        </div>
      </Col>
  )
}
