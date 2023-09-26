import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {faBug} from "@fortawesome/free-solid-svg-icons/faBug";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";
import {faCode} from "@fortawesome/free-solid-svg-icons/faCode";
import {cacheable} from "../apiInterface/MainDatabase"

export type changelogType = cacheable & {
  id: number,
  version: string,
  title: string,
  de: string | null,
  en: string | null,
  repository_html_url: string,
  color: string,
  created_at: number,
  icon: "code" | "bug" | "git" ,
}

export function ChangelogIcon({data}: {data: changelogType}) {
  switch (data.icon) {
    case "bug":
      return <FontAwesomeIcon icon={faBug} />
    case "code":
      return <FontAwesomeIcon icon={faCode} />
    default:
      return <FontAwesomeIcon icon={faGithub} />
  }
}
