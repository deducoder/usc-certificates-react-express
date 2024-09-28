import { Router } from "express";
import {
  deleteCertificateField,
  getCertificateFields,
  getCertificateField,
  postCertificateField,
  putCertificateField,
} from "../controllers/certificate-fields"; // Adjust the import path as needed

const router = Router();

// Routes for certificate fields
router.get("/", getCertificateFields); // Get all certificate fields
router.get("/:id", getCertificateField); // Get a single certificate field by ID
router.post("/", postCertificateField); // Create a new certificate field
router.put("/:id", putCertificateField); // Update a certificate field by ID
router.delete("/:id", deleteCertificateField); // Delete a certificate field by ID

export default router;
