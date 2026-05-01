export const downloadCSV = (vehicles, isAuto = false) => {
  if (!vehicles || vehicles.length === 0) {
    if (!isAuto) alert("No records available to export.");
    return;
  }

  // Define CSV headers
  const headers = [
    "Car Name", 
    "Number Plate", 
    "Owner Name", 
    "Phone Number", 
    "Address", 
    "Arrival Date", 
    "Expected Delivery", 
    "Status", 
    "Services Required", 
    "Notes", 
    "Record Added On"
  ];

  // Map vehicle data to row arrays
  const rows = vehicles.map(v => [
    `"${(v.carName || '').replace(/"/g, '""')}"`,
    `"${(v.numberPlate || '').replace(/"/g, '""')}"`,
    `"${(v.ownerName || '').replace(/"/g, '""')}"`,
    `"${(v.phoneNumber || '').replace(/"/g, '""')}"`,
    `"${(v.address || '').replace(/"/g, '""')}"`,
    `"${(v.arrivalDate || '')}"`,
    `"${(v.expectedDelivery || '')}"`,
    `"${(v.status || '')}"`,
    `"${(v.services || '').replace(/"/g, '""').replace(/\n/g, " ")}"`,
    `"${(v.notes || '').replace(/"/g, '""').replace(/\n/g, " ")}"`,
    `"${new Date(v.createdAt).toLocaleDateString()}"`
  ]);

  // Join headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(e => e.join(","))
  ].join("\n");

  // Add BOM (Byte Order Mark) so Excel opens UTF-8 properly
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  
  // Create a Blob and trigger download
  const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().split('T')[0];
  const prefix = isAuto ? "autobackup" : "export";
  
  link.setAttribute("href", url);
  link.setAttribute("download", `workshop_${prefix}_${dateStr}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
