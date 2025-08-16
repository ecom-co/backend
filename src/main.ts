/* eslint-disable no-console */
import { getValidationPipeConfig, HttpExceptionFilter, setUpSwagger } from '@ecom-co/utils';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import { join } from 'path';

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

    app.use(helmet());
    app.use(compression());

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
        servers: [
            {
                url: `http://localhost:${configService.port}`,
                description: 'Local Development',
            },
        ],
        apiKey: {
            providers: [
                {
                    name: 'api-key',
                    in: 'header',
                    keyName: 'X-Api-Key',
                    description: 'API Key',
                },
                {
                    name: 'api-key-2',
                    in: 'header',
                    keyName: 'X-Api-Key-2',
                    description: 'API Key 2',
                },
                {
                    name: 'api-key-3',
                    in: 'header',
                    keyName: 'X-Api-Key-3',
                    description: 'API Key 3',
                },
            ],
        },
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
    });

    // Start HTTP server
    await app.listen(configService.port);

    // Setup and start gRPC microservice
    try {
        const protoPath = join(process.cwd(), configService.grpcProtoPath);

        const microserviceOptions: MicroserviceOptions = {
            transport: Transport.GRPC,
            options: {
                package: configService.grpcPackage,
                protoPath,
                url: `0.0.0.0:${configService.grpcPort}`,
            },
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
