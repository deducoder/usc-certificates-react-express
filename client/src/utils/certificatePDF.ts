import jsPDF from "jspdf";
import { arialBase64 } from "./fonts/arial";
import { arialBoldBase64 } from "./fonts/arialBold";
import { arialNarrowBase64 } from "./fonts/arialNarrow";
import { timesNewRomanBase64 } from "./fonts/timesNewRoman";
import { timesNewRomanBoldBase64 } from "./fonts/timesNewRomanBold";

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

export const certificatePDF = () => {
  const doc = new jsPDF("portrait", "mm", [215.9, 355.6]);

  // Add custom fonts
  addCustomFonts(doc);

  // Testing fonts
  doc.setFont("Arial", "normal");
  doc.text("Texto en Arial", 10, 10);

  doc.setFont("ArialNarrow", "normal");
  doc.text("Texto en Arial Narrow", 10, 20);

  doc.setFont("Arial", "bold");
  doc.text("Texto en Arial Bold", 10, 30);

  doc.setFont("TimesNewRoman", "normal");
  doc.text("Texto en Times New Roman", 10, 40);

  doc.setFont("TimesNewRoman", "bold");
  doc.text("Texto en Times New Roman Bold", 10, 50);

  // Add a new page
  doc.addPage();

  // Second page
  doc.text("This is the second page!", 10, 10);

  // Save the PDF
  doc.save("two-pages.pdf");
};
