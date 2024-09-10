import { Request, Response } from "express";

export const getScores = (req: Request, res: Response) => {
  res.json({
    msg: "getScores",
  });
};

export const getScore = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    msg: "getScore",
    id,
  });
};

export const postScore = (req: Request, res: Response) => {
  const { body } = req;
  res.json({
    msg: "postScore",
    body,
  });
};

export const putScore = (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  res.json({
    msg: "putScore",
    id,
    body,
  });
};

export const deleteScore = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    msg: "deleteScore",
    id,
  });
};
