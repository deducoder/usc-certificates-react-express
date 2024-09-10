import { Request, Response } from "express";

export const getSubjects = (req: Request, res: Response) => {
  res.json({
    msg: "getSubjects",
  });
};

export const getSubject = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    msg: "getSubject",
    id,
  });
};

export const postSubject = (req: Request, res: Response) => {
  const { body } = req;
  res.json({
    msg: "postSubject",
    body,
  });
};

export const putSubject = (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  res.json({
    msg: "putSubject",
    id,
    body,
  });
};

export const deleteSubject = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    msg: "deleteSubject",
    id,
  });
};
