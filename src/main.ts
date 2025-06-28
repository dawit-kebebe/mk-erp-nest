import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { corsOptions } from './common/config/cors-config';
import { validationPipeOptions } from './common/config/validation-pipe-config';
import { DatabaseExceptionFilter } from './common/error/database.errors';
import { HttpExceptionFilter } from './common/error/http.errors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalFilters(new DatabaseExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors(corsOptions(configService));

  const config = new DocumentBuilder()
    .setTitle('MK ERP System API Documentation')
    .setDescription('The MK ERP System API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const serverPort = configService.get<number>("PORT");

  try {
    await app.listen(serverPort || 3000, () => {
      Logger.log(`[MK-ERP] - Server is listening on port http://localhost:${serverPort || 3000} for the documentation: http://localhost:${serverPort || 3000}/docs `);
    });
  } catch (error) {
    const faildAt = new Date();
    Logger.error(`[MK-ERP] - ${faildAt.toLocaleTimeString()} ${faildAt.toLocaleDateString()} - An error occurred while starting the server: `, error);
  }

}
bootstrap();
