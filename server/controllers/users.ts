import { Request, Response } from "express";
import User from "../models/user";

//function to get all DB users
export const getUsers = async (req: Request, res: Response) => {
  const users = await User.findAll(); //searching all users
  res.json(users); //sending json with all users as object
};

//function to get one DB user by ID
export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const user = await User.findByPk(id); //searching for one user by ID
  if (user) {
    //validate if user exist
    res.json(user); //sending json with user as object
  } else {
    res.status(404).json({
      msg: `don't exist a user with id: ${id}`,
    });
  }
};

//function to create a new user
export const postUser = async (req: Request, res: Response) => {
  const { body } = req; //getting body
  try {
    const existEmail = await User.findOne({
      where: {
        USER_EMAIL: body.USER_EMAIL,
      },
    });
    //validate if exist a previous user with the body.email
    if (existEmail) {
      return res.status(400).json({
        msg: `already exist a user with email: ` + body.USER_EMAIL,
      });
    } else {
      //creating a new user
      const user = await User.create(body); //post data from body
      res.json(user); //sending json with user values as object
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "can't create a new user",
    });
  }
};

//function to update one DB user by ID
export const putUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const user = await User.findByPk(id);
    //validate if exist a user with the ID
    if (!user) {
      return res.status(404).json({
        msg: `don't exist a user with id: ${id}`,
      });
    } else {
      //updating user
      await user.update(body);
      res.json(user); //sending json with new user values as object
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: `can't update user with id: ${id}`,
    });
  }
};

//function to delete one DB user by ID
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  //validate if exist a user with the ID
  if (!user) {
    return res.status(404).json({
      msg: `don't exist a user with id: ${id}`,
    });
  } else {
    //deleting user (STATUS: 1=ACTIVE/0=INACTIVE)
    await user.update({ USER_STATUS: 0 });
    res.json(user);
  }
};
