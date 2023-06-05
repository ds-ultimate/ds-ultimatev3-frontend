import {thousandsFormat} from "./UtilFunctions";
import {Line} from "react-chartjs-2";
import React from "react";
import useDatepickerLanguage from "./datepickerLanguage";
import {CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, TimeScale, Tooltip} from "chart.js";
import {Col} from "react-bootstrap";
import 'chartjs-adapter-date-fns';
import format from "date-fns/format";

ChartJS.register(
    TimeScale,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
);

export type chartDataType = Array<[string, number]>

type paramTypes = {
  data: chartDataType,
  inverted?: boolean,
}

export default function CustomChart({data, inverted}: paramTypes) {
  const dateLocale = useDatepickerLanguage()

  return (
      <Col xs={12} className={"pl-2 mt-2 position-relative"} style={{height: "250px"}}>
        <Line options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time',
              /*time: {
                displayFormats: {
                  This can change the x-Axis labels see: https://www.chartjs.org/docs/next/axes/cartesian/time.html#display-formats
                },
              },*/
              adapters: {
                date: {
                  locale: dateLocale
                }
              },
              ticks: {
                maxTicksLimit: 20,
              }
            },
            y: {
              type: 'linear',
              reverse: inverted === true,
              ticks: {
                callback: tickValue => thousandsFormat(+tickValue)
              }
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: tooltipItems => {
                  const firstItem = tooltipItems[0]
                  if(firstItem === undefined) return undefined
                  const timestamp = (firstItem.parsed as {x: number, y: number}).x
                  return format(timestamp, "dd.MM.yyyy HH:mm")
                },
                label: tooltipItem => {
                  return " " + thousandsFormat((tooltipItem.raw as {x: number, y: number}).y)
                }
              }
            }
          }
        }} data={{
          datasets: [
            {
              data: data.map(([d, v]) => ({x: d, y: v})),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        }} />
      </Col>
  )
}
