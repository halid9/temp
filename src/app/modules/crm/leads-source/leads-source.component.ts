import { Component } from "@angular/core";
import { read, utils, WorkBook, WorkSheet } from 'xlsx';

@Component({
    selector:'leads-source',
    templateUrl:'leads-source.component.html',
    styleUrls:['leads-source.component.scss']
})
export class LeadSourceComponent {
    rowData: any[] = [];
    columnMapping: { [key: string]: string } = {
      'Column 1': 'string',
      'Column 2': 'number',
      // Add more column titles and their corresponding types as needed
    };
  
    onFileChange(event: any): void {
      const file = event.target.files[0];
      const fileReader = new FileReader();
  
      fileReader.onload = (e: any) => {
        const buffer = e.target.result;
        const workbook: WorkBook = read(buffer, { type: 'array' });
        const sheetName: string = workbook.SheetNames[0];
        const worksheet: WorkSheet = workbook.Sheets[sheetName];
        const jsonData: any[] = utils.sheet_to_json(worksheet, { header: 1 });
  
        // Prepare the data for rendering in the table
        this.rowData = jsonData.map((row: any[]) => {
          const mappedRow: any = {};
          for (let i = 0; i < row.length; i++) {
            const columnTitle: string = jsonData[0][i];
            const columnType: string = this.columnMapping[columnTitle];
            const columnValue: any = row[i];
  
            // Map column value based on the specified type
            switch (columnType) {
              case 'number':
                mappedRow[columnTitle] = +columnValue;
                break;
              // Add more type cases and mapping logic as needed
              default:
                mappedRow[columnTitle] = columnValue;
                break;
            }
          }
          return mappedRow;
        });
      };
  
      fileReader.readAsArrayBuffer(file);
    }
  
  
  
  
}