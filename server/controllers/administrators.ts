import { Request, Response } from "express";
import Admin from "../models/admin";

//function to get all DB administrators
export const getAdmins = async (req: Request, res: Response) => {
  const admins = await Admin.findAll(); //searching all admins
  res.json({ admins }); //sending json with all admins as object
};

//function to get one DB administrator by ID
export const getAdmin = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const admin = await Admin.findByPk(id); //searching for one admin by ID
  if (admin) {
    //validate if admin exist
    res.json({ admin }); //sending json with admin as object
  } else {
    res.status(404).json({
      msg: `don't exist an admin with id: ${id}`,
    });
  }
};

//function to create a new administrator
export const postAdmin = async (req: Request, res: Response) => {
  const { body } = req; //getting body
  try {
    const admin = await Admin.create(body); //post data from body
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "can't create a new admin",
    });
  }
};

//function to update one DB administrator by ID
export const putAdmin = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const { body } = req; //getting body
  try {
    const admin = await Admin.findByPk(id);
    //validate if exist an admin with the ID
    if (!admin) {
      return res.status(404).json({
        msg: `don't exist an admin with id: ${id}`,
      });
    } else {
      //updating admin
      await admin.update(body);
      res.json(admin); //sending json with new admin values as object
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: `can't update admin with id: ${id}`,
    });
  }
};

//function to delete one DB administrator by ID
export const deleteAdmin = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const admin = await Admin.findByPk(id);
  //validate if exist an admin with the ID
  if (!admin) {
    return res.status(404).json({
      msg: `don't exist an admin with id: ${id}`,
    });
  } else {
    //deleting admin (STATUS: 1=ACTIVE/0=INACTIVE)
    await admin.update({ ADMIN_STATUS: 0 });
    res.json(admin);
  }
};
