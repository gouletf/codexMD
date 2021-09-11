import React, { useEffect, useState, useReducer, useContext } from "react";
import ScanDocument from "./components/ScanDocument";
import { ToastContainer, toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';
import "!style-loader!css-loader!react-toastify/dist/ReactToastify.css"
import * as Rx from 'rxjs';  
import { map } from 'rxjs/operators';     

import firebase from "firebase/app";
import { db } from "./firebase";

import LoadingSpinner from "./components/LoadingSpinner.js";

export default function App() {

    useEffect(() => {
        //firebase.functions().useEmulator("localhost", 5001);
        //firebase.functions().httpsCallable("helloWorld")().then(console.log).catch(console.log)
        // const unsub = db.collection("todos").onSnapshot((snap) => {
        //     setTodos(
        //         snap.docs.map((doc) => {
        //             return { id: doc.id, ...doc.data() };
        //         })
        //     );
        // });

        return () => unsub();
    }, []);

    return (
        <div className="flex">
            <LoadingSpinner />
            <ScanDocument />
        </div>
    );
}