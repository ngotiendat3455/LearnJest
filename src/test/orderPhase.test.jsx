import { render, screen } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";

test("Order phases for happy path", async () => {
  const user = userEvent.setup();
  render(<App />);
  // add ice cream scoops and toppings
  const vanillaScoops = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaScoops);
  await user.type(vanillaScoops, "1");

  const chocolateScoops = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  await user.clear(chocolateScoops);
  await user.type(chocolateScoops, "2");

  const cherriesTopping = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  await user.click(cherriesTopping);
  // find and click order summary button
  const orderButton = await screen.findByRole("button", {
    name: /order sundae/i,
  });
  await user.click(orderButton);

  //check summary information based on order
  const summaryHeading = await screen.findByRole("heading", {
    name: "Order Summary",
  });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsTotal = screen.getByRole("heading", {
    name: "Scoops total: $6.00",
  });
  expect(scoopsTotal).toBeInTheDocument();

  const toppingTotal = screen.getByRole("heading", {
    name: "Toppings total: $1.50",
  });
  expect(toppingTotal).toBeInTheDocument();

  expect(screen.getByText("1 Vanilla")).toBeInTheDocument();
  expect(screen.getByText("2 Chocolate")).toBeInTheDocument();
  expect(screen.getByText("Cherries")).toBeInTheDocument();

  const listItem = screen.getAllByRole("listitem");
  const optionItemtext = listItem.map((ele) => ele.textContent);
  expect(optionItemtext).toEqual(["1 Vanilla", "2 Chocolate", "Cherries"]);
  // check summary option items
  const grandTotal = screen.getByRole("heading", {
    name: "Total $7.50",
  });
  expect(grandTotal).toBeInTheDocument();
  // accept terms and click button
  const tcCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  await user.click(tcCheckbox);
  const confirmButton = screen.getByRole("button", {
    name: /confirm order/i,
  });
  await user.click(confirmButton);
  // confirm order number on confirmation page
  const headingThankYou = await screen.findByRole("heading", {
    name: /thank you/i,
  });
  expect(headingThankYou).toBeInTheDocument();

  const notLoading = screen.queryByText("loading");
  expect(notLoading).toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  // click "new order" button confirmation page
  const buttonNewConfirm = await screen.findByRole("button", {
    name: /new order/i,
  });
  await user.click(buttonNewConfirm);
  // check that scoops and toppings subtotals have been reset

  const scoopsTotalReset = await screen.findByText("Scoops total: $0.00");
  expect(scoopsTotalReset).toBeInTheDocument();
  const toppingTotalReset = screen.getByText("Toppings total: $0.00");
  expect(toppingTotalReset).toBeInTheDocument();
  // do we need to await anything to avoid
  await screen.findByRole("spinbutton", { name: "Vanilla" });
  await screen.findByRole("checkbox", { name: "Cherries" });
});
