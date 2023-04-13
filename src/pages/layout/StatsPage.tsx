import React, {ReactNode} from 'react';
import {Card, Col, Row} from "react-bootstrap";

export default function StatsPage({title, table}: {title: ReactNode, table: ReactNode}) {
  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col md={5} className={"p-lg-5 mx-auto my-1 text-center"}>
            <h1 className={"fw-normal"}>
              {title}
            </h1>
          </Col>
        </Col>
        <Col xs={12} className={"mt-2"}>
          <Card>
            <Card.Body>
              {table}
            </Card.Body>
          </Card>
        </Col>
      </Row>
  )
}
