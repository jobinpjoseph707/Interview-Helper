import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelServiceService {

  constructor() { }

  exportToExcel(data: any[], fileName: string): void {
    try {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } catch (error) {
      this.handleExcelError(error);
    }
  }

  private handleExcelError(error: any): void {
    // Log the error or display an alert to the user
    console.error('Error occurred during Excel export:', error);
    // You could notify the user of the error or handle it as per your needs
    alert('Failed to export to Excel. Please try again.');
  }
}
