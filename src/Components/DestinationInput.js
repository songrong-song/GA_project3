import React, { useContext, useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { Select } from 'antd';
import './DestinationInput.css';
import { ItineraryContext } from './ItineraryContext';

const { Option } = Select;

const DestinationInput = () => {
  const { destinationValue, updateDestinationValue, durationValue, updateDurationValue } = useContext(ItineraryContext);
  const autocomplete = useRef(null);

  const handleNumDaysChange = (value) => {
    updateDurationValue(value);
  };

  const dayOptions = [1, 2, 3, 4, 5, 6, 7].map((day) => (
    <Option key={day} value={day}>
      {day} day{day > 1 && 's'}
    </Option>
  ));

  const handlePlaceChange = (event) => {
    updateDestinationValue(event.target.value);
  };

  const handleAutocompleteLoad = (autocompleteInstance) => {
    if (autocompleteInstance) {
      autocomplete.current = autocompleteInstance;
    }
  };
  // console.log(handleAutocompleteLoad);
  console.log({destinationValue});
console.log({durationValue});

  return (
    <div className="destination-input">
      <h1>Which country/city are you travelling to?</h1>  
   <Autocomplete options={{ types: ["locality", "country"] }}>
        <input
          className="destination-input-field"
          type="text"
          placeholder="Enter a destination, country or city"
          onChange={handlePlaceChange}
          onBlur={handlePlaceChange}
          //this is to handle the issue of destination resetting to only keyboard value, instead of the selection after I add number of days. 
          //without this, the whenever I put in number of days, it clears my destination input. 
          value={destinationValue}
        />
      </Autocomplete>

      <div>
        <label htmlFor="numDays">Number of Days:</label>
        <Select id="numDays" value={durationValue} onChange={handleNumDaysChange}>
          <Option value="">Select</Option>
          {dayOptions}
        </Select>
      </div>
    </div>
  );
};

export default DestinationInput;
