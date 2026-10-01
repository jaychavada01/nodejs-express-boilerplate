const { XLSX } = require("../../config/packages");

/**
 * @name exportToExcel
 * @param {Array<Object>} data - Array of tabular JSON objects to write to Excel sheet
 * @param {Object} [options] - Configuration options (sheetName, headerOrder)
 * @description Generates an in-memory XLSX workbook buffer from JSON data using xlsx package
 * @returns {Buffer} XLSX file binary buffer
 */
const exportToExcel = (data = [], options = {}) => {
  const sheetName = options.sheetName || "Sheet1";

  /*
   * WORKBOOK CREATION & SHEET MAPPING
   * Converts JSON array to worksheet and bundles it into a new XLSX workbook.
   */
  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: options.headerOrder,
    skipHeader: false,
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  return XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });
};

/**
 * @name exportToCsv
 * @param {Array<Object>} data - Array of tabular JSON objects
 * @param {Object} [options] - Configuration options (headerOrder)
 * @description Generates an in-memory CSV text buffer from JSON data using xlsx package
 * @returns {Buffer} CSV binary buffer
 */
const exportToCsv = (data = [], options = {}) => {
  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: options.headerOrder,
  });

  const csvString = XLSX.utils.sheet_to_csv(worksheet);
  return Buffer.from(csvString, "utf8");
};

/**
 * @name parseExcelOrCsv
 * @param {Buffer} fileBuffer - Binary buffer of an uploaded XLSX, XLS, or CSV file
 * @param {Object} [options] - Parsing options (sheetIndex, raw, defval)
 * @description Parses an uploaded spreadsheet buffer into a clean array of row objects
 * @returns {Array<Object>} Array of parsed row objects
 */
const parseExcelOrCsv = (fileBuffer, options = {}) => {
  if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
    throw new Error("Invalid or missing file buffer");
  }

  /*
   * WORKBOOK BUFFER PARSING
   * Reads raw binary stream and extracts rows from targeted sheet index / name.
   */
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetNames = workbook.SheetNames;

  if (!sheetNames || sheetNames.length === 0) {
    return [];
  }

  const targetSheetName = options.sheetName || sheetNames[options.sheetIndex || 0];
  const worksheet = workbook.Sheets[targetSheetName];

  if (!worksheet) {
    return [];
  }

  return XLSX.utils.sheet_to_json(worksheet, {
    defval: options.defval !== undefined ? options.defval : "",
    raw: options.raw !== undefined ? options.raw : false,
  });
};

module.exports = {
  exportToExcel,
  exportToCsv,
  parseExcelOrCsv,
};
