import React, { FunctionComponent } from "react";
import { Button, Modal } from "@mui/material";
import { AddCircle, Edit, Visibility } from "@mui/icons-material";
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
  productItem?: {
    product?: {
      name: string;
      model: string;
      image: string;
    };
  };
  product?: {
    name: string;
    model: string;
    image: string;
  };
}

export enum AccessType {
  FULL_ACCESS,
  READ_ACCESS,
  CREATE_ACCESS,
  UPDATE_ACCESS,
  TWEAK_ACCESS
}

type TicketsProps = {
  accessType: AccessType;
  onlyResolved?: boolean;
};

// main component
const Tickets: FunctionComponent<TicketsProps> = ({ accessType, onlyResolved }) => {
  // ticket state
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [openId, setOpenId] = React.useState(0);
  const [viewNewTicket, setViewNetTicket] = React.useState(false);

  // context
  const privileges = React.useContext(RoleContext);

  // ticket schema
  const tableHeaderImmutable: ITableHeader[] = [
    { key: "createdAt", title: "Creation date" },
    { key: "client", title: "Client phone" },
    { key: "image", title: "Product image", isSpecialType: true },
    { key: "product", title: "Product name" },
    { key: "summary", title: "Summary" },
    { key: "status", title: "Status" },
    { key: "open", title: "View", isSpecialType: true }
  ];

  const tableHeaderMutable: ITableHeader[] = [
    { key: "createdAt", title: "Creation date" },
    { key: "client", title: "Client phone" },
    { key: "image", title: "Product image", isSpecialType: true },
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
    else if (accessType === AccessType.UPDATE_ACCESS || accessType === AccessType.TWEAK_ACCESS) queryName = "ticketsAssignedToAuthGroup";
    else if (accessType === AccessType.CREATE_ACCESS) queryName = "ticketsAssignedToAuthUser";
    else return;

    const ticketsResponse = await getServerData(`query { ${queryName} {id user title status createdAt openAt priority asset } }`, true);
    const tickets = ticketsResponse.data[queryName] as Ticket[];
    const assetList = tickets.map((ticket) => ticket.asset);
    const idList = assetList
      .filter((asset) => asset.startsWith("[product-") && asset.endsWith("]"))
      .map((asset) => parseInt(asset.substring(9, asset.length - 1)));
    const snList = assetList.filter((asset) => !asset.startsWith("[product-") || !asset.endsWith("]")).map((sn) => `"${sn}"`);

    const productsResponse = await getServerData(`query { productItems(snList: [${snList}]) { sn product { name model image } } }`);
    const productsByIdsResponse = await getServerData(`query { productsByIds(idList: [${idList}]) { id name model image }}`);

    const ticketItems = tickets.map((ticket) => ({
      ...ticket,
      productItem: productsResponse.data.productItems.filter((item: any) => item.sn === ticket.asset)?.at(0),
      product: productsByIdsResponse.data.productsByIds
        .filter((item: any) => item.id === parseInt(ticket.asset.substring(9, ticket.asset.length - 1)))
        ?.at(0)
    }));
    setViewNetTicket(false);
    setTickets(ticketItems);
    setTimeout(() => setOpenId(0), 1000);
  };

  React.useEffect(() => {
    action();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // render
  return (
    <>
      {privileges.addTicket && (
        <Button variant="contained" className="button button-right" onClick={() => setViewNetTicket(true)}>
          <AddCircle />
          Add New
        </Button>
      )}
      <ContentTable
        name="ticket"
        headers={accessType === AccessType.READ_ACCESS ? tableHeaderImmutable : tableHeaderMutable}
        canRead={privileges.readTicket}
        canWrite={privileges.writeTicket}
        data={tickets.filter(ticket => !onlyResolved || ticket.status === "RESOLVED" || ticket.status === "FEEDBACK").map((ticket) => ({
          createdAt: new Date(ticket.createdAt).toLocaleDateString(),
          client: ticket.user,
          image:
            ticket.productItem != null || ticket.product != null ? (
              <img
                src={data["site-url"] + (ticket.productItem?.product?.image ?? ticket.product?.image)}
                alt={ticket.productItem?.product?.name ?? ticket.product?.name}
              />
            ) : (
              <img src={LogoMin} alt="alardh-alsalba" />
            ),
          product: ticket.productItem != null ? ticket.productItem.product?.name + "\n" + ticket.productItem.product?.model : ticket.product?.name,
          summary: ticket.title,
          priority: <span className={`status-${ticket.priority.toLowerCase()}`}>{ticket.priority.toLowerCase()}</span>,
          status: ticket.status.toLowerCase(),
          open: (
            <Button variant="text" color="info" onClick={() => setOpenId(ticket.id)}>
              {accessType === AccessType.READ_ACCESS ? <Visibility /> : <Edit />}
            </Button>
          )
        }))}
      />
      <Modal open={openId !== 0} onClose={() => setOpenId(0)}>
        <div className="modal">
          <TicketForm accessType={accessType} id={openId} onUpdate={action} />
        </div>
      </Modal>
      <Modal open={viewNewTicket} onClose={() => setViewNetTicket(false)}>
        <div className="modal">
          <TicketForm onUpdate={action} />
        </div>
      </Modal>
    </>
  );
};

export default Tickets;
