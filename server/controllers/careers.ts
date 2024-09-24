import { Request, Response } from "express";
import Career from "../models/career";

//function to get all DB careers
export const getCareers = async (req: Request, res: Response) => {
  const careers = await Career.findAll(); //searching all careers
  res.json(careers); //sending json with all career as object
};

//function to get one DB career by ID
export const getCareer = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const career = await Career.findByPk(id); //searching for one career by ID
  if (career) {
    //validate if career exist
    res.json({ career }); //sending json with career as object
  } else {
    res.status(404).json({
      msg: `don't exist a career with id: ${id}`,
    });
  }
};

//function to create a new career
export const postCareer = async (req: Request, res: Response) => {
  const { body } = req; //getting body
  try {
    const existCareer = await Career.findOne({
      where: {
        CAREER_NAME: body.CAREER_NAME,
      },
    });
    //validate if exist a previus career with the body.name
    if (existCareer) {
      return res.status(400).json({
        msg: `already exist a career with name: ` + body.CAREER_NAME,
      });
    } else {
      //creating a new career
      const career = await Career.create(body); //post data from body
      res.json(career); //sending json with career values as object
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "can't create a new career",
    });
  }
};

//function to update one DB career by ID
export const putCareer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const career = await Career.findByPk(id);
    //validate if exist a career with the ID
    if (!career) {
      return res.status(404).json({
        msg: `don't exist a career with id: ${id}`,
      });
    } else {
      //updating career
      await career.update(body);
      res.json(career); //sending json with  new career values as object
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: `can't update career with id: ${id}`,
    });
  }
};

//function to delete one DB career by ID
export const deleteCareer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const career = await Career.findByPk(id);
  //validate if exist a career with the ID
  if (!career) {
    return res.status(404).json({
      msg: `don't exist a career with id: ${id}`,
    });
  } else {
    ////deleting user (STATUS: 1=ACTIVE/0=INACTIVE)
    await career.update({ CAREER_STATUS: 0 });
    res.json(career);
  }
};
