// google-drive.service.ts
import { Injectable } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
// import { Credentials } from 'google-auth-library';
import credentials from 'durable-epoch.json';

@Injectable()
export class GoogleDriveService {
  private readonly drive: drive_v3.Drive;

  constructor() {
    try {
      const auth = this.authorize();
      this.drive = google.drive({ version: 'v3', auth });
    } catch (e) {
      console.log('error in auth drive : ', e.message);
    }
  }

  private authorize(): any {
    // const credentials = require('path/to/your/credentials.json');
    const { client_email, private_key } = credentials;
    try {
      const auth = new google.auth.JWT({
        email: client_email,
        key: private_key,
        scopes: ['https://www.googleapis.com/auth/drive'],
      });
      return auth;
    } catch (e) {
      console.log('Error in authentication', e.message);
    }
  }

  async getFile(fileId: string): Promise<any> {
    try {
      return await this.drive.files.get({ fileId });
    } catch (e) {
      console.log('error while getting file : ', e.message);
    }
  }
}
