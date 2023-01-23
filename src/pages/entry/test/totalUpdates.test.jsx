import { render, screen } from "../../../test-utils/testing-library-utils";
import OrderEntry from "../OrderEntry";
import Options from "../Options";
import userEvent from "@testing-library/user-event";
test("update scoop subtotal when scoops change", async () => {
  const user = userEvent.setup();
  render(<Options optionType={"scoops"} />);

  // make sure total starts out $0.00
  const scoopsTotal = screen.getByText("Scoops total $", { exact: false });

  expect(scoopsTotal).toHaveTextContent("0.00");
  // update vanilla scoops to 1 and check the subtotal
  const vanillaScoops = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaScoops);
  await user.type(vanillaScoops, "1");
  screen.debug(vanillaScoops);
  expect(scoopsTotal).toHaveTextContent("2.00");

  // update chocolate scoops to 2 and check subtotal
  const chocolateScoops = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  await user.clear(chocolateScoops);
  await user.type(chocolateScoops, "2");
  expect(scoopsTotal).toHaveTextContent("6.00");
});

test("update topping subtotal when topping change", async () => {
  const user = userEvent.setup();
  render(<Options optionType={"toppings"} />);
  // make sure total starts out $0.00
  const toppingsTotal = screen.getByText("Toppings total $", { exact: false });
  expect(toppingsTotal).toHaveTextContent("0.00");
  // update check Cherries and check the subtotal
  const cherriesTopping = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  await user.click(cherriesTopping);
  expect(toppingsTotal).toHaveTextContent("1.50");
  // update check Hot fudge and check the subtotal
  const hotFudgeTopping = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });
  await user.click(hotFudgeTopping);
  expect(toppingsTotal).toHaveTextContent("3.00");
  // update uncheck Hot fudge and uncheck the subtotal
  await user.click(hotFudgeTopping);
  expect(toppingsTotal).toHaveTextContent("1.50");
});

describe("grand total", () => {
  // test("grand total starts at $0.00", () => {
  //   render(<OrderEntry />);
  //   const grandTotal = screen.getByText("Grand total: $", { exact: false });
  //   expect(grandTotal).toHaveTextContent("0.00");
  // });
  test("grand total updates properly if scoop is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });
    expect(grandTotal).toHaveTextContent("0.00");
    // update vanilla scoop to 2 and check grand total
    const vanillaScoops = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(vanillaScoops);
    await user.type(vanillaScoops, "2");

    expect(grandTotal).toHaveTextContent("4.00");

    const cherriesTopping = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    await user.click(cherriesTopping);
    expect(grandTotal).toHaveTextContent("5.50");
  });
  test("grand total updates properly if topping is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });
    // add cherries and check grand total
    const cherriesTopping = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    await user.click(cherriesTopping);
    expect(grandTotal).toHaveTextContent("1.50");
    // update vanilla scoop to 2 and check grand total
    const vanillaScoops = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(vanillaScoops);
    await user.type(vanillaScoops, "2");

    expect(grandTotal).toHaveTextContent("5.50");
  });
  test("grand total updates properly if item is removed", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });
    // add cherries and check grand total
    const cherriesTopping = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    await user.click(cherriesTopping);
    expect(grandTotal).toHaveTextContent("1.50");
    // update vanilla scoop to 2 and check grand total
    const vanillaScoops = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    await user.clear(vanillaScoops);
    await user.type(vanillaScoops, "2");

    expect(grandTotal).toHaveTextContent("5.50");

    await user.clear(vanillaScoops);
    await user.type(vanillaScoops, "1");

    expect(grandTotal).toHaveTextContent("3.50");

    await user.click(cherriesTopping);
    expect(grandTotal).toHaveTextContent("2.00");
  });
});
