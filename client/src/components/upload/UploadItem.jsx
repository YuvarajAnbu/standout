import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import "./UploadItem.css";
import { useAppStore } from "../../store/useAppStore";
import products from "../../state/products";
import colors from "../../state/colors";
import StockBox from "./StockBox";
import { useTimedMessages } from "../../hooks/useTimedMessages";
import MessageBanner from "../common/MessageBanner";
import ProductFormFields from "../common/ProductFormFields";

const initialStock = {
  images: [],
  color: colors[0][1],
  sizeRemaining: [{ size: "", remaining: "" }],
};

export default function UploadItem() {
  const { uploadOptions } = products;
  const setUserProducts = useAppStore((state) => state.setUserProducts);
  const userCount = useAppStore((state) => state.userCount);
  const setUserCount = useAppStore((state) => state.setUserCount);
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

  const onSubmit = (data) => {
    setSubmitting(true);
    try {
      let nextId = userCount;
      const stock = data.stock.map((entry, index) => {
        const field = fields[index];
        const stockImages = images[field?.id];
        if (!stockImages?.length) throw new Error("Each stock item needs an image");
        nextId += 1;
        return { ...entry, _id: `${nextId}`, images: stockImages };
      });
      const product = {
        _id: `${userCount}`,
        name: data.name.trim(),
        price: Math.round(Number(data.price) * 100),
        catagory: data.catagory,
        type: data.type,
        createdAt: `${new Date().getTime()}`,
        stock,
      };

      setUserProducts((current) => [...current, product]);
      setUserCount(nextId + 1);
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
    } finally {
      setSubmitting(false);
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
          loading={submitting}
          submitLabel="upload"
        />
      </form>
    </div>
  );
}
