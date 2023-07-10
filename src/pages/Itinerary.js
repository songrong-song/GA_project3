import Head from "next/head";
import React, { useState, useEffect, useContext } from 'react';
import { Button, Card } from 'antd';
import { ItineraryContext } from "../Components/ItineraryContext";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import axios from 'axios';

const { Meta } = Card;

const ItineraryGenerator = () => {
  const { selectedActivities, destinationValue, durationValue, selectedFood } = useContext(ItineraryContext);

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

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
    console.log("click")
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/itinerary', {
        selectedActivities,
        destinationValue,
        durationValue,
        selectedFood,
      }).then(response => {
        console.log("see response here")
        // Handle the response
        console.log(response.data);
        const { completion, attractionName } = response.data;
        console.log("--------------------");
        console.log(completion);
        console.log(response.data);
        console.log("--------------------");
        
        setResult(completion);
        // Do something with attractionName if needed
        setIsLoading(false);
      })
      .catch(error => {
        // Handle the error
        console.log('Error generating itinerary:', error);
      setResult("Something went wrong. Please try again.");
      setIsLoading(false);
      });
    } catch (error) {
      console.log('Error generating itinerary:', error);
      setResult("Something went wrong. Please try again.");
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

  const renderResultCards = () => {
    if (result) {
      // Parse the result and extract relevant information for each card
      // Example: Assuming result is an array of objects containing attraction information
      const attractions = JSON.parse(result);
      return attractions.map((attraction, index) => (
        <Card key={index} title={attraction["Attraction Name"]}>
          <p>Summary: {attraction["Summary"]}</p>
          <p>Location: {attraction["Location"]}</p>
          <p>Recommended Sojourn Time: {attraction["Recommended Sojourn Time"]} hours</p>
        </Card>
      ));
    }
    return null;
  };

  return (
    <>
      <div className="container-right">
        <Head>
          <title>Travel Generator</title>
        </Head>
        <h1>Generated Itinerary</h1>
        <div className="loader" style={{ display: isLoading ? 'block' : 'none' }}></div>
        {result ? (
          <div>
            <h2>Result as Text:</h2>
            <pre>{formatResult(result)}</pre>
          </div>
        ) : null}
        <Button onClick={handleSubmit}>Generate Itinerary</Button>
        <Button onClick={handleReset}>Reset</Button>
      </div>
      <div className="container-left">
        {latitude && longitude ? (
          <GoogleMap
            mapContainerStyle={{
              width: '40vw',
              height: '50vh',
            }}
            center={center}
            zoom={19}
            onClick={ev => {
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
    </>
  );
};

export default ItineraryGenerator;

