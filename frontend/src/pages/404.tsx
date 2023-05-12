import React from "react";
import MainCover from "../components/main-cover";


const NotFoundPage = () => {
  return (
    <div className="full-height">
      <MainCover title="Page Not Found" isBlinking={true} />
    </div>
  );
};

export default NotFoundPage;
