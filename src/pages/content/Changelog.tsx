import React from "react";
import {useTranslation} from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styles from "./Changelog.module.scss"
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {faClock} from "@fortawesome/free-solid-svg-icons";
import {ChangelogIcon, changelogType} from "../../modelHelper/Changelog";
import ErrorPage from "../layout/ErrorPage";
import {useChangelogPageData} from "../../apiInterface/loadContent";

export default function ChangelogPage() {
  const [dataErr, data] = useChangelogPageData()
  if(dataErr) return <ErrorPage error={dataErr} />

  return (
      <div className={"pt-3"}>
        <Timeline data={data} />
      </div>
  )
}

function Timeline({data}: {data: changelogType[]}) {
  const {i18n} = useTranslation("ui")
  return (
      <>
        <ul className={styles.timeline} >
          {data.map((d, idx) => {
            return (
                <li className={ (idx%2===1)?styles.timelineInverted : '' } key={d.id}>
                  <div className={styles.timelineBadge} style={{backgroundColor: d.color}}>
                    <ChangelogIcon data={d} />
                  </div>
                  <div className={styles.timelinePanel}>
                    <div>
                      <div className={"d-none d-lg-block"}>
                        <div className={styles.timelineTitle + " d-flex"}>
                          <h4 className={"text-truncate"} style={{width: "70%"}}>{d.title}</h4>
                          <h4 className={"text-truncate"} style={{width: "30%"}}>
                            <small><b className={"float-end"}>{d.version}</b></small>
                          </h4>
                        </div>
                      </div>
                      <div className={"d-lg-none"}>
                        <h4>{d.title}</h4>
                        <h4>
                          <small><b>{d.version}</b></small>
                        </h4>
                      </div>
                      <p>
                        <small className={"text-muted"}>
                          <FontAwesomeIcon icon={faClock} />{" "}
                          <DateToDiff timestamp={d.created_at} />
                        </small>
                      </p>
                    </div>
                    <div className={styles.timelineBody}>
                      <p style={{whiteSpace: "pre-line"}} dangerouslySetInnerHTML={{__html: (
                          (i18n.language === "de") ? (d.de??d.en??"") : (d.en??d.de??"")
                        )}}>
                      </p>
                      {d.repository_html_url && (
                          <p className={"float-end"}>
                            <a className={"link-black"} style={{color: "black", fontSize: "1.75em"}} href={d.repository_html_url} target="_blank" rel={"noreferrer"}>
                              <FontAwesomeIcon icon={faGithub} />
                            </a>
                          </p>
                      )}
                    </div>
                  </div>
                </li>
            )
          })}
        </ul>
      </>
  )
}

const datePad = (n: number) => String(n).padStart(2, '0')

function DateToDiff({timestamp}: {timestamp: number}) {
  const dTime = new Date(timestamp * 1000)
  const p = datePad

  return (
      <>
        {p(dTime.getDate())}-{p(dTime.getMonth() + 1)}-{p(dTime.getFullYear())}
      </>
  )
}