import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MySavedTrip.css";
import { Card, Col, Empty, Row, Timeline, Button } from "antd";
import { ItineraryContext } from "../Generator/ItineraryContext";
import Header from "../Header/Header";
import { isValidToken } from "../tokenUtils";
import Cookies from "js-cookie";
import { ArrowLeftOutlined } from "@ant-design/icons";


const { Meta } = Card;
let decodedToken = "";

const TripDetail = () => {
  const location = useLocation();
  const { selectedItinerary } = location.state || {};
  const jwt = require("jsonwebtoken");
  console.log("Component start");
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
  }, []);

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

   const handleGoBack = () => {
    navigate("/my-saved-trip");
  };

  const onLoad = async () => {
    const token = Cookies.get("token");

    function checkTokenAndNavigate() {
      try {
        if (token && isValidToken(token)) {
          const dToken = jwt.decode(token);
          return dToken;
        } else {
          navigate("/login");
          return;
        }
      } catch (error) {
        console.error("Error occurred during token validation:", error);
      }
    }

    decodedToken = await checkTokenAndNavigate();

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
      cards: Array.isArray(itinerary.itineraries[0])
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
            subtitle: item.subtitle || "Unknown",
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
  };

  useEffect(() => {
    onLoad();
  }, []);

  const renderResultCards = () => {
    if (result && result.length > 0) {
      const cards = droppableCards[0].cards;

      if (cards.length === 0) {
        return <Empty description="No result available" />;
      }

      return (
        <div>
          <div className="header">
          </div>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <div className="timeline-container">
              <Timeline className="timeline">
                {droppableCards.map((droppable, i) => (
                  <Timeline.Item key={droppable.id}>
                    <Row type="flex">
                      <div className="card-container">
                        {droppable.cards.map((card, index) => (
                          <div key={card.id}>
                            <Col span={24} xs={24} sm={24} md={24} lg={24} xl={24}>
                              <Card style={{ width: "100%" }}>
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
                        ))}
                      </div>
                    </Row>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </Col>
        </div>
      );
    }

    return <Empty description="No result available" />;
  };

  return (
    <div>
      <Header />
      <div className="My-saved-trip">
        <div className="text-and-button">
          <div className="centered-container">
            <Button type="link" onClick={handleGoBack}>
            <ArrowLeftOutlined /> Back to My Saved Trips
            </Button>
            {/* <h1 className="heading">{`destination: ${result[index]?.destination}`} || "Saved Trips"}</h1> */}
          </div>
        </div>
        <Row justify="left">
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <div className="timeline">
              <Timeline>
                  <Timeline.Item key={"selected-itinerary"}>
                    <Row type="flex">
                      <div className="card-container">
                      {selectedItinerary.map((card, index) => (
                          <div key={card.id}>
                            <Col span={24} xs={24} sm={24} md={24} lg={24} xl={24}>
                              <Card style={{ width: "100%" }}>
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
                            </Col>
                          </div>
                        ))}
                      </div>
                    </Row>
                  </Timeline.Item>
              </Timeline>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TripDetail;
