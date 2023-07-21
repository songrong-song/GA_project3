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
import './Itinerary.css'
const jwt = require('jsonwebtoken');

const { Meta } = Card;
let resultData = []
const Itinerary = () => {

  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['token']); // Access cookies using the useCookies hook
  const token = cookies.token; // Access the token from the cookies
  const userID = jwt.decode(token).userID
  const { destinationValue, durationValue, selectedFood, selectedActivities  } = useContext(ItineraryContext);
  const [dayValue, setDayValue] = useState(0); 
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapLoading,setIsMapLoading] = useState(false);
  
  const [latitude, setLatitude] = useState(48.8566); // Default latitude for Paris
  const [longitude, setLongitude] = useState(2.3522); // Default longitude for Paris
  const [center, setCenter] = useState({ lat: 0, lng: 0 });


  //Cards
  const [droppableCards, setDroppableCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [editedContent, setEditedContent] = useState({
    title: "",
    description: "",
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // A state that tracks data loading for entire page


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


    const response = await axios.post('http://localhost:3000/api/itinerary', {

      "destinationValue": destinationValue,
      "dayValue": durationValue, }) 
      // "selectedActivities": selectedActivities,
      // "selectedFood": selectedFood) })

      if (response.status === 200) {
      resultData = response.data;
      console.log(resultData);
      setResult(resultData);

       const formatResult = (result) => {
    // Format the result as needed
     return JSON.stringify(result, null, 4); // Convert object to a pretty-printed JSON string
    };

    const generateDroppableAreas = (dayValue) => {
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
              location: item.attraction1?.Location || "Unknown",
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
        ]
        ),
      }));
      console.log(newDroppableCards);
      setIsMapLoading(true);
      try{
        setLatitude(parseFloat(resultData[0].itineraries[0].attraction1["Location"]["Latitude"]));
        setLongitude(parseFloat(resultData[0].itineraries[0].attraction1["Location"]["Longitude"]));
      }catch(e){
      }
      setDroppableCards(newDroppableCards);
    };

    generateDroppableAreas(dayValue);
  } else {
    console.log('Error generating itinerary:');
    setResult('Something went wrong. Please try again.');
  } 
    setIsLoading(false);


 }


  // New function to fetch updated data from the server
  const fetchUpdatedData = async () => {

    try {
      const response = await axios.post('http://localhost:3000/api/itinerary', {
        "destinationValue": String(destinationValue),
        "dayValue": String(durationValue), //d
        "selectedActivities": String(selectedActivities),
        "selectedFood": String(selectedFood)
      });
      return response.data;
    } catch (error) {
      console.log('Error fetching updated data:', error);
      throw error;
    }
  };

  // Function to handle sync icon click
 const handleSyncIconClick = async (cardIndex, itemIndex) => {
    setIsLoading(true);

      const updatedData = await fetchUpdatedData();

      // Update the specific card's information with the new data
      const updatedCard = {
        ...droppableCards[cardIndex].cards[itemIndex],
        title: updatedData[itemIndex].attraction1?.["Attraction Name"] || "Unknown",
        description: {
          description: updatedData[itemIndex].attraction1?.Summary || "No description available",
          location: updatedData[itemIndex].attraction1?.Location || "Unknown",
          sojournTime: updatedData[itemIndex].attraction1?.["Recommended Sojourn Time"] || "Unknown",
        },
      };

      // Update the droppableCards state with the updated card
      const updatedDroppableCards = droppableCards.map((droppable, index) => ({
        ...droppable,
        cards: index === cardIndex ? droppable.cards.map((card, itemIdx) => itemIdx === itemIndex ? updatedCard : card) : droppable.cards,
      }));
      setDroppableCards(updatedDroppableCards);
      setIsLoading(false);
      };



 const handleEdit = (droppableIndex, cardIndex, field, value) => {

   
    const cards = droppableCards[0]?.cards;

if (cards && Array.isArray(cards) && cards.length > 0) {

 console.log(cards);
} else {
  // The array is either empty or does not contain any object elements
  console.log("No cards found.");
}

 //update the editingCard and editedContent state
  const cardToEdit = droppableCards[droppableIndex].cards[cardIndex];

  setEditingCard(cardToEdit);
  setEditedContent({
    title: cardToEdit.title,
    draggableIndex: droppableIndex, 
    cardIndex: cardIndex,
    description: cardToEdit.description.description,
  });

    setIsEditModalVisible(true);
 };

const handleSaveEditedContent = async () => {

  try {
    if (!editingCard) {
      return; // no edits made
    }

    alert(JSON.stringify(editingCard));
    const draggableIndex = document.getElementById("edit-card-draggableIndex").value
    const cardIndex = document.getElementById("edit-card-cardIndex").value

    
    droppableCards[draggableIndex].cards[cardIndex].title = document.getElementById("edit-card-title").value;
    droppableCards[draggableIndex].cards[cardIndex].description.description = document.getElementById("edit-card-description").value;

    const updatedCard = {
      ...editingCard,
      description: {
        ...editingCard.description,
        description: editedContent.description,
      },
    };

    

    setDroppableCards(droppableCards);
    console.log(droppableCards);
    setIsEditModalVisible(false);
    setEditingCard(null);
    setEditedContent({
      title: "",
      description: "",
      draggableIndex: "", 
      cardIndex: ""
    });
  message.success('Card data updated successfully!');
  } catch (error) {
    console.log('Error saving edited content:', error);
    message.error('An error occurred while saving the card data. Please try again.');

  }
};

const handleCancelEdit = () => {
  // Close the modal and reset the states
  setIsEditModalVisible(false);
  setEditingCard(null);
  setEditedContent({
    title: "",
    description: "",
    draggableIndex: "", 
    cardIndex: ""
  });
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

  const isValidToken = (token) => {
    // Implement the logic to validate the token
    return true; // Replace with your actual token validation logic
  };

//saving itinerary
const handleSave = async () => {
  if (token && isValidToken(token)) {
    // Perform the save functionality here
    const cards = droppableCards[0]?.cards;
    if (cards && Array.isArray(cards) && cards.length > 0) {
      const cardContent = cards.map((card) => ({
        title: card.title,
        description: card.description,
      }));

      // Convert the card content to JSON string
      const jsonData = JSON.stringify(cardContent, null, 2);

      // Perform the saving operation with the jsonData
      console.log('Saving card content:', jsonData);

        try {
         
          const response = await axios.post('http://localhost:3000/api/useritinerary/saveItinerary', {
            "userID": userID,
            "destinationValue": destinationValue,
            "dayValue": durationValue, //d
            "itinerary":jsonData,

          });
          return response.data;

        } catch (error) {
          console.log('Error fetching updated data:', error);
          throw error;
        }
    
    } else {
      console.log('No cards found.');
    }
  } else {
    navigate('/loginPrompt');
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
    <Row>
      <Col xs={24} sm={12} md={12} lg={12} xl={8}>
      <div className="my-trip-container"/>
          <h1 className="trip-heading">Generated Itinerary</h1>
          <p className="trip-description">Reorder the items or press the edit icon to generate another activity!</p>
          <div className="button-container">
            <Button type="primary" onClick={handleSubmit}>Generate Itinerary</Button>
            <Button onClick={handleSave}>Save Itinerary</Button>
            </div>
          <div className="timeline">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Timeline>
                {droppableCards.map((droppable, i) => (
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
                                      <EditOutlined key={`edit-${index}`} onClick={() => handleEdit(i,index, 'title', 'new value')} />,
                                      <SyncOutlined key={`sync-${index}`} onClick={() => handleSyncIconClick(index)} />
                                    ]}
                                  >
                                  
                                    <Meta 
                                    title= {
                                    <div className = "custom-card-title"> {card.title} </div>} 
                                    description={
                                    <div className = "custom-card-description"> 
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
                  </div> 
              */}
              {isMapLoading && isLoaded && latitude && longitude ? (
                    <Map isLoaded={true} latitude={latitude} longitude={longitude} center={{ lat: latitude, lng: longitude }} resultData={resultData} />
              ) : null}
            </div>

        </Col>
      </Row>
{isEditModalVisible && (
        <Modal
          title="Edit Card Content"
          visible={isEditModalVisible}
          onOk={handleSaveEditedContent}
          onCancel={handleCancelEdit}
        >
        <Input
            type="hidden"
            id="edit-card-draggableIndex"
            value={editedContent.draggableIndex}
          />
          <Input
            type="hidden"
            id="edit-card-cardIndex"
            value={editedContent.cardIndex}
          />
          <Input
            type="text"
            id="edit-card-title"
            value={editedContent.title}
            onChange={(e) => setEditedContent((prev) => ({ ...prev, title: e.target.value }))}
          />
          <Input.TextArea
            rows={4}
            id="edit-card-description"
            value={editedContent.description}
            onChange={(e) => setEditedContent((prev) => ({ ...prev, description: e.target.value }))}
          />
        </Modal>
      )}
  </div>
  );
}

export default Itinerary;
