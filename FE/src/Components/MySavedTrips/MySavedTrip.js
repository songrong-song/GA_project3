import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./MySavedTrip.css";
import { Card, Col, Empty, Row, message, Button } from "antd";
import { ItineraryContext } from "../Generator/ItineraryContext";
import Header from "../Header/Header";
import { isValidToken } from "../tokenUtils";
import Cookies from "js-cookie";
import axios from "axios";

const { Meta } = Card;
let decodedToken = "";

const MySavedTrip = () => {
  const jwt = require("jsonwebtoken");
  console.log("Component start");
  const { destinationValue } = useContext(ItineraryContext);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [result, setResult] = useState(null);
  const [droppableCards, setDroppableCards] = useState([]);
  const navigate = useNavigate();
  const [showTripDetails, setShowTripDetails] = useState(false); // Step 1: New state variable



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

  const handleDelete = async () => {
    // if (token && isValidToken(token))
    alert(decodedToken.userId);
    const response = await axios.post(
        "http://localhost:3000/api/useritinerary/deleteAllItinerary",
        {
          userID: decodedToken.userId,
        }
      );
      message.success("Itinerary deleted successfully");
      console.log("Deleted successfully");
      alert(JSON.stringify(response.data));
      return response.data;
    }
    
  const handleCardClick = (index) => {
    setShowTripDetails(true);  
    const selectedItinerary = result[index]?.itineraries;
    navigate("/trip-detail", { state: { selectedItinerary } });
  };


  const onLoad = async () => {
    const token = Cookies.get("token");

    function checkTokenAndNavigate() {
      try {
        if (token && isValidToken(token)) {
          const dToken = jwt.decode(token);
          // You can use the decodedToken here if needed
          return dToken;
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

    decodedToken = await checkTokenAndNavigate();

    if (decodedToken) {
      const response = await axios.post(
        "http://localhost:3000/api/useritinerary",
        {
          userId: decodedToken.userId,
        }
      );
      setResult(response.data);

      //saving itinerary
      const newDroppableCards = response.data.map((itinerary, index) => ({
        id: `result-cards-${index}`,
        title: `Saved On ${formatTimestamp(itinerary.createdAt)}`,
      }));

      setDroppableCards(newDroppableCards);
    }
  setDataLoaded(true)
  };

  useEffect(() => {
    onLoad();
  }, []);

  const renderFormattedTimestamps = () => {
  if (droppableCards.length > 0) {
    return droppableCards.map((droppable, index) => (
      <Card
        key={droppable.id} 
        className="timestamp-card" 
        style={{ marginBottom: "20px"}}
        >
        <Meta
          title={`Destination: ${result[index]?.destination}`}
          description= {
          <>
          {droppable.title}
          <Button type="link" onClick={() => handleCardClick(index)} style={{ float: "right" }}>
            View Itinerary
              </Button>
          </>
          }
        />
      </Card>
    ));
  }

  return null;
};

  const renderResultCards = () => {
    if (!dataLoaded) {
      return null;
    }
    if (droppableCards.length > 0) {
      return (
        <div>
          <Header />
          <div className="My-saved-trip">
            <div className="text-and-button">
              <div className="centered-container">
                <h1 className="heading"> Saved Trips</h1>
                <Button type="primary" danger onClick={() => handleDelete()} style={{ marginBottom: "20px"}} >
                  Delete All
                </Button>
              </div>
            </div>
            <Row justify="left">
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <div className="grid-cards-container">
                  {renderFormattedTimestamps()}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      );
    }

    return <Empty description="No result available" />;
  };

  return <div>{renderResultCards()}</div>;
};

export default MySavedTrip;
