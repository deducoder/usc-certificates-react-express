import { Request, Response } from "express";
import Student from "../models/student";

//function to get all DB students
export const getStudents = async (req: Request, res: Response) => {
  const students = await Student.findAll(); //searching all students
  res.json(students); //sending json with all students as object WATNING: don't send response as an object
};

//function to get one DB student by ID
export const getStudent = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const student = await Student.findByPk(id); //searching for one student by ID
  if (student) {
    //validate if student exist
    res.json(student); //sending json with student as object
  } else {
    res.status(404).json({
      msg: `don't exist a student with id: ${id}`,
    });
  }
};

//function to create a new student
export const postStudent = async (req: Request, res: Response) => {
  const { body } = req; //getting body
  try {
    const student = await Student.create(body); //post data from body
    res.json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "can't create a new student",
    });
  }
};

//function to update one DB student by ID
export const putStudent = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const { body } = req; //getting body
  try {
    const student = await Student.findByPk(id);
    //validate if exist a student with the ID
    if (!student) {
      return res.status(404).json({
        msg: `don't exist a student with id: ${id}`,
      });
    } else {
      //updating student
      await student.update(body);
      res.json(student); //sending json with new student values as object
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: `can't update student with id: ${id}`,
    });
  }
};

//function to delete one DB student by ID
export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const student = await Student.findByPk(id);
  //validate if exist a student with the ID
  if (!student) {
    return res.status(404).json({
      msg: `don't exist a student with id: ${id}`,
    });
  } else {
    //deleting admin (STATUS: 1=ACTIVE/0=INACTIVE)
    await student.update({ STUDENT_STATUS: 0 });
    res.json(student);
  }
};
