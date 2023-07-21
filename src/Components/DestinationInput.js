import React, { useContext, useRef, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { Select, Col, Row, Input, Form, message } from 'antd';
import './DestinationInput.css';
import { ItineraryContext } from './ItineraryContext';

const { Option } = Select;

const DestinationInput = () => {
  const { destinationValue, updateDestinationValue, durationValue, updateDurationValue } = useContext(ItineraryContext);
  const autocomplete = useRef(null);
  const [form] = Form.useForm();


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
  useEffect(() => {
    form.setFieldsValue({ destination: destinationValue }); // Set the value for the destination input
    form.setFieldsValue({ numDays: durationValue }); // Set the value for the numDays select
    console.log("destinationValue:", destinationValue); // Add this line to log destinationValue
    console.log("durationValue:", durationValue); // Add this line to log durationValue
  }, [destinationValue, durationValue, form]);

  const handlePlaceSelect = () => {
    const place = autocomplete.current.getPlace();
    const selectedPlace = place && place.formatted_address ? place.formatted_address : '';
    updateDestinationValue(selectedPlace);
    form.validateFields(['destination']).catch((error) => {
      message.error('Please enter a destination, country or city');
    });
  };

  return (
    <div className="destination-input">
      <h1 className="heading">Which country/city are you travelling to?</h1>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <div className="input-group">
            <label htmlFor="destination">Destination (required):</label>
            <Form.Item
              name="destination"
              rules={[
                { required: false, message: 'Please enter a destination, country or city' }
              ]}
            >
              <Autocomplete options={{ types: ['locality', 'country'] }} onLoad={handleAutocompleteLoad}>
                <Input
                  id="destination"
                  className="destination-input-field"
                  placeholder="Enter a destination, country or city"
                  onChange={handlePlaceChange}
                  onBlur={handlePlaceChange}
                  value={destinationValue}
                />
              </Autocomplete>
            </Form.Item>
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div className="input-group">
            <label htmlFor="numDays">Number of Days (required):</label>
            <Form.Item
              name="numDays"
              rules={[
                { required: true, message: 'Please select the number of days' }
              ]}
            >
            
              <Select id="numDays" value={durationValue} onChange={handleNumDaysChange}  placeholder="Select">
                {dayOptions}
              </Select>
            </Form.Item>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DestinationInput;
