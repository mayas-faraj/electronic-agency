import React, { FunctionComponent } from "react";
import { Button, Modal } from "@mui/material";
import { Email, Drafts } from "@mui/icons-material";
import TicketForm from "../content-forms/ticket";
import ContentTable, { ITableHeader } from "../content-table";
import RoleContext from "../role-context";
import getServerData from "../../libs/server-data";
import data from "../../data.json";

// types
interface Ticket {
  id: number;
  user: string;
  title: string;
  status: string;
  createdAt: string;
  openAt: boolean;
  asset: string;
  priority: string;
  productItem: {
    product?: {
      name: string;
      model: string;
      image: string;
    };
  };
}

// main component
const Tickets: FunctionComponent = () => {
  // ticket state
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [assignedTickets, setAssignedTickets] = React.useState<Ticket[]>([]);
  const [openId, setOpenId] = React.useState(0);

  // context
  const privileges = React.useContext(RoleContext);

  // ticket schema
  const tableHeader: ITableHeader[] = [
    { key: "createdAt", title: "Creation date" },
    { key: "client", title: "client" },
    { key: "image", title: "Product Image", isSpecialType: true },
    { key: "product", title: "Product name" },
    { key: "summary", title: "Summary" },
    { key: "status", title: "Status" },
    { key: "view", title: "Open ticket", isSpecialType: true }
  ];
  // on load
  const action = async () => {
    let queryName = "tickets";
    if (!privileges.readAdmin) queryName = "ticketsByAuth";
    const ticketsResponse = await getServerData(`query { ${queryName} {id user title status createdAt openAt priority asset } }`, true);
    const tickets = ticketsResponse.data[queryName] as Ticket[];
    const snList = tickets.map((ticket) => `"${ticket.asset}"`);
    const productsResponse = await getServerData(`query { productItems(snList: [${snList}]) { sn product { name model image } } }`);
    const ticketItems = tickets.map((ticket) => ({
      ...ticket,
      productItem: productsResponse.data.productItems.filter((item: any) => item.sn === ticket.asset)[0]
    }));
    setTickets(ticketItems);

    if (!privileges.readAdmin) {
      const assignedTicketsResponse = await getServerData(`query { ticketsAssignedToAuth {id user title status createdAt openAt priority asset } }`, true);
      const assignedTickets = assignedTicketsResponse.data.ticketsAssignedToAuth as Ticket[];
      const assignedSnList = assignedTickets.map((ticket) => `"${ticket.asset}"`);
      const assignedProductsResponse = await getServerData(`query { productItems(snList: [${assignedSnList}]) { sn product { name model image } } }`);
      const assignedTicketItems = assignedTickets.map((ticket) => ({
        ...ticket,
        productItem: assignedProductsResponse.data.productItems.filter((item: any) => item.sn === ticket.asset)[0]
      }));
      setAssignedTickets(assignedTicketItems);
    }
  };

  React.useEffect(() => {
    action();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // render
  return (
    <div>
      <ContentTable
        name="ticket"
        headers={tableHeader}
        canRead={privileges.readTicket}
        canWrite={privileges.writeTicket}
        addNewLink={privileges.writeTicket ? "/add-ticket" : undefined}
        data={tickets.map((ticket) => ({
          createdAt: new Date(ticket.createdAt).toLocaleDateString(),
          client: ticket.user,
          image: <img src={data["site-url"] + ticket.productItem.product?.image} alt={ticket.productItem.product?.name} />,
          product: ticket.productItem.product?.name + "\n" + ticket.productItem.product?.model,
          summary: ticket.title,
          status: ticket.status,
          view: (
            <Button variant="text" color="info" onClick={() => setOpenId(ticket.id)}>
              {ticket.openAt ? <Drafts /> : <Email />}
            </Button>
          )
        }))}
      />
      {!privileges.readAdmin && (
        <>
          <h2>Assign to me</h2>
          <ContentTable
            name="ticket"
            headers={tableHeader}
            canRead={privileges.readTicket}
            canWrite={privileges.writeTicket}
            data={assignedTickets.map((ticket) => ({
              createdAt: new Date(ticket.createdAt).toLocaleDateString(),
              client: ticket.user,
              image: <img src={data["site-url"] + ticket.productItem.product?.image} alt={ticket.productItem.product?.name} />,
              product: ticket.productItem.product?.name + "\n" + ticket.productItem.product?.model,
              summary: ticket.title,
              status: ticket.status,
              view: (
                <Button variant="text" color="info" onClick={() => setOpenId(ticket.id)}>
                  {ticket.openAt ? <Drafts /> : <Email />}
                </Button>
              )
            }))}
          />
        </>
      )}
      <Modal open={openId !== 0} onClose={() => setOpenId(0)}>
        <div className="modal">
          <TicketForm id={openId} onUpdate={action} />
        </div>
      </Modal>
    </div>
  );
};

export default Tickets;
