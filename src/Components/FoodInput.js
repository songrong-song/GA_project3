import React, { useContext } from 'react';
import { Select, Form } from 'antd';
import "./ActivityInput";
import { ItineraryContext } from './ItineraryContext';

const { Option } = Select;

const FoodInput = () => {
  const { selectedFood, updateSelectedFood } = useContext(ItineraryContext);
  
  const handleFoodChange = (values) => {
    updateSelectedFood(values);
  };

  const foodOptions = ['Local delights', 'Japanese', 'Italian', 'American', 'Korean', 'Mexican', 'Thai', 'Turkish', 'Indian', 'French', 'Spanish', 'Greek', 'Chinese']; // Replace with your activity options

  return (
    <div className="food-input">
      <div>
        <h1>Select cuisine preferences.</h1>
        <Form.Item
          name="food"
          rules={[
            { required: false, message: 'Please select at least one cuisine' }
          ]}
        >
          <label htmlFor="food">Food:</label>
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

