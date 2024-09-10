import { Request, Response } from "express";

export const getAdmins = (req: Request, res: Response) => {
  res.json({
    msg: "getAdmins",
  });
};

export const getAdmin = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    msg: "getAdmin",
    id,
  });
};

export const postAdmin = (req: Request, res: Response) => {
  const { body } = req;
  res.json({
    msg: "postAdmin",
    body,
  });
};

export const putAdmin = (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  res.json({
    msg: "putAdmin",
    id,
    body,
  });
};

export const deleteAdmin = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    msg: "deleteAdmin",
    id,
  });
};
