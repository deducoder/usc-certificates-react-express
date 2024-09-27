import { useParams } from "react-router-dom";
import { Container, Paper, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";

interface Student {
  STUDENT_NAME: string;
  STUDENT_PA_LAST_NAME: string;
  STUDENT_MA_LAST_NAME: string;
  SCORE_VALUE: number | null;
}

interface StudentCareer {
  CAREER_ID: number; // or string depending on your API
}

interface Career {
  CAREER_NAME: string;
}

interface Subject {
  SUBJECT_ID: number;
  SUBJECT_NAME: string;
}

function ScoresPage() {
  const { studentId } = useParams(); // Capture the student ID from the URL
  const [student, setStudent] = useState<Student | null>(null); // Changed to null initially
  const [studentCareer, setStudentCareer] = useState<StudentCareer | null>(
    null
  ); // Changed to null initially
  const [career, setCareer] = useState<Career | null>(null); // Changed to null initially
  const [subjects, setSubjects] = useState<Subject[] | null>(null);

  useEffect(() => {
    //fetching student info
    const fetchStudent = async () => {
      try {
        const studentResponse = await fetch(
          `http://localhost:8000/api/students/${studentId}`
        );
        const studentData = await studentResponse.json();
        //console.log(studentData);
        setStudent(studentData);
      } catch (error) {
        console.error(error);
      }
    };

    //fetching student-career info
    const fetchStudentCareer = async () => {
      try {
        const studentCareerResponse = await fetch(
          `http://localhost:8000/api/students-careers/${studentId}`
        );
        const studentCareerData = await studentCareerResponse.json();
        //console.log(studentCareerData);
        setStudentCareer(studentCareerData); // This will set the studentCareer with the data

        // Check if studentCareerData contains CAREER_ID before fetching career
        if (studentCareerData.CAREER_ID) {
          fetchCareer(studentCareerData.CAREER_ID); // Pass the career ID to fetchCareer
          fetchSubjects(studentCareerData.CAREER_ID);
        }
      } catch (error) {
        console.error(error);
      }
    };

    //fetching career info
    const fetchCareer = async (careerId: number) => {
      try {
        const careerResponse = await fetch(
          `http://localhost:8000/api/careers/${careerId}`
        );
        const careerData = await careerResponse.json();
        //console.log(careerData);
        setCareer(careerData);
      } catch (error) {
        console.error(error);
      }
    };

    //fetching subjects
    const fetchSubjects = async (careerId: number) => {
      try {
        const subjectResponse = await fetch(
          `http://localhost:8000/api/subjects/career/${careerId}`
        );
        const subjectData = await subjectResponse.json();
        console.log(subjectData);
        setSubjects(subjectData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudent();
    fetchStudentCareer();
  }, [studentId]); // Add studentId as a dependency

  return (
    <>
      <NavBar />
      <Container sx={{ padding: "2rem" }} disableGutters maxWidth={false}>
        <Paper sx={{ padding: "2rem", margin: "2rem" }}>
          <Typography variant="h6">
            {`${student?.STUDENT_NAME || "Unknown"} ${
              student?.STUDENT_PA_LAST_NAME || ""
            } ${student?.STUDENT_MA_LAST_NAME || ""}`}
          </Typography>
          <Typography variant="body1">
            {`CARRERA: ${career?.CAREER_NAME ?? "N/A"}`}
          </Typography>
          <Typography variant="body1">
            {`MATRÍCULA: ${student?.STUDENT_TUITION ?? "N/A"}`}
          </Typography>
        </Paper>
      </Container>
    </>
  );
}

export default ScoresPage;
