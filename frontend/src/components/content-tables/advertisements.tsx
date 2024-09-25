import React, { FunctionComponent } from "react";
import getServerData from "../../libs/server-data";
import Management, { ManagementType, Operation } from "../management";
import ContentTable, { HeaderType, ITableHeader } from "../content-table";
import ProfileContext from "../profile-context";
import data from "../../data.json";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import ImageUpload from "../image-upload";
import ContentForm from "../content-form";

// types
interface IAdvertisements {
  id: number;
  imageUrl: string;
  imageOrder: number;
  createdAt: string;
}

// main component
const Advertisements: FunctionComponent = () => {
  // productItem state
  const [advertisements, setAdvertisements] = React.useState<IAdvertisements[]>([]);
  const [image, setImage] = React.useState("");
  const [lastOrder, setLastOrder] = React.useState(0);

  // context
  const privileges = React.useContext(ProfileContext);

  // productItem schema
  const tableHeader: ITableHeader[] = [
    { key: "image", title: "Image" },
    { key: "createdAt", title: "Creation Date" },
    { key: "orderUp", title: "Up", type: HeaderType.UPDATE },
    { key: "orderDown", title: "Down", type: HeaderType.UPDATE },
    { key: "delete", title: "Delete", type: HeaderType.DELETE }
  ];
  // on load
  const action = async () => {
    setImage("");
    const result = await getServerData(`query { advertisements { id imageUrl imageOrder createdAt } }`);
    setAdvertisements(result.data.advertisements);
    if (result.data?.advertisements?.length !== null && result.data?.advertisements?.length > 0)
      setLastOrder(Math.max(...result.data.advertisements.map((ads: IAdvertisements) => ads.imageOrder)));
    else setLastOrder(1);
  };

  // event handler
  React.useEffect(() => {
    action();
  }, []);

  // render
  return (
    <div>
      {privileges.createAdvertisement && (
        <ContentForm
          name="ads"
          title="Create new ads"
          command={`mutation { createAdvertisement(input: {imageUrl: "${image}", imageOrder: ${
            lastOrder + 1
          }}) { id imageUrl imageOrder createdAt }}`}
          commandDisabled={image === ""}
          commandDisabledMessage="Please upload image the click save button"
          onUpdate={() => action()}
        >
          <ImageUpload name="image" uploadUrl="/upload-product" formName="product" value={image} onChange={(url) => setImage(url)} />
        </ContentForm>
      )}
      <ContentTable
        name="advertisement"
        headers={tableHeader}
        canCreate={privileges.createAdvertisement}
        canDelete={privileges.deleteAdvertisement}
        canRead={privileges.readAdvertisement}
        canUpdate={privileges.updateAdvertisement}
        hasSnColumn={true}
        data={advertisements.map((ads, index) => ({
          image: <img src={data["site-url"] + ads.imageUrl} alt={"ads"} />,
          createdAt: new Date(parseInt(ads.createdAt)).toLocaleString(),
          orderUp: (
            <Management
              type={ManagementType.button}
              operation={Operation.update}
              hasButtonClass={false}
              command={
                index > 0
                  ? `mutation { u1:updateAdvertisement(id: ${ads.id}, input: {imageOrder: ${
                      advertisements[index - 1].imageOrder
                    }})  {createdAt} u2:updateAdvertisement(id: ${advertisements[index - 1].id}, input: {imageOrder: ${
                      ads.imageOrder
                    }})  {createdAt}}`
                  : ""
              }
              onUpdate={action}
              buttonIcon={<ArrowDropUp />}
              hasButtonText={false}
              isDisabled={index === 0}
            />
          ),
          orderDown: (
            <Management
              type={ManagementType.button}
              operation={Operation.update}
              hasButtonClass={false}
              command={
                index < advertisements.length - 1
                  ? `mutation { u1:updateAdvertisement(id: ${ads.id}, input: {imageOrder: ${
                      advertisements[index + 1].imageOrder
                    }})  {createdAt} u2:updateAdvertisement(id: ${advertisements[index + 1].id}, input: {imageOrder: ${
                      ads.imageOrder
                    }})  {createdAt}}`
                  : ""
              }
              onUpdate={action}
              buttonIcon={<ArrowDropDown />}
              hasButtonText={false}
              isDisabled={index === advertisements.length - 1}
            />
          ),
          delete: (
            <Management
              type={ManagementType.button}
              operation={Operation.delete}
              command={`mutation { deleteAdvertisement(id: ${ads.id})  {imageUrl}}`}
              hasConfirmModal={true}
              onUpdate={action}
            />
          )
        }))}
      />
    </div>
  );
};

export default Advertisements;
