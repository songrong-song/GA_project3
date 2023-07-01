import React, { createContext, useState } from 'react';

export const ItineraryContext = createContext();

export const ItineraryProvider = ({ children }) => {
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [destinationValue, setDestinationValue] = useState('');
  const [durationValue, setDurationValue] = useState('');
  const [selectedFood, setSelectedFood] = useState([]);

  const updateSelectedActivities = (activities) => {
    setSelectedActivities(activities);
  };

  const updateDestinationValue = (destination) => {
    setDestinationValue(destination);
  };

  const updateDurationValue = (duration) => {
    setDurationValue(duration);
  };

  const updateSelectedFood = (food) => {
    setSelectedFood(food);
  };

  return (
    <ItineraryContext.Provider
      value={{
        selectedActivities,
        updateSelectedActivities,
        destinationValue,
        updateDestinationValue,
        durationValue,
        updateDurationValue,
        selectedFood,
        updateSelectedFood,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};