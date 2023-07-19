import React, { useState } from 'react';
import Header from './Header';
import { Empty, Col, Row, Card, Timeline } from 'antd';
import { DragOutlined, DeleteOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

const { Meta } = Card;

const MySavedTrip = async () => {

const response = await axios.post('http://localhost:3000/api/useritinerary', {
        "userEmail":  "example@example.com",
    });

const resultData = response.data;
console.log(resultData)


  const isTripSaved = true; // Replace with your logic to check if a trip is saved

  const [droppableCards, setDroppableCards] = useState([
    {
      id: 'droppable1',
      title: 'Droppable 1',
      cards: [
        { id: 'card1', title: 'Card 1', description: 'This is Card 1', day: 1 },
        { id: 'card2', title: 'Card 2', description: 'This is Card 2', day: 1 },
      ],
    },
    {
      id: 'droppable2',
      title: 'Droppable 2',
      cards: [
        { id: 'card3', title: 'Card 3', description: 'This is Card 3', day: 2 },
        { id: 'card4', title: 'Card 4', description: 'This is Card 4', day: 2 },
      ],
    },
  ]);

  const handleDragEnd = (result) => {
    if (!result.destination) return; // Dragged outside of a drop area

    const sourceDroppableId = result.source.droppableId;
    const destinationDroppableId = result.destination.droppableId;
    const draggableId = result.draggableId;

    if (sourceDroppableId === destinationDroppableId) {
      // Reorder cards within the same droppable container
      const updatedDroppableCards = droppableCards.map((droppable) => {
        if (droppable.id === sourceDroppableId) {
          const cards = [...droppable.cards];
          const [draggedCard] = cards.splice(result.source.index, 1);
          cards.splice(result.destination.index, 0, draggedCard);

          return {
            ...droppable,
            cards: cards,
          };
        } else {
          return droppable;
        }
      });

      setDroppableCards(updatedDroppableCards);
    } else {
      // Move card between droppable containers
      const sourceDroppableIndex = droppableCards.findIndex((item) => item.id === sourceDroppableId);
      const destinationDroppableIndex = droppableCards.findIndex((item) => item.id === destinationDroppableId);
      const sourceDroppable = droppableCards[sourceDroppableIndex];
      const destinationDroppable = droppableCards[destinationDroppableIndex];
      const sourceCards = [...sourceDroppable.cards];
      const destinationCards = [...destinationDroppable.cards];
      const [draggedCard] = sourceCards.splice(result.source.index, 1);
      destinationCards.splice(result.destination.index, 0, draggedCard);

      const updatedDroppableCards = [...droppableCards];
      updatedDroppableCards[sourceDroppableIndex] = {
        ...sourceDroppable,
        cards: sourceCards,
      };
      updatedDroppableCards[destinationDroppableIndex] = {
        ...destinationDroppable,
        cards: destinationCards,
      };

      setDroppableCards(updatedDroppableCards);
    }
  };

  return (
    <div>
      <Header />
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <div className="my-trip-container">
            <h2>My Saved Trip</h2>
            {isTripSaved ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Timeline>
                  {droppableCards.map((droppable) => (
                    <Timeline.Item key={droppable.id}>
                      <h3>{droppable.title}</h3>
                      <Droppable droppableId={droppable.id}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="card-container" // Add className for styling
                          >
                            {droppable.cards.map((card, index) => (
                              <Draggable key={card.id} draggableId={card.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <Card
                                      style={{ width: '100%' }}
                                      actions={[
                                        <DragOutlined key="drag" />,
                                        <DeleteOutlined key="delete" />,
                                      ]}
                                    >
                                      <Meta title={card.title} description={card.description} />
                                    </Card>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </Timeline.Item>
                  ))}
                </Timeline>
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
