import React from "react";
import Page from "../components/page";
import Tickets from "../components/content-tables/tickets";
import ProfileContext from "../components/profile-context";

const TicketsPage = () => {
  const profile = React.useContext(ProfileContext);

  return (
    <Page title="Tickets" hideBack={true}>
      {profile.privileges.createAdmin && <h2>All Tickets</h2>}
      {!profile.privileges.createAdmin && profile.privileges.createTicket && <h2>My Tickets</h2>}
      {!profile.privileges.createAdmin && profile.privileges.updateTicket && profile.privileges.updateRepair && profile.privileges.createFeedback && <h2>My Center Tickets</h2>}
      {!profile.privileges.createAdmin && profile.privileges.createRepair && <h2>My Tasks</h2>}
      <Tickets />
    </Page>
  );
};

export default TicketsPage;
