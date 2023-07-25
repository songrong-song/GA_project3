import React, { useEffect, useState } from "react";
import axios from "axios";
import Itinerary from "./Itinerary";

const Root = () => {
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/response");
        setItinerary(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Failed to fetch itinerary:", error);
        setIsLoading(false);
      }
    };

    fetchItinerary();
  }, []);

  return (
    <div className="page-root">
      <div className="container">
        <header className="site-header">
          <h1 className="page-title">Itinerary</h1>
        </header>

        {isLoading ? (
          <div>Loading itinerary...</div>
        ) : itinerary ? (
          <Itinerary data={itinerary} />
        ) : (
          <div>No itinerary found.</div>
        )}
      </div>
    </div>
  );
};

export default Root;
