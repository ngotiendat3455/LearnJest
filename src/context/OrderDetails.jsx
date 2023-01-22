import { createContext, useContext, useState } from "react";
import { pricePerItem } from "../constants";
import React from "react";
import { formatCurrency } from "../utilities";
const OrderDetails = createContext();

// create custom hook to check whether we're in a provider
export function useOrderDetails() {
  const contextValue = useContext(OrderDetails);

  if (!contextValue) {
    throw new Error(
      "useOrderDetails must be called from within an OrderDetailsProvider"
    );
  }

  return contextValue;
}

function calculateSubtotal(optionType, optionCounts) {
  let optionCount = 0;
  for (const count of optionCounts[optionType].values()) {
    optionCount += count;
  }
  return optionCount * pricePerItem[optionType];
}
export function OrderDetailsProvider(props) {
  const [optionCounts, setOptionCounts] = useState({
    scoops: new Map(),
    toppings: new Map(),
  });

  // const [totals, setTotal] = useState({
  //   scoops: 0,
  //   toppings: 0,
  //   grandTotal: 0,
  // });

  const value = React.useMemo(() => {
    function updateItemCount(itemName, newItemCount, optionType) {
      const newOptionCount = { ...optionCounts };
      const optionCountMap = newOptionCount[optionType];
      optionCountMap.set(itemName, parseInt(newItemCount));
      setOptionCounts(newOptionCount);
    }
    const scoopsTotals = calculateSubtotal("scoops", optionCounts);
    const toppingsTotals = calculateSubtotal("toppings", optionCounts);
    const totals = {
      scoops: formatCurrency(scoopsTotals),
      toppings: formatCurrency(toppingsTotals),
      grandTotal: formatCurrency(scoopsTotals + toppingsTotals),
    };
    return [
      {
        ...optionCounts,
        totals,
      },
      updateItemCount,
    ];
  });
  return (
    <OrderDetails.Provider value={value}>
      {props.children}
    </OrderDetails.Provider>
  );
}
