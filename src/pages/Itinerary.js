import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, Col, Empty, Input, Row, Timeline } from 'antd';
import { DragOutlined, EditOutlined, SyncOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import { ItineraryContext } from '../Components/ItineraryContext';
import Header from '../Components/Header';

const { Meta } = Card;

const Itinerary = () => {
  const { destinationValue } = useContext(ItineraryContext);

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
const [droppableCards, setDroppableCards] = useState([]);

  useEffect(() => {
    if (destinationValue) {
      getCoordinatesForDestination(destinationValue);
    }
  }, [destinationValue]);

  async function getCoordinatesForDestination(destination) {
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: destination }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          const latitude = Number(lat()); // Convert the lat value to a valid number
          const longitude = Number(lng()); // Convert the lng value to a valid number
          setLatitude(latitude);
          setLongitude(longitude);
          setCenter({ lat: latitude, lng: longitude });
        }
      });
    } catch (error) {
      console.log('Error fetching coordinates for destination:', error);
    }
  }

 const handleSubmit = async () => {
  setIsLoading(true);

  try {
    const response = await axios.post('http://localhost:3000/api/itinerary', {
      destinationValue: "Paris",
      dayValue: "3",
    });

    const resultData = response.data;
    console.log(resultData);
    setResult(resultData);

    const newDroppableCards = resultData.map((itinerary, index) => ({
      id: `result-cards-${index}`,
      title: `Day ${index + 1}`,
      cards: itinerary.itineraries.flatMap((item, itemIndex) => [
        {
          id: `result-card-${index}-${itemIndex}-attraction`,
          type: "Attraction",
          title: item.attraction1?.["Attraction Name"] || "Unknown",
          description: {
            description: item.attraction1?.Summary || "No description available",
            location: item.attraction1?.Location.latitude && item.attraction1?.Location.longitude || "Unknown",
            sojournTime: item.attraction1?.["Recommended Sojourn Time"] || "Unknown",
          },
        },
        {
          id: `result-card-${index}-${itemIndex}-restaurant`,
          type: "Restaurant",
          title: item.restaurant1?.["Restaurant Name"] || "Unknown",
          description: {
            description: item.restaurant1?.Summary || "No description available",
            location: item.restaurant1?.Location || "Unknown",
            sojournTime: item.restaurant1?.["Recommended Sojourn Time"] || "Unknown",
          },
        },
      ]),
    }));

    setDroppableCards(newDroppableCards);

  } catch (error) {
    console.log('Error generating itinerary:', error);
    setResult('Something went wrong. Please try again.');
  } finally {
    setIsLoading(false);
  }
};



  const handleReset = () => {
    setResult(null);
  };

  const formatResult = (result) => {
    // Format the result as needed
     return JSON.stringify(result, null, 2); // Convert object to a pretty-printed JSON string
};

  const handleEdit = (cardIndex, field, value) => {
    const updatedDroppableCards = droppableCards.map((droppable) => {
      const updatedCards = droppable.cards.map((card, index) => {
        if (index === cardIndex) {
          return {
            ...card,
            [field]: value,
          };
        }
        return card;
      });

      return {
        ...droppable,
        cards: updatedCards,
      };
    });

    setDroppableCards(updatedDroppableCards);
  };

const renderResultCards = () => {
  if (result && result.length > 0) {
    const cards = droppableCards[0].cards; // Use the cards array from droppableCards

    if (cards.length === 0) {
      return <Empty description="No result available" />;
    }

    return (
      <Timeline mode="left">
        <Timeline.Item>
          <h3>Result Cards</h3>
          <Droppable droppableId="result-cards">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="card-container">
                {cards.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <Card
                          style={{ width: '100%' }}
                          actions={[
                            <DragOutlined key="drag" />,
                            // <DeleteOutlined key="delete" />,
                            <EditOutlined key="edit" />,
                            <SyncOutlined key="" />
                          ]}
                        >
                          <Meta title={card.title} description = {
<div>
  <p>Description: {card.description.description}</p>
  <p>Location: {card.description.location}</p>
  <p>Sojourn Time: {card.description.sojournTime}</p>
</div>
                          }
/>
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
      </Timeline>
    );
  }

  return <Empty description="No result available" />;
};


  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

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

  const defaultActions = [
    <DragOutlined key="drag" />,
    <EditOutlined key="edit" />,
    <SyncOutlined key="sync" />,
  ];

  return (

    <div>
      <Header />
      <Row justify="center">
        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
          <div className="my-trip-container">
            <h1>Generated Itinerary</h1>
            <p>Reorder the items or press the edit icon to generate another activity!</p>
            <Button onClick={handleSubmit}>Generate Itinerary</Button>
            <Button onClick={handleReset}>Reset</Button>
          </div>
          <div className="timeline">
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
                                      // <DeleteOutlined key="delete" />,
                                      <EditOutlined key ="edit" />,
                                      <SyncOutlined key ="" />
                                    ]}
                                  >
                                    <Meta title={card.title} description={
                                    <div> 
                                      <p>Description: {card.description.description}</p>
                                <p>Location: {`${card.description.location.Latitude}, ${card.description.location.Longitude}`}</p>
                                      <p>Sojourn Time: {card.description.sojournTime}</p>
                                    </div>
                                    } />
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
          </div>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
          <div className="container-right">
            <div className="loader" style={{ display: isLoading ? 'block' : 'none' }}></div>
            {/* {result ? (
              <div>
                <h2>Result as Text:</h2>
                <pre>{formatResult(result)}</pre>
              </div>
            ) : null}
          </div> */}
            {isLoaded && latitude && longitude ? (
              <GoogleMap
                mapContainerStyle={{
                  width: '100%',
                  height: '50vh',
                }}
                center={center}
                zoom={19}
                onClick={(ev) => {
                  console.log('latitude = ', ev.latLng.lat());
                  console.log('longitude = ', ev.latLng.lng());
                }}
              />
            ) : null} </div>
        </Col>
      </Row>
    </div>
  );
};

export default Itinerary;
