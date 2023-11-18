import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleDriveService } from './google-drive/google-drive.service';
import { GoogleSheetsService } from './google-drive/google-sheets.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, GoogleDriveService, GoogleSheetsService],
})
export class AppModule {}
