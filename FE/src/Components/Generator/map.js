import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import "./Map.css";

const Map = ({ isLoaded, latitude, longitude, center, resultData }) => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null); // To store the selected marker

  // This code is used to check and filter out incorrect data from GPT
  useEffect(() => {
    const allMarkers = []; // Create a local array to collect markers

    if (resultData && resultData.length > 0) {
      resultData.forEach((itinerary, index) => {
        itinerary.itineraries.forEach((item, itemIndex) => {
          if (
            item.attraction1 &&
            item.attraction1["Location"] &&
            item.attraction1["Location"]["Latitude"] &&
            item.attraction1["Location"]["Longitude"]
          ) {
            allMarkers.push({
              id: `attraction-${index}-${itemIndex}`,
              type: "Attraction",
              title: item.attraction1["Attraction Name"] || "Unknown",
              position: {
                lat: parseFloat(item.attraction1["Location"]["Latitude"]),
                lng: parseFloat(item.attraction1["Location"]["Longitude"]),
              },
              description: item.attraction1['Summary'] || "",
            });
          }
          if (
            item.restaurant1 &&
            item.restaurant1["Location"] &&
            item.restaurant1["Location"]["Latitude"] &&
            item.restaurant1["Location"]["Longitude"]
          ) {
            allMarkers.push({
              id: `restaurant-${index}-${itemIndex}`,
              type: "Restaurant",
              title: item.restaurant1["Restaurant Name"] || "Unknown",
              position: {
                lat: parseFloat(item.restaurant1["Location"]["Latitude"]),
                lng: parseFloat(item.restaurant1["Location"]["Longitude"]),
              },
              description: "Additional information about the restaurant.",
            });
          }
        });
      });
    }

    setMarkers(allMarkers); // Set the state of 'markers' with the 'allMarkers' array
  }, [resultData]);

  // Function to handle marker click
  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker === selectedMarker ? null : marker); // Toggle the selected marker
  };

  // Rest of your component code using the 'markers' state
  return (
    <div className="container-right">
      {isLoaded && latitude && longitude ? (
        <div className="MapSection">
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "100vh",
            }}
            center={center}
            zoom={10}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                title={marker.title}
                onClick={() => handleMarkerClick(marker)} // Call the function when the marker is clicked
              >
                {selectedMarker === marker && (
                  <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                    <div>
                      <h3>{marker.title}</h3>
                      <p>{marker.description}</p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </GoogleMap>
        </div>
      ) : null}
    </div>
  );
};

export default Map;
