import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import useEvent from "@testing-library/user-event";
import SummaryForm from "../SummaryForm";

test("button has correct initial color", () => {
  render(<SummaryForm />);
  const confirmButton = screen.getByRole("button", { name: /confirm order/i });
  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  expect(checkbox).not.toBeChecked();
  expect(confirmButton).toBeDisabled();
});

test("checkbox disables button on first click and enable on second click",async () => {
  const user = useEvent.setup();
  render(<SummaryForm />);
  const confirmButton = screen.getByRole("button", { name: /confirm order/i });
  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  expect(checkbox).not.toBeChecked();
  expect(confirmButton).toBeDisabled();
  await user.click(checkbox);
  // expect(checkbox).toBeChecked();
  expect(confirmButton).toBeEnabled();
  await user.click(checkbox);
  expect(confirmButton).toBeDisabled();
});

test("popover responds to hover", async () => {
  const user = useEvent.setup();
  render(<SummaryForm />);
  // popover starts out hidden
  const nullPopover = screen.queryByText(
    /no ice cream will actually be delivered/i
  );
  expect(nullPopover).not.toBeInTheDocument();

  // popover appears upon mouseover of checkbox
  const checkbox = screen.getByText(/terms and conditions/i);
  await user.hover(checkbox);
  const popover = screen.queryByText(
    /no ice cream will actually be delivered/i
  );
  expect(popover).toBeInTheDocument();
  // popover disappears when we mouse out
  await user.unhover(checkbox);

    const nullPopoverAgain = screen.queryByText(
      /no ice cream will actually be delivered/i
    );
    expect(nullPopoverAgain).not.toBeInTheDocument();
  // await waitForElementToBeRemoved(() => {
  //   return screen.queryByText(/no ice cream will actually be delivered/i);
  // });
});
