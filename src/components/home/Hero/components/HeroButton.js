// frontend/src/components/home/Hero/components/HeroButton.js
import React from 'react';
import { Link } from 'react-router-dom';

const HeroButton = ({ button }) => {
  if (!button?.text) return null;

  const buttonStyle = {
    backgroundColor: button.backgroundColor,
    color: button.textColor,
  };

  if (button.action?.type === 'scroll') {
    return (
      <button
        onClick={() => {
          const element = document.querySelector(button.action.target);
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        style={buttonStyle}
        className="px-6 py-3 rounded-md font-medium transition-transform hover:scale-105"
      >
        {button.text}
      </button>
    );
  }

  return (
    <Link
      to={button.action?.target || '#'}
      style={buttonStyle}
      className="px-6 py-3 rounded-md font-medium transition-transform hover:scale-105"
      target="_blank"
      rel="noopener noreferrer"
    >
      {button.text}
    </Link>
  );
};

export default HeroButton;
