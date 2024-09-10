import { Request, Response } from "express";

export const getCareers = (req: Request, res: Response) => {
  res.json({
    msg: "getCareers",
  });
};

export const getCareer = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    msg: "getCareer",
    id,
  });
};

export const postCareer = (req: Request, res: Response) => {
  const { body } = req;
  res.json({
    msg: "postCareer",
    body,
  });
};

export const putCareer = (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  res.json({
    msg: "putCareer",
    id,
    body,
  });
};

export const deleteCareer = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    msg: "deleteCareer",
    id,
  });
};
