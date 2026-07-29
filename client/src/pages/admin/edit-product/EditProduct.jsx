import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import "@/pages/admin/upload-product/UploadItem.scss";
import { useAppStore } from "@/app/store/useAppStore";
import products from "@/features/catalog/data/products";
import colors from "@/features/catalog/data/colors";
import StockBox from "@/pages/admin/edit-product/StockBox";
import { useTimedMessages } from "@/shared/hooks/useTimedMessages";
import MessageBanner from "@/shared/components/ui/MessageBanner";
import ProductFormFields from "@/features/admin/components/ProductFormFields";
import { apiRequest } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/queries";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { uploadOptions } = products;
  const userProducts = useAppStore((state) => state.userProducts);
  const setUserProducts = useAppStore((state) => state.setUserProducts);
  const userCount = useAppStore((state) => state.userCount);
  const setUserCount = useAppStore((state) => state.setUserCount);
  const hideProducts = useAppStore((state) => state.hideProducts);
  const setHideProducts = useAppStore((state) => state.setHideProducts);
  const isLocalProduct = id.length < 20 || hideProducts.includes(id);
  const localProduct = userProducts.find((product) => product._id === id);
  const productQuery = useQuery({
    queryKey: queryKeys.product(id),
    queryFn: ({ signal }) => apiRequest(`/product/${id}`, { signal }),
    enabled: !isLocalProduct,
    staleTime: 60_000,
  });
  const item = isLocalProduct ? localProduct : productQuery.data;

  const [category, setCategory] = useState("women");
  const [images, setImages] = useState({});
  const [submitting, setSubmitting] = useState(false);
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
    if ((isLocalProduct && !localProduct) || productQuery.isError) {
      navigate("/404", { replace: true });
    }
  }, [isLocalProduct, localProduct, navigate, productQuery.isError]);

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

  const onSubmit = (data) => {
    setSubmitting(true);
    try {
      let nextId = userCount;
      const stock = data.stock.map((entry, index) => {
        const field = fields[index];
        const stockImages = images[field?._id || field?.id];
        if (!stockImages?.length) throw new Error("Each stock item needs an image");
        const stockId = field?._id || `${nextId++}`;
        return { ...entry, _id: stockId, images: stockImages };
      });
      const product = {
        _id: id,
        name: data.name.trim(),
        price: Math.round(Number(data.price) * 100),
        catagory: data.catagory,
        type: data.type,
        createdAt: `${new Date().getTime()}`,
        stock,
      };

      setUserProducts((current) => [
        ...current.filter((existing) => existing._id !== id),
        product,
      ]);
      setUserCount(nextId + 1);
      if (id.length >= 20) {
        setHideProducts((current) =>
          current.includes(id) ? current : [...current, id],
        );
      }
      setSuccessMsgs("Product updated successfully");
    } catch (error) {
      setErrorMsgs(error.message || "Something went wrong. Please try again");
    } finally {
      setSubmitting(false);
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
          loading={submitting}
          submitLabel="save changes"
        />
      </form>
    </div>
  );
}
