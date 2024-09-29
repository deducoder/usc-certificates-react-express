import jsPDF from "jspdf";
import { arialBase64 } from "./fonts/arial";
import { arialBoldBase64 } from "./fonts/arialBold";
import { arialNarrowBase64 } from "./fonts/arialNarrow";
import { timesNewRomanBase64 } from "./fonts/timesNewRoman";
import { timesNewRomanBoldBase64 } from "./fonts/timesNewRomanBold";
import { logoMXBase64 } from "./pictures/logoMX";
import { pictureSizeBase64 } from "./pictures/pictureSize";

const addCustomFonts = (doc: jsPDF) => {
  // Arial
  doc.addFileToVFS("Arial.ttf", arialBase64);
  doc.addFont("Arial.ttf", "Arial", "normal");

  // Arial Narrow
  doc.addFileToVFS("ArialNarrow.ttf", arialNarrowBase64);
  doc.addFont("ArialNarrow.ttf", "ArialNarrow", "normal");

  // Arial Bold
  doc.addFileToVFS("ArialBold.ttf", arialBoldBase64);
  doc.addFont("ArialBold.ttf", "Arial", "bold");

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
  STUDENT_NAME: String;
  STUDENT_TUITION: Number;
  STUDENT_CAREER: String;
  STUDENT_START_PERIOD: Date;
  STUDENT_END_PERIOD: Date;
}

export const certificatePDF = (data: Data) => {
  // Creando documento
  const doc = new jsPDF("portrait", "mm", [215.9, 355.6]);

  // Agregando fuentes
  addCustomFonts(doc);

  // Separar la fecha de vigencia
  const date: String = data.VIGENCIA; // Suponiendo que data.VIGENCIA es "2019-10-03"
  const [yyyy, mm, dd] = date.split("-");

  const month = [
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

  const monthName = month[parseInt(mm) - 1];

  // Posiciones para el contenido
  //const pageWidth = doc.internal.pageSize.getWidth();

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

  doc.setFont("Arial", "bold");
  doc.setFontSize(9);
  doc.text(`${dd}`, 95, 64);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("__", 95, 64);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("DE", 100, 64);

  doc.setFont("Arial", "bold");
  doc.setFontSize(9);
  doc.text(`${monthName}`, 106, 64);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("____________", 106, 64);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("DEL", 128, 64);

  doc.setFont("Arial", "bold");
  doc.setFontSize(9);
  doc.text(`${yyyy}`, 136, 64);

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

  doc.setFont("Arial", "bold");
  doc.setFontSize(9);
  doc.text(`${data.STUDENT_CAREER},`, 117, 94);

  doc.setFont("Arial", "normal");
  doc.setFontSize(9);
  doc.text("EN EL", 197, 94);

  // Agregar una nueva página
  doc.addPage();

  // Segunda página
  doc.text("This is the second page!", 10, 10);

  // Guardar el PDF
  doc.save("two-pages.pdf");
};
