import {useTranslation} from "react-i18next";
import {Row} from "react-bootstrap";
import ErrorPage, {GenericFrontendError} from "../../../layout/ErrorPage";
import {playerBasicDataType} from "../../../../modelHelper/Player";
import {worldType} from "../../../../modelHelper/World";
import {usePlayerChartData} from "../../../../apiInterface/loadContent";
import {ChartSection} from "../Util";


export default function PlayerCharts({playerData, worldData}: {playerData: playerBasicDataType, worldData: worldType | undefined}) {
  const {t} = useTranslation("ui")
  const [chartErr, chartData] = usePlayerChartData(worldData?.server__code, worldData?.name, playerData.cur?.playerID + "")

  if(! playerData.cur) return <ErrorPage error={GenericFrontendError} />
  if(chartErr) return <ErrorPage error={chartErr} />

  return (
      <Row className={"justify-content-center"}>
        <ChartSection
          charts={[
            [false, chartData?.general.points, t("chart.title.points")],
            [true, chartData?.general.rank, t("chart.title.rank")],
            [false, chartData?.general.village, t("chart.title.village")],
          ]}
          title={t('table-title.general')}
        />
        <ChartSection
          charts={[
            [false, chartData?.bash.gesBash, t("chart.title.gesBash")],
            [false, chartData?.bash.offBash, t("chart.title.offBash")],
            [false, chartData?.bash.defBash, t("chart.title.defBash")],
            [false, chartData?.bash.supBash, t("chart.title.supBash")],
          ]}
          title={t('table-title.bashStats')}
        />
      </Row>
  )
}
