import dayjs from "dayjs";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";
import { jsPDF } from "jspdf";
import config from "./config.json"

const mockUserId = "abc123"

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId,
};

firebase.initializeApp(firebaseConfig);

export const storage = firebase.app().storage(`gs://webacl-2f825`)

export const storageRef = storage.ref();

export const db = firebase.app().firestore();

export const buildPath = () => {
   return (`${mockUserId}/${dayjs().format(config.DATE_FORMAT)}/${dayjs().format(config.TIME_FORMAT)}`)
}

export const uploadFile = (file) => {
    const ref = storageRef.child(buildPath())

    ref.put(file).then((snapshot) => {
        console.log('Uploaded a blob or file!')
    })
}

export const uploadBlob = (files) => {
    const ref = storageRef.child(buildPath());

    ref.put(blob).then((snapshot) => {
        console.log('Uploaded a blob or file!')
    })
}

export const uploadImageData = (imgData) => {

    const ref = storageRef.child(buildPath());

    return ref.putString(imgData, 'data_url');
}

/*export const uploadImageData = (imgData) => {

    const ref = storageRef.child(buildPath()+`.pdf`);

    toPDF(imgData, "imageData").then((payload) => {
        
        ref.put(payload).then((snapshot) => {
            console.log('Uploaded a blob or file!')
        })

    })
}*/

export const uploadPdf = (files) => {

    const ref = storageRef.child(buildPath()+`.pdf`);

    toPDF(files, "file").then((payload) => {
        
        ref.put(payload).then((snapshot) => {
            console.log('Uploaded a blob or file!')
        })

    })
}

export const toPDF = (imgs, functionCode) => {
    const doc = new jsPDF('p', 'pt', 'a4');
    var width = doc.internal.pageSize.width;    
    var height = doc.internal.pageSize.height;
    var options = {
         pagesplit: true
    };

    const banner = 50;
    const aspectwidth1= (height-banner)*(9/16);

    let promises = [];

    if(functionCode === "file") {
        [...imgs].forEach(img => {
            promises.push(getBase64(img))
        })
    }
    
   return  Promise.all(promises).then (imgDatas => {

        imgDatas.forEach((imgData, i) => {
            if(i != 0) {
                doc.addPage();
            }
            doc.addImage(imgData, 10, banner, aspectwidth1, (height-banner), imgs[i].name);
            console.log(imgData, "taco");
        })
 
        doc.save("pdf");
        return doc
    })
}

function getBase64(file) {
    let result_base64 = new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => resolve(reader.result);
    });

    return result_base64;
  }