
import {Link} from "react-router-dom";
import {formatRoute} from "../../../../util/router";
import {VILLAGE_CONQUER} from "../../../../util/routes";
import {CustomTooltip, nf} from "../../../../util/UtilFunctions";
import {worldType} from "../../../../modelHelper/World";
import {Tooltip} from "react-bootstrap";
import {useTranslation} from "react-i18next";

type paramTypesPlayerConquer = {
  village_id: number,
  world: worldType,
  conquer: {
    total: number,
  },
}

export function LinkVillageConquer({village_id, world, conquer}: paramTypesPlayerConquer) {
  const {t} = useTranslation("ui")

  return (
      <>
        <CustomTooltip overlay={<Tooltip>{t("conquer.highlight.total")}</Tooltip>}>
          <Link to={formatRoute(VILLAGE_CONQUER, {server: world.server__code, world: world.name, village: (village_id + ""), type: "all"})}>
            {nf.format(conquer.total)}
          </Link>
        </CustomTooltip>
      </>
  )
}
