import {useEffect, useState} from "react";
import {ServerFlag, serverType} from "../../modelHelper/Server";
import {newsType} from "../../modelHelper/News";
import {useTranslation} from "react-i18next";
import {getIndexPageData} from "../../apiInterface/loadContent";
import {Link} from "react-router-dom";
import {formatRoute} from "../../util/router";
import {SERVER} from "../../util/routes";
import {Card, Carousel, Col, Row, Table} from "react-bootstrap";

import styles from "./Index.module.scss"

export default function IndexPage() {
  const [data, setData] = useState<{ servers: serverType[], news: newsType[] }>({servers: [], news: []})
  const [t, i18n] = useTranslation("ui")

  useEffect(() => {
    let mounted = true
    getIndexPageData()
        .then(data => {
          if(mounted) {
            setData(data)
          }
        })

    return () => {
      mounted = false
    }
  }, [])

  let news: JSX.Element | undefined = undefined
  if(data.news) {
    news = (
        <Row className="justify-content-center">
          <Col xs={12} md={10} className={"mt-1 mb-3"}>
            <Carousel className={"rounded " + styles.newsBorder}>
              {data.news.map(n => {
                const n_content = (i18n.language === "de")?n.content_de:n.content_en
                return (
                    <Carousel.Item key={n.id}>
                      <Card>
                        <Card.Body>
                          <Card.Title className={"text-center"}>{t('news.title')}:</Card.Title>
                          <div className={"text-center"} dangerouslySetInnerHTML={{__html: n_content}}></div>
                        </Card.Body>
                      </Card>
                    </Carousel.Item>
                )
              })}
            </Carousel>
          </Col>
        </Row>
    )
  }

  let servers: JSX.Element[] | undefined = undefined
  if(data.servers) {
    servers = data.servers.map(s => {
      return (
          <tr key={s.code}>
            <td><ServerFlag server={s} /></td>
            <td>{s.code}</td>
            <td className={styles.dsLinkTruncate}><a href={s.url}>{s.url}</a></td>
            <td>{s.world_cnt}</td>
            <td><Link to={formatRoute(SERVER, {server: s.code})} className={"btn btn-primary btn-sm"}>{t('server.show')}</Link></td>
          </tr>
      )
    })
  }

  return (
      <>
        <Row className="justify-content-center">
          <Col xs={12}>
            <Col md={5} className={"p-lg-3 mx-auto my-1 text-center"}>
              <h1 className={"fw-normal"}>DS-Ultimate</h1>
            </Col>
          </Col>
        </Row>
        {news}
        <Row className="justify-content-center">
          <Col xs={12} lg={6} className={"mt-2"}>
            <Card>
              <Card.Body>
                {t("index.help")}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12} lg={9} xl={6} className={"mt-2"}>
            <Card>
              <Card.Body className={"table-responsive"}>
                <Card.Title as={"h2"}>{t("server.choose")}:</Card.Title>
                <Table striped hover>
                  <thead>
                  <tr>
                    <th></th>
                    <th>{t('server.code')}</th>
                    <th>{t('server.dsLink')}</th>
                    <th>{t('server.worlds')}</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  {servers}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
  )
};
