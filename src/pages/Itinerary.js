import React, { useState, useEffect, useContext } from 'react';
import { Button, Card, Col, Empty, Input, Row, Timeline, config } from 'antd';
import { DragOutlined, DeleteOutlined, EditOutlined, SyncOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import { ItineraryContext } from '../Components/ItineraryContext';
import Header from '../Components/Header';

const { Meta } = Card;

const Itinerary = () => {
  const { destinationValue, durationValue } = useContext(ItineraryContext);

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
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


      console.log("check backend GPT result here")
      console.log("because of invalid API key at this moment, only empty json is returned now!")

      const response = await axios.post('http://localhost:3000/api/itinerary', {
        destinationValue: destinationValue,
        duration: durationValue,
      });
      console.log("Result from chatGPT")
      console.log(response.data.storeData)
     

      console.log("Here I assign a hard coded value for the result! Would change after the setting of database")
      console.log("Result from hardcoded")
      const hardCode = {
        "storeData": {
            "UserId": "ABC",
            "Desination": "Singapore",
            "Itinerary": [
                {
                    "attraction1": 
                      {
                        "Attraction Name": "Gardens by the Bay",
                        "Summary": "Gardens by the Bay is a nature park spanning 101 hectares of reclaimed land. It features iconic Supertrees, conservatories, and beautiful waterfront gardens.",
                        "Location": {
                          "Latitude": 1.2816,
                          "Longitude": 103.8636
                        },
                        "Recommended Sojourn Time (number of hours only)": 3
                      },


                    "restaurant1": 
                    {
                      "Restaurant Name": "Garden Bistro",
                      "Summary": "A charming bistro located near Gardens by the Bay, offering a delightful menu of international and local cuisines. Enjoy your meal in a cozy garden setting surrounded by lush greenery.",
                      "Location": {
                        "Latitude": 1.2816,
                        "Longitude": 103.8636
                      },
                      "Recommended Sojourn Time": 2
                    },
                    

                    "attraction2":
                      {
                        "Attraction Name": "Marina Bay Sands SkyPark",
                        "Summary": "Marina Bay Sands SkyPark is an iconic rooftop observation deck located on top of the Marina Bay Sands hotel. It offers stunning panoramic views of Singapore's skyline, including the Gardens by the Bay and the Singapore Strait.",
                        "Location": {
                          "Latitude": 1.2836,
                          "Longitude": 103.8586
                        },
                        "Recommended Sojourn Time (number of hours only)": 2
                      },

                    "restaurant2": 
                    {
                      "Restaurant Name": "Skyview Terrace",
                      "Summary": "A stunning rooftop restaurant located near Marina Bay Sands SkyPark, offering a blend of international flavors and exquisite dining experience. Enjoy breathtaking views of the city skyline while savoring delectable cuisine.",
                      "Location": {
                        "Latitude": 1.2836,
                        "Longitude": 103.8596
                      },
                      "Recommended Sojourn Time": 2
                    }
                },

                {
                  "attraction1": 
                  {
                    "Attraction Name": "Singapore Botanic Gardens",
                    "Summary": "The Singapore Botanic Gardens is a lush green oasis in the heart of the city. It is a UNESCO World Heritage Site and features beautiful gardens, a tropical rainforest, and a variety of plant species.",
                    "Location": {
                      "Latitude": 1.3138,
                      "Longitude": 103.8153
                    },
                    "Recommended Sojourn Time (number of hours only)": 3
                  },

                                    
                  "restaurant1": {
                    "Restaurant Name": "Garden Terrace Cafe",
                    "Summary": "A charming cafe located near the Singapore Botanic Gardens, offering a variety of delicious dishes and beverages. Relax and enjoy your meal in a serene garden setting.",
                    "Location": {
                      "Latitude": 1.3138,
                      "Longitude": 103.8154
                    },
                    "Recommended Sojourn Time": 1
                  },
                  
                  "attraction2": 
                  {
                    "Attraction Name": "Singapore Zoo",
                    "Summary": "The Singapore Zoo is a world-class zoological garden known for its innovative and immersive animal exhibits. It showcases a diverse range of wildlife and offers unique experiences for visitors.",
                    "Location": {
                      "Latitude": 1.4043,
                      "Longitude": 103.7930
                    },
                    "Recommended Sojourn Time (number of hours only)": 4
                  },

                  "restaurant2": 
                    {
                      "Restaurant Name": "Zoo Bistro",
                      "Summary": "A family-friendly bistro located near the Singapore Zoo, offering a variety of delicious dishes and a lively atmosphere. Enjoy a meal surrounded by nature after your zoo visit.",
                      "Location": {
                        "Latitude": 1.4043,
                        "Longitude": 103.7930
                      },
                      "Recommended Sojourn Time": 1
                    }
              }
            ]
        }
    };
      console.log(hardCode);
      setResult(hardCode);
      console.log("current result:");
      console.log(hardCode);

      setIsLoading(false);
    } catch (error) {
      console.log('Error generating itinerary:', error);
      setResult('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  const formatResult = (result) => {
    // Format the result as needed
    return result;
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

  const handleRefresh = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post('/api/generate_prompt', {
        // Pass any required data to the backend
      });

      // Handle the response from the backend

      setIsLoading(false);
    } catch (error) {
      console.log('Error generating prompt:', error);
      setIsLoading(false);
    }
  };

   const renderResultCards = () => {
  if (result) {
    // Parse the result and extract relevant information for each card
    // Example: Assuming result is an array of objects containing attraction information
    const attractions = JSON.parse(result);
    return attractions.map((attraction, index) => (
      <Card
        key={index}
        title={
          <Input
            value={attraction.title}
            onChange={(e) => handleEdit(index, 'title', e.target.value)}
          />
        }
          actions={[
          // <SettingOutlined key="setting" />,
          // <EditOutlined key="edit" />,
          // <EllipsisOutlined key="ellipsis" />,
        ]}
         bordered={false}
      >
        <Meta
          description={
            <Input.TextArea
              value={attraction.description}
              onChange={(e) => handleEdit(index, 'description', e.target.value)}
            />
          }
        />
      </Card>
    ));
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
          </div>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
          <div className="container-right">
            <div className="loader" style={{ display: isLoading ? 'block' : 'none' }}></div>
            {result ? (
              <div>
                <h2>Result as Text:</h2>
                <pre>{formatResult(result)}</pre>
              </div>
            ) : null}
          </div>
          <div className="container-left">
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
            ) : null}
            {result ? (
              <div>
                <h2>Result as Cards:</h2>
                <div className="card-container">{renderResultCards()}</div>
              </div>
            ) : null}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Itinerary;
