import { Request, Response } from "express";
import Subject from "../models/subjects";

//functino to get all DB subjects
export const getSubjects = async (req: Request, res: Response) => {
  const subjects = await Subject.findAll(); //searching all subjects
  res.json(subjects); //sending json with all subjects as object
};

//function to get one DB subject by ID
export const getSubject = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const subject = await Subject.findByPk(id);
  if (subject) {
    //validate if subject exist
    res.json(subject); //sending json with subject as object
  } else {
    res.status(404).json({
      msg: `don't exist a subject with id: ${id}`,
    });
  }
};

//functino to create a new subject
export const postSubject = async (req: Request, res: Response) => {
  const { body } = req; //getting body
  try {
    const subject = await Subject.create(body); //post data from body
    res.json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "can't create a new subject",
    });
  }
};

//function to update one DB subject by ID
export const putSubject = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const { body } = req; //getting body
  try {
    const subject = await Subject.findByPk(id);
    //validate if exist a career with the ID
    if (!subject) {
      return res.status(404).json({
        msg: `don't exist a subject with id: ${id}`,
      });
    } else {
      //updating subject
      await subject.update(body);
      res.json(subject); //sending json with new subject values as object
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: `can't update subject with id: ${id}`,
    });
  }
};

//function to delete one DB subject by ID
export const deleteSubject = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const subject = await Subject.findByPk(id);
  //validate if exist a subject with the ID
  if (!subject) {
    return res.status(404).json({
      msg: `don't exist a subject with id: ${id}`,
    });
  } else {
    //deleting subject (STATUS: 1=ACTIVE/0=INACTIVE)
    await subject.update({ SUBJECT_STATUS: 0 });
    res.json(subject);
  }
};
