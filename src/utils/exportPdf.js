import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const downloadPDF = (vehicles, isAuto = false) => {
  if (!vehicles || vehicles.length === 0) {
    if (!isAuto) alert("No records available to export.");
    return;
  }

  const doc = new jsPDF('landscape'); // Use landscape for wider tables
  
  // Title
  doc.setFontSize(18);
  doc.text("AutoHub Workshop Records", 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  const dateStr = new Date().toLocaleDateString();
  doc.text(`Generated on: ${dateStr} ${isAuto ? '(Auto Backup)' : ''}`, 14, 30);

  // Define Headers
  const tableColumn = ["Car Name", "Number Plate", "Owner Name", "Phone Number", "Arrival", "Due Date", "Status", "Services"];
  
  // Define Rows
  const tableRows = [];

  vehicles.forEach(v => {
    const vehicleData = [
      v.carName,
      v.numberPlate,
      v.ownerName,
      v.phoneNumber,
      new Date(v.arrivalDate).toLocaleDateString(),
      new Date(v.expectedDelivery).toLocaleDateString(),
      v.status,
      (v.services || '').substring(0, 50) + ((v.services && v.services.length > 50) ? '...' : '') // truncate services slightly for table
    ];
    tableRows.push(vehicleData);
  });

  // Generate Table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] }, // Match accent-primary color
    alternateRowStyles: { fillColor: [241, 245, 249] }
  });

  // Save the PDF
  const dateStrFile = new Date().toISOString().split('T')[0];
  const prefix = isAuto ? "autobackup" : "export";
  doc.save(`workshop_${prefix}_${dateStrFile}.pdf`);
};
