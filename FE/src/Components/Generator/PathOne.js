import React from "react";
import { Row, Col } from "antd";
import StepComponent from "./StepComponent";
import Header from "../Header/Header";
import BigBenBottom from "../Images/BigBenBottom.png";

const PathOne = () => {
  return (
    <div>
      <Header />
      <Row>
        <Col
          xs={24}
          sm={16}
          md={16}
          lg={16}
          xl={16}
          style={{ paddingRight: "20px" }}
        >
          <StepComponent />
        </Col>
        {/* <Col xs={0} sm={8} md={8} lg={8} xl={8} style={{ marginTop: '100px' }}>
          <img
            src={travel}
            style={{ width: '100%', height: 'auto' }}
          />
        </Col> */}
      </Row>
      {/* bottom image */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          marginLeft: 0,
        }}
      >
        <img
          src={BigBenBottom}
          alt="Big Ben"
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
};

export default PathOne;
