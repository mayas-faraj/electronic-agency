import React from "react";
import Page from "../components/page";
import Tickets, { AccessType } from "../components/content-tables/tickets";
import RoleContext from "../components/role-context";

const TicketsPage = () => {
  const privileges = React.useContext(RoleContext);

  return (
    <Page title="Tickets" hideBack={true}>
      {privileges.writeAdmin && (
        <>
          <h2>All Tickets</h2>
          <Tickets accessType={AccessType.FULL_ACCESS} />
        </>
      )}
      {privileges.addTicket && (
        <>
          <h2>My Tickets</h2>
          <Tickets accessType={AccessType.READ_ACCESS} />
        </>
      )}
      {!privileges.writeAdmin && privileges.writeTicket && !privileges.writeRepair && !privileges.writeFeedback && !privileges.addTicket && (
        <>
          <h2>My Center Tickets</h2>
          <Tickets accessType={AccessType.UPDATE_ACCESS} />
        </>
      )}
      {!privileges.writeAdmin && privileges.writeRepair && (
        <>
          <h2>My Tasks</h2>
          <Tickets accessType={AccessType.CREATE_ACCESS} />
        </>
      )}
      {!privileges.writeAdmin && privileges.writeFeedback && (
        <>
          <h2>My Feedback</h2>
          <Tickets accessType={AccessType.TWEAK_ACCESS} onlyResolved={true} />
        </>
      )}
    </Page>
  );
};

export default TicketsPage;
