import ExcelJS from "exceljs";
import type { ExportData, ExportProgressCallback } from "../types/export";
import {
  COLORS,
  solidFill,
  thinBorder,
  STYLE_SHEET_TITLE,
  STYLE_SECTION_HEADER,
  STYLE_SUBSECTION_HEADER,
  STYLE_TABLE_HEADER,
  STYLE_LABEL,
  STYLE_VALUE,
  STYLE_VALUE_HIGHLIGHT,
  STYLE_VALUE_AMBER,
  STYLE_TABLE_ROW,
  STYLE_TABLE_ROW_ALT,
  STYLE_TEXT_WRAP,
  STYLE_META,
  FMT_CURRENCY,
  FMT_YEAR,
} from "./excelStyles";

// ─── Utilidades ───────────────────────────────────────────────────────────────

function yieldToMain(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Convierte un indice de columna (1-based) a letra(s) de Excel: 1→A, 26→Z, 27→AA */
function colLetter(col: number): string {
  let letter = "";
  while (col > 0) {
    const rem = (col - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    col = Math.floor((col - 1) / 26);
  }
  return letter;
}

/** Construye una referencia absoluta: ref(1,2) → "$A$2" */
function ref(col: number, row: number): string {
  return `$${colLetter(col)}$${row}`;
}

/** Nombre de hoja entre comillas simples para referencias cross-sheet */
const SH1 = "'Resumen y Parametros'";

/** Crea un objeto formula para ExcelJS con valor de cache */
function formula(f: string, result: number | string): ExcelJS.CellFormulaValue {
  const normalized = f.trim().startsWith("=") ? f.trim().slice(1) : f.trim();
  return { formula: normalized, result };
}

/** Aplica estilo a una celda de forma segura (sin romper value) */
function applyStyle(cell: ExcelJS.Cell, style: Partial<ExcelJS.Style>): void {
  if (style.fill) cell.fill = style.fill as ExcelJS.Fill;
  if (style.font) cell.font = style.font as Partial<ExcelJS.Font>;
  if (style.alignment) cell.alignment = style.alignment as Partial<ExcelJS.Alignment>;
  if (style.border) cell.border = style.border as Partial<ExcelJS.Borders>;
}

// ─── MAPA DE POSICIONES FIJAS — Hoja 1 ───────────────────────────────────────
//
// El layout de la Hoja 1 usa posiciones de fila CONSTANTES para que las
// formulas de las otras hojas puedan referenciar celdas por posicion fija.
//
// Columna A = labels, Columna B = valores/formulas editables/calculados
// COL_LABEL=1 (A), COL_VALUE=2 (B)

const COL_L = 1; // columna de labels
const COL_V = 2; // columna de valores
const COL_SPAN_H1 = 6; // span total Hoja 1

// ── Bloque CUOTA HIPOTECA (filas 4-10) ───────────────────────────────────────
const R_HEADER_CUOTA = 4;
const R_CUOTA_MENSUAL = 5; // B5  = cuota hipoteca mensual  (formula PMT)
const R_IBI_MENSUAL = 6; // B6  = IBI mensual             (formula)
const R_TOTAL_MENSUAL = 7; // B7  = total mensual           (formula)
const R_RATIO_ESFUERZO = 8; // B8  = ratio esfuerzo          (formula)
const R_PLAZO_DISPLAY = 9; // B9  = plazo (referencia)
// R=10 vacia

// ── Bloque AHORRO NECESARIO (filas 11-18) ─────────────────────────────────────
const R_HEADER_AHORRO = 11;
const R_TOTAL_NECESARIO = 12; // B12 = total necesario         (formula)
const R_ENTRADA = 13; // B13 = entrada a aportar       (formula)
const R_GASTOS_IMPUESTOS = 14; // B14 = gastos e impuestos      (formula)
const R_AHORROS_DISPLAY = 15; // B15 = ahorros actuales        (referencia)
const R_FALTA_AHORRAR = 16; // B16 = falta por ahorrar       (formula)
const R_AHORRO_MENSUAL_D = 17; // B17 = ahorro mensual          (referencia)
const R_TIEMPO_MESES = 18; // B18 = tiempo estimado meses   (formula)
// R=19 vacia

// ── Bloque IMPORTE HIPOTECA (filas 20-26) ─────────────────────────────────────
const R_HEADER_IMPORTE = 20;
const R_IMPORTE_PRESTAMO = 21; // B21 = importe prestamo        (formula)
const R_PCT_LTV_DISPLAY = 22; // B22 = % LTV                   (referencia)
const R_ENTRADA_APORTADA = 23; // B23 = entrada aportada        (referencia B13)
const R_INTERESES_TOTALES = 24; // B24 = intereses totales       (formula)
const R_COSTE_TOTAL = 25; // B25 = coste total operacion   (formula)
// R=26,27 vacias

// ── Bloque PARAMETROS (filas 28+) ─────────────────────────────────────────────
const R_HEADER_PARAMS = 28;
// R=29 vacia
const R_SUBHEADER_INMUEBLE = 30;
const R_PRECIO_INMUEBLE = 31; // B31 INPUT  precio del inmueble
const R_PCT_LTV = 32; // B32 INPUT  % LTV
const R_PLAZO_ANOS = 33; // B33 INPUT  plazo en anos
const R_TIPO_HIPOTECA = 34; // B34 INPUT  tipo hipoteca (texto)
const R_TIPO_INTERES = 35; // B35 INPUT  tipo interes anual (decimal)
const R_TASA_INFLACION = 36; // B36 INPUT  tasa inflacion (decimal)
// R=37 vacia
const R_SUBHEADER_FINANCIERO = 38;
const R_AHORROS = 39; // B39 INPUT  ahorros actuales
const R_INGRESOS = 40; // B40 INPUT  ingresos mensuales
const R_ALQUILER = 41; // B41 INPUT  alquiler equivalente
const R_AHORRO_MENSUAL = 42; // B42 INPUT  ahorro mensual
// R=43 vacia
const R_SUBHEADER_IMPUESTOS = 44;
const R_TIPO_INMUEBLE = 45; // B45 INPUT  tipo inmueble (texto)
const R_ITP = 46; // B46 INPUT  ITP (decimal)
const R_IVA = 47; // B47 INPUT  IVA (decimal)
const R_AJD = 48; // B48 INPUT  AJD (decimal)
const R_IBI_ANUAL = 49; // B49 INPUT  IBI y Comunidad anual
const R_NOTARIA = 50; // B50 formula notaria
const R_REGISTRO = 51; // B51 formula registro
const R_GESTORIA = 52; // B52 formula gestoria
const R_TASACION = 53; // B53 formula tasacion
// formulas intermedias (ocultas visualmente pero usadas en formulas):
const R_IMPUESTOS_CALC = 54; // B54 formula impuestos (ITP o IVA+AJD)
const R_OTROS_GASTOS_CALC = 55; // B55 formula otros gastos (notaria+reg+gest+tasac)
// R=56 pie de pagina

// ─── Referencias absolutas de los INPUTS de Hoja 1 (para formulas cross-sheet) ──

const P = {
  // Inputs directos
  precioInmueble: `${SH1}!${ref(COL_V, R_PRECIO_INMUEBLE)}`,
  pctLtv: `${SH1}!${ref(COL_V, R_PCT_LTV)}`,
  plazoAnos: `${SH1}!${ref(COL_V, R_PLAZO_ANOS)}`,
  tipoInteres: `${SH1}!${ref(COL_V, R_TIPO_INTERES)}`,
  tasaInflacion: `${SH1}!${ref(COL_V, R_TASA_INFLACION)}`,
  ahorros: `${SH1}!${ref(COL_V, R_AHORROS)}`,
  ingresos: `${SH1}!${ref(COL_V, R_INGRESOS)}`,
  alquiler: `${SH1}!${ref(COL_V, R_ALQUILER)}`,
  ahorroMensual: `${SH1}!${ref(COL_V, R_AHORRO_MENSUAL)}`,
  tipoInmueble: `${SH1}!${ref(COL_V, R_TIPO_INMUEBLE)}`,
  itp: `${SH1}!${ref(COL_V, R_ITP)}`,
  iva: `${SH1}!${ref(COL_V, R_IVA)}`,
  ajd: `${SH1}!${ref(COL_V, R_AJD)}`,
  ibiAnual: `${SH1}!${ref(COL_V, R_IBI_ANUAL)}`,
  // Valores calculados de Hoja 1 reutilizados en otras hojas
  importePrestamo: `${SH1}!${ref(COL_V, R_IMPORTE_PRESTAMO)}`,
  cuotaMensual: `${SH1}!${ref(COL_V, R_CUOTA_MENSUAL)}`,
  ibiMensual: `${SH1}!${ref(COL_V, R_IBI_MENSUAL)}`,
  totalMensual: `${SH1}!${ref(COL_V, R_TOTAL_MENSUAL)}`,
  ratioEsfuerzo: `${SH1}!${ref(COL_V, R_RATIO_ESFUERZO)}`,
  entrada: `${SH1}!${ref(COL_V, R_ENTRADA)}`,
  gastosImpuestos: `${SH1}!${ref(COL_V, R_GASTOS_IMPUESTOS)}`,
  interesesTotales: `${SH1}!${ref(COL_V, R_INTERESES_TOTALES)}`,
};

// ─── HOJA 1: Resumen y Parametros ────────────────────────────────────────────

function buildSheetResumen(workbook: ExcelJS.Workbook, data: ExportData): void {
  const { state, derived } = data;
  const ws = workbook.addWorksheet("Resumen y Parametros");

  ws.columns = [
    { key: "label", width: 42 },
    { key: "value", width: 24 },
    { key: "c", width: 4 },
    { key: "d", width: 4 },
    { key: "e", width: 4 },
    { key: "f", width: 4 },
  ];

  // ── Fila 1: Titulo ────────────────────────────────────────────────────────
  ws.mergeCells(1, COL_L, 1, COL_SPAN_H1);
  const titleCell = ws.getCell(1, COL_L);
  titleCell.value = "SIMULACION HIPOTECARIA";
  applyStyle(titleCell, STYLE_SHEET_TITLE);
  ws.getRow(1).height = 28;

  // ── Fila 2: Metadata ──────────────────────────────────────────────────────
  ws.mergeCells(2, COL_L, 2, COL_SPAN_H1);
  const metaCell = ws.getCell(2, COL_L);
  metaCell.value = `Generado el ${formatDate(new Date())} | Calculadora Hipotecaria Espana`;
  applyStyle(metaCell, STYLE_META);
  ws.getRow(2).height = 16;

  // ── Fila 3: Vacia ─────────────────────────────────────────────────────────
  ws.getRow(3).height = 8;

  // ────────────────────────────────────────────────────────────────────────────
  // BLOQUE 1: CUOTA HIPOTECA
  // ────────────────────────────────────────────────────────────────────────────
  ws.mergeCells(R_HEADER_CUOTA, COL_L, R_HEADER_CUOTA, COL_SPAN_H1);
  const h1 = ws.getCell(R_HEADER_CUOTA, COL_L);
  h1.value = "  CUOTA HIPOTECA";
  applyStyle(h1, STYLE_SECTION_HEADER);
  ws.getRow(R_HEADER_CUOTA).height = 22;

  // B5 — Cuota mensual sin PMT (compatibilidad Google Sheets / Numbers):
  // IF(r=0, P/n, (P*r*(1+r)^n)/((1+r)^n-1))
  // Equivale a calculateMortgage(loanAmount, numInterestRate, numYears)
  // Los inputs aun no existen en la hoja — se referencian por posicion futura en B35, B33, B21
  // Usamos las referencias directas a la seccion de parametros (misma hoja)
  const monthlyRate = `${ref(COL_V, R_TIPO_INTERES)}/12`;
  const payments = `${ref(COL_V, R_PLAZO_ANOS)}*12`;
  const principal = `${ref(COL_V, R_IMPORTE_PRESTAMO)}`;
  const fCuota = `IF(${ref(COL_V, R_TIPO_INTERES)}=0,${principal}/(${payments}),(${principal}*(${monthlyRate})*POWER(1+(${monthlyRate}),${payments}))/(POWER(1+(${monthlyRate}),${payments})-1))`;
  setLabelValue(
    ws,
    R_CUOTA_MENSUAL,
    "Cuota Hipoteca Mensual",
    formula(fCuota, derived.monthlyPayment),
    FMT_CURRENCY,
    STYLE_VALUE_HIGHLIGHT
  );

  // B6 — IBI mensual: =B49/12
  const fIbiMensual = `=${ref(COL_V, R_IBI_ANUAL)}/12`;
  setLabelValue(
    ws,
    R_IBI_MENSUAL,
    "IBI y Comunidad (mensual)",
    formula(fIbiMensual, derived.monthlyIbiAndCommunity),
    FMT_CURRENCY,
    STYLE_VALUE
  );

  // B7 — Total mensual: =B5+B6
  const fTotal = `=${ref(COL_V, R_CUOTA_MENSUAL)}+${ref(COL_V, R_IBI_MENSUAL)}`;
  setLabelValue(
    ws,
    R_TOTAL_MENSUAL,
    "Total Mensual (Hipoteca + IBI/Com.)",
    formula(fTotal, derived.totalMonthlyPayment),
    FMT_CURRENCY,
    STYLE_VALUE_HIGHLIGHT
  );

  // B8 — Ratio de esfuerzo: =IF(B40>0, B7/B40, 0)
  const fRatio = `=IF(${ref(COL_V, R_INGRESOS)}>0,${ref(COL_V, R_TOTAL_MENSUAL)}/${ref(COL_V, R_INGRESOS)},0)`;
  setLabelValue(
    ws,
    R_RATIO_ESFUERZO,
    "Ratio de Esfuerzo",
    formula(fRatio, derived.affordabilityRatio / 100),
    '0.0"%"',
    STYLE_VALUE
  );
  // (El color condicional se aplica mas abajo via addConditionalFormatting)

  // B9 — Plazo (referencia directa): =B33
  const fPlazo = `=${ref(COL_V, R_PLAZO_ANOS)}`;
  setLabelValue(
    ws,
    R_PLAZO_DISPLAY,
    "Plazo (anos)",
    formula(fPlazo, derived.numYears),
    `0 "anos"`,
    STYLE_VALUE
  );

  ws.getRow(10).height = 8; // separador

  // ────────────────────────────────────────────────────────────────────────────
  // BLOQUE 2: AHORRO NECESARIO
  // ────────────────────────────────────────────────────────────────────────────
  ws.mergeCells(R_HEADER_AHORRO, COL_L, R_HEADER_AHORRO, COL_SPAN_H1);
  const h2 = ws.getCell(R_HEADER_AHORRO, COL_L);
  h2.value = "  AHORRO NECESARIO (ENTRADA + GASTOS)";
  applyStyle(h2, STYLE_SECTION_HEADER);
  ws.getRow(R_HEADER_AHORRO).height = 22;

  // B13 — Entrada: =MAX(0, B31 - B21)  (precio - prestamo)
  const fEntrada = `=MAX(0,${ref(COL_V, R_PRECIO_INMUEBLE)}-${ref(COL_V, R_IMPORTE_PRESTAMO)})`;
  setLabelValue(
    ws,
    R_ENTRADA,
    "Entrada a Aportar",
    formula(fEntrada, derived.downPayment),
    FMT_CURRENCY,
    STYLE_VALUE
  );

  // B14 — Gastos e Impuestos: =B54+B55
  const fGastos = `=${ref(COL_V, R_IMPUESTOS_CALC)}+${ref(COL_V, R_OTROS_GASTOS_CALC)}`;
  setLabelValue(
    ws,
    R_GASTOS_IMPUESTOS,
    "Gastos e Impuestos",
    formula(fGastos, derived.totalExpenses),
    FMT_CURRENCY,
    STYLE_VALUE
  );

  // B12 — Total necesario: =B13+B14
  const fTotalNecesario = `=${ref(COL_V, R_ENTRADA)}+${ref(COL_V, R_GASTOS_IMPUESTOS)}`;
  setLabelValue(
    ws,
    R_TOTAL_NECESARIO,
    "Total Necesario (Entrada + Gastos)",
    formula(fTotalNecesario, derived.totalInitialCash),
    FMT_CURRENCY,
    STYLE_VALUE_HIGHLIGHT
  );

  // B15 — Ahorros actuales (input, ref directa): =B39
  const fAhorrosD = `=${ref(COL_V, R_AHORROS)}`;
  setLabelValue(
    ws,
    R_AHORROS_DISPLAY,
    "Ahorros Actuales",
    formula(fAhorrosD, derived.numSavings),
    FMT_CURRENCY,
    STYLE_VALUE
  );

  // B16 — Falta por ahorrar: =MAX(0, B12-B39)
  const fFalta = `=MAX(0,${ref(COL_V, R_TOTAL_NECESARIO)}-${ref(COL_V, R_AHORROS)})`;
  setLabelValue(
    ws,
    R_FALTA_AHORRAR,
    "Falta por Ahorrar",
    formula(fFalta, derived.missingSavings),
    FMT_CURRENCY,
    STYLE_VALUE_AMBER
  );

  // B17 — Ahorro mensual (input, ref directa): =B42
  const fAhorroMD = `=${ref(COL_V, R_AHORRO_MENSUAL)}`;
  setLabelValue(
    ws,
    R_AHORRO_MENSUAL_D,
    "Ahorro Mensual",
    formula(fAhorroMD, derived.numMonthlySavings),
    FMT_CURRENCY,
    STYLE_VALUE
  );

  // B18 — Tiempo estimado (meses), evitando ROUNDUP por compatibilidad:
  // ceil(a/b) para positivos = INT((a+b-1)/b)
  const fTiempo = `IF(${ref(COL_V, R_AHORRO_MENSUAL)}>0,IF(${ref(COL_V, R_FALTA_AHORRAR)}>0,INT((${ref(COL_V, R_FALTA_AHORRAR)}+${ref(COL_V, R_AHORRO_MENSUAL)}-1)/${ref(COL_V, R_AHORRO_MENSUAL)}),0),0)`;
  setLabelValue(
    ws,
    R_TIEMPO_MESES,
    "Tiempo Estimado para Completar Ahorro (meses)",
    formula(fTiempo, derived.monthsToSave),
    `0 "meses"`,
    STYLE_VALUE
  );

  ws.getRow(19).height = 8;

  // ────────────────────────────────────────────────────────────────────────────
  // BLOQUE 3: IMPORTE HIPOTECA
  // ────────────────────────────────────────────────────────────────────────────
  ws.mergeCells(R_HEADER_IMPORTE, COL_L, R_HEADER_IMPORTE, COL_SPAN_H1);
  const h3 = ws.getCell(R_HEADER_IMPORTE, COL_L);
  h3.value = "  IMPORTE HIPOTECA";
  applyStyle(h3, STYLE_SECTION_HEADER);
  ws.getRow(R_HEADER_IMPORTE).height = 22;

  // B21 — Importe prestamo: =MAX(0, B31*B32)
  const fImporte = `=MAX(0,${ref(COL_V, R_PRECIO_INMUEBLE)}*${ref(COL_V, R_PCT_LTV)})`;
  setLabelValue(
    ws,
    R_IMPORTE_PRESTAMO,
    "Importe del Prestamo",
    formula(fImporte, derived.loanAmount),
    FMT_CURRENCY,
    STYLE_VALUE_HIGHLIGHT
  );

  // B22 — % LTV (referencia): =B32
  const fLtvD = `=${ref(COL_V, R_PCT_LTV)}`;
  setLabelValue(
    ws,
    R_PCT_LTV_DISPLAY,
    "% Financiacion (LTV)",
    formula(fLtvD, derived.numLtv / 100),
    '0.0"%"',
    STYLE_VALUE
  );

  // B23 — Entrada aportada (misma formula que B13): =B13
  const fEntradaRef = `=${ref(COL_V, R_ENTRADA)}`;
  setLabelValue(
    ws,
    R_ENTRADA_APORTADA,
    "Entrada Aportada",
    formula(fEntradaRef, derived.downPayment),
    FMT_CURRENCY,
    STYLE_VALUE
  );

  // B24 — Intereses totales: =B5*B33*12-B21
  const fIntereses = `=${ref(COL_V, R_CUOTA_MENSUAL)}*${ref(COL_V, R_PLAZO_ANOS)}*12-${ref(COL_V, R_IMPORTE_PRESTAMO)}`;
  setLabelValue(
    ws,
    R_INTERESES_TOTALES,
    "Intereses Totales a Pagar",
    formula(fIntereses, derived.totalInterestPaid),
    FMT_CURRENCY,
    STYLE_VALUE_AMBER
  );

  // B25 — Coste total: =B31+B14+B24+B49*B33
  const fCosteTotal = `=${ref(COL_V, R_PRECIO_INMUEBLE)}+${ref(COL_V, R_GASTOS_IMPUESTOS)}+${ref(COL_V, R_INTERESES_TOTALES)}+${ref(COL_V, R_IBI_ANUAL)}*${ref(COL_V, R_PLAZO_ANOS)}`;
  setLabelValue(
    ws,
    R_COSTE_TOTAL,
    "Coste Total de la Operacion",
    formula(fCosteTotal, derived.totalCostOfProperty),
    FMT_CURRENCY,
    STYLE_VALUE_HIGHLIGHT
  );

  ws.getRow(26).height = 8;
  ws.getRow(27).height = 8;

  // ────────────────────────────────────────────────────────────────────────────
  // SECCION PARAMETROS DE SIMULACION
  // ────────────────────────────────────────────────────────────────────────────
  ws.mergeCells(R_HEADER_PARAMS, COL_L, R_HEADER_PARAMS, COL_SPAN_H1);
  const hParams = ws.getCell(R_HEADER_PARAMS, COL_L);
  hParams.value = "  PARAMETROS DE SIMULACION";
  applyStyle(hParams, {
    ...STYLE_SHEET_TITLE,
    font: { bold: true, color: { argb: COLORS.white }, size: 13, name: "Calibri" },
  });
  ws.getRow(R_HEADER_PARAMS).height = 26;

  ws.getRow(29).height = 8;

  // ── Sub-seccion: Datos del Inmueble ───────────────────────────────────────
  ws.mergeCells(R_SUBHEADER_INMUEBLE, COL_L, R_SUBHEADER_INMUEBLE, COL_SPAN_H1);
  const hInmueble = ws.getCell(R_SUBHEADER_INMUEBLE, COL_L);
  hInmueble.value = "  Datos del Inmueble";
  applyStyle(hInmueble, STYLE_SUBSECTION_HEADER);
  ws.getRow(R_SUBHEADER_INMUEBLE).height = 20;

  // Inputs — valores estaticos editables por el usuario
  setInputRow(ws, R_PRECIO_INMUEBLE, "Precio del Inmueble", derived.numPropertyValue, FMT_CURRENCY);
  setInputRow(ws, R_PCT_LTV, "Porcentaje de Financiacion (LTV)", derived.numLtv / 100, '0.0"%"');
  setInputRow(ws, R_PLAZO_ANOS, "Plazo de la Hipoteca (anos)", derived.numYears, `0 "anos"`);
  setInputRow(
    ws,
    R_TIPO_HIPOTECA,
    "Tipo de Hipoteca",
    state.mortgageType === "fixed" ? "Fija" : "Variable",
    undefined,
    true
  );
  setInputRow(
    ws,
    R_TIPO_INTERES,
    "Tipo de Interes Anual",
    derived.numInterestRate / 100,
    '0.00"%"'
  );
  setInputRow(
    ws,
    R_TASA_INFLACION,
    "Tasa de Inflacion Estimada",
    derived.numInflationRate / 100,
    '0.00"%"'
  );

  ws.getRow(37).height = 8;

  // ── Sub-seccion: Perfil Financiero ────────────────────────────────────────
  ws.mergeCells(R_SUBHEADER_FINANCIERO, COL_L, R_SUBHEADER_FINANCIERO, COL_SPAN_H1);
  const hFin = ws.getCell(R_SUBHEADER_FINANCIERO, COL_L);
  hFin.value = "  Perfil Financiero";
  applyStyle(hFin, STYLE_SUBSECTION_HEADER);
  ws.getRow(R_SUBHEADER_FINANCIERO).height = 20;

  setInputRow(ws, R_AHORROS, "Ahorros Actuales", derived.numSavings, FMT_CURRENCY);
  setInputRow(ws, R_INGRESOS, "Ingresos Netos Mensuales", derived.numMonthlyIncome, FMT_CURRENCY);
  setInputRow(
    ws,
    R_ALQUILER,
    "Alquiler Actual o Equivalente (mensual)",
    derived.numEquivalentRent,
    FMT_CURRENCY
  );
  setInputRow(
    ws,
    R_AHORRO_MENSUAL,
    "Ahorro Mensual Previsto",
    derived.numMonthlySavings,
    FMT_CURRENCY
  );

  ws.getRow(43).height = 8;

  // ── Sub-seccion: Impuestos y Gastos ───────────────────────────────────────
  ws.mergeCells(R_SUBHEADER_IMPUESTOS, COL_L, R_SUBHEADER_IMPUESTOS, COL_SPAN_H1);
  const hImp = ws.getCell(R_SUBHEADER_IMPUESTOS, COL_L);
  hImp.value = "  Impuestos y Gastos";
  applyStyle(hImp, STYLE_SUBSECTION_HEADER);
  ws.getRow(R_SUBHEADER_IMPUESTOS).height = 20;

  const tipoText =
    state.propertyType === "second-hand" ? "Segunda Mano (ITP)" : "Obra Nueva (IVA+AJD)";
  setInputRow(ws, R_TIPO_INMUEBLE, "Tipo de Inmueble", tipoText, undefined, true);

  // Siempre mostramos las 3 filas de impuestos (ITP, IVA, AJD)
  // La formula de calculo usa IF para elegir el calculo correcto
  setInputRow(
    ws,
    R_ITP,
    "ITP - Impuesto de Transmisiones Patrimoniales",
    derived.numItpRate / 100,
    '0.0"%"'
  );
  setInputRow(
    ws,
    R_IVA,
    "IVA - Impuesto sobre el Valor Anadido",
    derived.numIvaRate / 100,
    '0.0"%"'
  );
  setInputRow(ws, R_AJD, "AJD - Actos Juridicos Documentados", derived.numAjdRate / 100, '0.0"%"');
  setInputRow(
    ws,
    R_IBI_ANUAL,
    "IBI y Comunidad (coste anual)",
    derived.numIbiAndCommunity,
    FMT_CURRENCY
  );

  // Filas de gastos calculados (formulas)
  // B50 — Notaria: =ROUND(B31*0.003+300, 0)
  const fNotaria = `=ROUND(${ref(COL_V, R_PRECIO_INMUEBLE)}*0.003+300,0)`;
  setLabelValue(
    ws,
    R_NOTARIA,
    "Gastos de Notaria (estimacion)",
    formula(fNotaria, derived.numNotaryFee),
    FMT_CURRENCY,
    STYLE_VALUE
  );

  // B51 — Registro: =ROUND(B31*0.0015+150, 0)
  const fRegistro = `=ROUND(${ref(COL_V, R_PRECIO_INMUEBLE)}*0.0015+150,0)`;
  setLabelValue(
    ws,
    R_REGISTRO,
    "Gastos de Registro (estimacion)",
    formula(fRegistro, derived.numRegistryFee),
    FMT_CURRENCY,
    STYLE_VALUE
  );

  // B52 — Gestoria: constante 400
  setLabelValue(ws, R_GESTORIA, "Gastos de Gestoria (estimacion)", 400, FMT_CURRENCY, STYLE_VALUE);

  // B53 — Tasacion: =ROUND(MAX(300, B31*0.001), 0)
  const fTasacion = `=ROUND(MAX(300,${ref(COL_V, R_PRECIO_INMUEBLE)}*0.001),0)`;
  setLabelValue(
    ws,
    R_TASACION,
    "Gastos de Tasacion (estimacion)",
    formula(fTasacion, derived.numTasacionFee),
    FMT_CURRENCY,
    STYLE_VALUE
  );

  // B54 — Impuestos calculados (fila auxiliar, fondo gris suave):
  // =IF(B45="Segunda Mano (ITP)", B31*B46, B31*B47 + B31*B48)
  const fImpCalc = `=IF(${ref(COL_V, R_TIPO_INMUEBLE)}="Segunda Mano (ITP)",${ref(COL_V, R_PRECIO_INMUEBLE)}*${ref(COL_V, R_ITP)},${ref(COL_V, R_PRECIO_INMUEBLE)}*${ref(COL_V, R_IVA)}+${ref(COL_V, R_PRECIO_INMUEBLE)}*${ref(COL_V, R_AJD)})`;
  setLabelValue(
    ws,
    R_IMPUESTOS_CALC,
    "Impuestos (calculo automatico segun tipo)",
    formula(fImpCalc, derived.taxes),
    FMT_CURRENCY,
    {
      ...STYLE_VALUE,
      fill: solidFill(COLORS.indigo50),
      font: { italic: true, color: { argb: COLORS.slate500 }, size: 9, name: "Calibri" },
    }
  );

  // B55 — Otros gastos (fila auxiliar):
  // =B50+B51+B52+B53
  const fOtrosGastos = `=${ref(COL_V, R_NOTARIA)}+${ref(COL_V, R_REGISTRO)}+${ref(COL_V, R_GESTORIA)}+${ref(COL_V, R_TASACION)}`;
  setLabelValue(
    ws,
    R_OTROS_GASTOS_CALC,
    "Otros Gastos (Notaria + Registro + Gestoria + Tasacion)",
    formula(fOtrosGastos, derived.otherExpenses),
    FMT_CURRENCY,
    {
      ...STYLE_VALUE,
      fill: solidFill(COLORS.indigo50),
      font: { italic: true, color: { argb: COLORS.slate500 }, size: 9, name: "Calibri" },
    }
  );

  // ── Pie de pagina ─────────────────────────────────────────────────────────
  ws.getRow(55).height = 8;
  const footerRow = 56;
  ws.mergeCells(footerRow, COL_L, footerRow, COL_SPAN_H1);
  const footerCell = ws.getCell(footerRow, COL_L);
  footerCell.value =
    "Los resultados son orientativos y no constituyen una oferta vinculante. Puede modificar los parametros de entrada (celdas con fondo blanco) para recalcular automaticamente todos los valores.";
  applyStyle(footerCell, {
    ...STYLE_META,
    alignment: { vertical: "middle", horizontal: "left", wrapText: true },
  });
  ws.getRow(footerRow).height = 32;

  // ── Formato condicional en Ratio de Esfuerzo (B8) ─────────────────────────
  // Verde si <= 30%, Amber si 30-35%, Rojo si > 35%
  ws.addConditionalFormatting({
    ref: `${ref(COL_V, R_RATIO_ESFUERZO)}`,
    rules: [
      {
        type: "cellIs",
        operator: "greaterThan",
        formulae: ["0.35"],
        priority: 1,
        style: {
          fill: solidFill(COLORS.red50) as ExcelJS.Fill,
          font: { bold: true, color: { argb: COLORS.red600 }, name: "Calibri", size: 10 },
        },
      },
      {
        type: "cellIs",
        operator: "greaterThan",
        formulae: ["0.3"],
        priority: 2,
        style: {
          fill: solidFill(COLORS.amber50) as ExcelJS.Fill,
          font: { bold: true, color: { argb: COLORS.amber600 }, name: "Calibri", size: 10 },
        },
      },
      {
        type: "cellIs",
        operator: "lessThan",
        formulae: ["0.3"],
        priority: 3,
        style: {
          fill: solidFill(COLORS.emerald50) as ExcelJS.Fill,
          font: { bold: true, color: { argb: COLORS.emerald600 }, name: "Calibri", size: 10 },
        },
      },
    ],
  });

  ws.views = [{ state: "frozen", ySplit: 2, xSplit: 0 }];
}

// ─── Helpers de Hoja 1 ───────────────────────────────────────────────────────

/** Fila de parametro de entrada: label gris + valor editable blanco */
function setInputRow(
  ws: ExcelJS.Worksheet,
  rowNum: number,
  label: string,
  value: string | number,
  numFmt?: string,
  isText?: boolean
): void {
  const row = ws.getRow(rowNum);
  row.height = 18;

  const lc = row.getCell(COL_L);
  lc.value = label;
  applyStyle(lc, STYLE_LABEL);

  const vc = row.getCell(COL_V);
  vc.value = value;
  if (numFmt && !isText) vc.numFmt = numFmt;

  // Estilo de celda editable: fondo ligeramente diferenciado
  applyStyle(vc, {
    font: { bold: false, color: { argb: COLORS.slate900 }, size: 10, name: "Calibri" },
    alignment: { vertical: "middle", horizontal: "right" },
    fill: solidFill(COLORS.white),
    border: thinBorder(COLORS.indigo600), // borde indigo para distinguir inputs
  });
}

/** Fila de valor calculado: label + formula/valor con estilo aplicado */
function setLabelValue(
  ws: ExcelJS.Worksheet,
  rowNum: number,
  label: string,
  value: ExcelJS.CellValue,
  numFmt?: string,
  style: Partial<ExcelJS.Style> = STYLE_VALUE
): void {
  const row = ws.getRow(rowNum);
  row.height = 18;

  const lc = row.getCell(COL_L);
  lc.value = label;
  applyStyle(lc, STYLE_LABEL);

  const vc = row.getCell(COL_V);
  vc.value = value;
  if (numFmt) vc.numFmt = numFmt;
  applyStyle(vc, style);
}

// ─── HOJA 2: Amortizacion ─────────────────────────────────────────────────────

function buildSheetAmortizacion(workbook: ExcelJS.Workbook, data: ExportData): void {
  const { derived, amortizationData } = data;
  const ws = workbook.addWorksheet("Amortizacion");

  ws.columns = [
    { key: "year", width: 10 },
    { key: "balance", width: 22 },
    { key: "principalPaid", width: 22 },
    { key: "totalInterest", width: 24 },
    { key: "monthlyPayment", width: 22 },
    { key: "realPayment", width: 24 },
  ];

  const COL_SPAN = 6;

  // ── Fila 1: Titulo ────────────────────────────────────────────────────────
  ws.mergeCells(1, 1, 1, COL_SPAN);
  const t = ws.getCell(1, 1);
  t.value = "DETALLE DE AMORTIZACION";
  applyStyle(t, STYLE_SHEET_TITLE);
  ws.getRow(1).height = 28;

  // ── Fila 2: Nota ─────────────────────────────────────────────────────────
  ws.mergeCells(2, 1, 2, COL_SPAN);
  const m = ws.getCell(2, 1);
  m.value =
    "Las formulas referencian los parametros de la hoja 'Resumen y Parametros'. Modificar los datos de entrada alli recalculara esta tabla automaticamente.";
  applyStyle(m, STYLE_META);
  ws.getRow(2).height = 16;

  // ── Fila 3: Vacia ─────────────────────────────────────────────────────────
  ws.getRow(3).height = 8;

  // ── Fila 4: Headers ──────────────────────────────────────────────────────
  const headers = [
    "Ano",
    "Capital Pendiente",
    "Capital Amortizado",
    "Intereses Acumulados",
    "Cuota Nominal",
    "Cuota Real (con Inflacion)",
  ];
  const hr = ws.getRow(4);
  headers.forEach((h, i) => {
    const c = hr.getCell(i + 1);
    c.value = h;
    applyStyle(c, STYLE_TABLE_HEADER);
  });
  hr.height = 22;
  ws.autoFilter = { from: { row: 4, column: 1 }, to: { row: 4, column: COL_SPAN } };

  // ── Filas de datos: formulas compatibles (sin CUMPRINC/CUMIPMT) ───────────
  //
  // Se usa una expresion cerrada anual basada en:
  // balance_y = P*(1+r)^(12*y) - M*(( (1+r)^(12*y)-1 )/r)
  // y en caso r=0:
  // balance_y = P - M*12*y
  //
  // Donde:
  // P = importe prestamo
  // r = tipoInteresAnual/12
  // M = cuota mensual
  //
  // Con esto derivamos:
  // principalAcumulado_y = P - balance_y
  // interesesAcumulados_y = M*12*y - principalAcumulado_y
  // E: Cuota Nominal = referencia a B5 de Hoja 1
  //    =CuotaMensual (cross-sheet)
  // F: Cuota Real = CuotaNominal / (1 + TasaInflacion)^Ano
  //    =CuotaNominal / (1 + TasaInflacion)^A_r

  const numYears = derived.numYears;

  for (let y = 1; y <= numYears; y++) {
    const r = y + 4; // fila en la hoja
    const isAlt = y % 2 === 0;
    const rowStyle = isAlt ? STYLE_TABLE_ROW_ALT : STYLE_TABLE_ROW;
    const wsRow = ws.getRow(r);
    wsRow.height = 18;

    // Referencia a la celda Ano de esta fila (columna A)
    const rAno = `A${r}`;

    // Datos de cache de la fila correspondiente en amortizationData
    const cached = amortizationData[y - 1];

    // A: Ano
    const cAno = wsRow.getCell(1);
    cAno.value = y;
    applyStyle(cAno, { ...rowStyle, alignment: { horizontal: "center", vertical: "middle" } });

    // B: Capital Pendiente
    const mRate = `${P.tipoInteres}/12`;
    const fBalance = `IF(${P.tipoInteres}=0,MAX(0,${P.importePrestamo}-${P.cuotaMensual}*12*${rAno}),MAX(0,${P.importePrestamo}*POWER(1+${mRate},12*${rAno})-${P.cuotaMensual}*((POWER(1+${mRate},12*${rAno})-1)/${mRate})))`;
    const cBalance = wsRow.getCell(2);
    cBalance.value = formula(fBalance, cached?.balance ?? 0);
    cBalance.numFmt = FMT_CURRENCY;
    applyStyle(cBalance, rowStyle);

    // C: Capital Amortizado acumulado = Prestamo - Balance
    const fPrincipal = `${P.importePrestamo}-B${r}`;
    const cPrincipal = wsRow.getCell(3);
    cPrincipal.value = formula(fPrincipal, cached?.principalPaid ?? 0);
    cPrincipal.numFmt = FMT_CURRENCY;
    applyStyle(cPrincipal, rowStyle);

    // D: Intereses Acumulados = total cuotas pagadas - principal amortizado
    const fInterest = `${P.cuotaMensual}*12*${rAno}-C${r}`;
    const cInterest = wsRow.getCell(4);
    cInterest.value = formula(fInterest, cached?.totalInterest ?? 0);
    cInterest.numFmt = FMT_CURRENCY;
    applyStyle(cInterest, {
      ...rowStyle,
      font: { size: 10, name: "Calibri", color: { argb: COLORS.amber600 } },
    });

    // E: Cuota Nominal (referencia cross-sheet a cuota mensual de Hoja 1)
    const fCuota = `=${P.cuotaMensual}`;
    const cCuota = wsRow.getCell(5);
    cCuota.value = formula(fCuota, cached?.monthlyPayment ?? 0);
    cCuota.numFmt = FMT_CURRENCY;
    applyStyle(cCuota, rowStyle);

    // F: Cuota Real = CuotaNominal / (1 + TasaInflacion)^Ano
    const fReal = `=${P.cuotaMensual}/POWER(1+${P.tasaInflacion},${rAno})`;
    const cReal = wsRow.getCell(6);
    cReal.value = formula(fReal, cached?.realMonthlyPayment ?? 0);
    cReal.numFmt = FMT_CURRENCY;
    applyStyle(cReal, {
      ...rowStyle,
      font: { size: 10, name: "Calibri", italic: true, color: { argb: COLORS.slate500 } },
    });
  }

  ws.views = [{ state: "frozen", ySplit: 4, xSplit: 0 }];
}

// ─── HOJA 3: Analisis de Viabilidad ──────────────────────────────────────────

function buildSheetViabilidad(workbook: ExcelJS.Workbook, data: ExportData): void {
  const { derived } = data;
  const ws = workbook.addWorksheet("Analisis de Viabilidad");

  const COL_SPAN = 4;
  ws.columns = [
    { key: "label", width: 46 },
    { key: "value", width: 26 },
    { key: "c", width: 4 },
    { key: "d", width: 4 },
  ];

  // Fila 1: Titulo
  ws.mergeCells(1, 1, 1, COL_SPAN);
  const t = ws.getCell(1, 1);
  t.value = "ANALISIS DE VIABILIDAD";
  applyStyle(t, STYLE_SHEET_TITLE);
  ws.getRow(1).height = 28;

  // Fila 2: Nota
  ws.mergeCells(2, 1, 2, COL_SPAN);
  const m = ws.getCell(2, 1);
  m.value =
    "Basado en el ratio maximo de esfuerzo hipotecario recomendado del 30% sobre ingresos netos. Referencia datos de la hoja 'Resumen y Parametros'.";
  applyStyle(m, STYLE_META);
  ws.getRow(2).height = 18;

  ws.getRow(3).height = 8;

  // ── Sub-seccion: Capacidad de Endeudamiento ───────────────────────────────
  ws.mergeCells(4, 1, 4, COL_SPAN);
  const hCap = ws.getCell(4, 1);
  hCap.value = "  Capacidad de Endeudamiento";
  applyStyle(hCap, STYLE_SUBSECTION_HEADER);
  ws.getRow(4).height = 20;

  // B5 — Ingresos (ref cross-sheet)
  const fIngresos = `=${P.ingresos}`;
  setH3Row(
    ws,
    5,
    "Ingresos Netos Mensuales",
    formula(fIngresos, derived.numMonthlyIncome),
    FMT_CURRENCY,
    STYLE_VALUE
  );

  // B6 — Ratio maximo (constante)
  setH3Row(ws, 6, "Ratio Maximo Recomendado", 0.3, '0"%"', STYLE_VALUE);

  // B7 — Cuota maxima: =B5*0.3
  const fCuotaMax = `=${P.ingresos}*0.3`;
  setH3Row(
    ws,
    7,
    "Cuota Maxima Recomendada",
    formula(fCuotaMax, derived.numMonthlyIncome * 0.3),
    FMT_CURRENCY,
    STYLE_VALUE_HIGHLIGHT
  );

  // B8 — Prestamo maximo sin PV (compatibilidad):
  // IF(r=0, M*n, (M*(1-(1+r)^-n))/r)
  const fPrestamoMax = `IF(${P.tipoInteres}=0,${P.ingresos}*0.3*${P.plazoAnos}*12,(${P.ingresos}*0.3*(1-POWER(1+${P.tipoInteres}/12,-${P.plazoAnos}*12)))/(${P.tipoInteres}/12))`;
  setH3Row(
    ws,
    8,
    "Prestamo Maximo Recomendado",
    formula(fPrestamoMax, derived.maxLoanAmount),
    FMT_CURRENCY,
    STYLE_VALUE_HIGHLIGHT
  );

  // B9 — Precio maximo de compra: =PrestamoMaximo + Ahorros
  const fPrecioMax = `=B8+${P.ahorros}`;
  setH3Row(
    ws,
    9,
    "Precio Maximo de Compra (Prestamo Max + Ahorros)",
    formula(fPrecioMax, derived.maxLoanAmount + derived.numSavings),
    FMT_CURRENCY,
    STYLE_VALUE_HIGHLIGHT
  );

  ws.getRow(10).height = 8;

  // ── Sub-seccion: Situacion Actual ─────────────────────────────────────────
  ws.mergeCells(11, 1, 11, COL_SPAN);
  const hAct = ws.getCell(11, 1);
  hAct.value = "  Situacion Actual";
  applyStyle(hAct, STYLE_SUBSECTION_HEADER);
  ws.getRow(11).height = 20;

  // B12 — Prestamo solicitado (ref)
  const fPrestamo = `=${P.importePrestamo}`;
  setH3Row(
    ws,
    12,
    "Prestamo Solicitado",
    formula(fPrestamo, derived.loanAmount),
    FMT_CURRENCY,
    STYLE_VALUE
  );

  // B13 — Cuota total mensual (ref)
  const fCuotaTotal = `=${P.totalMensual}`;
  setH3Row(
    ws,
    13,
    "Cuota Total Mensual (Hipoteca + IBI/Com.)",
    formula(fCuotaTotal, derived.totalMonthlyPayment),
    FMT_CURRENCY,
    STYLE_VALUE
  );

  // B14 — Ratio de esfuerzo actual (ref)
  const fRatioAct = `=${P.ratioEsfuerzo}`;
  setH3Row(
    ws,
    14,
    "Ratio de Esfuerzo Actual",
    formula(fRatioAct, derived.affordabilityRatio / 100),
    '0.0"%"',
    STYLE_VALUE
  );

  // Formato condicional en B14 (mismo criterio que Hoja 1 B8)
  ws.addConditionalFormatting({
    ref: "$B$14",
    rules: [
      {
        type: "cellIs",
        operator: "greaterThan",
        formulae: ["0.35"],
        priority: 1,
        style: {
          fill: solidFill(COLORS.red50) as ExcelJS.Fill,
          font: { bold: true, color: { argb: COLORS.red600 }, name: "Calibri", size: 10 },
        },
      },
      {
        type: "cellIs",
        operator: "greaterThan",
        formulae: ["0.3"],
        priority: 2,
        style: {
          fill: solidFill(COLORS.amber50) as ExcelJS.Fill,
          font: { bold: true, color: { argb: COLORS.amber600 }, name: "Calibri", size: 10 },
        },
      },
      {
        type: "cellIs",
        operator: "lessThan",
        formulae: ["0.3"],
        priority: 3,
        style: {
          fill: solidFill(COLORS.emerald50) as ExcelJS.Fill,
          font: { bold: true, color: { argb: COLORS.emerald600 }, name: "Calibri", size: 10 },
        },
      },
    ],
  });

  ws.getRow(15).height = 8;

  // ── Resultado ─────────────────────────────────────────────────────────────
  ws.mergeCells(16, 1, 16, COL_SPAN);
  const hRes = ws.getCell(16, 1);
  hRes.value = "  Resultado de la Operacion";
  applyStyle(hRes, STYLE_SUBSECTION_HEADER);
  ws.getRow(16).height = 20;

  // B17 — Estado: =IF(PrestamoSolicitado <= PrestamoMaximo, "OPERACION VIABLE", "OPERACION DE ALTO RIESGO")
  const isViable = derived.loanAmount <= derived.maxLoanAmount;
  const fEstado = `=IF(${P.importePrestamo}<=B8,"OPERACION VIABLE","OPERACION DE ALTO RIESGO")`;
  const estadoRow = ws.getRow(17);
  estadoRow.height = 22;
  const estadoLabel = estadoRow.getCell(1);
  estadoLabel.value = "Estado";
  applyStyle(estadoLabel, STYLE_LABEL);
  const estadoVal = estadoRow.getCell(2);
  estadoVal.value = formula(fEstado, isViable ? "OPERACION VIABLE" : "OPERACION DE ALTO RIESGO");
  applyStyle(
    estadoVal,
    isViable
      ? {
          ...STYLE_VALUE,
          fill: solidFill(COLORS.emerald50),
          font: { bold: true, color: { argb: COLORS.emerald600 }, size: 11, name: "Calibri" },
        }
      : {
          ...STYLE_VALUE,
          fill: solidFill(COLORS.red50),
          font: { bold: true, color: { argb: COLORS.red600 }, size: 11, name: "Calibri" },
        }
  );

  // Formato condicional en B17 para que cambie de color automaticamente
  ws.addConditionalFormatting({
    ref: "$B$17",
    rules: [
      {
        type: "containsText",
        operator: "containsText",
        text: "VIABLE",
        priority: 1,
        style: {
          fill: solidFill(COLORS.emerald50) as ExcelJS.Fill,
          font: { bold: true, color: { argb: COLORS.emerald600 }, name: "Calibri", size: 11 },
        },
      },
      {
        type: "containsText",
        operator: "containsText",
        text: "RIESGO",
        priority: 2,
        style: {
          fill: solidFill(COLORS.red50) as ExcelJS.Fill,
          font: { bold: true, color: { argb: COLORS.red600 }, name: "Calibri", size: 11 },
        },
      },
    ],
  });

  // B18 — Detalle: formula de texto que describe la situacion
  // =IF(PrestamoSolicitado<=PrestamoMaximo,
  //   "El prestamo esta por debajo del limite recomendado.",
  //   "El prestamo supera el limite recomendado.")
  const fDetalle = `=IF(${P.importePrestamo}<=B8,"El prestamo solicitado esta dentro del limite maximo recomendado. La operacion es financieramente viable segun el criterio del 30%.","El prestamo solicitado supera el limite maximo recomendado. Considera reducir el importe o buscar un precio de compra mas bajo.")`;
  const detalleRow = ws.getRow(18);
  detalleRow.height = 40;
  ws.mergeCells(18, 1, 18, COL_SPAN);
  const detalleCell = detalleRow.getCell(1);
  detalleCell.value = formula(
    fDetalle,
    isViable
      ? "El prestamo solicitado esta dentro del limite maximo recomendado. La operacion es financieramente viable segun el criterio del 30%."
      : "El prestamo solicitado supera el limite maximo recomendado. Considera reducir el importe o buscar un precio de compra mas bajo."
  );
  applyStyle(detalleCell, {
    ...STYLE_TEXT_WRAP,
    fill: solidFill(isViable ? COLORS.emerald50 : COLORS.red50),
    border: thinBorder(isViable ? COLORS.emerald600 : COLORS.red600),
  });

  // Formato condicional en fila 18 (celda A18 mergeada)
  ws.addConditionalFormatting({
    ref: "$A$18",
    rules: [
      {
        type: "containsText",
        operator: "containsText",
        text: "viable",
        priority: 1,
        style: {
          fill: solidFill(COLORS.emerald50) as ExcelJS.Fill,
          border: thinBorder(COLORS.emerald600) as Partial<ExcelJS.Borders>,
        },
      },
      {
        type: "containsText",
        operator: "containsText",
        text: "supera",
        priority: 2,
        style: {
          fill: solidFill(COLORS.red50) as ExcelJS.Fill,
          border: thinBorder(COLORS.red600) as Partial<ExcelJS.Borders>,
        },
      },
    ],
  });

  ws.views = [{ state: "frozen", ySplit: 1, xSplit: 0 }];
}

/** Helper para filas de Hoja 3 */
function setH3Row(
  ws: ExcelJS.Worksheet,
  rowNum: number,
  label: string,
  value: ExcelJS.CellValue,
  numFmt?: string,
  style: Partial<ExcelJS.Style> = STYLE_VALUE
): void {
  const row = ws.getRow(rowNum);
  row.height = 18;
  const lc = row.getCell(1);
  lc.value = label;
  applyStyle(lc, STYLE_LABEL);
  const vc = row.getCell(2);
  vc.value = value;
  if (numFmt) vc.numFmt = numFmt;
  applyStyle(vc, style);
}

// ─── HOJA 4: Comprar vs Alquilar ─────────────────────────────────────────────

function buildSheetComprarVsAlquilar(workbook: ExcelJS.Workbook, data: ExportData): void {
  const { derived } = data;
  const ws = workbook.addWorksheet("Comprar vs Alquilar");

  const COL_SPAN = 4;
  ws.columns = [
    { key: "label", width: 40 },
    { key: "value", width: 24 },
    { key: "c", width: 4 },
    { key: "d", width: 4 },
  ];

  // Calculos para valores de cache
  const annualRent = derived.numEquivalentRent * 12;
  const grossYield = derived.numPropertyValue > 0 ? annualRent / derived.numPropertyValue : 0;

  // Fila 1: Titulo
  ws.mergeCells(1, 1, 1, COL_SPAN);
  const t = ws.getCell(1, 1);
  t.value = "COMPRAR VS ALQUILAR";
  applyStyle(t, STYLE_SHEET_TITLE);
  ws.getRow(1).height = 28;

  // Fila 2: Nota
  ws.mergeCells(2, 1, 2, COL_SPAN);
  const m = ws.getCell(2, 1);
  m.value =
    "Para precision optima, el alquiler debe corresponder a una propiedad equivalente (mismas caracteristicas, zona y estado). Referencia datos de la hoja 'Resumen y Parametros'.";
  applyStyle(m, STYLE_META);
  ws.getRow(2).height = 18;

  ws.getRow(3).height = 8;

  // ── Sub-seccion: Rentabilidad Bruta ───────────────────────────────────────
  ws.mergeCells(4, 1, 4, COL_SPAN);
  const hY = ws.getCell(4, 1);
  hY.value = "  Rentabilidad Bruta (Gross Yield)";
  applyStyle(hY, STYLE_SUBSECTION_HEADER);
  ws.getRow(4).height = 20;

  // B5 — Alquiler mensual (ref cross-sheet)
  setH4Row(
    ws,
    5,
    "Alquiler Mensual Equivalente",
    formula(`=${P.alquiler}`, derived.numEquivalentRent),
    FMT_CURRENCY,
    STYLE_VALUE
  );

  // B6 — Alquiler anual: =B5*12
  setH4Row(
    ws,
    6,
    "Alquiler Anual Equivalente",
    formula(`=B5*12`, annualRent),
    FMT_CURRENCY,
    STYLE_VALUE
  );

  // B7 — Precio del inmueble (ref cross-sheet)
  setH4Row(
    ws,
    7,
    "Precio del Inmueble",
    formula(`=${P.precioInmueble}`, derived.numPropertyValue),
    FMT_CURRENCY,
    STYLE_VALUE
  );

  // B8 — Yield: =IF(B7>0, B6/B7, 0)
  const fYield = `=IF(B7>0,B6/B7,0)`;
  const yieldRow = ws.getRow(8);
  yieldRow.height = 26;
  const yLabel = yieldRow.getCell(1);
  yLabel.value = "Rentabilidad Bruta (Gross Yield)";
  applyStyle(yLabel, STYLE_LABEL);
  const yVal = yieldRow.getCell(2);
  yVal.value = formula(fYield, grossYield);
  yVal.numFmt = '0.0"%"';
  applyStyle(yVal, {
    font: { bold: true, color: { argb: COLORS.indigo600 }, size: 14, name: "Calibri" },
    alignment: { vertical: "middle", horizontal: "right" },
    border: thinBorder(COLORS.slate200),
  });

  // Formato condicional en B8 (yield) — 4 zonas de color
  // greaterThanOrEqual no esta soportado por ExcelJS; usamos between y greaterThan
  ws.addConditionalFormatting({
    ref: "$B$8",
    rules: [
      {
        type: "cellIs",
        operator: "greaterThan",
        formulae: ["0.0699"],
        priority: 1,
        style: {
          fill: solidFill(COLORS.indigo50) as ExcelJS.Fill,
          font: { bold: true, color: { argb: COLORS.indigo600 }, size: 14, name: "Calibri" },
          border: thinBorder(COLORS.indigo600) as Partial<ExcelJS.Borders>,
        },
      },
      {
        type: "cellIs",
        operator: "between",
        formulae: ["0.05", "0.07"],
        priority: 2,
        style: {
          fill: solidFill(COLORS.emerald50) as ExcelJS.Fill,
          font: { bold: true, color: { argb: COLORS.emerald600 }, size: 14, name: "Calibri" },
          border: thinBorder(COLORS.emerald600) as Partial<ExcelJS.Borders>,
        },
      },
      {
        type: "cellIs",
        operator: "between",
        formulae: ["0.03", "0.05"],
        priority: 3,
        style: {
          fill: solidFill(COLORS.amber50) as ExcelJS.Fill,
          font: { bold: true, color: { argb: COLORS.amber600 }, size: 14, name: "Calibri" },
          border: thinBorder(COLORS.amber600) as Partial<ExcelJS.Borders>,
        },
      },
      {
        type: "cellIs",
        operator: "lessThan",
        formulae: ["0.03"],
        priority: 4,
        style: {
          fill: solidFill(COLORS.red50) as ExcelJS.Fill,
          font: { bold: true, color: { argb: COLORS.red600 }, size: 14, name: "Calibri" },
          border: thinBorder(COLORS.red600) as Partial<ExcelJS.Borders>,
        },
      },
    ],
  });

  // B9 — Categoria: =IF(B8>=0.07,"Muy interesante",IF(B8>=0.05,"Interesante",IF(B8>=0.03,"Normal","Caro")))
  const fCat = `=IF(B8>=0.07,"Muy interesante",IF(B8>=0.05,"Interesante",IF(B8>=0.03,"Normal","Caro")))`;
  let catLabel = "";
  if (grossYield >= 0.07) catLabel = "Muy interesante";
  else if (grossYield >= 0.05) catLabel = "Interesante";
  else if (grossYield >= 0.03) catLabel = "Normal";
  else catLabel = "Caro";
  setH4Row(ws, 9, "Categoria", formula(fCat, catLabel), undefined, {
    font: { bold: true, color: { argb: COLORS.indigo600 }, size: 11, name: "Calibri" },
    alignment: { vertical: "middle", horizontal: "center" },
    border: thinBorder(COLORS.slate200),
  });

  // Formato condicional en B9 (categoria)
  ws.addConditionalFormatting({
    ref: "$B$9",
    rules: [
      {
        type: "containsText",
        operator: "containsText",
        text: "Muy interesante",
        priority: 1,
        style: {
          fill: solidFill(COLORS.indigo50) as ExcelJS.Fill,
          font: { bold: true, color: { argb: COLORS.indigo600 }, size: 11, name: "Calibri" },
        },
      },
      {
        type: "containsText",
        operator: "containsText",
        text: "Interesante",
        priority: 2,
        style: {
          fill: solidFill(COLORS.emerald50) as ExcelJS.Fill,
          font: { bold: true, color: { argb: COLORS.emerald600 }, size: 11, name: "Calibri" },
        },
      },
      {
        type: "containsText",
        operator: "containsText",
        text: "Normal",
        priority: 3,
        style: {
          fill: solidFill(COLORS.amber50) as ExcelJS.Fill,
          font: { bold: true, color: { argb: COLORS.amber600 }, size: 11, name: "Calibri" },
        },
      },
      {
        type: "containsText",
        operator: "containsText",
        text: "Caro",
        priority: 4,
        style: {
          fill: solidFill(COLORS.red50) as ExcelJS.Fill,
          font: { bold: true, color: { argb: COLORS.red600 }, size: 11, name: "Calibri" },
        },
      },
    ],
  });

  // B10 — Formula de calculo (texto descriptivo fijo)
  setH4Row(ws, 10, "Formula de calculo", "(Alquiler Anual / Precio Inmueble) x 100", undefined, {
    font: { italic: true, color: { argb: COLORS.slate500 }, size: 9, name: "Calibri" },
    alignment: { vertical: "middle", horizontal: "left" },
    border: thinBorder(COLORS.slate200),
  });

  ws.getRow(11).height = 8;

  // ── Sub-seccion: Interpretacion ───────────────────────────────────────────
  ws.mergeCells(12, 1, 12, COL_SPAN);
  const hInt = ws.getCell(12, 1);
  hInt.value = "  Interpretacion";
  applyStyle(hInt, STYLE_SUBSECTION_HEADER);
  ws.getRow(12).height = 20;

  // B13 — Interpretacion: IF anidado con texto descriptivo segun yield
  const fInterp = `=IF(B8>=0.07,"Excelente rentabilidad implicita. Comprar esta propiedad es financieramente mucho mas ventajoso que alquilarla.",IF(B8>=0.05,"Buena rentabilidad. La compra empieza a ser una opcion financieramente muy atractiva frente al alquiler.",IF(B8>=0.03,"Rentabilidad estandar en el mercado actual. La decision de compra dependera mas de factores personales que puramente financieros.","La rentabilidad es muy baja. Financieramente suele ser mejor alquilar e invertir los ahorros en otros activos.")))`;
  let interpCache = "";
  if (grossYield >= 0.07)
    interpCache =
      "Excelente rentabilidad implicita. Comprar esta propiedad es financieramente mucho mas ventajoso que alquilarla.";
  else if (grossYield >= 0.05)
    interpCache =
      "Buena rentabilidad. La compra empieza a ser una opcion financieramente muy atractiva frente al alquiler.";
  else if (grossYield >= 0.03)
    interpCache =
      "Rentabilidad estandar en el mercado actual. La decision de compra dependera mas de factores personales que puramente financieros.";
  else
    interpCache =
      "La rentabilidad es muy baja. Financieramente suele ser mejor alquilar e invertir los ahorros en otros activos.";

  ws.mergeCells(13, 1, 13, COL_SPAN);
  const interpRow = ws.getRow(13);
  interpRow.height = 48;
  const interpCell = interpRow.getCell(1);
  interpCell.value = formula(fInterp, interpCache);
  applyStyle(interpCell, { ...STYLE_TEXT_WRAP, border: thinBorder(COLORS.slate200) });

  ws.getRow(14).height = 8;

  // ── Sub-seccion: Escala de Referencia ────────────────────────────────────
  ws.mergeCells(15, 1, 15, COL_SPAN);
  const hScale = ws.getCell(15, 1);
  hScale.value = "  Escala de Referencia del Mercado";
  applyStyle(hScale, STYLE_SUBSECTION_HEADER);
  ws.getRow(15).height = 20;

  // Headers de la tabla de escala
  const scaleHeaders = ["Rango de Yield", "Categoria", "Interpretacion"];
  const shRow = ws.getRow(16);
  shRow.height = 20;
  scaleHeaders.forEach((h, i) => {
    const c = shRow.getCell(i + 1);
    c.value = h;
    applyStyle(c, STYLE_TABLE_HEADER);
  });

  // Filas de la escala (valores fijos — referencia de lectura, no formulas)
  const scaleData: [string, string, string, string, string][] = [
    [
      "< 3%",
      "Caro",
      "Mejor alquilar e invertir los ahorros en otros activos.",
      COLORS.red600,
      COLORS.red50,
    ],
    [
      "3% - 5%",
      "Normal",
      "Decision dependiente de factores personales mas que financieros.",
      COLORS.orange500,
      COLORS.amber50,
    ],
    [
      "5% - 7%",
      "Interesante",
      "Compra financieramente muy atractiva frente al alquiler.",
      COLORS.emerald600,
      COLORS.emerald50,
    ],
    [
      "> 7%",
      "Muy interesante",
      "Compra muy ventajosa. Excelente rentabilidad implicita.",
      COLORS.indigo600,
      COLORS.indigo50,
    ],
  ];

  scaleData.forEach(([range, cat, interp, fgColor, bgColor], idx) => {
    const rNum = 17 + idx;
    const isCurrentCat = cat === catLabel;
    const fill = solidFill(isCurrentCat ? bgColor : COLORS.white);
    const sRow = ws.getRow(rNum);
    sRow.height = 24;

    const c1 = sRow.getCell(1);
    c1.value = range;
    applyStyle(c1, {
      fill,
      font: {
        bold: isCurrentCat,
        color: { argb: isCurrentCat ? fgColor : COLORS.slate700 },
        size: 10,
        name: "Calibri",
      },
      alignment: { horizontal: "center", vertical: "middle" },
      border: thinBorder(COLORS.slate200),
    });

    const c2 = sRow.getCell(2);
    c2.value = cat;
    applyStyle(c2, {
      fill,
      font: { bold: true, color: { argb: fgColor }, size: 10, name: "Calibri" },
      alignment: { horizontal: "center", vertical: "middle" },
      border: thinBorder(COLORS.slate200),
    });

    const c3 = sRow.getCell(3);
    c3.value = interp;
    applyStyle(c3, {
      fill,
      font: {
        color: { argb: isCurrentCat ? fgColor : COLORS.slate700 },
        size: 10,
        name: "Calibri",
      },
      alignment: { horizontal: "left", vertical: "middle", wrapText: true },
      border: thinBorder(COLORS.slate200),
    });
  });

  ws.views = [{ state: "frozen", ySplit: 1, xSplit: 0 }];
}

/** Helper para filas de Hoja 4 */
function setH4Row(
  ws: ExcelJS.Worksheet,
  rowNum: number,
  label: string,
  value: ExcelJS.CellValue,
  numFmt?: string,
  style: Partial<ExcelJS.Style> = STYLE_VALUE
): void {
  const row = ws.getRow(rowNum);
  row.height = 18;
  const lc = row.getCell(1);
  lc.value = label;
  applyStyle(lc, STYLE_LABEL);
  const vc = row.getCell(2);
  vc.value = value;
  if (numFmt) vc.numFmt = numFmt;
  applyStyle(vc, style);
}

// ─── FUNCION PRINCIPAL ────────────────────────────────────────────────────────

/**
 * Genera un fichero Excel con 4 hojas que contienen el analisis completo
 * de la simulacion hipotecaria. Todos los valores calculados se expresan
 * como formulas de Excel que referencian los parametros de entrada de la
 * Hoja 1, permitiendo al usuario modificar parametros y ver el recalculo
 * automatico.
 *
 * @param data       Datos de estado, derivados y tabla de amortizacion
 * @param onProgress Callback de progreso (0-100)
 * @returns Blob con el fichero .xlsx listo para descargar
 */
export async function generateMortgageExcel(
  data: ExportData,
  onProgress?: ExportProgressCallback
): Promise<Blob> {
  onProgress?.(0);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Calculadora Hipotecaria Espana";
  workbook.created = new Date();
  workbook.modified = new Date();

  // Hoja 1: Resumen y Parametros (contiene los inputs y los bloques de resumen)
  buildSheetResumen(workbook, data);
  onProgress?.(15);
  await yieldToMain();

  // Hoja 2: Amortizacion (formulas CUMPRINC/CUMIPMT cross-sheet)
  buildSheetAmortizacion(workbook, data);
  onProgress?.(50);
  await yieldToMain();

  // Hoja 3: Analisis de Viabilidad (formulas cross-sheet con PV)
  buildSheetViabilidad(workbook, data);
  onProgress?.(70);
  await yieldToMain();

  // Hoja 4: Comprar vs Alquilar (formulas cross-sheet con IF anidados)
  buildSheetComprarVsAlquilar(workbook, data);
  onProgress?.(90);
  await yieldToMain();

  // Generar buffer y convertir a Blob
  const buffer = await workbook.xlsx.writeBuffer();
  onProgress?.(100);

  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}
