import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import "../upload/UploadItem.css";
import {
  ProductsContext,
  UserContext,
  UserProductsContext,
  UserCountContext,
  HideProductsContext,
  ColorsContext,
} from "../../App";
import StockBox from "./StockBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function EditProduct() {
  // const history = useHistory();
  let navigate = useNavigate();
  const [item, setItem] = useState({});

  const { uploadOptions } = useContext(ProductsContext);
  const { user } = useContext(UserContext);
  const { userProducts, setUserProducts } = useContext(UserProductsContext);
  const { userCount, setUserCount } = useContext(UserCountContext);
  const { hideProducts, setHideProducts } = useContext(HideProductsContext);
  const colors = useContext(ColorsContext);

  const [catagory, setCatagory] = useState("women");
  const [images, setImages] = useState({});

  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  const [successMsgs, setSuccessMsgs] = useState("");
  const [errorMsgs, setErrorMsgs] = useState("");
  const [showMsgs, setShowMsgs] = useState(false);

  useEffect(() => {
    document.title = "Edit Products | Stand Out";
  }, []);

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

  useEffect(() => {
    if (typeof user.name !== "undefined") {
      axios
        .get(`/user/is-admin`)
        .then((res) => {
          if (res.status !== 200) {
            throw new Error();
          }
          if (res.data !== "admin") {
            // history.push(404);
            navigate("/404");
          }
        })
        .catch((err) => {
          console.log(err);
          // history.push(404);
          navigate("/404");
        });
    } else {
      // history.replace("/404");
      navigate("/404", { replace: true });
    }
  }, [user.name, navigate]);

  useEffect(() => {
    if (id.length < 20 || hideProducts.includes(id)) {
      const product = userProducts.filter((e) => e._id === id);

      if (product.length === 0) {
        // history.replace("/404");
        navigate("/404", { replace: true });
      } else {
        setItem(product[0]);
      }
    } else {
      axios
        .get(`/product/${id}`)
        .then((res) => {
          if (res.status !== 200) {
            throw new Error();
          }
          if (typeof res.data.name === "undefined") {
            // history.replace("/404");
            navigate("/404", { replace: true });
          } else {
            setItem(res.data);
          }
        })
        .catch((err) => {
          // history.replace("/404");
          navigate("/404", { replace: true });
          console.log(err);
        });
    }
  }, [id, userProducts, hideProducts, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    setValue,
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "stock",
  });

  useEffect(() => {
    if (typeof item._id !== "undefined") {
      if (fields.length < 1) {
        item.stock.forEach((el) => {
          setTimeout(() => {
            setImages((prev) => {
              return { ...prev, [el._id]: el.images };
            });
            append({
              color: el.color,
              _id: el._id,
              sizeRemaining: el.sizeRemaining,
            });
          }, 1);
        });
      }
    }
  }, [item, append, fields.length]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const cents = Math.round(data.price * 100);
      let count = userCount;

      const createdAt = `${new Date().getTime()}`;

      const product = {
        _id: id,
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
          _id: `${count}`,
          images: imgArr[i],
          color: data.stock[i].color,
          sizeRemaining: data.stock[i].sizeRemaining,
        });
        count = count + 1;
      }
      setUserProducts((prev) => [...prev.filter((e) => e._id !== id), product]);
      setUserCount(count + 1);
      if (id.length > 20) {
        setHideProducts((prev) => [...prev, id]);
      }
      setSuccessMsgs("Product Updated Successfully");
      setLoading(false);
    } catch (err) {
      console.log(err);
      setErrorMsgs("Something went wrong. Please try again");
      setLoading(false);
    }
  };

  return typeof item._id === "undefined" ? (
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
      <h1>edit products</h1>
      <form className="upload__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="upload__form__input-container">
          <label htmlFor="name">
            name <span>*</span>
          </label>
          <input
            name="name"
            autoFocus
            placeholder="eg.  button down shirts for men"
            id="inputName"
            {...register("inputName", {
              pattern: {
                value: /^[\w/d ]{0,}[\w-/d]{2,}[\w-/d ]{0,}$/,
                message: "should only be 2 or more than 2 letters",
              },
              required: "required",
            })}
            defaultValue={item.name}
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
            placeholder="25.55 or 25 (in usd)"
            {...register("price", {
              required: "required",
              pattern: {
                value: /^(\d+)(\.\d+)?$/,
                message:
                  "should only contain number and may or may not one decimal",
              },
            })}
            defaultValue={item.price / 100}
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
                {...register("catagory")}
                defaultValue={item.catagory}
              >
                <option value="women">women</option>
                <option value="men">men</option>
                <option value="both">both</option>
              </select>{" "}
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
                {...register("type")}
                defaultValue={item.type}
              >
                {uploadOptions[catagory].map((el, l) => (
                  <option key={l} value={el.toLowerCase()}>
                    {el}
                  </option>
                ))}
              </select>{" "}
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
                  item,
                  colors,
                  setValue,
                  field,
                  index,
                  append,
                  remove,
                }}
              />
            ))}
          </div>
        </div>
        <button
          className={
            loading
              ? "upload__form__submit-button upload__form__submit-button--loading"
              : "upload__form__submit-button"
          }
          type="submit"
        >
          {loading ? (
            <div className="upload__form__submit-button__loader"></div>
          ) : (
            "upload"
          )}
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
