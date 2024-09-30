import jsPDF from "jspdf";
import { arialBase64 } from "./fonts/arial";
import { arialBoldBase64 } from "./fonts/arialBold";
import { arialNarrowBase64 } from "./fonts/arialNarrow";
import { arialNarrowBoldBase64 } from "./fonts/arialNarrowBold";
import { timesNewRomanBase64 } from "./fonts/timesNewRoman";
import { timesNewRomanBoldBase64 } from "./fonts/timesNewRomanBold";
import { logoMXBase64 } from "./pictures/logoMX";
import { pictureSizeBase64 } from "./pictures/pictureSize";
import { tableBase64 } from "./pictures/table";

const addCustomFonts = (doc: jsPDF) => {
  // Arial
  doc.addFileToVFS("Arial.ttf", arialBase64);
  doc.addFont("Arial.ttf", "Arial", "normal");

  // Arial Bold
  doc.addFileToVFS("ArialBold.ttf", arialBoldBase64);
  doc.addFont("ArialBold.ttf", "Arial", "bold");

  // Arial Narrow
  doc.addFileToVFS("ArialNarrow.ttf", arialNarrowBase64);
  doc.addFont("ArialNarrow.ttf", "ArialNarrow", "normal");

  // Arial Narrow Bold
  doc.addFileToVFS("ArialNarrowBold.ttf", arialNarrowBoldBase64);
  doc.addFont("ArialNarrowBold.ttf", "ArialNarrow", "bold");

  // Times New Roman
  doc.addFileToVFS("TimesNewRoman.ttf", timesNewRomanBase64);
  doc.addFont("TimesNewRoman.ttf", "TimesNewRoman", "normal");

  // Times New Roman Bold
  doc.addFileToVFS("TimesNewRomanBold.ttf", timesNewRomanBoldBase64);
  doc.addFont("TimesNewRomanBold.ttf", "TimesNewRoman", "bold");
};

interface Data {
  // Informacion de la escuela
  REGIMEN: String;
  TURNO: String;
  CLAVE: String;
  MODALIDAD: String;
  RVOE: String;
  VIGENCIA: String;
  SECL: String;
  LEGAL: String;
  // Informacion del estudiante
  STUDENT_ID: number;
  STUDENT_NAME: String;
  STUDENT_TUITION: Number;
  STUDENT_CAREER: String;
  CAREER_ID: Number;
  STUDENT_START_PERIOD: String;
  STUDENT_END_PERIOD: String;
}

interface Subject {
  SUBJECT_ID: number;
  SUBJECT_NAME: string;
  SUBJECT_PERIOD: number;
}

interface Score {
  SUBJECT_ID: number;
  SCORE: number;
  SCORE_OBSERVATION: string;
}

export const certificatePDF = async (data: Data) => {
  // Creando documento
  const doc = new jsPDF("portrait", "mm", [215.9, 355.6]);

  // Obteniendo las materias
  const fetchSubjects = async (): Promise<Subject[]> => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/subjects/career/${data.CAREER_ID}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const subjectsData = await response.json();
      return subjectsData;
    } catch (error) {
      console.error("Error al obtener materias:", error);
      return []; // Retorna un array vacío en caso de error
    }
  };

  // Función para obtener los puntajes del estudiante
  const fetchScores = async (studentId: number): Promise<Score[]> => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/scores/student/${studentId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const scoresData = await response.json();
      return scoresData;
    } catch (error) {
      console.error("Error al obtener puntajes:", error);
      return []; // Retorna un array vacío en caso de error
    }
  };

  // Convertir numero a texto
  const translateNumberToWords = (num: number): string => {
    const words: { [key: number]: string } = {
      0: "Cero",
      1: "Uno",
      2: "Dos",
      3: "Tres",
      4: "Cuatro",
      5: "Cinco",
      6: "Seis",
      7: "Siete",
      8: "Ocho",
      9: "Nueve",
      10: "Diez",
      // Agrega más números si es necesario
    };

    return words[num] || ""; // Devuelve una cadena vacía si no hay correspondencia
  };

  // Función para agregar materias y puntajes
  const getSubjectsAndScores = async (
    studentId: number,
    period: number,
    x: number,
    y: number
  ) => {
    const subjects: Subject[] = await fetchSubjects(); // Obtener materias
    const scores: Score[] = await fetchScores(studentId); // Obtener puntajes del estudiante

    // Filtrar materias por periodo
    const filteredSubjects = subjects.filter(
      (subject) => subject.SUBJECT_PERIOD === period
    );

    // Posición inicial para el texto
    let currentY = y;

    if (filteredSubjects.length > 0) {
      let defaultFontSize = 8;
      doc.setFontSize(defaultFontSize);

      filteredSubjects.forEach((filteredSubject) => {
        const splitText: string[] = doc.splitTextToSize(
          filteredSubject.SUBJECT_NAME,
          55
        );

        if (splitText.length > 1) {
          doc.setFontSize(7);
        }

        // Agregar nombre de materia
        splitText.forEach((line: string) => {
          if (line) {
            doc.text(line, x, currentY);
            currentY += 4; // Incrementar la posición Y para la siguiente línea
          }
        });

        if (splitText.length > 1) {
          doc.setFontSize(defaultFontSize);
        }

        const subjectScore = scores.find(
          (score) => score.SUBJECT_ID === filteredSubject.SUBJECT_ID
        );

        if (subjectScore) {
          const scoreValue =
            subjectScore.SCORE !== null ? subjectScore.SCORE : 0; // Valor del puntaje
          const scoreText = scoreValue.toString(); // Texto del puntaje
          const observationText = subjectScore.SCORE_OBSERVATION || ""; // Texto de observación

          // Imprimir el `SCORE` y el `SCORE_OBSERVATION`
          if (scoreText) {
            doc.text(scoreText, x + 58, currentY - 4); // Columna de SCORE
          }
          if (observationText) {
            doc.text(observationText, x + 82, currentY - 4); // Columna de OBSERVATION
          }

          // Traducir el puntaje a palabras y mostrarlo
          const translatedScore = translateNumberToWords(scoreValue);
          if (translatedScore) {
            doc.text(translatedScore, x + 66, currentY - 4); // Columna para la traducción
          }
        }

        // Espacio entre materias
        currentY += 2;
      });
    } else {
      console.log(`No hay materias para el periodo ${period}.`);
    }
  };

  // Agregando fuentes
  addCustomFonts(doc);

  doc.setFont("ArialNarrow", "normal");
  await getSubjectsAndScores(data.STUDENT_ID, 1, 10, 135);
  await getSubjectsAndScores(data.STUDENT_ID, 2, 111, 135);
  await getSubjectsAndScores(data.STUDENT_ID, 3, 10, 205);
  await getSubjectsAndScores(data.STUDENT_ID, 4, 111, 205);
  await getSubjectsAndScores(data.STUDENT_ID, 5, 10, 275);
  await getSubjectsAndScores(data.STUDENT_ID, 6, 111, 275);

  // Separar la fecha de vigencia
  const convertDate = (date: String) => {
    const [yyyy, mm, dd] = date.split("-");

    const monthNames = [
      "ENERO",
      "FEBRERO",
      "MARZO",
      "ABRIL",
      "MAYO",
      "JUNIO",
      "JULIO",
      "AGOSTO",
      "SEPTIEMBRE",
      "OCTUBRE",
      "NOVIEMBRE",
      "DICIEMBRE",
    ];

    const monthName = monthNames[parseInt(mm) - 1]; // Convertir mm a número y obtener el nombre del mes

    return { yyyy, mm, dd, monthName };
  };

  // Logo gobierno de MX
  doc.addImage(logoMXBase64, "PNG", 9, 8, 28, 29);

  // Primer párrafo
  const infoGobierno = `GOBIERNO CONSTITUCIONAL DEL ESTADO DE CHIAPAS\nSECRETARÍA DE EDUCACIÓN ESTATAL\nSUBSECRETARÍA DE EDUCACIÓN ESTATAL`;
  doc.setFont("Arial", "bold");
  doc.setFontSize(12);
  doc.text(infoGobierno, 105, 10, { align: "center" });

  // Segundo párrafo
  const infoDireccion = `DIRECCIÓN DE EDUCACIÓN SUPERIOR\nDEPARTAMENTO DE SERVICIOS ESCOLARES`;
  doc.setFont("Arial", "normal");
  doc.setFontSize(10);
  doc.text(infoDireccion, 105, 25, { align: "center" });

  // SE-CL-YY
  doc.setFont("Arial", "normal");
  doc.setFontSize(10);
  doc.text(`${data.SECL}`, 200, 12, { align: "right" });

  // Tamaño para la fotografía
  doc.addImage(pictureSizeBase64, "PNG", 9, 45, 37, 50);

  // Parrafo con información de la escuela
  doc.setFont("Arial", "normal");
  doc.setFontSize(12);
  doc.text("LA UNIVERSIDAD", 55, 43);

  doc.setFont("Arial", "bold");
  doc.setFontSize(12);
  doc.text("«SAN CRISTÓBAL»", 91, 43);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("UBICADO EN LA CIUDAD DE", 131, 43);

  doc.setFont("Arial", "bold");
  doc.setFontSize(9);
  doc.text("SAN CRISTÓBAL DE ", 175, 43);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("__________________", 175, 43.5);

  doc.setFont("Arial", "bold");
  doc.setFontSize(9);
  doc.text("LAS CASAS, CHIAPAS", 55, 50);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("____________________", 55, 50.5);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("RÉGIMEN", 114, 50);

  doc.setFont("Arial", "bold");
  doc.setFontSize(9);
  doc.text(`${data.REGIMEN},`, 130, 50);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("____________", 130, 50.5);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("TURNO:", 181, 50);

  doc.setFont("Arial", "bold");
  doc.setFontSize(9);
  doc.text(`${data.TURNO},`, 195, 50);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("______", 195, 50.5);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("CLAVE:", 55, 57);

  doc.setFont("Arial", "bold");
  doc.setFontSize(12);
  doc.text(`${data.CLAVE},`, 68, 57);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("_______________", 68, 57.5);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("MODALIDAD:", 97, 57);

  doc.setFont("Arial", "bold");
  doc.setFontSize(9);
  doc.text(`${data.MODALIDAD},`, 118, 57);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("______", 118, 57.5);

  doc.setFont("Arial", "normal");
  doc.setFontSize(12);
  doc.text("RVOE:", 131, 57);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("ACUERDO NUMERO:", 145, 57);

  doc.setFont("Arial", "bold");
  doc.setFontSize(12);
  doc.text(`${data.RVOE},`, 178, 57);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("________________", 178, 57.5);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("VIGENTE: A PARTIR DEL", 55, 64);

  const vigenciaDD = convertDate(data.VIGENCIA);
  doc.setFont("Arial", "bold");
  doc.setFontSize(9);
  doc.text(`${vigenciaDD.dd}`, 95, 64);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("__", 95, 64);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("DE", 100, 64);

  const vigenciaMM = convertDate(data.VIGENCIA);
  doc.setFont("Arial", "bold");
  doc.setFontSize(9);
  doc.text(`${vigenciaMM.monthName}`, 106, 64);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("____________", 106, 64);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("DEL", 128, 64);

  const vigenciaYYYY = convertDate(data.VIGENCIA);
  doc.setFont("Arial", "bold");
  doc.setFontSize(9);
  doc.text(`${vigenciaYYYY.yyyy}`, 136, 64);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("____", 136, 64);

  // Parrafo de información del alumno
  doc.setFont("Arial", "bold");
  doc.setFontSize(12);
  doc.text("C E R T I F I C A", 55, 80);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("QUE EL (LA) C.", 89, 80);

  doc.setFont("TimesNewRoman", "normal");
  doc.setFontSize(11);
  doc.text(`${data.STUDENT_NAME}`, 113, 80);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("____________________________________________________", 113, 80.5);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("CON NÚMERO DE CONTROL", 55, 87);

  doc.setFont("TimesNewRoman", "normal");
  doc.setFontSize(12);
  doc.text(`${data.STUDENT_TUITION}`, 115, 87);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("___________________________", 101, 87.5);

  doc.setFont("Arial", "bold");
  doc.setFontSize(12);
  doc.text("ACREDITÓ", 152, 87);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("LAS MATERIAS QUE", 175, 87);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("INTEGRAN EL PLAN DE ESTUDIO DE LA", 55, 94);

  doc.setFont("ArialNarrow", "bold");
  doc.setFontSize(10);
  doc.text(`${data.STUDENT_CAREER},`, 117, 94);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("EN EL", 197, 94);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("PERÍODO DE", 55, 101);

  const inicioPeriodoMM = convertDate(data.STUDENT_START_PERIOD);
  doc.setFont("TimesNewRoman", "normal");
  doc.setFontSize(11);
  doc.text(`${inicioPeriodoMM.monthName}`, 76, 101);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("_______________", 76, 101);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("DE", 104, 101);

  const inicioPeriodoYYYY = convertDate(data.STUDENT_START_PERIOD);
  doc.setFont("TimesNewRoman", "normal");
  doc.setFontSize(11);
  doc.text(`${inicioPeriodoYYYY.yyyy}`, 110, 101);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("_____", 110, 101);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("A", 121, 101);

  const finPeriodoMM = convertDate(data.STUDENT_END_PERIOD);
  doc.setFont("TimesNewRoman", "normal");
  doc.setFontSize(11);
  doc.text(`${finPeriodoMM.monthName}`, 125, 101);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("_______________", 125, 101);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("DE", 153, 101);

  const finPeriodoYYYY = convertDate(data.STUDENT_END_PERIOD);
  doc.setFont("TimesNewRoman", "normal");
  doc.setFontSize(11);
  doc.text(`${finPeriodoYYYY.yyyy}`, 159, 101);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("_____,", 159, 101);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("CON LOS RESULTADOS", 170, 101);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("QUE A CONTINUACIÓN SE ANOTAN.", 55, 108);

  // Tablas de calificaciones
  // Tabla 1
  doc.addImage(tableBase64, "PNG", 9, 120, 96, 60);
  // Cabecera tabla 1
  doc.setFont("ArialNarrow", "normal");
  doc.setFontSize(10);
  doc.text("PRIMER CUATRIMESTRE", 20, 127);
  doc.setFontSize(9);
  doc.text("CALIFICACIÓN", 65.5, 124);
  doc.text("Cifra", 66.5, 129);
  doc.text("Letra", 76.5, 129);
  doc.setFontSize(10);
  doc.text(`OBSERVA-\nCIONES`, 94, 125, { align: "center" });

  // Tabla 2
  doc.addImage(tableBase64, "PNG", 110, 120, 96, 60);
  // Cabecera tabla 2
  doc.setFont("ArialNarrow", "normal");
  doc.setFontSize(10);
  doc.text("SEGUNDO CUATRIMESTRE", 120, 127);
  doc.setFontSize(9);
  doc.text("CALIFICACIÓN", 166, 124);
  doc.text("Cifra", 167, 129);
  doc.text("Letra", 177, 129);
  doc.setFontSize(10);
  doc.text(`OBSERVA-\nCIONES`, 195, 125, { align: "center" });

  // Tabla 3
  doc.addImage(tableBase64, "PNG", 9, 190, 96, 60);
  // Cabecera tabla 3
  doc.setFont("ArialNarrow", "normal");
  doc.setFontSize(10);
  doc.text("TECER CUATRIMESTRE", 20, 197);
  doc.setFontSize(9);
  doc.text("CALIFICACIÓN", 65.5, 194);
  doc.text("Cifra", 66.5, 199);
  doc.text("Letra", 76.5, 199);
  doc.setFontSize(10);
  doc.text(`OBSERVA-\nCIONES`, 94, 195, { align: "center" });

  // Tabla 4
  doc.addImage(tableBase64, "PNG", 110, 190, 96, 60);
  // Cabecera tabla 4
  doc.setFont("ArialNarrow", "normal");
  doc.setFontSize(10);
  doc.text("CUARTO CUATRIMESTRE", 120, 197);
  doc.setFontSize(9);
  doc.text("CALIFICACIÓN", 166, 194);
  doc.text("Cifra", 167, 199);
  doc.text("Letra", 177, 199);
  doc.setFontSize(10);
  doc.text(`OBSERVA-\nCIONES`, 195, 195, { align: "center" });

  // Tabla 5
  doc.addImage(tableBase64, "PNG", 9, 260, 96, 60);
  // Cabecera tabla 5
  doc.setFont("ArialNarrow", "normal");
  doc.setFontSize(10);
  doc.text("PRIMER CUATRIMESTRE", 20, 267);
  doc.setFontSize(9);
  doc.text("CALIFICACIÓN", 65.5, 264);
  doc.text("Cifra", 66.5, 269);
  doc.text("Letra", 76.5, 269);
  doc.setFontSize(10);
  doc.text(`OBSERVA-\nCIONES`, 94, 265, { align: "center" });

  // Tabla 6
  doc.addImage(tableBase64, "PNG", 110, 260, 96, 60);
  // Cabecera tabla 6
  doc.setFont("ArialNarrow", "normal");
  doc.setFontSize(10);
  doc.text("SEXTO CUATRIMESTRE", 120, 267);
  doc.setFontSize(9);
  doc.text("CALIFICACIÓN", 166, 264);
  doc.text("Cifra", 167, 269);
  doc.text("Letra", 177, 269);
  doc.setFontSize(10);
  doc.text(`OBSERVA-\nCIONES`, 195, 265, { align: "center" });

  // Advertencia
  doc.setFont("ArialNarrow", "normal");
  doc.setFontSize(11);
  doc.text(
    "Este documento no es válido si presenta raspaduras o enmendaduras.",
    60,
    340
  );

  // Agregar una nueva página
  doc.addPage();

  // Tabla 7
  doc.addImage(tableBase64, "PNG", 9, 15, 96, 60);
  // Cabecera tabla 7
  doc.setFont("ArialNarrow", "normal");
  doc.setFontSize(10);
  doc.text("SÉPTIMO CUATRIMESTRE", 20, 22);
  doc.setFontSize(9);
  doc.text("CALIFICACIÓN", 65.5, 19);
  doc.text("Cifra", 66.5, 24);
  doc.text("Letra", 76.5, 24);
  doc.setFontSize(10);
  doc.text(`OBSERVA-\nCIONES`, 94, 20, { align: "center" });

  // Tabla 8
  doc.addImage(tableBase64, "PNG", 110, 15, 96, 60);
  // Cabecera tabla 8
  doc.setFont("ArialNarrow", "normal");
  doc.setFontSize(10);
  doc.text("OCTAVO CUATRIMESTRE", 120, 22);
  doc.setFontSize(9);
  doc.text("CALIFICACIÓN", 166, 19);
  doc.text("Cifra", 167, 24);
  doc.text("Letra", 177, 24);
  doc.setFontSize(10);
  doc.text(`OBSERVA-\nCIONES`, 195, 20, { align: "center" });

  // Cuerpo
  doc.setFont("ArialNarrow", "normal");
  await getSubjectsAndScores(data.STUDENT_ID, 7, 10, 30);
  await getSubjectsAndScores(data.STUDENT_ID, 8, 111, 30);

  // Guardar el PDF
  doc.save(`${data.STUDENT_TUITION}-CER-AQ`);
};
