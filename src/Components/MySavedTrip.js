import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, Col, Empty, Input, Row, Timeline, Modal, message } from 'antd';
import { DragOutlined, EditOutlined, SyncOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import { ItineraryContext } from '../Components/ItineraryContext';
import Header from '../Components/Header';
import Map from '../Components/map';
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom';
import { isValidToken } from "../Components/tokenUtils";
const jwt = require('jsonwebtoken');



const { Meta } = Card;

const Itinerary = () => {



  const jwt = require('jsonwebtoken');
  const { parse } = require('cookie')
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const token = cookies.token;

  const { destinationValue, durationValue } = useContext(ItineraryContext);

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [droppableCards, setDroppableCards] = useState([]);
  const [isMapLoading, setIsMapLoading] = useState(false);
  let resultData = []

  useEffect(() => {
    if (destinationValue) {
      getCoordinatesForDestination(destinationValue);
    }
  }, [destinationValue]);

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


  const onLoad = async () => {

    try {
      console.log(cookies.token)
      const decodedToken = jwt.decode(cookies.token);
      console.log(decodedToken)
    } catch (error) {
      console.error('Error decoding token:', error);
      // Handle the error
    }

    const decodedToken = jwt.decode(cookies.token);

    alert(decodedToken.userId)

    const response = await axios.post('http://localhost:3000/api/useritinerary', {
      userId: decodedToken.userId,
    });

    const resultData = response.data;
    console.log(resultData);
    setResult(resultData);

    const newDroppableCards = resultData.flatMap((itinerary, index) => ({
      id: `result-cards-${index}`,
      title: `Saved Time ${itinerary.createdAt}`,
      cards: itinerary.itineraries.flatMap((items, itemIndex) =>
        items.map((item, subItemIndex) => ({
          id: `result-card-${index}-${itemIndex}-${subItemIndex}-attraction`,
          type: "Attraction",
          title: item.title || "Unknown",
          subtitle: itinerary.destination, // Set the subtitle here (example: using destination from itinerary)
          description: {
            description: item.description?.description || "No description available",
            location: {
              Latitude: item.description?.location?.Latitude || "Unknown",
              Longitude: item.description?.location?.Longitude || "Unknown",
            },
            sojournTime: item.description?.sojournTime || "Unknown",
          },
        }))
      ),
    }));
    
    // Example Usage
    console.log(newDroppableCards);
    
    
    // Example Usage
    console.log(newDroppableCards);
    
    

    setDroppableCards(newDroppableCards);
    renderResultCards();

  }

  useEffect(() => {
    onLoad();
  }, []);



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
        <div>
          <Col className="gutter-row" span={12} xs={24} sm={12} md={12} lg={12} xl={12}>
            <div className="timeline">
              <DragDropContext onDragEnd={handleDragEnd}>

                <Timeline>
                  {droppableCards.map((droppable, i) => (
                    <Timeline.Item key={droppable.id}>
                      <h3>{droppable.title}</h3>
                      <Row type="flex" >
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
                                      <Col span={24} xs={24} sm={12} md={12} lg={24} xl={24}>
                                        <Card

                                          style={{ width: '100%' }}
                                          actions={[
                                            <DragOutlined key="drag" />,
                                            <EditOutlined key={`edit-${index}`} onClick={() => handleEdit(i, index, 'title', 'new value')} />,

                                          ]}
                                        >
                                          <Meta
                                            title={
                                              <div className="custom-card-title"> {card.title} </div>}
                                            description={
                                              <div className="custom-card-description">
                                                <p>Description: {card.description.description}</p>
                                                <p>Location: {`${card.description.location.Latitude}, ${card.description.location.Longitude}`}</p>
                                                <p>Sojourn Time: {card.description.sojournTime}</p>
                                              </div>
                                            } />

                                        </Card>
                                      </Col>
                                    </div>
                                  )}
                                </Draggable>
                              ))}

                              {provided.placeholder}
                            </div>

                          )}
                        </Droppable>
                      </Row>
                    </Timeline.Item>
                  ))}
                </Timeline>

              </DragDropContext>
            </div>
          </Col>

          <Col className="gutter-row" span={12} xs={24} sm={12} md={12} lg={12} xl={12}>
            <div className="container-right">
              <div className="loader" style={{ display: isLoading ? 'block' : 'none' }}></div>
              {/* {result ? (
            <div>
                      <h2>Result as Text:</h2>
                      <pre>{formatResult(result)}</pre>
                    </div>
                  ) : null}
            </div> 
        */}
              {isMapLoading && isLoaded && latitude && longitude ? (
                <Map isLoaded={true} latitude={latitude} longitude={longitude} center={{ lat: latitude, lng: longitude }} resultData={resultData} />
              ) : null}
            </div>
          </Col>
        </div>


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
                                      <EditOutlined key="edit" />,
                                      <SyncOutlined key="" />
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
              <Map
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
}

export default Itinerary;
