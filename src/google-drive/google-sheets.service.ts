import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import credentials from 'durable-epoch.json';

@Injectable()
export class GoogleSheetsService {
  private client: sheets_v4.Sheets;

  constructor() {
    try {
      const auth = this.authorize();
      this.client = google.sheets({ version: 'v4', auth });
    } catch (e) {
      console.log('error in auth spredsheets : ', e.message);
    }
  }

  private authorize() {
    // const credentials = await require('durable-epoch.json');
    const { client_email, private_key } = credentials;
    try {
      const auth = new google.auth.JWT({
        email: client_email,
        key: private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      return auth;
    } catch (e) {
      console.log('error in authorize :', e);
    }
  }

  async getSheetData(spreadsheetId: string): Promise<any> {
    try {
      const range = 'patient';
      const valueRenderOption = '=INDEX(A:G, MATCH("Sangeeta", B:B, 0), 0)';
      const result = await this.client.spreadsheets.values.get({
        spreadsheetId,
        range,
        valueRenderOption,
      });
      console.log(result.data.values);
      return result.data.values;
    } catch (e) {
      console.log('error while getting spredsheet : ', e);
    }
  }

  async appendSheetData(spreadsheetId: string, data: any) {
    try {
      const patientDetails = [
        data.patientId,
        data.firstName,
        data.lastName,
        data.address,
        data.location,
        data.email,
        data.phone,
      ];

      const prescriptionDetails = [
        data.physicianId,
        data.patientId,
        data.prescription,
        data.dose,
      ];

      const physicianDetails = [
        data.physicianId,
        data.physicianFirstName,
        data.physicianlastName,
        data.physicianNumber,
      ];

      const appointmentDetails = [
        data.appointmentId,
        data.patientId,
        data.physicianId,
        data.visitDate,
        data.nextVisit,
        data.bill,
      ];

      const patient = {
        values: [patientDetails],
      };

      const rangePatient = 'patient';
      const resultPatient = await this.client.spreadsheets.values.append({
        spreadsheetId,
        range: rangePatient,
        valueInputOption: 'USER_ENTERED',
        requestBody: patient,
      });

      const rangePrescription = 'prescription';
      const resultPrescription = await this.client.spreadsheets.values.append({
        spreadsheetId,
        range: rangePrescription,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [prescriptionDetails] },
      });

      const rangePhysician = 'physician';
      const resultPhysician = await this.client.spreadsheets.values.append({
        spreadsheetId,
        range: rangePhysician,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [physicianDetails] },
      });

      const rangeAppointment = 'appointment';
      const resultAppointment = await this.client.spreadsheets.values.append({
        spreadsheetId,
        range: rangeAppointment,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [appointmentDetails] },
      });

      return {
        patientStatus: resultPatient.status,
        prescriptionStatus: resultPrescription.status,
        physicianStatus: resultPhysician.status,
        appointmentStatus: resultAppointment.status,
      };
    } catch (e) {
      console.log('error while inserting data : ', e.message);
    }
  }

  async updateSheetData(
    spreadsheetId: string,
    range: string,
    values: any[][],
  ): Promise<any> {
    const result = await this.client.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    return result.data;
  }
}
