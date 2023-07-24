import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import "./Map.css";

const Map = ({ isLoaded, latitude, longitude, center, resultData }) => {
  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    if (resultData && resultData.length > 0) {
      const allMarkers = []; // Create a local array to collect markers

      resultData.forEach((itinerary, index) => {
        itinerary.itineraries.forEach((item, itemIndex) => {
          if (item.attraction1) {
            allMarkers.push({
              id: `attraction-${index}-${itemIndex}`,
              type: "Attraction",
              title: item.attraction1["Attraction Name"] || "Unknown",
              position: {
                lat: parseFloat(item.attraction1["Location"]["Latitude"]),
                lng: parseFloat(item.attraction1["Location"]["Longitude"]),
              },
            });
          }

          if (item.restaurant1) {
            allMarkers.push({
              id: `restaurant-${index}-${itemIndex}`,
              type: "Restaurant",
              title: item.restaurant1["Restaurant Name"] || "Unknown",
              position: {
                lat: parseFloat(item.restaurant1["Location"]["Latitude"]),
                lng: parseFloat(item.restaurant1["Location"]["Longitude"]),
              },
            });
          }
        });
      });

      setMarkers(allMarkers); // Set the state after processing all the markers
    }
  }, [resultData]);

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
            {markers.map((itinerary, i) =>
              itinerary.itineraries.map((item, j) => (
                <React.Fragment key={`${i}-${j}`}>
                  {item.attraction1 ? (
                    <Marker
                      key={`attraction-${i}-${j}`}
                      position={{
                        lat: parseFloat(
                          item.attraction1["Location"]["Latitude"]
                        ),
                        lng: parseFloat(
                          item.attraction1["Location"]["Longitude"]
                        ),
                      }}
                    />
                  ) : null}

                  {item.restaurant1 ? (
                    <Marker
                      key={`restaurant-${i}-${j}`}
                      position={{
                        lat: parseFloat(
                          item.restaurant1["Location"]["Latitude"]
                        ),
                        lng: parseFloat(
                          item.restaurant1["Location"]["Longitude"]
                        ),
                      }}
                    />
                  ) : null}
                </React.Fragment>
              ))
            )}
          </GoogleMap>
        </div>
      ) : null}
    </div>
  );
};

export default Map;
