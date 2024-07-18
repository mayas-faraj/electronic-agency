import React from "react";
import Page from "../components/page";
import Tickets, { AccessType } from "../components/content-tables/tickets";
import RoleContext from "../components/role-context";

const TicketsPage = () => {
  const privileges = React.useContext(RoleContext);

  return (
    <Page title="Tickets">
      {privileges.writeAdmin && (
        <>
          <h2>All Tickets</h2>
          <Tickets accessType={AccessType.FULL_ACCESS} />
        </>
      )}
      {!privileges.writeAdmin && privileges.writeTicket && !privileges.writeRepair && (
        <>
          <h2>My Tickets</h2>
          <Tickets accessType={AccessType.READ_ACCESS} />
          <h2>Assign to me</h2>
          <Tickets accessType={AccessType.UPDATE_ACCESS} />
        </>
      )}
      {!privileges.writeAdmin && privileges.writeRepair && (
        <>
          <h2>My Tasks</h2>
          <Tickets accessType={AccessType.CREATE_ACCESS} />
        </>
      )}
    </Page>
  );
};

export default TicketsPage;
