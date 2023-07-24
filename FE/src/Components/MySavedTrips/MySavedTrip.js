import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./MySavedTrip.css";
import { Card, Col, Empty, Row, Timeline } from "antd";
import { DragOutlined, EditOutlined, SyncOutlined } from "@ant-design/icons";
import { ItineraryContext } from "../Generator/ItineraryContext";
import Header from "../Header/Header";
import { isValidToken } from "../tokenUtils";

const { Meta } = Card;

const MySavedTrip = () => {
  const jwt = require("jsonwebtoken");
  const [cookies] = useCookies(["token"]);

  const { destinationValue } = useContext(ItineraryContext);

  const [result, setResult] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [droppableCards, setDroppableCards] = useState([]);
  let resultData = [];
  const navigate = useNavigate();

  useEffect(() => {
    if (destinationValue) {
      getCoordinatesForDestination(destinationValue);
    }
  });

  async function getCoordinatesForDestination(destination) {
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: destination }, (results, status) => {
        if (status === "OK" && results[0]) {
          const { lat, lng } = results[0].geometry.location;
          setLatitude(Number(lat())); // Convert the lat value to a valid number
          setLongitude(Number(lng())); // Convert the lng value to a valid number
          if (!center) {
            setCenter({ lat: latitude, lng: longitude });
          }
        }
      });
    } catch (error) {
      console.log("Error fetching coordinates for destination:", error);
    }
  }

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    return date.toLocaleString("en-US", options);
  }

  const onLoad = async () => {
    const token = cookies.token;

    async function checkTokenAndNavigate() {
      try {
        if (token && isValidToken(token)) {
          const decodedToken = jwt.decode(token);
          // You can use the decodedToken here if needed
          return decodedToken;
        } else {
          navigate("/login");
          return;
        }
      } catch (error) {
        // Handle any errors that occur during token validation or decoding
        console.error("Error occurred during token validation:", error);
        // Handle the error accordingly (e.g., show an error message to the user)
        // Example: setErrorState(true);
      }
    }

    const decodedToken = await checkTokenAndNavigate();
    console.log(decodedToken.userId);
    if (decodedToken) {
      const response = await axios.post(
        "http://localhost:3000/api/useritinerary",
        {
          userId: decodedToken.userId,
        }
      );

      resultData = response.data;
      console.log(resultData);
      setResult(resultData);
    }

    const newDroppableCards = resultData.flatMap((itinerary, index) => ({
      id: `result-cards-${index}`,
      title: `Saved On ${formatTimestamp(itinerary.createdAt)}`,
      cards: Array.isArray(itinerary.itineraries[0]) // Check if itineraries is an array of arrays
        ? itinerary.itineraries.flatMap((items, itemIndex) =>
            items.map((item, subItemIndex) => ({
              id: `result-card-${index}-${itemIndex}-${subItemIndex}-attraction`,
              type: "Attraction",
              title: item.title || "Unknown",
              description: {
                description:
                  item.description?.description || "No description available",
                location: {
                  Latitude: item.description?.location?.Latitude || "Unknown",
                  Longitude: item.description?.location?.Longitude || "Unknown",
                },
                sojournTime: item.description?.sojournTime || "Unknown",
              },
            }))
          )
        : itinerary.itineraries.map((item, itemIndex) => ({
            id: `result-card-${index}-${itemIndex}-attraction`,
            type: "Attraction",
            title: item.title || "Unknown",
            subtitle: item.subtitle || "Unknown", // Set the subtitle for each attraction
            description: {
              description:
                item.description?.description || "No description available",
              location: {
                Latitude: item.description?.location?.Latitude || "Unknown",
                Longitude: item.description?.location?.Longitude || "Unknown",
              },
              sojournTime: item.description?.sojournTime || "Unknown",
            },
          })),
    }));

    console.log(newDroppableCards);
    setDroppableCards(newDroppableCards);
    renderResultCards();
  };

  useEffect(() => {
    onLoad();
  });

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
          <div className="header">
            <h1>Saved Trips</h1>
          </div>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <div className="timeline">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Timeline>
                  {droppableCards.map((droppable, i) => (
                    <Timeline.Item key={droppable.id}>
                      <h3>{droppable.title}</h3>
                      <Row type="flex">
                        <Droppable droppableId={droppable.id}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="card-container" // Add className for styling
                            >
                              {droppable.cards.map((card, index) => (
                                <Draggable
                                  key={card.id}
                                  draggableId={card.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <Col
                                        span={24}
                                        xs={24}
                                        sm={24}
                                        md={24}
                                        lg={24}
                                        xl={24}
                                      >
                                        <Card
                                          style={{ width: "100%" }}
                                          actions={[
                                            <DragOutlined key="drag" />,
                                            <EditOutlined
                                              key={`edit-${index}`}
                                              onClick={() =>
                                                handleEdit(
                                                  i,
                                                  index,
                                                  "title",
                                                  "new value"
                                                )
                                              }
                                            />,
                                          ]}
                                        >
                                          <Meta
                                            title={
                                              <div className="custom-card-title">
                                                {" "}
                                                {card.title}{" "}
                                              </div>
                                            }
                                            description={
                                              <div className="custom-card-description">
                                                <p>
                                                  Description:{" "}
                                                  {card.description.description}
                                                </p>
                                                <p>
                                                  Location:{" "}
                                                  {`${card.description.location.Latitude}, ${card.description.location.Longitude}`}
                                                </p>
                                                <p>
                                                  Sojourn Time:{" "}
                                                  {card.description.sojournTime}
                                                </p>
                                              </div>
                                            }
                                          />
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
        </div>
      );
    }

    return <Empty description="No result available" />;
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return; // Dragged outside of a drop area

    const sourceDroppableId = result.source.droppableId;
    const destinationDroppableId = result.destination.droppableId;

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
      const sourceDroppableIndex = droppableCards.findIndex(
        (item) => item.id === sourceDroppableId
      );
      const destinationDroppableIndex = droppableCards.findIndex(
        (item) => item.id === destinationDroppableId
      );
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
      <Row justify="left">
        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
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
                            <Draggable
                              key={card.id}
                              draggableId={card.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Card
                                    style={{ width: "100%" }}
                                    actions={[
                                      <DragOutlined key="drag" />,
                                      // <DeleteOutlined key="delete" />,
                                      <EditOutlined key="edit" />,
                                      <SyncOutlined key="" />,
                                    ]}
                                  >
                                    <Meta
                                      title={card.title}
                                      description={
                                        <div>
                                          <p>
                                            Description:{" "}
                                            {card.description.description}
                                          </p>
                                          <p>
                                            Location:{" "}
                                            {`${card.description.location.Latitude}, ${card.description.location.Longitude}`}
                                          </p>
                                          <p>
                                            Sojourn Time:{" "}
                                            {card.description.sojournTime}
                                          </p>
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
                ))}
              </Timeline>
            </DragDropContext>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MySavedTrip;
