/* eslint-disable no-console */
import { getValidationPipeConfig, HttpExceptionFilter, setUpSwagger } from '@ecom-co/utils';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import * as bodyParser from 'body-parser';

import { ConfigServiceApp } from '@/modules/config/config.service';

import { AppModule } from '@/app.module';

/**
 * Bootstrap the NestJS application
 */
const bootstrap = async (): Promise<void> => {
    const app: NestApplication = await NestFactory.create(AppModule, {
        snapshot: true,
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });

    // Increase payload size limit
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    // Get config service
    const configService = app.get(ConfigServiceApp);

    // Enable CORS
    app.enableCors({
        origin: true,
        credentials: true,
    });

    const validationPipe: ValidationPipe = getValidationPipeConfig();
    app.useGlobalPipes(validationPipe);

    // Global class serializer interceptor
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    // Add HttpExceptionFilter to handle exceptions globally
    app.useGlobalFilters(
        new HttpExceptionFilter(app.get(Reflector), {
            isDevelopment: configService.isDevelopment,
            enableRateLimitTracking: true,
        }),
    );

    // Global prefix - Set BEFORE Swagger
    app.setGlobalPrefix('api');
    setUpSwagger(app, {
        title: configService.swaggerTitle,
        nodeEnv: configService.nodeEnv,
        port: configService.port,
        description: configService.swaggerDescription,
        version: configService.swaggerVersion,
    });

    await app.listen(configService.port);
    console.log(`Server is running on port ${configService.port}`);
    console.log(`Environment: ${configService.nodeEnv}`);
    if (configService.isDevelopment) {
        console.log(`📚 Swagger documentation: http://localhost:${configService.port}/docs`);
    }
};

void bootstrap();
