import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { RowInput, UserOptions } from "jspdf-autotable"

interface Column {
  header: string
  key: string
}

interface SummaryItem {
  label: string
  value: string
}

interface PDFOptions {
  title: string
  data: any[]
  columns: Column[]
  summary?: SummaryItem[]
  fileName?: string
}

export function generatePDF(options: PDFOptions): void {
  const {
    title,
    data,
    columns,
    summary,
    fileName = `${title.replace(/\s+/g, "_").toLowerCase()}.pdf`,
  } = options

  // Create new PDF document
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(16)
  doc.text(title, 14, 22)

  // Add date
  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

  // Prepare data for autoTable
  const tableColumn: string[] = columns.map((col) => col.header)
  const tableRows: RowInput[] = []

  // Convert data to table rows
  for (const item of data) {
    const row: (string | number)[] = []
    for (const col of columns) {
      const value = item[col.key]
      row.push(value !== undefined ? value : "")
    }
    tableRows.push(row)
  }

  // Generate the table using autoTable
  let finalY = 60; // Default value if table doesn't return finalY
  
  try {
    // Call autoTable and capture the returned position
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      margin: { top: 35 },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didDrawPage: (data) => {
        // Update finalY with the position after the table is drawn
        if (data.cursor) {
          finalY = data.cursor.y;
        }
      },
    })
  } catch (error) {
    console.error("Error generating table:", error);
    // Continue with default finalY value
  }

  // Add summary if provided
  if (summary && summary.length > 0) {
    doc.setFontSize(12)
    doc.text("Summary:", 14, finalY + 10)

    summary.forEach((item, index) => {
      doc.setFontSize(10)
      doc.text(`${item.label}: ${item.value}`, 14, finalY + 20 + index * 7)
    })
  }

  // Save the PDF
  doc.save(fileName)
}
