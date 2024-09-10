import { Request, Response } from "express";

export const getStudentsCareers = (req: Request, res: Response) => {
  res.json({
    msg: "getStudentsCareers",
  });
};

export const getStudentCareer = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    msg: "getStudentCareer",
    id,
  });
};

export const postStudentCareer = (req: Request, res: Response) => {
  const { body } = req;
  res.json({
    msg: "posStudentCareer",
    body,
  });
};

export const putStudentCareer = (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  res.json({
    msg: "putStudentCareer",
    id,
    body,
  });
};

export const deleteStudentCareer = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    msg: "deleteStudentCareer",
    id,
  });
};
