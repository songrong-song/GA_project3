import React, { useContext } from "react";
import { Select, Form, Tag } from "antd";
import "./FoodInput.css";
import { ItineraryContext } from "./ItineraryContext";

const { Option } = Select;

const FoodInput = () => {
  const { selectedFood, updateSelectedFood } = useContext(ItineraryContext);

  const handleFoodChange = (values) => {
    updateSelectedFood(values);
  };

  const foodOptions = [
    "Local delights",
    "Japanese",
    "Italian",
    "American",
    "Korean",
    "Mexican",
    "Thai",
    "Turkish",
    "Indian",
    "French",
    "Spanish",
    "Greek",
    "Chinese",
  ]; // Replace with your activity options

  return (
    <div className="food-input">
      <div>
        <div className="titleTag">
          <h1 className="heading">Select cuisine preferences.</h1>
          <Tag color="orange" style={{ height: "24px", lineHeight: "24px" }}>
            Coming Soon
          </Tag>
        </div>
        <label htmlFor="food">Cuisine:</label>
        <Form.Item
          name="food"
          rules={[
            { required: false, message: "Please select at least one cuisine" },
          ]}
        >
          <Select
            className="food-input-selector"
            id="foods"
            mode="multiple"
            value={selectedFood}
            onChange={handleFoodChange}
            placeholder="Select cuisine"
          >
            {foodOptions.map((value) => (
              <Option key={value} value={value}>
                {value}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </div>
  );
};

export default FoodInput;
