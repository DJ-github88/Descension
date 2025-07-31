import React from 'react';
import Step10Review from './Step10Review';

/**
 * Step7Review - Wrapper for Step10Review
 * This component simply wraps the Step10Review component to maintain compatibility
 * with the wizard flow that expects a Step7Review component.
 */
const Step7Review = (props) => {
  return <Step10Review {...props} />;
};

export default Step7Review;
