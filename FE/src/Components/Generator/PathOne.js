import React from "react";
import { Row, Col } from "antd";
import StepComponent from "./StepComponent";
import Header from "../Header/Header";
import BigBenBottom from "../Images/BigBenBottom.png";

const PathOne = () => {
  return (
    <div>
    <div
      style={{
        backgroundImage: `url(${BigBenBottom})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh", // Adjust this to set the minimum height of the container
      }}>
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
    </div>
    </div>
  );
};

export default PathOne;
