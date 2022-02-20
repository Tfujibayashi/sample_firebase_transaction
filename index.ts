import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as serviceAccount from "./test-2a430-firebase-adminsdk-g79l8-06e85bb9ea.json";

const params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

const firebaseApp = initializeApp({
  credential: cert(params),
});

const db = getFirestore(firebaseApp);
const collection = db.collection("user");

const newProduct = "test4";
const open = false;

db.runTransaction(async (transaction) => {
  const userDoc = await transaction.get(collection);

  userDoc.docs.forEach((doc) => {
    transaction.update(doc.ref, { [`product.${newProduct}`]: open });
  });

  return userDoc;
})
  .then(() => {
    console.log("Transaction successfully committed!");
  })
  .catch((error) => {
    console.log("Transaction failed: ", error);
  });
