import React, { useReducer } from "react";
import produce from "immer";
import { uploadImageData } from "./firebase";
import { ToastContainer, toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';
import "!style-loader!css-loader!react-toastify/dist/ReactToastify.css"

const initialState = {
  buttonDisabled: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "begin-upload":
      return produce(state, (draft) => {
        draft.buttonDisabled = true;
      });
    case "upload-success":
      return produce(state, (draft) => {
        toast.success("File successfully uploaded");
        draft.buttonDisabled = false;
      });
    case "upload-ended":
      return produce(state, (draft) => {
        draft.buttonDisabled = false;
      });
  }
};

const contextClass = {
  default: "bg-grey-200",
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-400",
  warning: "bg-yellow-400",
  dark: "bg-white-600 font-gray-300",
};

const Context = React.createContext({});

const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const uploadFile = async (imgData) => {
    dispatch({ type: "begin-upload" });
    await Promise.resolve(uploadImageData(imgData))
      .then(function (snapshot) {
        dispatch({ type: "upload-success" })
      })
      .catch((err) => toast.error(err))
      .finally(dispatch({ type: "upload-ended" }));
    //Dispatch Upload Complete
  };

  return (
    <Context.Provider value={{ state, dispatch, uploadFile }}>
      <ToastContainer
                    toastClassName={({ type }) => contextClass[type || "default"] + " relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"}
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
      {children}
    </Context.Provider>
  );
};

function useGlobalContext() {
  const context = React.useContext(Context)
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a contextProvider')
  }
  return context
}

export { ContextProvider, useGlobalContext };
