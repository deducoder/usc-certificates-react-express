export interface AutoTableHeadCell {
  content: string;
  colSpan?: number;
  rowSpan?: number;
  styles?: {
    halign?: "center" | "left" | "right";
    valign?: "top" | "middle" | "bottom";
    fontSize?: number;
    // Puedes agregar más propiedades según tus necesidades
  };
}

export interface AutoTableOptions {
  head: AutoTableHeadCell[][];
  startY?: number;
  startX?: number;
  margin?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  tableWidth?: string; // Puede ser "wrap", "auto" o un valor numérico
  // Puedes agregar más propiedades según las opciones de autoTable
}
