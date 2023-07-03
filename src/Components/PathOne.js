import React from 'react';
import LeftSidebar from './LeftSideBar';
import StepComponent from './StepComponent';
import MenuPage from './Header';

const PathOne = (props) => {
    return (
<>
<MenuPage />
{/* <LeftSidebar /> */}
<StepComponent /> 
</>
    ); 
}
export default PathOne;