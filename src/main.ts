/* eslint-disable no-console */
import { join } from 'path';

import type { NestApplication } from '@nestjs/core';
import { NestFactory, Reflector } from '@nestjs/core';

import { ClassSerializerInterceptor } from '@nestjs/common';

import { getValidationPipeConfig, HttpExceptionFilter, setUpSwagger } from '@ecom-co/utils';
import { Transport } from '@nestjs/microservices';
import * as bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';

import { ConfigServiceApp } from '@/modules/config/config.service';

import { AppModule } from '@/app.module';

import type { MicroserviceOptions } from '@nestjs/microservices';

/**
 * Bootstrap the NestJS application
 */
const bootstrap = async (): Promise<void> => {
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

    app.use(helmet());
    app.use(compression());

    app.useGlobalPipes(getValidationPipeConfig());

    // Global class serializer interceptor
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    // Add HttpExceptionFilter to handle exceptions globally
    app.useGlobalFilters(
        new HttpExceptionFilter(app.get(Reflector), {
            enableRateLimitTracking: true,
            isDevelopment: configService.isDevelopment,
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
                {
                    name: 'api-key-2',
                    description: 'API Key 2',
                    in: 'header',
                    keyName: 'X-Api-Key-2',
                },
                {
                    name: 'api-key-3',
                    description: 'API Key 3',
                    in: 'header',
                    keyName: 'X-Api-Key-3',
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

    // Setup and start gRPC microservice
    try {
        const protoPath = join(process.cwd(), configService.grpcProtoPath);

        const microserviceOptions: MicroserviceOptions = {
            options: {
                package: configService.grpcPackage,
                protoPath,
                url: `0.0.0.0:${configService.grpcPort}`,
            },
            transport: Transport.GRPC,
        };

        const grpcApp = await NestFactory.createMicroservice(AppModule, microserviceOptions);

        await grpcApp.listen();
        console.log(`gRPC server running on ${configService.grpcPort}`);
    } catch (err) {
        console.error('Failed to start gRPC microservice', err as Error);
    }

    console.log(`Server is running on port ${configService.port}`);
    console.log(`Environment: ${configService.nodeEnv}`);

    if (configService.isDevelopment) {
        console.log(`📚 Swagger documentation: http://localhost:${configService.port}/docs`);
    }
};

void bootstrap();
