import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "@/pages/admin/upload-product/UploadItem.scss";
import products from "@/features/catalog/data/products";
import colors from "@/features/catalog/data/colors";
import StockBox from "@/pages/admin/upload-product/StockBox";
import { useTimedMessages } from "@/shared/hooks/useTimedMessages";
import MessageBanner from "@/shared/components/ui/MessageBanner";
import ProductFormFields from "@/features/admin/components/ProductFormFields";
import { buildProductPayload } from "@/features/admin/productPayload";
import { apiRequest } from "@/shared/api/client";

const initialStock = {
  images: [],
  color: colors[0][1],
  sizeRemaining: [{ size: "", remaining: "" }],
};

export default function UploadItem() {
  const { uploadOptions } = products;
  const queryClient = useQueryClient();
  const [category, setCategory] = useState("women");
  const [images, setImages] = useState({});
  const {
    successMsgs,
    errorMsgs,
    showMsgs,
    setSuccessMsgs,
    setErrorMsgs,
    dismissMessages,
  } = useTimedMessages();

  useEffect(() => {
    document.title = "Upload Item | Stand Out";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      catagory: category,
      type: uploadOptions[category][0].toLowerCase(),
      stock: [initialStock],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "stock" });
  const createProduct = useMutation({
    mutationFn: (product) =>
      apiRequest("/product", {
        method: "POST",
        body: { product },
      }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["products"] }),
        queryClient.invalidateQueries({ queryKey: ["http"] }),
        queryClient.invalidateQueries({ queryKey: ["http-scope"] }),
      ]),
  });

  const onSubmit = async (data) => {
    try {
      const product = buildProductPayload(data, fields, images);
      await createProduct.mutateAsync(product);
      setSuccessMsgs("Product uploaded successfully");
      setCategory("women");
      setImages({});
      reset({
        catagory: "women",
        type: uploadOptions.women[0].toLowerCase(),
        stock: [initialStock],
      });
    } catch (error) {
      setErrorMsgs(error.message || "Something went wrong. Please try again");
    }
  };

  return (
    <div className="upload">
      <MessageBanner message={errorMsgs} type="error" visible={showMsgs} onDismiss={dismissMessages} />
      <MessageBanner message={successMsgs} type="success" visible={showMsgs} onDismiss={dismissMessages} />
      <h1>upload products</h1>
      <form className="upload__form" onSubmit={handleSubmit(onSubmit)}>
        <ProductFormFields
          register={register}
          errors={errors}
          category={category}
          setCategory={setCategory}
          setValue={setValue}
          uploadOptions={uploadOptions}
          fields={fields}
          StockBoxComponent={StockBox}
          stockBoxProps={{
            control,
            register,
            errors,
            images,
            setImages,
            getValues,
            colors,
            setValue,
            append,
            remove,
          }}
          loading={createProduct.isPending}
          submitLabel="upload"
        />
      </form>
    </div>
  );
}
