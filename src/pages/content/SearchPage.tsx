import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Card, Col, Form, InputGroup, Row} from "react-bootstrap";

import ErrorPage from "../layout/ErrorPage";
import React, {ChangeEvent, useCallback, useEffect, useState} from "react"
import {FrontendError} from "../layout/ErrorPages/ErrorTypes"
import {worldDisplayNameRaw} from "../../modelHelper/World"
import {SearchAlly} from "./search/SearchAlly"
import {SearchPlayer} from "./search/SearchPlayer"
import Select from "react-select"
import {useWorldsOfServer} from "../../apiInterface/loaders/world"
import usePersistentState from "../../util/persitentState"
import {SearchVillage} from "./search/SearchVillage"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faUser, faUsers} from "@fortawesome/free-solid-svg-icons"
import {faFortAwesome} from "@fortawesome/free-brands-svg-icons"

import "../../util/bootstrapSelect.scss"
import {formatRoute} from "../../util/router"
import {SEARCH} from "../routes"


export const SEARCH_LIMIT = 100

export default function SearchPage() {
  const {server, type, search} = useParams()
  const { t } = useTranslation("ui")
  const [worldsErr, worldsData] = useWorldsOfServer(server)
  const [searchActive, setSearchActive] = useState<boolean>(true)
  const [searchWorlds, setSearchWorlds] = usePersistentState<number[]>("search." + type + "." + server, [])
  const redirect = useRedirect()

  useEffect(() => {
    document.title = t("title.search")
  }, [t])

  if(worldsErr) return <ErrorPage error={worldsErr} />

  let typeTrans: string
  if(type === "player") {
    typeTrans = t("table-title.player")
  }
  else if(type === "ally") {
    typeTrans = t("table-title.allys")
  }
  else if(type === "village") {
    typeTrans = t("table-title.villages")
  }
  else {
    const errData: FrontendError = {
      isFrontend: true,
      code: 404,
      k: "404.unknownType",
      p: {type},
    }
    return <ErrorPage error={errData} />
  }

  //search might be undefined in case of submit without contents
  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col md={5} className={"p-lg-5 mx-auto my-1 text-center"}>
            <h1 className={"fw-normal"}>{t("title.search")}: {typeTrans}</h1>
          </Col>
        </Col>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <InputGroup className={"mb-2 d-none d-lg-flex"}>
                <InputGroup.Text>{t("search.type")}</InputGroup.Text>
                <InputGroup.Radio checked={type === "village"} onChange={() => redirect("village", null)} />
                <InputGroup.Text onClick={() => redirect("village", null)}><FontAwesomeIcon icon={faFortAwesome} className={"me-1"} />{t("table.village")}</InputGroup.Text>
                <InputGroup.Radio checked={type === "player"} onChange={() => redirect("player", null)} />
                <InputGroup.Text onClick={() => redirect("player", null)}><FontAwesomeIcon icon={faUser} className={"me-1"} />{t("table.player")}</InputGroup.Text>
                <InputGroup.Radio checked={type === "ally"} onChange={() => redirect("ally", null)} />
                <InputGroup.Text onClick={() => redirect("ally", null)}><FontAwesomeIcon icon={faUsers} className={"me-1"} />{t("table.ally")}</InputGroup.Text>
              </InputGroup>
              <InputGroup className={"mb-2 d-lg-none"}>
                <InputGroup.Text>{t("search.type")}</InputGroup.Text>
                <Form.Select value={type} onChange={(event) => redirect(event.target.value, null)}>
                  <option value={"village"}>{t("table.village")}</option>
                  <option value={"player"}>{t("table.player")}</option>
                  <option value={"ally"}>{t("table.ally")}</option>
                </Form.Select>
              </InputGroup>
              <InputGroup className={"mb-2"}>
                <InputGroup.Text>{t("search.query")}</InputGroup.Text>
                <Form.Control value={search ?? ""} onChange={(event: ChangeEvent<HTMLInputElement>) => redirect(null, event.target.value)} />
              </InputGroup>
              <InputGroup className={"mb-2 d-none d-lg-flex"}>
                <InputGroup.Text>{t("search.worlds")}</InputGroup.Text>
                <InputGroup.Radio checked={searchActive} onChange={() => setSearchActive(true)} />
                <InputGroup.Text onClick={() => setSearchActive(true)}>{t("search.activeWorlds")}</InputGroup.Text>
                <InputGroup.Radio checked={!searchActive} onChange={() => setSearchActive(false)}/>
                <InputGroup.Text onClick={() => setSearchActive(false)}>{t("search.customWorlds")}</InputGroup.Text>
                {worldsData && <Select
                    options={worldsData.map(value => {return {value: value.id, label: worldDisplayNameRaw(t, value)}})}
                    isMulti={true}
                    className={"bootstrap-select-custom" + (searchActive?" bootstrap-select-custom-disabled":"")}
                    value={searchWorlds.map(value => {
                      const w = worldsData.find(world => world.id === value)
                      if(w === undefined) return undefined
                      return {value: value, label: worldDisplayNameRaw(t, w)}
                    }).filter(value => value !== undefined) as Array<{value: number, label: string}>}
                    onChange={newValue => setSearchWorlds(newValue.map(v => v.value))}
                    isDisabled={searchActive}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary25: "var(--bs-select-active-color-dark)",
                        primary: "var(--bs-select-active-color-dark)",
                        neutral80: "var(--bs-body-color)",
                        neutral20: "var(--bs-select-opt-disabled-color)",
                      }
                    })}
                    isOptionDisabled={() => searchWorlds.length >= 20}
                />}
              </InputGroup>
              <InputGroup className={"mb-2 d-lg-none"}>
                <InputGroup.Text>{t("search.worlds")}</InputGroup.Text>
                <Form.Select value={searchActive?"true":"false"} onChange={(event) => setSearchActive(event.target.value === "true")}>
                  <option value={"true"}>{t("search.activeWorlds")}</option>
                  <option value={"false"}>{t("search.customWorlds")}</option>
                </Form.Select>
              </InputGroup>
              <InputGroup className={"mb-2 d-lg-none" + (searchActive?" d-none":"")}>
                {worldsData && <Select
                    options={worldsData.map(value => {return {value: value.id, label: worldDisplayNameRaw(t, value)}})}
                    isMulti={true}
                    className={"bootstrap-select-custom" + (searchActive?" bootstrap-select-custom-disabled":"")}
                    value={searchWorlds.map(value => {
                      const w = worldsData.find(world => world.id === value)
                      if(w === undefined) return undefined
                      return {value: value, label: worldDisplayNameRaw(t, w)}
                    }).filter(value => value !== undefined) as Array<{value: number, label: string}>}
                    onChange={newValue => setSearchWorlds(newValue.map(v => v.value))}
                    isDisabled={searchActive}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary25: "var(--bs-select-active-color-dark)",
                        primary: "var(--bs-select-active-color-dark)",
                        neutral80: "var(--bs-body-color)",
                        neutral20: "var(--bs-select-opt-disabled-color)",
                      }
                    })}
                    isOptionDisabled={() => searchWorlds.length >= 20}
                />}
              </InputGroup>
              {type === "village" && server && search && <SearchVillage server={server} searchActive={searchActive} searchWorlds={searchWorlds} search={search} />}
              {type === "player" && server && search && <SearchPlayer server={server} searchActive={searchActive} searchWorlds={searchWorlds} search={search} />}
              {type === "ally" && server && search && <SearchAlly server={server} searchActive={searchActive} searchWorlds={searchWorlds} search={search} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
  )
}

function useRedirect() {
  const {server, type, search} = useParams()
  const navigate = useNavigate()

  return useCallback((typeNew: string | null, searchNew: string | null) => {
    navigate(formatRoute(SEARCH, {server: server, type: typeNew ?? type, search: searchNew ?? search ?? ""}))
  }, [server, type, search, navigate])
}
