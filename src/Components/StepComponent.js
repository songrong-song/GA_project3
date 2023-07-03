import React, { useContext, useState } from 'react';
import { Steps, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import "./StepComponent.css";
import DestinationInput from "./DestinationInput";
import ActivityInput from './ActivityInput';
import FoodInput from './FoodInput';
import { ItineraryContext } from './ItineraryContext';

const StepComponent = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  //Accessing the context values using the use context hook 
  const {
  destinationValue,
  durationValue,
  selectedActivities,
  selectedFood,
} = useContext(ItineraryContext);



  const handleNextStep = (event) => {
    setCurrentStep(currentStep + 1);
    event.preventDefault();
  };

  const handlePreviousStep = (event) => {
    setCurrentStep(currentStep - 1);
    event.preventDefault();
  };

  const handleSubmission = (event) => {
    setCurrentStep(currentStep + 1);
    navigate('/generator');
    event.preventDefault();
  };


  return (
    <div className="step-component">
      <Steps
        direction="horizontal"
        current={currentStep}
        size="small"
        items={[
          {
            title: "Step 1",
            description: "Destination",
          },
          {
            title: "Step 2",
            description: "Activity",
          },
          {
            title: "Step 3",
            description: "Food",
          },
        ]}
      />
      <div className="step-content">
        {currentStep === 0 && (
          <DestinationInput
          />
        )}
        {currentStep === 1 && (
          <ActivityInput
          />
        )}
        {currentStep === 2 && (
          <FoodInput
          />
        )}
      </div>
      <div className="step-navigation">
        {currentStep > 0 && (
          <Button className="back" onClick={handlePreviousStep}>
            Back
          </Button>
        )}
        {currentStep < 2 && (
          <Button className="next" type="primary" onClick={handleNextStep}>
            Next
          </Button>
        )}
        {currentStep === 2 && (
          <Button className="submit" type="primary" onClick={handleSubmission}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepComponent;
