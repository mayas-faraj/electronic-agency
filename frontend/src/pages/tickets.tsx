import React from "react";
import Page from "../components/page";
import Tickets from "../components/content-tables/tickets";
import ProfileContext from "../components/profile-context";

const TicketsPage = () => {
  const privileges = React.useContext(ProfileContext);

  return (
    <Page title="Tickets" hideBack={true}>
      {privileges.createAdmin && <h2>All Tickets</h2>}
      {!privileges.createAdmin && privileges.createTicket && <h2>My Tickets</h2>}
      {!privileges.createAdmin && privileges.updateTicket && privileges.updateRepair && privileges.createFeedback && <h2>My Center Tickets</h2>}
      {!privileges.createAdmin && privileges.createRepair && <h2>My Tasks</h2>}
      <Tickets />
    </Page>
  );
};

export default TicketsPage;
