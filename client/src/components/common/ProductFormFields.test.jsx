import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFieldArray, useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import ProductFormFields from "./ProductFormFields";

function ProductFormHarness({ onSubmit }) {
  const form = useForm({
    defaultValues: {
      catagory: "women",
      type: "tops",
      stock: [{ color: "#000", sizeRemaining: [] }],
    },
  });
  const { fields } = useFieldArray({ control: form.control, name: "stock" });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <ProductFormFields
        register={form.register}
        errors={form.formState.errors}
        category="women"
        setCategory={() => {}}
        setValue={form.setValue}
        uploadOptions={{ women: ["tops"], men: ["shirts"], both: ["tops"] }}
        fields={fields}
        StockBoxComponent={() => <div>Stock fields</div>}
        stockBoxProps={{}}
        loading={false}
        submitLabel="save"
      />
    </form>
  );
}

describe("ProductFormFields", () => {
  it("submits the shared product name and normalized form fields", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ProductFormHarness onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/name/i), "Everyday shirt");
    await user.type(screen.getByLabelText(/price/i), "24.95");
    await user.click(screen.getByRole("button", { name: "save" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Everyday shirt",
        price: "24.95",
        catagory: "women",
        type: "tops",
      }),
      expect.anything(),
    );
  });
});
