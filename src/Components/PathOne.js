import React from 'react';
import { Row, Col } from 'antd';
import StepComponent from './StepComponent';
import MenuPage from './Header';

const PathOne = (props) => {
  return (
    <div>
      <MenuPage />

      <Row justify="left">
        {/* <Col xs={24} sm={20} md={16} lg={12} xl={8}> */}
          {/* <LeftSidebar /> */}
        {/* </Col> */}
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <StepComponent />
        </Col>
      </Row>
    </div>
  );
}

export default PathOne;
