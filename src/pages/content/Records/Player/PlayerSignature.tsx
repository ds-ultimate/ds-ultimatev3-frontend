import {useTranslation} from "react-i18next";
import {Button, Form} from "react-bootstrap";

import {useCallback, useState} from "react";
import {playerSignature} from "../../../../apiInterface/apiConf";
import {worldType} from "../../../../modelHelper/World";


export default function PlayerSignature({worldData, player_id}: {worldData: worldType, player_id: number}) {
  const {t} = useTranslation("ui")
  const [isExtended, setIsExtended] = useState(false)

  const switchExtended = useCallback(() => {
    setIsExtended((old) => !old)
  }, [setIsExtended])

  const sigRoute = playerSignature({server: worldData.server__code, world: worldData.name, player: (player_id + "")})
  const sigBBCode = `[url=${sigRoute}][img]${sigRoute}[/img][/url]`

  const sigContent = (
      <>
        <Form.Control className={"mb-2 mt-2"} type={"text"} disabled value={sigBBCode} />
        <Form.Label className={"me-3"}>{t("sigPreview")}</Form.Label>
        <img src={sigRoute} alt={"[" + t("signature") + "]"}/>
      </>
  )

  return (
      <>
        <Button variant={"secondary"} onClick={switchExtended}>{t("signature")}</Button>
        {isExtended && sigContent}
      </>
  )
}
