import React from 'react';
import MainCover from '../components/main-cover';

const GlimmerPage = () => {
  return (
    <div className="full-height">
        <MainCover title="Loading ..." isBlinking={true} />
    </div>
  );
}

export default GlimmerPage;