import React, { useState, useContext, useEffect } from 'react';
import { Select, Form } from 'antd';
import "./ActivityInput.css";
import { ItineraryContext } from './ItineraryContext';

const { Option } = Select;

const ActivityInput = () => {
  const { selectedActivities: contextSelectedActivities, updateSelectedActivities } = useContext(ItineraryContext);
  const { destinationValue, updateDestinationValue, durationValue, updateDurationValue } = useContext(ItineraryContext);
  const [selectedActivities, setSelectedActivities] = useState(contextSelectedActivities || []);

  console.log("secondpage")

  console.log("D", destinationValue)

  console.log("DU", durationValue)

  useEffect(() => {
    setSelectedActivities(contextSelectedActivities || []);
  }, [contextSelectedActivities]);

  const handleActivitiesChange = (values) => {
    setSelectedActivities(values);
  };

  const handleBlur = () => {
    updateSelectedActivities(selectedActivities);
  };

  const activityOptions = [
    'Outdoor', 'Historical', 'Art', 'Shopping', 'Nightlife', 'Museums',
    'Theme Park', 'Water Sports', 'Wellness', 'Architecture', 'Music', 'Events'
  ];

  return (
    <div className="activity-input">
      <div>
        <h1>Select activities that interest you.</h1>
        <Form.Item
          name="activities"
          rules={[
            { required: true, message: 'Please select at least one activity' }
          ]}
        >
          <Select
            className="activity-input-selector"
            mode="multiple"
            value={selectedActivities}
            onChange={handleActivitiesChange}
            onBlur={handleBlur}
            placeholder="Select activities"
          >
            {activityOptions.map((activity) => (
              <Option key={activity} value={activity}>
                {activity}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </div>
  );
};

export default ActivityInput;
