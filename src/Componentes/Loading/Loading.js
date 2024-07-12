import React from 'react';
import Lottie from 'react-lottie';
import animationData from './Animation.json';

const Loading = () => {
  const options = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Lottie options={options} height={500} width={500} />
    </div>
  );
};

export default Loading;
