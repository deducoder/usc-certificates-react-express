import { Request, Response } from "express";
import Score from "../models/score";
import Student from "../models/student";

//function to get all DB scocores
export const getScores = async (req: Request, res: Response) => {
  const scores = await Score.findAll();
  res.json({ scores });
};

//function to get one DB score by ID
export const getScore = async (req: Request, res: Response) => {
  const { id } = req.params;
  const score = await Score.findByPk(id);
  if (score) {
    res.json({ score });
  } else {
    res.status(404).json({
      msg: `don't exist a score with id: ${id}`,
    });
  }
};

//function to fetch all subjects by careerID
export const getScoressByStudentId = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  try {
    const scores = await Score.findAll({
      where: {
        STUDENT_ID: studentId,
      },
    });
    if (scores.length === 0) {
      return res.status(404).json({
        msg: `No scores found for student ID: ${studentId}`,
      });
    }
    res.json(scores);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "error fetching scores by studentID",
    });
  }
};

//function to create a new score
export const postScore = async (req: Request, res: Response) => {
  const { STUDENT_ID, SUBJECT_ID, SCORE, SCORE_OBSERVATION } = req.body; //getting data from body
  try {
    const existStudent = await Student.findByPk(STUDENT_ID);
    //validate if exist a user with the body.STUDENT_ID
    if (!existStudent) {
      return res.status(404).json({
        msg: `don't exist a student with id: ${STUDENT_ID}`,
      });
    } else {
      //validate if exist a score with STUDENT_ID-SUBJECT_ID relation
      const existScore = await Score.findOne({
        where: {
          STUDENT_ID: STUDENT_ID,
          SUBJECT_ID: SUBJECT_ID,
        },
      });
      if (existScore) {
        return res.status(400).json({
          msg: `already exist a score with user: ${STUDENT_ID} in subject: ${SUBJECT_ID}`,
        });
      } else {
        //create a new score
        const score = await Score.create({
          STUDENT_ID,
          SUBJECT_ID,
          SCORE,
          SCORE_OBSERVATION,
        });
        res.json(score);
      }
    }
  } catch (error) {
    console.error(error);
    res.send(500).json({
      msg: "can't create a new score value",
    });
  }
};

//function to update one DB score by ID
export const putScore = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const { body } = req; //getting body
  try {
    const score = await Score.findByPk(id);
    //validate if exist an score with the ID
    if (!score) {
      return res.status(404).json({
        msg: `don't exist an score with id: ${id}`,
      });
    } else {
      //updating score
      await score.update(body);
      res.json(score); //sending json with new score values as object
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: `can't update score with id: ${id}`,
    });
  }
};

export const deleteScore = async (req: Request, res: Response) => {
  const { id } = req.params; //getting ID
  const score = await Score.findByPk(id);
  //validate if exist an score with the ID
  if (!score) {
    return res.status(404).json({
      msg: `don't exist an score with id: ${id}`,
    });
  } else {
    //deleting score (STATUS: 1=ACTIVE/0=INACTIVE)
    await score.update({ SCORE_STATUS: 0 });
    res.json(score);
  }
};
