// src/utils/toastService.js
import { toast } from "react-toastify";
import CustomToast from "../Toast/CustomToast.jsx";

export const showToast = (type, message) => {
  toast(<CustomToast type={type} message={message} />, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
