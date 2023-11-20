// app.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { GoogleDriveService } from './google-drive/google-drive.service';
import { GoogleSheetsService } from './google-drive/google-sheets.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly driveService: GoogleDriveService,
    private readonly sheetsService: GoogleSheetsService,
  ) {}

  @Get()
  async getGoogleDriveFile(): Promise<any> {
    const fileId = '1U1cCw43KwEzA5IIcBOV5aWmzHFAZ0cpr1CedNS9UYg8';
    return await this.driveService.getFile(fileId);
  }

  @Get(':sheetId')
  async getSheetData(@Param() sheetId: any): Promise<any> {
    return await this.sheetsService.getSheetData(sheetId?.sheetId);
  }

  @Post('/add/:sheetId')
  async appendSheetData(
    @Body() data: any,
    @Param() spreadsheetId: string,
  ): Promise<any> {
    console.log('data from UI', data);
    console.log('params from url', spreadsheetId);

    // const spreadsheetId = '1JsoVLud6Id6YdRTcX-fD1RlCuhoeeus0QCdHIJuTnRI';
    return await this.sheetsService.appendSheetData(spreadsheetId, data);
  }

  // @Get('/update/:sheetId')
  // async updateSheetData(
  //   @Body() data: any,
  //   @Param() spreadsheetId: string,
  // ): Promise<any> {
  //   // const spreadsheetId = '1JsoVLud6Id6YdRTcX-fD1RlCuhoeeus0QCdHIJuTnRI';
  //   // const range = 'patient!A2';
  //   return this.sheetsService.updateSheetData(spreadsheetId, data);
  // }
}
