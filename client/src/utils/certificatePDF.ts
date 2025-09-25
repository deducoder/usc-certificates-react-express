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
import { squareBase64 } from "./pictures/square";
import { averageSquareBase64 } from "./pictures/averageSquare";
import { schoolarServicesTableBase64 } from "./pictures/schoolarServicesTable";
import { sofiaBase64 } from "./fonts/sofiaBold";

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

  // Sofia Sans Bold
  doc.addFileToVFS("SofiaBold.ttf", sofiaBase64);
  doc.addFont("SofiaBold.ttf", "SofiaBold", "bold");
};

function calculateTextWidth(doc: jsPDF, text: string): number {
  return doc.getTextWidth(text);
}

// Function to add underscores based on text width
function addTextWithUnderscores(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  additionalSpaces: number = 0
) {
  // Calculate the width of the text
  const textWidth = calculateTextWidth(doc, text);

  // Set font for underscores and calculate underscore width
  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  const underscoreWidth = calculateTextWidth(doc, "_");

  // Calculate the number of underscores needed
  const totalUnderscores = Math.ceil(
    textWidth / underscoreWidth + additionalSpaces
  );
  const underscores = "_".repeat(totalUnderscores);

  // Write underscores to the PDF
  doc.text(underscores, x, y);
}

// NUEVA FUNCIÓN para dibujar texto con partes en negrita
// Reemplaza la función anterior por esta nueva versión mejorada
// Reemplaza la función anterior por esta nueva versión
// Reemplaza la función anterior por esta versión corregida
const drawJustifiedTextWithBold = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number => {
  // 1. Tokenizar el texto (sin cambios aquí)
  const parts = text
    .trim()
    .split(/(\*.*?\*)/g)
    .filter(Boolean);
  const allTokens: {
    text: string;
    width: number;
    isBold: boolean;
    isSpace: boolean;
  }[] = [];

  parts.forEach((part) => {
    const isBold = part.startsWith("*") && part.endsWith("*");
    const textContent = isBold ? part.slice(1, -1) : part;
    doc.setFont("Arial", isBold ? "bold" : "normal");

    const subTokens = textContent.split(/(\s+)/).filter(Boolean);
    subTokens.forEach((subToken) => {
      allTokens.push({
        text: subToken,
        width: doc.getTextWidth(subToken),
        isBold: isBold,
        isSpace: /^\s+$/.test(subToken),
      });
    });
  });

  // 2. Lógica de renderizado de línea (CORREGIDA)
  const renderLine = (lineToRender: typeof allTokens, justify: boolean) => {
    // Eliminar espacios al final de la línea, no afectan la justificación
    while (
      lineToRender.length > 0 &&
      lineToRender[lineToRender.length - 1].isSpace
    ) {
      lineToRender.pop();
    }
    const words = lineToRender.filter((t) => !t.isSpace);
    if (words.length === 0) return;

    let currentX = x;

    // Para la última línea o líneas con una sola palabra, imprimir secuencialmente
    if (!justify || words.length <= 1) {
      lineToRender.forEach((token) => {
        doc.setFont("Arial", token.isBold ? "bold" : "normal");
        doc.text(token.text, currentX, currentY);
        currentX += token.width;
      });
      return;
    }

    // Lógica de justificación MEJORADA
    const totalWordWidth = words.reduce((acc, w) => acc + w.width, 0);
    const spaceSlots = lineToRender.filter((t) => t.isSpace).length;

    // Si no hay espacios (ej. una palabra muy larga), no justificar
    if (spaceSlots === 0) {
      renderLine(lineToRender, false); // Re-llama en modo no justificado
      return;
    }

    const totalSpacing = maxWidth - totalWordWidth;
    const spaceWidth = totalSpacing / spaceSlots; // Distribuir el espacio entre los "slots" de espacio originales

    lineToRender.forEach((token) => {
      doc.setFont("Arial", token.isBold ? "bold" : "normal");
      doc.text(token.text, currentX, currentY);

      if (token.isSpace) {
        currentX += spaceWidth; // Un token de espacio se expande al tamaño calculado
      } else {
        currentX += token.width; // Un token de palabra mantiene su tamaño original
      }
    });
  };

  // 3. Construcción de líneas (sin cambios aquí)
  let line: typeof allTokens = [];
  let currentY = y;
  let currentWidth = 0;

  for (let i = 0; i < allTokens.length; i++) {
    const token = allTokens[i];
    if (currentWidth + token.width > maxWidth && !token.isSpace) {
      renderLine(line, true);
      line = [token];
      currentWidth = token.width;
      currentY += lineHeight;
    } else {
      line.push(token);
      currentWidth += token.width;
    }
  }

  if (line.length > 0) {
    renderLine(line, false);
  }

  return currentY;
};

interface Data {
  // Informacion de la escuela
  REGIMEN: string;
  TURNO: string;
  CLAVE: string;
  MODALIDAD: string;
  RVOE: string;
  VIGENCIA: string;
  SECL: string;
  LEGAL_1: string;
  LEGAL_2: string;
  // Informacion del estudiante
  STUDENT_ID: number;
  STUDENT_NAME: string;
  STUDENT_TUITION: number;
  STUDENT_CAREER: string;
  CAREER_ID: number;
  STUDENT_START_PERIOD: string;
  STUDENT_END_PERIOD: string;
  // Información de los responsables
  PEOPLE: { [key: number]: People };
  // Expedición
  EXP: string;
  CERTIFICATE_NUMBER: string;
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

interface People {
  PEOPLE_ID: number; // ID único de la persona
  NAME: string; // Nombre completo de la persona
  CHARGE: string; // Cargo o puesto de la persona
}

export const certificatePDF = async (data: Data) => {
  // Creando documento
  const doc = new jsPDF("portrait", "mm", [215.9, 343]);
  console.log(data.PEOPLE[1].NAME); // Imprime el nombre de la persona con PEOPLE_ID 1
  console.log(data.PEOPLE[2].NAME); // Imprime el nombre de la persona con PEOPLE_ID 1
  console.log(data.PEOPLE[3].NAME); // Imprime el nombre de la persona con PEOPLE_ID 1
  console.log(data.PEOPLE[4].NAME); // Imprime el nombre de la persona con PEOPLE_ID 1
  console.log(data.PEOPLE[5].NAME); // Imprime el nombre de la persona con PEOPLE_ID 1
  console.log(data.PEOPLE[6].NAME); // Imprime el nombre de la persona con PEOPLE_ID 1
  console.log(data.PEOPLE[7].NAME); // Imprime el nombre de la persona con PEOPLE_ID 1

  // Obteniendo las materias
  const fetchSubjects = async (): Promise<Subject[]> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/subjects/career/${data.CAREER_ID}`
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
        `${import.meta.env.VITE_API_URL}/api/scores/student/${studentId}`
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
    };

    return words[num] || ""; // Devuelve una cadena vacía si no hay correspondencia
  };

  const numberToWords: { [key: number]: string } = {
    0: "cero",
    1: "uno",
    2: "dos",
    3: "tres",
    4: "cuatro",
    5: "cinco",
    6: "seis",
    7: "siete",
    8: "ocho",
    9: "nueve",
    10: "diez",
  };

  // Funicion para centrar palabras
  function getCenteredX(
    doc: jsPDF,
    text: string,
    xStart: number,
    xEnd: number
  ): number {
    // Calcular el ancho del texto
    const textWidth = doc.getTextWidth(text);

    // Calcular la coordenada X para centrar el texto dentro del rango
    return xStart + (xEnd - xStart - textWidth) / 2;
  }

  // Funcion para convertir promedio a texto
  const translateAverageToWords = (numStr: string): string => {
    const [wholePart, decimalPart] = numStr.split("."); // Divide el número en parte entera y decimal
    let words = "";

    // Convertir la parte entera
    if (parseInt(wholePart) in numberToWords) {
      words += numberToWords[parseInt(wholePart)];
    } else {
      words += "número fuera de rango"; // Mensaje de error si no se encuentra
    }

    if (decimalPart) {
      words += " punto ";
      for (const digit of decimalPart) {
        words += numberToWords[parseInt(digit)] + " "; // Agrega cada dígito
      }
    }

    // Hacer que la primera letra sea mayúscula
    return words.charAt(0).toUpperCase() + words.slice(1).trim();
  };

  // Funcion que convierte total de materias a texto
  const numberToString = (num: number): string => {
    const unidades: string[] = [
      "cero",
      "uno",
      "dos",
      "tres",
      "cuatro",
      "cinco",
      "seis",
      "siete",
      "ocho",
      "nueve",
    ];
    const especiales: string[] = [
      "diez",
      "once",
      "doce",
      "trece",
      "catorce",
      "quince",
      "dieciséis",
      "diecisiete",
      "dieciocho",
      "diecinueve",
    ];
    const decenas: string[] = [
      "veinte",
      "treinta",
      "cuarenta",
      "cincuenta",
      "sesenta",
      "setenta",
      "ochenta",
      "noventa",
    ];

    if (num < 0 || num > 99) {
      return "número fuera de rango";
    }

    if (num === 0) {
      return unidades[0]; // "cero"
    }

    if (num >= 1 && num <= 9) {
      return unidades[num];
    }

    if (num >= 10 && num <= 19) {
      return especiales[num - 10];
    }
    if (num % 10 === 0 && num <= 90) {
      return decenas[Math.floor(num / 10) - 2];
    }

    if (num >= 21 && num <= 99) {
      const decena = decenas[Math.floor(num / 10) - 2];
      const unidad = unidades[num % 10];
      return decena + " y " + unidad;
    }

    return "";
  };

  // Función para determinar el tamaño de fuente del nombre basado en su longitud
  const getNameFontSize = (name: string): number => {
    const referenceName = "SEBASTIAN ALEXANDER HERNANDEZ PANIAGUA";
    return name.length >= referenceName.length ? 11 : 12;
  };

  let averageScore: string = "0.0";
  let totalSubjects: number = 0;

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

    const scoreValues = scores.map((score) => score.SCORE); // Extraer los scores
    const totalScore = scoreValues.reduce((acc, score) => acc + score, 0); // Sumar todos los scores

    // Asignar el promedio a averageScore
    averageScore =
      scoreValues.length > 0
        ? (totalScore / scoreValues.length).toFixed(1)
        : "0.0"; // Calcular promedio con 1 decimal

    totalSubjects = subjects.length > 0 ? (totalSubjects = subjects.length) : 0;

    if (filteredSubjects.length > 0) {
      let defaultFontSize = 9.5;
      doc.setFontSize(defaultFontSize);

      filteredSubjects.forEach((filteredSubject) => {
        const splitText: string[] = doc.splitTextToSize(
          filteredSubject.SUBJECT_NAME,
          53
        );

        if (splitText.length > 1) {
          doc.setFontSize(9.5);
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
            const scoreTextWidth = doc.getTextWidth(scoreText); // Obtener el ancho del texto
            const xCentered = x + 58 - scoreTextWidth / 2;
            console.log(scoreText);
            doc.text(scoreText, xCentered, currentY - 4); // Imprimir el SCOR centrado
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
        currentY += 0.5;
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

    const monthName = monthNames[parseInt(mm) - 1];

    return { yyyy, mm, dd, monthName };
  };

  const convertDateNoCaps = (date: String) => {
    const [yyyy, mm, dd] = date.split("-");

    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const monthName = monthNames[parseInt(mm) - 1];

    return { yyyy, mm, dd, monthName };
  };

  // Logo gobierno de MX
  doc.addImage(logoMXBase64, "PNG", 9, 8, 28, 29);

  // Numero de certificado
  doc.setFont("TimesNewRoman", "bold");
  doc.setFontSize(12);
  doc.text("N°: _________", 175, 30.2);

  doc.setTextColor("red");
  doc.text(`${data.CERTIFICATE_NUMBER}`, 183, 30);

  // Primer párrafo
  doc.setTextColor("black");
  const infoGobierno = `GOBIERNO CONSTITUCIONAL DEL ESTADO DE CHIAPAS\nSECRETARÍA DE EDUCACIÓN ESTATAL\nSUBSECRETARÍA DE EDUCACIÓN ESTATAL`;
  doc.setFont("Arial", "bold");
  doc.setFontSize(12);
  doc.text(infoGobierno, 105, 10, { align: "center" });

  // Segundo párrafo
  const infoDireccion = `DIRECCIÓN DE EDUCACIÓN SUPERIOR\nDEPARTAMENTO DE SERVICIOS ESCOLARES`;
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
  // Estableciendo fuentes
  doc.setFont("Arial", "bold");
  doc.setFontSize(9);

  // Coordenadas de inicio y fin
  const xStart3 = 106;
  const xEnd3 = 125;

  // Obteniendo coordenada x centrada
  const centeredX3 = getCenteredX(
    doc,
    `${vigenciaMM.monthName}`,
    xStart3,
    xEnd3
  );

  // Imprimiendo texto y subrayado
  doc.text(`${vigenciaMM.monthName}`, centeredX3, 64);
  addTextWithUnderscores(doc, vigenciaMM.monthName, centeredX3, 64, 0);

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
  doc.setFontSize(getNameFontSize(data.STUDENT_NAME));
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

  doc.setFont("ArialNarrow", "normal");
  doc.setFontSize(9.5);
  doc.text("INTEGRAN EL PLAN DE ESTUDIO DE LA", 55, 94);

  doc.setFont("SofiaBold", "bold");
  doc.setFontSize(13);
  // Coordendas
  const xStart12 = 108;
  const xEnd12 = 195;

  // Obteniendo coordenada x centrada
  const centeredX12 = getCenteredX(
    doc,
    `${data.STUDENT_CAREER}`,
    xStart12,
    xEnd12
  );

  // Imprimiendo texto
  doc.text(`${data.STUDENT_CAREER},`, centeredX12, 94);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("EN EL", 197, 94);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("PERÍODO DE", 55, 101);

  const inicioPeriodoMM = convertDate(data.STUDENT_START_PERIOD);
  // Estableciendo fuentes
  doc.setFont("TimesNewRoman", "normal");
  doc.setFontSize(11);

  // Coordenadas de inicio y fin
  const xStart1 = 76;
  const xEnd1 = 100;

  // Obteniendo coordenada x centrada
  const centeredX1 = getCenteredX(
    doc,
    `${inicioPeriodoMM.monthName}`,
    xStart1,
    xEnd1
  );

  // Imprimiendo texto y subrayado
  doc.text(`${inicioPeriodoMM.monthName}`, centeredX1, 101);
  addTextWithUnderscores(doc, inicioPeriodoMM.monthName, centeredX1, 101, 0);

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
  // Estableciendo fuentes
  doc.setFont("TimesNewRoman", "normal");
  doc.setFontSize(11);

  // Coordenadas de inicio y fin
  const xStart2 = 125;
  const xEnd2 = 150;

  // Obteniendo coordenada x centrada
  const centeredX2 = getCenteredX(
    doc,
    `${finPeriodoMM.monthName}`,
    xStart2,
    xEnd2
  );

  // Imprimiendo texto y subrayado
  doc.text(`${finPeriodoMM.monthName}`, centeredX2, 101);
  addTextWithUnderscores(doc, finPeriodoMM.monthName, centeredX2, 101, 0);

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
  doc.text("TERCER CUATRIMESTRE", 20, 197);
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
  doc.text("QUINTO CUATRIMESTRE", 20, 267);
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
    328
  );

  // Agregar una nueva página
  doc.addPage();

  // Tabla 7
  doc.addImage(tableBase64, "PNG", 9, 10, 96, 60);
  // Cabecera tabla 7
  doc.setFont("ArialNarrow", "normal");
  doc.setFontSize(10);
  doc.text("SÉPTIMO CUATRIMESTRE", 20, 17);
  doc.setFontSize(9);
  doc.text("CALIFICACIÓN", 65.5, 14);
  doc.text("Cifra", 66.5, 19);
  doc.text("Letra", 76.5, 19);
  doc.setFontSize(10);
  doc.text(`OBSERVA-\nCIONES`, 94, 15, { align: "center" });

  // Tabla 8
  doc.addImage(tableBase64, "PNG", 110, 10, 96, 60);
  // Cabecera tabla 8
  doc.setFont("ArialNarrow", "normal");
  doc.setFontSize(10);
  doc.text("OCTAVO CUATRIMESTRE", 120, 17);
  doc.setFontSize(9);
  doc.text("CALIFICACIÓN", 166, 14);
  doc.text("Cifra", 167, 19);
  doc.text("Letra", 177, 19);
  doc.setFontSize(10);
  doc.text(`OBSERVA-\nCIONES`, 195, 15, { align: "center" });

  // Cuerpo
  doc.setFont("ArialNarrow", "normal");
  await getSubjectsAndScores(data.STUDENT_ID, 7, 10, 25);
  await getSubjectsAndScores(data.STUDENT_ID, 8, 111, 25);

  if (data.CAREER_ID === 7) {
    // Tabla 9
    doc.addImage(tableBase64, "PNG", 9, 74, 96, 60);
    // Cabecera tabla 9
    doc.setFont("ArialNarrow", "normal");
    doc.setFontSize(10);
    doc.text("NOVENO CUATRIMESTRE", 20, 81);
    doc.setFontSize(9);
    doc.text("CALIFICACIÓN", 65.5, 78);
    doc.text("Cifra", 66.5, 83);
    doc.text("Letra", 76.5, 83);
    doc.setFontSize(10);
    doc.text(`OBSERVA-\nCIONES`, 94, 79, { align: "center" });

    // Cuerpo
    await getSubjectsAndScores(data.STUDENT_ID, 9, 10, 90);

    // Promedio
    const averageScoreText = translateAverageToWords(averageScore);
    doc.addImage(averageSquareBase64, "PNG", 9, 137, 96, 5);
    doc.setFont("Arial", "bold");
    doc.setFontSize(9);
    doc.text("PROMEDIO GENERAL:", 10, 140.5);
    doc.setFont("TimesNewRoman", "bold");
    doc.setFontSize(9);
    doc.text(`${averageScore}  ( ${averageScoreText} )`, 55, 140.5);

    // Responsable 1
    doc.setFont("Arial", "bold");
    doc.setFontSize(9);
    doc.text(`${data.PEOPLE[1].CHARGE} «SAN CRISTÓBAL»`, 55, 152, {
      maxWidth: 60,
      align: "center",
    });
    doc.text("____________________________________________________", 10, 174);
    doc.setFont("TimesNewRoman", "normal");
    // Estableciendo fuentes
    doc.setFontSize(10);

    // Coordenadas de inicio y fin
    const xStart4 = 10;
    const xEnd4 = 100;

    // Obteniendo coordenada x centrada
    const centeredX4 = getCenteredX(
      doc,
      `${data.PEOPLE[1].NAME}`,
      xStart4,
      xEnd4
    );

    // Imprimiendo nombre
    doc.text(`${data.PEOPLE[1].NAME}`, centeredX4, 179);

    // Responsable 2
    doc.setFont("Arial", "bold");
    doc.setFontSize(9);
    doc.text(`${data.PEOPLE[2].CHARGE} «SAN CRISTÓBAL»`, 155, 152, {
      maxWidth: 50,
      align: "center",
    });
    doc.text("____________________________________________________", 110, 174);
    doc.setFont("TimesNewRoman", "normal");
    doc.setFontSize(10);

    const xStart5 = 110;
    const xEnd5 = 200;

    // Obteniendo coordenada x centrada
    const centeredX5 = getCenteredX(
      doc,
      `${data.PEOPLE[2].NAME}`,
      xStart5,
      xEnd5
    );

    doc.text(`${data.PEOPLE[2].NAME}`, centeredX5, 179);
  } else {
    // Promedio
    const averageScoreText = translateAverageToWords(averageScore);
    doc.addImage(averageSquareBase64, "PNG", 9, 74, 96, 5);
    doc.setFont("Arial", "bold");
    doc.setFontSize(9);
    doc.text("PROMEDIO GENERAL:", 10, 77.5);
    doc.setFont("TimesNewRoman", "bold");
    doc.setFontSize(9);
    doc.text(`${averageScore}  ( ${averageScoreText} )`, 55, 77.5);

    // Responsable 1
    doc.setFont("Arial", "bold");
    doc.setFontSize(9);
    doc.text(`${data.PEOPLE[1].CHARGE} «SAN CRISTÓBAL»`, 55, 140, {
      maxWidth: 60,
      align: "center",
    });
    doc.text("____________________________________________________", 10, 160);
    doc.setFont("TimesNewRoman", "normal");
    // Estableciendo fuentes
    doc.setFontSize(10);

    // Coordenadas de inicio y fin
    const xStart4 = 10;
    const xEnd4 = 100;

    // Obteniendo coordenada x centrada
    const centeredX4 = getCenteredX(
      doc,
      `${data.PEOPLE[1].NAME}`,
      xStart4,
      xEnd4
    );

    // Imprimiendo nombre
    doc.text(`${data.PEOPLE[1].NAME}`, centeredX4, 165);

    // Responsable 2
    doc.setFont("Arial", "bold");
    doc.setFontSize(9);
    doc.text(`${data.PEOPLE[2].CHARGE} «SAN CRISTÓBAL»`, 155, 140, {
      maxWidth: 50,
      align: "center",
    });
    doc.text("____________________________________________________", 110, 160);
    doc.setFont("TimesNewRoman", "normal");
    doc.setFontSize(10);

    const xStart5 = 110;
    const xEnd5 = 200;

    // Obteniendo coordenada x centrada
    const centeredX5 = getCenteredX(
      doc,
      `${data.PEOPLE[2].NAME}`,
      xStart5,
      xEnd5
    );

    doc.text(`${data.PEOPLE[2].NAME}`, centeredX5, 165);
  }

  // Legal
  const totalSubjectsText = numberToString(totalSubjects);
  const certificateDate = convertDateNoCaps(data.EXP);
  doc.addImage(squareBase64, "PNG", 110, 74, 96, 50);
  doc.setFont("Arial", "normal");
  doc.setFontSize(10.7);
  doc.text(
    "La  escala oficial de calificaciones  es  de  0 (CERO)  a",
    111.5,
    78,
    { maxWidth: 95, align: "justify" }
  );
  doc.text("10 (DIEZ), considerando como mínima aprobatoria  6", 111.5, 82.5, {
    maxWidth: 95,
    align: "justify",
  });
  doc.text(
    `(SEIS).  Este certificado ampara ${totalSubjects} (${totalSubjectsText})`,
    111.5,
    88,
    { maxWidth: 96, align: "justify" }
  );
  doc.text(
    "materias     del   plan   de   estudios   vigente    y    en",
    111.5,
    93,
    { maxWidth: 96, align: "justify" }
  );
  doc.text(
    "cumplimiento a las prescripciones legales, se extiende",
    111.5,
    98,
    { maxWidth: 95, align: "justify" }
  );
  doc.text(
    "el  presente,  en   la ciudad  de  San  Cristóbal de Las",
    111.5,
    103,
    { maxWidth: 95, align: "justify" }
  );
  doc.text(
    `Casas, Chiapas, a los ${certificateDate.dd} días del mes  de  ${certificateDate.monthName}  de`,
    111.5,
    108,
    { maxWidth: 95, align: "justify" }
  );
  doc.text("__", 150, 108);
  //doc.text("_________", 184, 113);
  addTextWithUnderscores(doc, certificateDate.monthName, 184, 108, 0);
  doc.setFont("Arial", "normal");
  doc.setFontSize(11);
  doc.text(`${certificateDate.yyyy}`, 111.5, 113);
  doc.text("_____", 111, 113);

  // Responsable 3
  doc.setFont("Arial", "bold");
  doc.setFontSize(9);
  doc.text(`${data.PEOPLE[3].CHARGE}`, 55, 190, {
    maxWidth: 60,
    align: "center",
  });
  doc.text("____________________________________________________", 10, 210);
  doc.setFont("TimesNewRoman", "normal");
  doc.setFontSize(10);

  const xStart6 = 10;
  const xEnd6 = 100;

  // Obteniendo coordenada x centrada
  const centeredX6 = getCenteredX(
    doc,
    `${data.PEOPLE[3].NAME}`,
    xStart6,
    xEnd6
  );

  doc.text(`${data.PEOPLE[3].NAME}`, centeredX6, 215);

  // Responsable 4
  doc.setFont("Arial", "bold");
  doc.setFontSize(9);
  doc.text(`${data.PEOPLE[4].CHARGE}`, 155, 190, {
    maxWidth: 50,
    align: "center",
  });
  doc.text("____________________________________________________", 110, 210);
  doc.setFont("TimesNewRoman", "normal");
  doc.setFontSize(10);

  const xStart7 = 110;
  const xEnd7 = 200;

  // Obteniendo coordenada x centrada
  const centeredX7 = getCenteredX(
    doc,
    `${data.PEOPLE[4].NAME}`,
    xStart7,
    xEnd7
  );

  doc.text(`${data.PEOPLE[4].NAME}`, centeredX7, 215);

  // Tabla de servicio escolare
  doc.addImage(schoolarServicesTableBase64, "PNG", 10, 230, 60, 95);
  doc.setFont("Arial", "normal");
  doc.setFontSize(8.5);
  doc.text("REGISTRADO EN EL DEPARTAMENTO DE SERVICIOS ESCOLARES", 40, 235.5, {
    maxWidth: 60,
    align: "center",
  });
  doc.setFontSize(10);
  doc.text("CON Nº:", 12, 252);
  doc.text("EN EL LIBRO:", 12, 262);
  doc.text("FOJA:", 12, 272);
  doc.text("FECHA:", 12, 282);
  doc.text("_____________", 40, 252);
  doc.text("_____________", 40, 262);
  doc.text("_____________", 40, 272);
  doc.text("_____________", 40, 282);
  doc.setFont("Arial", "bold");
  doc.text("C O T E J Ó:", 30, 293);
  // Estableciendo fuentes
  doc.setFont("TimesNewRoman", "normal");
  doc.setFontSize(8);
  // Coordenadas de inicio y fin
  const xStart8 = 12;
  const xEnd8 = 68;

  // Obteniendo coordenada x centrada
  const centeredX8 = getCenteredX(
    doc,
    `${data.PEOPLE[7].NAME}`,
    xStart8,
    xEnd8
  );
  // Imprimiendo texto
  doc.text(`${data.PEOPLE[7].NAME}`, centeredX8, 302);

  doc.setFont("Arial", "normal");
  doc.text(`${data.PEOPLE[5].CHARGE}`, 27, 312);

  // Estableciendo fuentes
  doc.setFont("TimesNewRoman", "normal");
  doc.setFontSize(8);

  // Obteniendo coordenada x centrada
  const centeredX9 = getCenteredX(
    doc,
    `${data.PEOPLE[5].NAME}`,
    xStart8,
    xEnd8
  );
  // Imprimiendo texto
  doc.text(`${data.PEOPLE[5].NAME}`, centeredX9, 320);

  // Parrafo legal
  // client/src/utils/certificatePDF.ts

  // ... (resto del código)

  // Parrafo legal
  doc.setFont("Arial", "normal");
  doc.setFontSize(10);

  // Dibuja el primer párrafo y guarda la posición 'y' donde termina.
  const finalYOfLegal1 = drawJustifiedTextWithBold(
    doc,
    data.LEGAL_1,
    110,
    235,
    95,
    4.5
  );

  // Calcula la posición para el segundo párrafo: donde terminó el primero + un salto de línea.
  const yForLegal2 = finalYOfLegal1 + 4.5 * 1.5; // Multiplicamos por 2 para un espacio más notorio

  // Dibuja el segundo párrafo en la nueva posición calculada.
  drawJustifiedTextWithBold(doc, data.LEGAL_2, 110, yForLegal2, 95, 4.5);

  // ... (resto del código)

  doc.setFont("TimesNewRoman", "normal");
  doc.setFontSize(10);
  // Coordenadas de inicio y fin
  const xStart10 = 110;
  const xEnd10 = 200;

  // Obteniendo coordenada x centrada
  const centeredX10 = getCenteredX(
    doc,
    `${data.PEOPLE[4].NAME}`,
    xStart10,
    xEnd10
  );
  doc.text(`${data.PEOPLE[4].NAME}`, centeredX10, 285);
  doc.setFont("Arial", "bold");
  doc.setFontSize(9);
  doc.text("____________________________________________________", 110, 286);
  doc.setFont("Arial", "normal");
  doc.setFontSize(8);
  doc.text("TUXTLA GUTIÉRREZ, CHIAPAS; A", 110, 298);
  doc.setFont("Arial", "bold");
  doc.setFontSize(9);
  doc.text("__________________________", 157, 298);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text(`${data.PEOPLE[6].CHARGE}`, 156, 320, {
    maxWidth: 100,
    align: "center",
  });
  doc.text("____________________________________________________", 110, 312);
  doc.setFont("TimesNewRoman", "normal");
  doc.setFontSize(10);
  // Coordenadas de inicio y fin
  const xStart11 = 110;
  const xEnd11 = 200;

  // Obteniendo coordenada x centrada
  const centeredX11 = getCenteredX(
    doc,
    `${data.PEOPLE[6].NAME}`,
    xStart11,
    xEnd11
  );
  doc.text(`${data.PEOPLE[6].NAME}`, centeredX11, 316, {
    maxWidth: 87,
  });

  // Guardar el PDF
  doc.save(`${data.EXP}-${data.STUDENT_TUITION}-CER-AQ`);
};
