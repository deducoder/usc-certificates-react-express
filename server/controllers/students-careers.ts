import e, { Request, Response } from "express";
import StudentCareer from "../models/student-career";

//function to get all DB student-career relations
export const getStudentsCareers = async (req: Request, res: Response) => {
  const studentsCareers = await StudentCareer.findAll(); //searching all relations
  res.json(studentsCareers); //sending json with all relations as object
};

// function to get one DB student-career relation
export const getStudentCareer = async (req: Request, res: Response) => {
  const { id } = req.params; //getting STUDENT_ID
  const studentCareer = await StudentCareer.findOne({
    where: {
      STUDENT_ID: id,
      RELATION_STATUS: 1, // Solo relaciones activas
    },
  }); //searching for one relation by STUDENT_ID
  if (studentCareer) {
    //validate if relation exist
    res.json(studentCareer); //sending json with relation as object
  } else {
    res.status(404).json({
      msg: `No existe una relación activa para el estudiante con id: ${id}`,
    });
  }
};

//function to create a new student-career relation
export const postStudentCareer = async (req: Request, res: Response) => {
  const { body } = req; //getting body
  try {
    const existStudentCareer = await StudentCareer.findOne({
      where: {
        STUDENT_ID: body.STUDENT_ID,
      },
    });
    //validate if exist a previous student with the body.id
    if (existStudentCareer) {
      return res.status(400).json({
        msg: `already exist relation to this student: ` + body.STUDENT_ID,
      });
    } else {
      //creating a new student-career
      const studentCareer = await StudentCareer.create(body); //post data from body
      res.json(studentCareer); //sending json with user values as object
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "can't create a new relation",
    });
  }
};

//function to update one DB student-career relation by ID
export const putStudentCareer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const studentCareer = await StudentCareer.findOne({
      where: {
        STUDENT_ID: id,
        RELATION_STATUS: 1,
      },
    });
    //validate if exist a relation with the STUDENT_ID
    if (!studentCareer) {
      return res.status(404).json({
        msg: `No existe una relación activa para el estudiante con id: ${id}`,
      });
    } else {
      //updating relation
      await studentCareer.update(body);
      res.json(studentCareer); //sending json with new relation values as object
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: `No se puede actualizar la relación para el estudiante con id: ${id}`,
    });
  }
};

//function to delete one DB student-career relation by ID
export const deleteStudentCareer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const studentCareer = await StudentCareer.findByPk(id);
  //validate if exist a relation with the ID
  if (!studentCareer) {
    return res.status(404).json({
      msg: `don't exist a relation with id: ${id}`,
    });
  } else {
    //deleting user (STATUS: 1=ACTIVE/0=INACTIVE)
    await studentCareer.update({ RELATION_STATUS: 0 });
    res.json(studentCareer);
  }
};
