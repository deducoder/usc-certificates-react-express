import { Request, Response } from "express";
import CertificateField from "../models/certificate-field"; // Adjust the import path as needed

// Function to get all certificate fields
export const getCertificateFields = async (req: Request, res: Response) => {
  try {
    const fields = await CertificateField.findAll(); // Searching all certificate fields
    res.json(fields); // Sending JSON with all fields as an array of objects
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "An error occurred while retrieving certificate fields",
    });
  }
};

// Function to get one certificate field by ID
export const getCertificateField = async (req: Request, res: Response) => {
  const { id } = req.params; // Getting ID
  try {
    const field = await CertificateField.findByPk(id); // Searching for one field by ID
    if (field) {
      // Validate if the field exists
      res.json(field); // Sending JSON with field as an object
    } else {
      res.status(404).json({
        msg: `No certificate field exists with id: ${id}`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "An error occurred while retrieving the certificate field",
    });
  }
};

// Function to create a new certificate field
export const postCertificateField = async (req: Request, res: Response) => {
  const { body } = req; // Getting body
  try {
    const existingField = await CertificateField.findOne({
      where: {
        FIELD_NAME: body.FIELD_NAME,
      },
    });
    // Validate if a field with the same name already exists
    if (existingField) {
      return res.status(400).json({
        msg: `A certificate field with name '${body.FIELD_NAME}' already exists`,
      });
    } else {
      // Creating a new certificate field
      const field = await CertificateField.create(body); // Post data from body
      res.json(field); // Sending JSON with new field values as an object
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Can't create a new certificate field",
    });
  }
};

// Function to update one certificate field by ID
export const putCertificateField = async (req: Request, res: Response) => {
  const { id } = req.params; // Getting ID
  const { body } = req; // Getting body
  try {
    const field = await CertificateField.findByPk(id);
    // Validate if the field with the ID exists
    if (!field) {
      return res.status(404).json({
        msg: `No certificate field exists with id: ${id}`,
      });
    } else {
      // Updating certificate field
      await field.update(body);
      res.json(field); // Sending JSON with new field values as an object
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: `Can't update certificate field with id: ${id}`,
    });
  }
};

// Function to delete one certificate field by ID
export const deleteCertificateField = async (req: Request, res: Response) => {
  const { id } = req.params; // Getting ID
  try {
    const field = await CertificateField.findByPk(id);
    // Validate if the field with the given ID exists
    if (!field) {
      return res.status(404).json({
        msg: `Certificate field with id ${id} does not exist`,
      });
    }
    // Delete the field from the database
    await field.destroy();
    res.json({
      msg: `Certificate field with id ${id} has been deleted`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "An error occurred while trying to delete the certificate field",
    });
  }
};
