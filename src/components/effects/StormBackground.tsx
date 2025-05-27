
"use client";

import React from 'react';

const StormBackground: React.FC = () => {
  return (
    <div className="storm-background-container" aria-hidden="true">
      <div className="storm-layer storm-layer-1"></div>
      <div className="storm-layer storm-layer-2"></div>
      <div className="storm-layer storm-layer-3"></div>
    </div>
  );
};

export default StormBackground;
