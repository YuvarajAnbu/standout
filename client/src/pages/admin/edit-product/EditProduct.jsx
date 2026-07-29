import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "@/pages/admin/upload-product/UploadItem.scss";
import products from "@/features/catalog/data/products";
import colors from "@/features/catalog/data/colors";
import StockBox from "@/pages/admin/edit-product/StockBox";
import { useTimedMessages } from "@/shared/hooks/useTimedMessages";
import MessageBanner from "@/shared/components/ui/MessageBanner";
import ProductFormFields from "@/features/admin/components/ProductFormFields";
import { buildProductPayload } from "@/features/admin/productPayload";
import { apiRequest } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/queries";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { uploadOptions } = products;
  const productQuery = useQuery({
    queryKey: queryKeys.product(id),
    queryFn: ({ signal }) => apiRequest(`/product/${id}`, { signal }),
    staleTime: 60_000,
  });
  const item = productQuery.data;

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    setValue,
  } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "stock" });

  useEffect(() => {
    document.title = "Edit Products | Stand Out";
  }, []);

  useEffect(() => {
    if (productQuery.isError) {
      navigate("/404", { replace: true });
    }
  }, [navigate, productQuery.isError]);

  useEffect(() => {
    if (!item?.stock?.length || fields.length > 0) return;

    setCategory(item.catagory);
    setValue("catagory", item.catagory);
    setValue("type", item.type);
    setImages(
      Object.fromEntries(
        item.stock.map((stock) => [stock._id, stock.images]),
      ),
    );
    append(
      item.stock.map((stock) => ({
        color: stock.color,
        _id: stock._id,
        sizeRemaining: stock.sizeRemaining,
      })),
    );
  }, [append, fields.length, item, setValue]);

  const updateProduct = useMutation({
    mutationFn: (product) =>
      apiRequest(`/product/${id}`, {
        method: "PUT",
        body: { product },
      }),
    onSuccess: (product) => {
      queryClient.setQueryData(queryKeys.product(id), product);
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ["products"] }),
        queryClient.invalidateQueries({ queryKey: ["http"] }),
        queryClient.invalidateQueries({ queryKey: ["http-scope"] }),
      ]);
    },
  });

  const onSubmit = async (data) => {
    try {
      const product = buildProductPayload(data, fields, images, {
        includeStockIds: true,
      });
      await updateProduct.mutateAsync(product);
      setSuccessMsgs("Product updated successfully");
    } catch (error) {
      setErrorMsgs(error.message || "Something went wrong. Please try again");
    }
  };

  if (!item) {
    return (
      <div className="loader-container">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="upload">
      <MessageBanner message={errorMsgs} type="error" visible={showMsgs} onDismiss={dismissMessages} />
      <MessageBanner message={successMsgs} type="success" visible={showMsgs} onDismiss={dismissMessages} />
      <h1>edit products</h1>
      <form className="upload__form" onSubmit={handleSubmit(onSubmit)}>
        <ProductFormFields
          register={register}
          errors={errors}
          category={category}
          setCategory={setCategory}
          setValue={setValue}
          uploadOptions={uploadOptions}
          defaultProduct={item}
          fields={fields}
          StockBoxComponent={StockBox}
          stockBoxProps={{
            control,
            register,
            errors,
            images,
            setImages,
            getValues,
            item,
            colors,
            setValue,
            append,
            remove,
          }}
          loading={updateProduct.isPending}
          submitLabel="save changes"
        />
      </form>
    </div>
  );
}
