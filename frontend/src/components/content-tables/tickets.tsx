import React, { FunctionComponent } from "react";
import { Button, Modal } from "@mui/material";
import { AddCircle, DeleteForever, Edit, Visibility } from "@mui/icons-material";
import TicketForm from "../content-forms/ticket";
import ContentTable, { HeaderType, ITableHeader } from "../content-table";
import RoleContext from "../role-context";
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
  const privileges = React.useContext(RoleContext);

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

    if (privileges.createAdmin) queryName = "tickets";
    else if (privileges.createTicket) queryName = "ticketsByAuth";
    else if (privileges.updateTicket || privileges.updateRepair || privileges.createFeedback) queryName = "ticketsAssignedToAuthGroup";
    else if (privileges.createRepair) queryName = "ticketsAssignedToAuthUser";
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
      {privileges.createTicket && (
        <Button variant="contained" className="button" onClick={() => setViewNetTicket(true)}>
          <AddCircle />
          Add New
        </Button>
      )}
      <ContentTable
        name="ticket"
        headers={tableHeader}
        canCreate={privileges.createTicket}
        canDelete={privileges.deleteTicket}
        canRead={privileges.readTicket}
        canUpdate={privileges.updateTicket}
        data={tickets
          .filter(
            (ticket) =>
              privileges.createAdmin ||
              privileges.createTicket ||
              privileges.updateTicket ||
              privileges.createRepair ||
              (privileges.updateRepair && ticket.status === "RESOLVED") ||
              (privileges.createFeedback && ticket.status === "CLOSED")
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
            priority: <span className={`status-${ticket.priority.toLowerCase()}`}>{ticket.priority.toLowerCase()}</span>,
            status: ticket.status.toLowerCase().replace("_", " "),
            open: (
              <Button variant="text" color="info" onClick={() => setOpenId(ticket.id)}>
                {privileges.updateTicket ? <Edit /> : <Visibility />}
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
