import React from 'react';
import Header from './Header';
import { Empty, Col, Row, Radio, Timeline, Card } from 'antd';
import { DragOutlined, DeleteOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const { Meta } = Card;

const MySavedTrip = () => {
  const isTripSaved = true; // Replace with your logic to check if a trip is saved
  const tripDuration = 5;

  // Array of timeline items with draggable cards
  const timelineItems = Array.from({ length: tripDuration }, (_, index) => ({
    id: `day-${index + 1}`,
    label: `Day ${index + 1}`,
    content: (
      <Draggable draggableId={`day-${index + 1}`} index={index}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <Card
              style={{
                width: 300,
              }}
              cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
              actions={[
                <DragOutlined key="drag" />,
                <DeleteOutlined key="delete" />,
              ]}
            >
              <Meta title={`Activities for Day ${index + 1}`} description="This is the description" />
            </Card>
          </div>
        )}
      </Draggable>
    ),
  }));

  return (
    <div>
      <Header />
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <div className="my-trip-container">
            <h2>My Saved Trip</h2>
            {isTripSaved ? (
              <DragDropContext>
                <Droppable droppableId="timeline">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Timeline mode="left">
                        {timelineItems.map((item, index) => (
                          <Timeline.Item key={item.id} label={item.label}>
                            <span>{item.content}</span>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <Empty description="No trip saved" />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MySavedTrip;
