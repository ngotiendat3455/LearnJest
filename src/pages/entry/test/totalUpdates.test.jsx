import { render, screen } from "../../../test-utils/testing-library-utils";
import OrderEntry from "../OrderEntry";
import Options from "../Options";
import userEvent from "@testing-library/user-event";
test("update scoop subtotal when scoops change", async () => {
  render(<Options optionType={"scoops"} />);

  // make sure total starts out $0.00
  const scoopsTotal = screen.getByText("Scoops total $", { exact: false });
  expect(scoopsTotal).toHaveTextContent("0.00");
  // update vanilla scoops to 1 and check the subtotal
  const vanillaScoops = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  userEvent.clear(vanillaScoops);
  userEvent.type(vanillaScoops, "1");
  expect(scoopsTotal).toHaveTextContent("2.00");

  // update chocolate scoops to 2 and check subtotal
  const chocolateScoops = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  userEvent.clear(chocolateScoops);
  userEvent.type(chocolateScoops, "2");
  expect(scoopsTotal).toHaveTextContent("6.00");
});

test("update topping subtotal when topping change", async () => {
  render(<Options optionType={"toppings"} />);
  // make sure total starts out $0.00
  const toppingsTotal = screen.getByText("Toppings total $", { exact: false });
  expect(toppingsTotal).toHaveTextContent("0.00");
  // update check Cherries and check the subtotal
  const cherriesTopping = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  userEvent.click(cherriesTopping);
  expect(toppingsTotal).toHaveTextContent("1.50");
  // update check Hot fudge and check the subtotal
  const hotFudgeTopping = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });
  userEvent.click(hotFudgeTopping);
  expect(toppingsTotal).toHaveTextContent("3.00");
  // update uncheck Hot fudge and uncheck the subtotal
  userEvent.click(hotFudgeTopping);
  expect(toppingsTotal).toHaveTextContent("1.50");
});
