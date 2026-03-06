import type ExcelJS from "exceljs";

// ─── Paleta de colores (ARGB sin #, con prefijo FF para opacidad total) ──────

export const COLORS = {
  // Indigo — color primario de la UI
  indigo600: "FF4F46E5",
  indigo700: "FF4338CA",
  indigo100: "FFE0E7FF",
  indigo50: "FFEFF0FF",

  // Slate — escala de grises de la UI
  slate900: "FF0F172A",
  slate800: "FF1E293B",
  slate700: "FF334155",
  slate500: "FF64748B",
  slate200: "FFE2E8F0",
  slate100: "FFF1F5F9",
  slate50: "FFF8FAFC",

  // Semanticos
  emerald600: "FF059669",
  emerald50: "FFF0FDF4",
  amber600: "FFD97706",
  amber50: "FFFEFCE8",
  red600: "FFDC2626",
  red50: "FFFEF2F2",
  orange500: "FFF97316",
  rose500: "FFF43F5E",

  white: "FFFFFFFF",
} as const;

// ─── Fuente base ─────────────────────────────────────────────────────────────

const BASE_FONT_NAME = "Calibri";

// ─── Helper: crea un Fill de tipo solid ──────────────────────────────────────

export function solidFill(argb: string): ExcelJS.Fill {
  return {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb },
  };
}

// ─── Helper: crea un borde fino en los 4 lados ───────────────────────────────

export function thinBorder(argb: string = COLORS.slate200): Partial<ExcelJS.Borders> {
  const side: Partial<ExcelJS.Border> = { style: "thin", color: { argb } };
  return { top: side, left: side, bottom: side, right: side };
}

export function mediumBorder(argb: string = COLORS.slate200): Partial<ExcelJS.Borders> {
  const side: Partial<ExcelJS.Border> = { style: "medium", color: { argb } };
  return { top: side, left: side, bottom: side, right: side };
}

// ─── Estilos predefinidos (Partial<Style>) ───────────────────────────────────

/** Header principal de seccion — fondo indigo oscuro, texto blanco, bold */
export const STYLE_SECTION_HEADER: Partial<ExcelJS.Style> = {
  fill: solidFill(COLORS.indigo600),
  font: { bold: true, color: { argb: COLORS.white }, size: 12, name: BASE_FONT_NAME },
  alignment: { vertical: "middle", horizontal: "left", wrapText: false },
  border: thinBorder(COLORS.indigo700),
};

/** Sub-header de seccion — fondo slate oscuro, texto blanco */
export const STYLE_SUBSECTION_HEADER: Partial<ExcelJS.Style> = {
  fill: solidFill(COLORS.slate800),
  font: { bold: true, color: { argb: COLORS.white }, size: 11, name: BASE_FONT_NAME },
  alignment: { vertical: "middle", horizontal: "left" },
  border: thinBorder(COLORS.slate700),
};

/** Titulo de tabla — fondo indigo mas oscuro, texto blanco, bold */
export const STYLE_TABLE_HEADER: Partial<ExcelJS.Style> = {
  fill: solidFill(COLORS.slate800),
  font: { bold: true, color: { argb: COLORS.white }, size: 10, name: BASE_FONT_NAME },
  alignment: { vertical: "middle", horizontal: "center", wrapText: false },
  border: thinBorder(COLORS.slate700),
};

/** Titulo grande de la hoja — fondo indigo, texto blanco, 14pt */
export const STYLE_SHEET_TITLE: Partial<ExcelJS.Style> = {
  fill: solidFill(COLORS.indigo600),
  font: { bold: true, color: { argb: COLORS.white }, size: 14, name: BASE_FONT_NAME },
  alignment: { vertical: "middle", horizontal: "left" },
};

/** Label de fila (columna A) */
export const STYLE_LABEL: Partial<ExcelJS.Style> = {
  font: { color: { argb: COLORS.slate700 }, size: 10, name: BASE_FONT_NAME },
  alignment: { vertical: "middle", horizontal: "left" },
  border: thinBorder(COLORS.slate200),
};

/** Valor de fila (columna B+) — bold, alineado a la derecha */
export const STYLE_VALUE: Partial<ExcelJS.Style> = {
  font: { bold: true, color: { argb: COLORS.slate900 }, size: 10, name: BASE_FONT_NAME },
  alignment: { vertical: "middle", horizontal: "right" },
  border: thinBorder(COLORS.slate200),
};

/** Valor de totales/destacado — bold, color indigo */
export const STYLE_VALUE_HIGHLIGHT: Partial<ExcelJS.Style> = {
  fill: solidFill(COLORS.indigo50),
  font: { bold: true, color: { argb: COLORS.indigo600 }, size: 11, name: BASE_FONT_NAME },
  alignment: { vertical: "middle", horizontal: "right" },
  border: thinBorder(COLORS.slate200),
};

/** Valor con color amber (advertencia) */
export const STYLE_VALUE_AMBER: Partial<ExcelJS.Style> = {
  font: { bold: true, color: { argb: COLORS.amber600 }, size: 10, name: BASE_FONT_NAME },
  alignment: { vertical: "middle", horizontal: "right" },
  border: thinBorder(COLORS.slate200),
};

/** Estado VIABLE (verde) */
export const STYLE_STATUS_VIABLE: Partial<ExcelJS.Style> = {
  fill: solidFill(COLORS.emerald50),
  font: { bold: true, color: { argb: COLORS.emerald600 }, size: 11, name: BASE_FONT_NAME },
  alignment: { vertical: "middle", horizontal: "center" },
  border: thinBorder(COLORS.emerald600),
};

/** Estado ALTO RIESGO (rojo) */
export const STYLE_STATUS_RISK: Partial<ExcelJS.Style> = {
  fill: solidFill(COLORS.red50),
  font: { bold: true, color: { argb: COLORS.red600 }, size: 11, name: BASE_FONT_NAME },
  alignment: { vertical: "middle", horizontal: "center" },
  border: thinBorder(COLORS.red600),
};

/** Fila de tabla — fondo blanco */
export const STYLE_TABLE_ROW: Partial<ExcelJS.Style> = {
  font: { size: 10, name: BASE_FONT_NAME },
  alignment: { vertical: "middle", horizontal: "right" },
  border: thinBorder(COLORS.slate200),
};

/** Fila de tabla alterna — fondo slate muy suave */
export const STYLE_TABLE_ROW_ALT: Partial<ExcelJS.Style> = {
  fill: solidFill(COLORS.slate50),
  font: { size: 10, name: BASE_FONT_NAME },
  alignment: { vertical: "middle", horizontal: "right" },
  border: thinBorder(COLORS.slate200),
};

/** Texto descriptivo con wrap */
export const STYLE_TEXT_WRAP: Partial<ExcelJS.Style> = {
  font: { size: 10, name: BASE_FONT_NAME, color: { argb: COLORS.slate700 } },
  alignment: { vertical: "middle", horizontal: "left", wrapText: true },
  border: thinBorder(COLORS.slate200),
};

/** Fila metadata (fecha, etc.) — italic, gris */
export const STYLE_META: Partial<ExcelJS.Style> = {
  font: { italic: true, color: { argb: COLORS.slate500 }, size: 9, name: BASE_FONT_NAME },
  alignment: { vertical: "middle", horizontal: "left" },
};

// ─── Formatos numericos ───────────────────────────────────────────────────────

/** Formato de moneda espanola: 1.234,56 € */
export const FMT_CURRENCY = '#,##0.00 "€"';

/** Formato de porcentaje con 1 decimal */
export const FMT_PERCENT = '0.0"%"';

/** Formato de entero con separador de miles */
export const FMT_INTEGER = "#,##0";

/** Formato de ano (entero simple) */
export const FMT_YEAR = "0";

// ─── Helpers para manipular hojas ────────────────────────────────────────────

/**
 * Ajusta automaticamente el ancho de todas las columnas de la hoja
 * basandose en el contenido de las celdas.
 */
export function autoFitColumns(
  worksheet: ExcelJS.Worksheet,
  minWidth: number = 10,
  maxWidth: number = 60
): void {
  worksheet.columns.forEach((column) => {
    if (!column || !column.eachCell) return;
    let maxLength = minWidth;
    column.eachCell({ includeEmpty: false }, (cell) => {
      const cellValue = cell.value;
      let len = 0;
      if (cellValue === null || cellValue === undefined) {
        len = 0;
      } else if (typeof cellValue === "object" && "richText" in cellValue) {
        len = (cellValue as ExcelJS.CellRichTextValue).richText
          .map((rt) => rt.text)
          .join("").length;
      } else {
        len = String(cellValue).length;
      }
      if (len > maxLength) maxLength = len;
    });
    column.width = Math.min(maxLength + 4, maxWidth);
  });
}

/**
 * Aplica el estilo de header a una fila de cabeceras de tabla
 * y devuelve el numero de fila siguiente.
 */
export function applyTableHeaders(
  worksheet: ExcelJS.Worksheet,
  headers: string[],
  rowNum: number,
  style: Partial<ExcelJS.Style> = STYLE_TABLE_HEADER
): number {
  const row = worksheet.getRow(rowNum);
  headers.forEach((header, idx) => {
    const cell = row.getCell(idx + 1);
    cell.value = header;
    Object.assign(cell, style);
  });
  row.height = 20;
  return rowNum + 1;
}

/**
 * Anade una fila de separador/titulo de seccion con merge de columnas.
 * Devuelve el numero de la siguiente fila libre.
 */
export function addSectionHeader(
  worksheet: ExcelJS.Worksheet,
  title: string,
  rowNum: number,
  colSpan: number,
  style: Partial<ExcelJS.Style> = STYLE_SECTION_HEADER
): number {
  const row = worksheet.getRow(rowNum);
  const cell = row.getCell(1);
  cell.value = title;
  Object.assign(cell, style);
  worksheet.mergeCells(rowNum, 1, rowNum, colSpan);
  row.height = 22;
  return rowNum + 1;
}

/**
 * Anade una fila vacia de separador.
 * Devuelve el numero de la siguiente fila libre.
 */
export function addEmptyRow(worksheet: ExcelJS.Worksheet, rowNum: number): number {
  worksheet.getRow(rowNum).height = 8;
  return rowNum + 1;
}

/**
 * Anade una fila de label + valor con formato numerico opcional.
 * Devuelve el numero de la siguiente fila libre.
 */
export function addLabelValueRow(
  worksheet: ExcelJS.Worksheet,
  rowNum: number,
  label: string,
  value: string | number | null,
  options: {
    numFmt?: string;
    valueStyle?: Partial<ExcelJS.Style>;
    labelStyle?: Partial<ExcelJS.Style>;
    height?: number;
  } = {}
): number {
  const { numFmt, valueStyle = STYLE_VALUE, labelStyle = STYLE_LABEL, height = 18 } = options;

  const row = worksheet.getRow(rowNum);

  const labelCell = row.getCell(1);
  labelCell.value = label;
  Object.assign(labelCell, labelStyle);

  const valueCell = row.getCell(2);
  valueCell.value = value;
  Object.assign(valueCell, valueStyle);
  if (numFmt) valueCell.numFmt = numFmt;

  row.height = height;
  return rowNum + 1;
}
