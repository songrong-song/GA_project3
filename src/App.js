import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PathOne from './Components/PathOne';
import ItineraryGenerator from './pages/Itinerary';
import { ItineraryProvider } from './Components/ItineraryContext';

function App() {
  const [destinationValue, setDestinationValue] = useState('');
  const [durationValue, setDurationValue] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedFood, setSelectedFood] = useState([]);

  return (
      <ItineraryProvider
        destinationValue={destinationValue}
        durationValue={durationValue}
        selectedActivities={selectedActivities}
        selectedFood={selectedFood}
      >
        <Routes>
          <Route path="/" element={<PathOne />} />
          <Route path="/generator" element={<ItineraryGenerator />} />
        </Routes>
      </ItineraryProvider>
  );
}

export default App;
