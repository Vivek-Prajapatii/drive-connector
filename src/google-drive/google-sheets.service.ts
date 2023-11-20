import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import credentials from 'durable-epoch.json';
import { ArrayToJson } from 'src/utils/ArrayToJson.util';
import { mergeEntitiesByIndex } from 'src/utils/MergeObjects.util';

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
      const resultPatient = await this.client.spreadsheets.values.get({
        spreadsheetId,
        range: 'patient',
      });
      const patient = ArrayToJson(resultPatient.data.values);

      const resultPhysician = await this.client.spreadsheets.values.get({
        spreadsheetId,
        range: 'physician',
      });
      const physician = ArrayToJson(resultPhysician.data.values);

      const resultAppointment = await this.client.spreadsheets.values.get({
        spreadsheetId,
        range: 'appointment',
      });
      const appointment = ArrayToJson(resultAppointment.data.values);

      const resultPrescription = await this.client.spreadsheets.values.get({
        spreadsheetId,
        range: 'prescription',
      });
      const prescription = ArrayToJson(resultPrescription.data.values);

      const result = mergeEntitiesByIndex({
        patient,
        physician,
        appointment,
        prescription,
      });

      return result;
    } catch (e) {
      console.log('error while getting spredsheet : ', e.message);
      return e;
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

  // async updateSheetData(spreadsheetId: string, data: any): Promise<any> {
  //   const getResponse = await this.getSheetData(spreadsheetId);
  //   const valuesInColumn = getResponse.data.values[0];

  //   const targetId = data.patientId;

  //   const targetIndex = valuesInColumn.indexOf(targetId);

  //   const rangePatient = '';
  //   const result = await this.client.spreadsheets.values.update({
  //     spreadsheetId,
  //     range: rangePatient,
  //     valueInputOption: 'RAW',
  //     requestBody: { values },
  //   });

  //   return result.data;
  // }
}
