// exportToExcel.js
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Convert data to Excel and download
export const exportToExcel = (data, fileName = "OT_Report.xlsx") => {
    if (!data || data.length === 0) return;

    // Convert boolean fields to 'Yes'/'No' and dates/times to string if needed
    const formattedData = data.map(item => ({
        "Admit Date": item.admission_date ? item.admission_date : "",
        "Admit Time": item.admission_time ? item.admission_time : "",
        "Entry ID": item.entry_id,
        "OT Room": `OT - ${item.room_id}`,
        "Patient Name": item.patient_name,
        "UHID": item.uhid,
        "Age": item.age,
        "Gender": item.gender,
        "Diagnosis": item.diagnosis,
        "Surgeon Name": item.surgeon,
        "Waiting": item.is_waiting ? "Yes" : "No",
        "Pre OP": item.is_in_preop ? "Yes" : "No",
        "Preparation": item.is_under_preparation ? "Yes" : "No",
        "Started": item.is_surgery_started ? "Yes" : "No",
        "Completed": item.is_surgery_completed ? "Yes" : "No",
        "Recovery": item.is_shifted_recovery ? "Yes" : "No",
        "Cancelled": item.is_cancelled ? "Yes" : "No",
        "Discharge Status": item.discharge_date ? "Discharged" : "Admitted",
        "Discharge Date": item.discharge_date ? item.discharge_date : "",
        "Discharge Time": item.discharge_time ? item.discharge_time : "",
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OT Report");

    // Write workbook and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, fileName);
};
