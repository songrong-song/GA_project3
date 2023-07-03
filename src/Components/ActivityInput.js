import React, { useContext } from 'react';
import { Select } from 'antd';
import "./ActivityInput.css";
import { ItineraryContext } from './ItineraryContext';

const { Option } = Select;

const ActivityInput = () => {
  const {selectedActivities, updateSelectedActivities} = useContext(ItineraryContext);

  const handleActivitiesChange = (values) => {
    updateSelectedActivities(values);
  };

  const activityOptions = [
    'Outdoor', 'Historical', 'Art', 'Shopping', 'Nightlife', 'Museums',
    'Theme Park', 'Water Sports', 'Wellness', 'Architecture', 'Music', 'Events'
  ];

  return (
    <div className="activity-input">
      <div>
        <h1>Select activities that interest you.</h1>
        <label htmlFor="activities">Activities:</label>
        <Select
          className="activity-input-selector"
          id="activities"
          mode="multiple"
          value={selectedActivities}
          onChange={handleActivitiesChange}
          placeholder="Select activities"
        >
          {activityOptions.map((activity) => (
            <Option key={activity} value={activity}>
              {activity}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default ActivityInput;
