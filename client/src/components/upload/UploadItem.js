import React, { useContext, useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./UploadItem.css";
import {
  ProductsContext,
  UserContext,
  UserProductsContext,
  UserCountContext,
  ColorsContext,
} from "../../App";
import StockBox from "./StockBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function UploadItem() {
  const history = useHistory();

  const { uploadOptions } = useContext(ProductsContext);
  const { user } = useContext(UserContext);
  const { setUserProducts } = useContext(UserProductsContext);
  const { userCount, setUserCount } = useContext(UserCountContext);
  const colors = useContext(ColorsContext);

  const [catagory, setCatagory] = useState("women");
  const [type, setType] = useState(uploadOptions.women[0]);
  const [images, setImages] = useState({});

  const [successMsgs, setSuccessMsgs] = useState("");
  const [errorMsgs, setErrorMsgs] = useState("");
  const [showMsgs, setShowMsgs] = useState(false);

  const [loadingButton, setLoadingButton] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Upload Item | Stand Out";
  }, []);

  useEffect(() => {
    if (typeof user.name !== "undefined") {
      axios
        .get(`/user/is-admin`)
        .then((res) => {
          if (res.status !== 200) {
            throw new Error();
          }
          if (res.data === "admin") {
            setLoading(false);
          } else {
            history.push("404");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      history.replace("/404");
    }
  }, [user.name, history]);

  useEffect(() => {
    if (errorMsgs !== "") {
      const a = setTimeout(() => {
        setErrorMsgs("");
      }, 3400);
      const b = setTimeout(() => {
        setShowMsgs(true);
      }, 1);
      const c = setTimeout(() => {
        setShowMsgs(false);
      }, 3000);

      return () => {
        clearTimeout(a);
        clearTimeout(b);
        clearTimeout(c);
      };
    }
  }, [errorMsgs]);

  useEffect(() => {
    if (successMsgs !== "") {
      const a = setTimeout(() => {
        setSuccessMsgs("");
      }, 3400);
      const b = setTimeout(() => {
        setShowMsgs(true);
      }, 1);
      const c = setTimeout(() => {
        setShowMsgs(false);
      }, 3000);

      return () => {
        clearTimeout(a);
        clearTimeout(b);
        clearTimeout(c);
      };
    }
  }, [successMsgs]);

  const {
    register,
    handleSubmit,
    errors,
    control,
    getValues,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      catagory,
      type,
      stock: [
        {
          image: [],
          color: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "stock",
  });

  const onSubmit = async (data) => {
    setLoadingButton(true);
    try {
      const cents = Math.round(data.price * 100);
      let count = userCount;

      const createdAt = `${new Date().getTime()}`;

      const product = {
        _id: `${count}`,
        name: data.name,
        price: cents,
        catagory: data.catagory,
        type: data.type,
        createdAt,
        stock: [],
      };

      const imgArr = Object.values(images);

      for (var i = 0; i < data.stock.length; i++) {
        if (typeof imgArr[i] === "undefined") {
          throw new Error();
        }

        product.stock.push({
          _id: `${count + 1}`,
          images: imgArr[i],
          color: data.stock[i].color,
          sizeRemaining: data.stock[i].sizeRemaining,
        });
        count = count + 1;
      }
      setUserProducts((prev) => [...prev, product]);
      setUserCount(count + 1);

      setSuccessMsgs("Product Uploaded Successfully");
      reset();
      setValue("catagory", catagory);
      setValue("type", type);
      setImages({});
      setLoadingButton(false);
    } catch (err) {
      console.log(err);
      setErrorMsgs("Something went wrong. Please try again");
      setLoadingButton(false);
    }
  };

  return loading ? (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  ) : (
    <div className="upload">
      {errorMsgs !== "" && (
        <div className={showMsgs ? "msg msg--visible" : "msg"}>
          <FontAwesomeIcon
            icon={["far", "times-circle"]}
            className="icon"
            onClick={() => {
              setSuccessMsgs("");
            }}
          />
          <p>{errorMsgs}</p>
        </div>
      )}
      {successMsgs !== "" && (
        <div className={showMsgs ? "msg msg--visible" : "msg"}>
          <FontAwesomeIcon
            icon={["far", "check-circle"]}
            className="icon"
            onClick={() => {
              setSuccessMsgs("");
            }}
          />
          <p>{successMsgs}</p>
        </div>
      )}
      <h1>upload products</h1>
      <form className="upload__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="upload__form__input-container">
          <label htmlFor="name">
            name <span>*</span>
          </label>
          <input
            name="name"
            autoFocus
            ref={register({
              pattern: {
                value: /^[\w/d ]{0,}[\w-/d]{2,}[\w-/d ]{0,}$/,
                message: 'should only be 2 or more than 2 letters, "-"',
              },
              required: "Required",
            })}
          />
          {typeof errors.name !== "undefined" && (
            <p className="upload__form__input-container__error-msg">
              <FontAwesomeIcon icon="circle" className="icon" />{" "}
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="upload__form__input-container">
          <label htmlFor="price">
            price <span>*</span>
          </label>
          <input
            name="price"
            className="upload__form__input-container__price"
            placeholder="20 or 20.55 (in USD)"
            ref={register({
              required: "Required",
              pattern: {
                value: /^(\d+)(\.\d+)?$/,
                message: "Must be numbers or decimals",
              },
            })}
          />
          {typeof errors.price !== "undefined" && (
            <p className="upload__form__input-container__error-msg">
              <FontAwesomeIcon icon="circle" className="icon" />{" "}
              {errors.price.message}
            </p>
          )}
        </div>
        <div className="upload__form__flex">
          <div className="upload__form__input-container">
            <label htmlFor="catagory">
              catagory <span>*</span>
            </label>
            <div className="upload__form__input-container__select-container">
              <select
                name="catagory"
                onChange={(e) => setCatagory(e.target.value)}
                ref={register}
              >
                <option value="women">women</option>
                <option value="men">men</option>
                <option value="both">both</option>
              </select>
              <FontAwesomeIcon icon="chevron-right" className="icon" />
            </div>
          </div>
          <div className=" upload__form__input-container">
            <label htmlFor="type">
              type <span>*</span>
            </label>
            <div className="upload__form__input-container__select-container">
              <select
                name="type"
                ref={register}
                onChange={(e) => {
                  setType(e.target.value);
                }}
              >
                {uploadOptions[catagory].map((el, l) => (
                  <option value={el.toLowerCase()} key={l}>
                    {el}
                  </option>
                ))}
              </select>
              <FontAwesomeIcon icon="chevron-right" className="icon" />
            </div>
          </div>
        </div>
        <div className=" upload__form__input-container upload__form__stocks-box">
          <label htmlFor="stock">
            stock <span>*</span>
          </label>

          <div className="upload__form__stocks-box__stocks-container">
            {fields.map((field, index) => (
              <StockBox
                key={field.id}
                {...{
                  control,
                  register,
                  errors,
                  images,
                  setImages,
                  getValues,
                  colors,
                  setValue,
                  index,
                  field,
                  append,
                  remove,
                }}
              />
            ))}
          </div>
        </div>
        <button
          className={
            loadingButton
              ? "upload__form__submit-button upload__form__submit-button--loading"
              : "upload__form__submit-button"
          }
          type="submit"
        >
          {loadingButton ? (
            <div className="upload__form__submit-button__loader"></div>
          ) : (
            "upload"
          )}
        </button>
      </form>
    </div>
  );
}

export default UploadItem;
