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
  STUDENT_ID: Number;
  STUDENT_NAME: String;
  STUDENT_TUITION: Number;
  STUDENT_CAREER: String;
  CAREER_ID: Number;
  STUDENT_START_PERIOD: String;
  STUDENT_END_PERIOD: String;
}

export const certificatePDF = (data: Data) => {
  // Creando documento
  const doc = new jsPDF("portrait", "mm", [215.9, 355.6]);

  // Obteniendo las materias
  const fetchSubjects = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/subjects/career/${data.CAREER_ID}`
      );
      const subjectsData = await response.json();
      return subjectsData;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  const getSubjects = async (period: number) => {
    const subjects = await fetchSubjects(); // Espera a que se resuelva la promesa

    // Filtra las materias por el periodo especificado
    const filteredSubjects = subjects.filter(
      (subject) => subject.SUBJECT_PERIOD === period
    );

    if (filteredSubjects.length > 0) {
      filteredSubjects.forEach((filteredSubject) => {
        console.log(
          `Nombre (Periodo ${period}): ${filteredSubject.SUBJECT_NAME}`
        );
      });
    } else {
      console.log(`No hay materias para el periodo ${period}.`);
    }
  };

  // Llama a la función para cada periodo de 1 a 8
  for (let period = 1; period <= 8; period++) {
    getSubjects(period);
  }

  // Agregando fuentes
  addCustomFonts(doc);

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

  // Posiciones para el contenido

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
  // Cuerpo
  const textTest = "INTRODUCCIÓN A LA INGENIERÍA EN SISTEMAS COMPUTACIONALES";
  doc.setFont("Arial", "normal");
  doc.setFontSize(8);
  doc.text(textTest, 10, 135, { maxWidth: 55 });

  // Tabla 2
  doc.addImage(tableBase64, "PNG", 110, 120, 96, 60);
  // Cabecera tabla 2
  doc.setFont("ArialNarrow", "normal");
  doc.setFontSize(10);
  doc.text("SEGUNDO CUATRIMESTRE", 130, 126);

  // Agregar una nueva página
  doc.addPage();

  // Segunda página
  doc.text("This is the second page!", 10, 10);

  // Guardar el PDF
  doc.save("two-pages.pdf");
};
