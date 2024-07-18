import React, { FunctionComponent } from "react";
import { Button, Modal } from "@mui/material";
import { Email, Drafts, Visibility } from "@mui/icons-material";
import TicketForm from "../content-forms/ticket";
import ContentTable, { ITableHeader } from "../content-table";
import RoleContext from "../role-context";
import getServerData from "../../libs/server-data";
import LogoMin from "../../assets/imgs/logo-min.png";
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

export enum AccessType {
  FULL_ACCESS,
  READ_ACCESS,
  CREATE_ACCESS,
  UPDATE_ACCESS
}

type TicketsProps = {
  accessType: AccessType;
};

// main component
const Tickets: FunctionComponent<TicketsProps> = ({ accessType }) => {
  // ticket state
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [openId, setOpenId] = React.useState(0);

  // context
  const privileges = React.useContext(RoleContext);

  // ticket schema
  const tableHeaderImmutable: ITableHeader[] = [
    { key: "createdAt", title: "Creation date" },
    { key: "client", title: "client" },
    { key: "image", title: "Product Image", isSpecialType: true },
    { key: "product", title: "Product name" },
    { key: "summary", title: "Summary" },
    { key: "status", title: "Status" },
    { key: "open", title: "View", isSpecialType: true }
  ];

  const tableHeaderMutable: ITableHeader[] = [
    { key: "createdAt", title: "Creation date" },
    { key: "client", title: "client" },
    { key: "image", title: "Product Image", isSpecialType: true },
    { key: "product", title: "Product name" },
    { key: "summary", title: "Summary" },
    { key: "priority", title: "Priority" },
    { key: "status", title: "Status" },
    { key: "open", title: "Open ticket" }
  ];
  // on load
  const action = async () => {
    let queryName = "";

    if (accessType === AccessType.FULL_ACCESS) queryName = "tickets";
    else if (accessType === AccessType.READ_ACCESS) queryName = "ticketsByAuth";
    else if (accessType === AccessType.UPDATE_ACCESS) queryName = "ticketsAssignedToAuthGroup";
    else if (accessType === AccessType.CREATE_ACCESS) queryName = "ticketsAssignedToAuthUser";
    else return;

    const ticketsResponse = await getServerData(`query { ${queryName} {id user title status createdAt openAt priority asset } }`, true);
    const tickets = ticketsResponse.data[queryName] as Ticket[];
    const snList = tickets.map((ticket) => `"${ticket.asset}"`);
    const productsResponse = await getServerData(`query { productItems(snList: [${snList}]) { sn product { name model image } } }`);
    const ticketItems = tickets.map((ticket) => ({
      ...ticket,
      productItem: productsResponse.data.productItems.filter((item: any) => item.sn === ticket.asset)?.at(0)
    }));
    setTickets(ticketItems);
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
        headers={accessType === AccessType.READ_ACCESS ? tableHeaderImmutable : tableHeaderMutable}
        canRead={privileges.readTicket}
        canWrite={privileges.writeTicket}
        addNewLink={accessType === AccessType.READ_ACCESS ? "/add-ticket" : undefined}
        data={tickets.map((ticket) => ({
          createdAt: new Date(ticket.createdAt).toLocaleDateString(),
          client: ticket.user,
          image:
            ticket.productItem != null ? (
              <img src={data["site-url"] + ticket.productItem.product?.image} alt={ticket.productItem.product?.name} />
            ) : (
              <img src={LogoMin} alt="alardh-alsalba" />
            ),
          product: ticket.productItem != null ? ticket.productItem.product?.name + "\n" + ticket.productItem.product?.model : "<product not found>",
          summary: ticket.title,
          priority: <span className={`status-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>,
          status: ticket.status,
          open: (
            <Button variant="text" color="info" onClick={() => setOpenId(ticket.id)}>
              {accessType === AccessType.READ_ACCESS ? <Visibility /> : <Drafts />}
            </Button>
          )
        }))}
      />
      <Modal open={openId !== 0} onClose={() => setOpenId(0)}>
        <div className="modal">
          <TicketForm accessType={accessType} id={openId} onUpdate={action} />
        </div>
      </Modal>
    </div>
  );
};

export default Tickets;
