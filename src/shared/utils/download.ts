/**
 * Utility functions for downloading files in the browser
 */

export interface DownloadOptions {
  filename: string;
  mimeType?: string;
}

/**
 * Downloads content as a file using a temporary anchor element
 * @param content - The content to download (string, Blob, or ArrayBuffer)
 * @param options - Download options including filename and mimeType
 */
export function downloadFile(
  content: string | Blob | ArrayBuffer,
  options: DownloadOptions
): void {
  let blob: Blob;

  if (content instanceof Blob) {
    blob = content;
  } else if (content instanceof ArrayBuffer) {
    blob = new Blob([content], {
      type: options.mimeType || 'application/octet-stream',
    });
  } else {
    blob = new Blob([content], { type: options.mimeType || 'text/plain' });
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = options.filename;

  // Temporarily add to DOM for Firefox compatibility
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Clean up the URL object
  window.URL.revokeObjectURL(url);
}

/**
 * Downloads CSV content as a file
 * @param csvContent - The CSV content as a string
 * @param filename - The filename for the download
 */
export function downloadCSV(csvContent: string, filename: string): void {
  downloadFile(csvContent, {
    filename: filename.endsWith('.csv') ? filename : `${filename}.csv`,
    mimeType: 'text/csv',
  });
}

/**
 * Downloads JSON content as a file
 * @param jsonData - The data to serialize as JSON
 * @param filename - The filename for the download
 */
export function downloadJSON(jsonData: unknown, filename: string): void {
  const jsonContent = JSON.stringify(jsonData, null, 2);
  downloadFile(jsonContent, {
    filename: filename.endsWith('.json') ? filename : `${filename}.json`,
    mimeType: 'application/json',
  });
}

/**
 * Downloads a PDF blob as a file
 * @param pdfBlob - The PDF blob
 * @param filename - The filename for the download
 */
export function downloadPDF(pdfBlob: Blob, filename: string): void {
  downloadFile(pdfBlob, {
    filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
    mimeType: 'application/pdf',
  });
}
