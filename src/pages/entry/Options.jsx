import axios from "axios";
import React from "react";
import ScoopOption from "./ScoopOption";
import ToppingOption from "./ToppingOption";
import AlertBanner from "../../common/AlertBanner";
import { pricePerItem } from "../../constants";
import { useOrderDetails } from "../../context/OrderDetails";
import { Row } from "react-bootstrap";

export default function Options({ optionType }) {
  const [items, setItems] = React.useState([]);
  const [isError, setisError] = React.useState(false);
  const [{ totals }, updateItemCount] = useOrderDetails();
  React.useEffect(() => {
    axios
      .get(`http://localhost:3030/${optionType}`)
      .then((response) => setItems(response.data))
      .catch((error) => setisError(true));
  }, []);

  const ItemComponent = optionType === "scoops" ? ScoopOption : ToppingOption;

  const optionItems = items.map((item) => (
    <ItemComponent
      key={item.name}
      name={item.name}
      imagePath={item.imagePath}
      updateItemCount={(itemName, newItemCount) =>
        updateItemCount(itemName, newItemCount, optionType)
      }
    />
  ));
  const title = optionType[0].toUpperCase() + optionType.slice(1).toLowerCase();
  if (isError) {
    return <AlertBanner />;
  }
  return (
    <>
      <h2>{title}</h2>
      <p>{pricePerItem[optionType]} each</p>
      <p>
        {title} total {totals[optionType]}
      </p>
      <Row>{optionItems}</Row>
    </>
  );
}
