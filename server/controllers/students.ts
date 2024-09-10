import { Request, Response } from "express";

export const getStudents = (req: Request, res: Response) => {
  res.json({
    msg: "getStudents",
  });
};

export const getStudent = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    msg: "getStudent",
    id,
  });
};

export const postStudent = (req: Request, res: Response) => {
  const { body } = req;
  res.json({
    msg: "postStudent",
    body,
  });
};

export const putStudent = (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  res.json({
    msg: "putStudent",
    id,
    body,
  });
};

export const deleteStudent = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    msg: "deleteStudent",
    id,
  });
};
