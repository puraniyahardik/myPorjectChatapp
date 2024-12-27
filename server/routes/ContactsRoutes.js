import { Router } from "express";
import { verifyToken } from "../middlewares/userAuth.js";
import { getAllContacts, GetContactsForDmList, SearchController } from "../controller/ContactsController.js";

const ContactRoutes=Router();


ContactRoutes.post("/search",verifyToken,SearchController);

ContactRoutes.get("/getContactForDm",verifyToken,GetContactsForDmList);

ContactRoutes.get("/getallcontacts",verifyToken,getAllContacts);
export default ContactRoutes;
