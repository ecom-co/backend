import type { NestApplication } from '@nestjs/core';
import { NestFactory, Reflector } from '@nestjs/core';

import { ClassSerializerInterceptor, Logger } from '@nestjs/common';

import { HttpGrpcExceptionFilter } from '@ecom-co/grpc';
import { getValidationPipeConfig, HttpExceptionFilter, setUpSwagger } from '@ecom-co/utils';
import * as bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { ConfigServiceApp } from '@/modules/config/config.service';

import { AppModule } from '@/app.module';

/**
 * Bootstrap the NestJS application
 */
const bootstrap = async (): Promise<void> => {
    const logger = new Logger('Root');
    const app: NestApplication = await NestFactory.create(AppModule, {
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
        snapshot: true,
    });

    // Increase payload size limit
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

    // Get config service
    const configService = app.get(ConfigServiceApp);

    // Enable CORS
    app.enableCors({
        credentials: true,
        origin: true,
    });

    app.use(cookieParser());
    app.use(helmet());
    app.use(compression());

    app.useGlobalPipes(getValidationPipeConfig());

    // Global class serializer interceptor
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    // Add HttpExceptionFilter to handle exceptions globally
    app.useGlobalFilters(
        new HttpExceptionFilter(app.get(Reflector), {
            enableRateLimitTracking: true,
            isDevelopment: true,
        }),
    );
    app.useGlobalFilters(
        new HttpGrpcExceptionFilter({
            enableStackTrace: configService.isDevelopment,
            isDevelopment: configService.isDevelopment,
            logLevel: configService.isDevelopment ? 'debug' : 'error',
        }),
    );

    // Global prefix - Set BEFORE Swagger
    app.setGlobalPrefix('api');
    setUpSwagger(app, {
        title: configService.swaggerTitle,
        apiKey: {
            providers: [
                {
                    name: 'api-key',
                    description: 'API Key',
                    in: 'header',
                    keyName: 'X-Api-Key',
                },
            ],
        },
        description: configService.swaggerDescription,
        jwt: {
            providers: [
                {
                    name: 'access-token',
                    description: 'JWT Access Token for regular users',
                },
                {
                    name: 'admin-token',
                    description: 'JWT Admin Token for administrative access',
                },
            ],
        },
        nodeEnv: configService.nodeEnv,
        port: configService.port,
        servers: [
            {
                description: 'Local Development',
                url: `http://localhost:${configService.port}`,
            },
        ],
        version: configService.swaggerVersion,
    });

    // Start HTTP server
    await app.listen(configService.port);

    logger.log(`Server is running on port ${configService.port}`);
    logger.log(`Environment: ${configService.nodeEnv}`);

    if (configService.isDevelopment) {
        logger.log(`📚 Swagger documentation: http://localhost:${configService.port}/docs`);
    }
};

void bootstrap();
