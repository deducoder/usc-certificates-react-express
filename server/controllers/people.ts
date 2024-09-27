import { Request, Response } from "express";
import People from "../models/people";

//function to get all DB people
export const getPeople = async (req: Request, res: Response) => {
  const people = await People.findAll(); //searching all careers
  res.json(people); //sending json with all career as object
};

//function to get one DB career by ID
export const getPerson = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const person = await People.findByPk(id); //searching for one career by ID
  if (person) {
    //validate if career exist
    res.json(person); //sending json with career as object
  } else {
    res.status(404).json({
      msg: `don't exist a person with id: ${id}`,
    });
  }
};

//function to create a new career
export const postPerson = async (req: Request, res: Response) => {
  const { body } = req; //getting body
  try {
    const existPerson = await People.findOne({
      where: {
        PEOPLE_NAME: body.PEOPLE_NAME,
      },
    });
    //validate if exist a previus career with the body.name
    if (existPerson) {
      return res.status(400).json({
        msg: `already exist a person with name: ` + body.PEOPLE_NAME,
      });
    } else {
      //creating a new career
      const person = await People.create(body); //post data from body
      res.json(person); //sending json with career values as object
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "can't create a new person",
    });
  }
};

//function to update one DB career by ID
export const putPerson = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const person = await People.findByPk(id);
    //validate if exist a career with the ID
    if (!person) {
      return res.status(404).json({
        msg: `don't exist a person with id: ${id}`,
      });
    } else {
      //updating career
      await person.update(body);
      res.json(person); //sending json with  new career values as object
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: `can't update person with id: ${id}`,
    });
  }
};

// Function to delete one DB person by ID
export const deletePerson = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const person = await People.findByPk(id);
    // Validate if the person with the given ID exists
    if (!person) {
      return res.status(404).json({
        msg: `Person with id ${id} does not exist`,
      });
    }
    // Delete the person physically from the database
    await person.destroy();
    res.json({
      msg: `Person with id ${id} has been deleted`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "An error occurred while trying to delete the person",
    });
  }
};
