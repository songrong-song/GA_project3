import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api"
import "./Map.css";

const Map = ({ isLoaded, latitude, longitude, center, resultData }) => {
let rand = ""
const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [markers, setMarkers] = useState([]);
  let allMarkers = [];
 useEffect(() => {


    if (resultData && resultData.length > 0) {

      resultData.forEach((itinerary, index) => {
        itinerary.itineraries.forEach((item, itemIndex) => {
        
        //if (item.attraction?.Location?.latitude && item.attraction?.Location?.longitude) {
            allMarkers.push({
              id: `attraction-${index}-${itemIndex}`,
              type: "Attraction",
              title: item.attraction1["Attraction Name"] || "Unknown",
              position: {
                lat: parseFloat(item.attraction1["Location"]["Latitude"]),
                lng: parseFloat(item.attraction1["Location"]["Longitude"]),
              },
            });
         // }
          //if (item.restaurant1?.Location?.latitude && item.restaurant1?.Location?.longitude) {
            allMarkers.push({
              id: `restaurant-${index}-${itemIndex}`,
              type: "Restaurant",
              title: item.restaurant1["Restaurant Name"] || "Unknown",
              position: {
                lat: parseFloat(item.restaurant1["Location"]["Latitude"]),
                lng: parseFloat(item.restaurant1["Location"]["Longitude"]),
              },
            });
          //}
        });
      });
      setMarkers(allMarkers);
    }
  }, [resultData]);

 return (
    <div className="container-right">
      { isLoaded && latitude && longitude ? (
        <div className="MapSection">
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: "100vh",
                }}
              center={{ lat: latitude, lng: longitude }}
              zoom={10}
            >
           
            
            {resultData.map((itinerary, i) => (
                
              itinerary.itineraries.map((item, j) => (
                
                     <React.Fragment key={`${i}-${j}`}>
                   {  rand = (Math.random() + 1).toString(36).substring(7) }
                    <Marker
                        key={`attraction-${i}-${j}`}
                        position={{ 
                            lat: parseFloat(item.attraction1["Location"]["Latitude"]), 
                            lng: parseFloat(item.attraction1["Location"]["Longitude"]) 
                        }}
                        
                    />
                    {console.log(item.attraction1["Attraction Name"])}
                    {console.log(item.restaurant1["Restaurant Name"])}
                    {console.log(item.attraction1["Location"]["Latitude"])}
                    {console.log(item.attraction1["Location"]["Longitude"])}
                    {console.log(item.restaurant1["Location"]["Latitude"])}
                    {console.log(item.restaurant1["Location"]["Longitude"])}

                    <Marker
                        key={`restaurant-${i}-${j}`}
                        position={{ lat: parseFloat(item.restaurant1["Location"]["Latitude"]), lng: parseFloat(item.restaurant1["Location"]["Longitude"]) }}
                        
                    />  
               </React.Fragment>
                ))))}
             
            </GoogleMap>
          </div>
      ) : null}
    </div>
  );
};

export default Map;