import React, { FunctionComponent } from "react";
import { Button, Modal } from "@mui/material";
import { AddCircle, Edit, Visibility } from "@mui/icons-material";
import TicketForm from "../content-forms/ticket";
import ContentTable, { HeaderType, ITableHeader } from "../content-table";
import ProfileContext from "../profile-context";
import getServerData from "../../libs/server-data";
import LogoMin from "../../assets/imgs/logo-min.png";
import data from "../../data.json";
import Management, { ManagementType, Operation } from "../management";

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

// main component
const Tickets: FunctionComponent = () => {
  // ticket state
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [openId, setOpenId] = React.useState(0);
  const [viewNewTicket, setViewNetTicket] = React.useState(false);

  // context
  const profile = React.useContext(ProfileContext);

  // ticket schema
  const tableHeader: ITableHeader[] = [
    { key: "createdAt", title: "Creation Date" },
    { key: "client", title: "Client Phone" },
    { key: "image", title: "Product Image", type: HeaderType.SPECIAL },
    { key: "product", title: "Product Name" },
    { key: "summary", title: "Summary" },
    { key: "status", title: "Status" },
    { key: "priority", title: "Priority" },
    { key: "open", title: "Open Ticket", type: HeaderType.SPECIAL },
    { key: "delete", title: "Delete", type: HeaderType.DELETE }
  ];

  // on load
  const action = async () => {
    let queryName = "";

    if (profile.privileges.createAdmin) queryName = "tickets";
    else if (profile.privileges.createTicket && !profile.privileges.updateTicket) queryName = "ticketsByAuth";
    else if (profile.privileges.updateTicket || profile.privileges.updateRepair || profile.privileges.createFeedback) queryName = "ticketsAssignedToAuthGroup";
    else if (profile.privileges.createRepair) queryName = "ticketsAssignedToAuthUser";
    else return;

    const ticketsResponse = await getServerData(`query { ${queryName} {id user title status createdAt openAt priority asset } }`, true);
    const tickets = ticketsResponse.data[queryName] as Ticket[];
    const assetList = tickets.map((ticket) => ticket.asset);
    const idList = assetList.filter((asset) => asset.startsWith("[product-") && asset.endsWith("]")).map((asset) => parseInt(asset.substring(9, asset.length - 1)));
    const snList = assetList.filter((asset) => !asset.startsWith("[product-") || !asset.endsWith("]")).map((sn) => `"${sn}"`);

    const productsResponse = await getServerData(`query { productItems(snList: [${snList}]) { sn product { name model image } } }`);
    const productsByIdsResponse = await getServerData(`query { productsByIds(idList: [${idList}]) { id name model image }}`);

    const ticketItems = tickets.map((ticket) => ({
      ...ticket,
      productItem: productsResponse.data.productItems.filter((item: any) => item.sn === ticket.asset)?.at(0),
      product: productsByIdsResponse.data.productsByIds.filter((item: any) => item.id === parseInt(ticket.asset.substring(9, ticket.asset.length - 1)))?.at(0)
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
      {profile.privileges.createTicket && (
        <Button variant="contained" className="button" onClick={() => setViewNetTicket(true)}>
          <AddCircle />
          Add New
        </Button>
      )}
      <ContentTable
        name="ticket"
        headers={tableHeader}
        canCreate={profile.privileges.createTicket}
        canDelete={profile.privileges.deleteTicket}
        canRead={profile.privileges.readTicket}
        canUpdate={profile.privileges.updateTicket}
        data={tickets
          .filter(
            (ticket) =>
              profile.privileges.createAdmin ||
              profile.privileges.createTicket ||
              profile.privileges.updateTicket ||
              profile.privileges.createRepair ||
              (profile.privileges.updateRepair && ticket.status === "RESOLVED") ||
              (profile.privileges.createFeedback && ticket.status === "CLOSED")
          )
          .map((ticket) => ({
            createdAt: new Date(ticket.createdAt).toLocaleDateString(),
            client: ticket.user,
            image:
              ticket.productItem != null || ticket.product != null ? (
                <img src={data["site-url"] + (ticket.productItem?.product?.image ?? ticket.product?.image)} alt={ticket.productItem?.product?.name ?? ticket.product?.name} />
              ) : (
                <img src={LogoMin} alt="alardh-alsalba" />
              ),
            product: ticket.productItem != null ? ticket.productItem.product?.name + "\n" + ticket.productItem.product?.model : ticket.product?.name,
            summary: ticket.title,
            priority: <span className={`priority-${ticket.priority.toLowerCase()}`}>{ticket.priority.toLowerCase()}</span>,
            status: ticket.status.toLowerCase().replace("_", " "),
            open: (
              <Button variant="text" color="info" onClick={() => setOpenId(ticket.id)}>
                {profile.privileges.updateTicket ? <Edit /> : <Visibility />}
              </Button>
            ),
            delete: (
              <Management
                type={ManagementType.button}
                operation={Operation.delete}
                command={`mutation { deleteTicket(id: ${ticket.id})  {id}}`}
                hasConfirmModal={true}
                onUpdate={action}
                isService={true}
              />
            )
          }))}
      />
      <Modal open={openId !== 0} onClose={() => setOpenId(0)}>
        <div className="modal">
          <TicketForm id={openId} onUpdate={action} />
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
