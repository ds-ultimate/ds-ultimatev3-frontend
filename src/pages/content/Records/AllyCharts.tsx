import {useTranslation} from "react-i18next";
import {Card, Col, Row} from "react-bootstrap";
import ErrorPage from "../../layout/ErrorPage";
import {allyBasicDataType} from "../../../modelHelper/Ally";
import {worldType} from "../../../modelHelper/World";
import React, {ReactNode, useState} from "react";
import {useAllyChartData} from "../../../apiInterface/loadContent";
import 'chartjs-adapter-date-fns';
import CustomChart, {chartDataType} from "../../../util/CustomChart";


export default function AllyCharts({allyData, worldData}: {allyData: allyBasicDataType, worldData: worldType | undefined}) {
  const {t} = useTranslation("ui")
  const [chartErr, chartData] = useAllyChartData(worldData?.server__code, worldData?.name, allyData.cur?.allyID + "")

  if(! allyData.cur) return <ErrorPage error={"internalerr"} />
  if(chartErr) return <ErrorPage error={chartErr} />

  return (
      <Row className={"justify-content-center"}>
        {chartData && <ChartSection
          charts={[
            [false, chartData.general.points, t("chart.title.points")],
            [true, chartData.general.rank, t("chart.title.rank")],
            [false, chartData.general.village, t("chart.title.village")],
          ]}
          title={t('table-title.general')}
        />}
        {chartData && <ChartSection
          charts={[
            [false, chartData.bash.gesBash, t("chart.title.gesBash")],
            [false, chartData.bash.offBash, t("chart.title.offBash")],
            [false, chartData.bash.defBash, t("chart.title.defBash")],
          ]}
          title={t('table-title.bashStats')}
        />}
      </Row>
  )
}

function ChartSection({charts, title}: {charts: Array<[boolean, chartDataType, ReactNode]>, title: ReactNode}) {
  const [selected, setSelected] = useState(0)
  const [inverted, selectedChart] = charts[selected]

  return (
      <Col xs={12} lg={6} className={"mt-3"}>
        <Card>
          <Card.Body>
            <Card.Title as={"h4"}>{title}</Card.Title>
            <select onChange={newValue => setSelected(+newValue.target.value)}>
              {charts.map(([_val, _t, opt], idx) => <option key={idx} value={idx}>{opt}</option>)}
            </select>
            <CustomChart data={selectedChart} inverted={inverted} />
          </Card.Body>
        </Card>
      </Col>
  )
}
