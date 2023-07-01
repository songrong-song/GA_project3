import Head from "next/head";
import React, { useState, useEffect, useContext } from 'react';
import { Configuration, OpenAIApi } from "openai";
import { useNavigate } from 'react-router-dom';
import '../pages/Itinerary.css';
import { Button } from 'antd';
import { ItineraryContext } from "../Components/ItineraryContext";
import { GoogleMap, LoadScript, useJsApiLoader } from "@react-google-maps/api";


const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
delete configuration.baseOptions.headers['User-Agent'];
const openai = new OpenAIApi(configuration);

const ItineraryGenerator = () => {
  const { selectedActivities, destinationValue, durationValue, selectedFood } = useContext(ItineraryContext);
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
//   const center = {
//   lat: 1.2345, // Set the latitude value
//   lng: 3.567, // Set the longitude value
// };
  const [center, setCenter] = useState({ lat: 0, lng: 0 }); // Initialize center with default values


  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['geometry', 'drawing', 'places'],
  });

  const mapContainerStyle = {
  width: '40vw', 
  height: '100vh', 
};

  function generatePrompt(selectedActivities, destinationValue, durationValue, selectedFood) {
    let itinerary = `Write me an itinerary for ${durationValue} days to ${destinationValue}. For each day, list me the following:\n\n`;
    itinerary += `- Attractions suitable for ${selectedActivities} and a short summary of each`;
    itinerary += `- 2 Restaurants with food choices of ${selectedFood}, one for lunch & another for dinner, with shortened Google Map links \n\n and Latitude: [LATITUDE], Longitude: [LONGITUDE]`;

    return itinerary;
    
  }

  //GMAP coordinates for lat long center
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
          setLatitude(lat);
          setLongitude(lng);
           setCenter({ lat: latitude, lng: longitude });
        }
      });
    } catch (error) {
      console.log('Error fetching coordinates for destination:', error);
    }
  }

      // ---------------------
  useEffect(() => {
    handleSubmit();
  }, []);

//OpenAI-------------------------------
  if (!configuration.apiKey) {
    alert("OpenAI API key not configured, please follow instructions in README.md");
    return null;
  }

  const handleSubmit = async () => {
    try {
      const result = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(selectedActivities, destinationValue, durationValue, selectedFood),
        temperature: 0.5,
        max_tokens: 4000,
      });

      let resultFinal = result.data.choices[0].text;
      resultFinal = resultFinal.replaceAll("\n", "<br/>");

      // Extract latitude and longitude for restaurants in results 
    const restaurantRegex = /Dinner: ([^\n]+), Latitude: ([^,]+), Longitude: ([^\n]+)/;
    const matches = resultFinal.match(restaurantRegex);
    if (matches) {
      const latitude = matches[1];
      const longitude = matches[2];
      
      // Replace the placeholder with the actual latitude and longitude
      resultFinal = resultFinal.replace("[LATITUDE]", latitude).replace("[LONGITUDE]", longitude)
      
          // Update the latitude and longitude state variables
        setLatitude(latitude);
        setLongitude(longitude);
      }

      console.log(resultFinal);
      setResult(resultFinal);
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      console.log("error response", error.response);

      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }

      setResult("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    navigate(-1);
  };
  
   
const formatResult = (result) => {
  const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
  const formattedResult = result.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
  return formattedResult;
};

  return (
  <>
    <div className="container-right">
      <Head>
        <title>Travel Generator</title>
      </Head>
      <h1>Generated Itinerary</h1>
      <div className="loader" style={{ display: isLoading ? 'block' : 'none' }}></div>
      <pre
        style={{
          overflow: 'auto',
          width: '600px',
          whiteSpace: 'pre-wrap',
          fontFamily: 'Roboto, sans-serif',
        }}
        dangerouslySetInnerHTML={{ __html: result ? formatResult(result) : '' }}
      ></pre>
       <Button onClick={handleReset}>Generate another trip</Button>
       </div>
        <div className="container-left" >
      
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={19}
              onClick={ev => {
                console.log('latitide = ', ev.latLng.lat());
                console.log('longitude = ', ev.latLng.lng());
              }}
            />
         
  
  </div>
</>
)}
export default ItineraryGenerator;
