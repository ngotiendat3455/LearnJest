import { render } from "@testing-library/react";
import { OrderDetailsProvider } from "../context/OrderDetails";
const renderWithContext = (ui, options) => {
  return render(ui, {
    wrapper: OrderDetailsProvider,
    ...options,
  });
};

export * from "@testing-library/react";
export { renderWithContext as render };
