import React, { useContext, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { Select, Col, Row, Input, Form } from "antd";
import "./DestinationInput.css";
import { ItineraryContext } from "./ItineraryContext";

const { Option } = Select;

const DestinationInput = () => {
  const {
    destinationValue,
    updateDestinationValue,
    durationValue,
    updateDurationValue,
  } = useContext(ItineraryContext);
  const autocomplete = useRef(null);

  const dayOptions = [1, 2, 3, 4, 5, 6, 7].map((day) => (
    <Option key={day} value={day} selected={day === durationValue}>
      {day}
    </Option>
  ));

  if (!durationValue) {
    updateDurationValue(localStorage.getItem("NumberOfDays"));
  }
  if (!destinationValue) {
    updateDestinationValue(localStorage.getItem("Destination"));
  }

  const handleNumDaysChange = (value) => {
    console.log("check");
    console.log(value);
    updateDurationValue(value);
    localStorage.setItem("NumberOfDays", value);
  };

  const handlePlaceChange = (event) => {
    updateDestinationValue(event.target.value);
    localStorage.setItem("Destination", event.target.value);
  };

  const handleAutocompleteLoad = (autocompleteInstance) => {
    if (autocompleteInstance) {
      autocomplete.current = autocompleteInstance;
    }
  };

  return (
    <div className="destination-input">
      <h1 className="heading">Which country/city are you travelling to?</h1>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <div className="input-group">
            <label htmlFor="destination">Destination (required): </label>
            <Form.Item
              name="destination"
              rules={[
                {
                  required: false,
                  message: "Please enter a destination, country or city",
                },
              ]}
            >
              <Autocomplete
                options={{ types: ["locality", "country"] }}
                onLoad={handleAutocompleteLoad}
              >
                <Input
                  id="destination"
                  className="destination-input-field"
                  placeholder="Enter a destination, country or city"
                  onChange={handlePlaceChange}
                  onBlur={handlePlaceChange}
                  value={localStorage.getItem("Destination")}
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
                { required: true, message: "Please select the number of days" },
              ]}
            >
              <Select
                id="numDays"
                defaultValue={localStorage.getItem("NumberOfDays")}
                onChange={handleNumDaysChange}
                placeholder="Select"
              >
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
