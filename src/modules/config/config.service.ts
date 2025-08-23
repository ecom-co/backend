import { Injectable } from '@nestjs/common';

import { ConfigService as NestConfigService } from '@nestjs/config';

import { EnvironmentVariables } from '@/modules/config/config.validation';

@Injectable()
export class ConfigServiceApp {
    get databaseUrl(): string | undefined {
        return this.configService.get('DATABASE_URL');
    }

    get elasticsearchPassword(): string | undefined {
        return this.configService.get('ELASTICSEARCH_PASSWORD');
    }

    // Elasticsearch Configuration
    get elasticsearchUrl(): string {
        return this.configService.get('ELASTICSEARCH_URL');
    }

    get elasticsearchUsername(): string | undefined {
        return this.configService.get('ELASTICSEARCH_USERNAME');
    }

    get grpcPackage(): string {
        return this.configService.get('GRPC_PACKAGE', 'example');
    }

    // gRPC Configuration
    get grpcPort(): number {
        return this.configService.get('GRPC_PORT', 50051);
    }

    get grpcProtoPath(): string {
        return this.configService.get('GRPC_PROTO_PATH', 'src/proto/example.proto');
    }

    get isDevelopment(): boolean {
        return this.nodeEnv === 'development';
    }

    get isProduction(): boolean {
        return this.nodeEnv === 'production';
    }

    // Application Configuration
    get nodeEnv(): string {
        return this.configService.get('NODE_ENV');
    }

    get port(): number {
        return this.configService.get('PORT');
    }

    // RabbitMQ Configuration
    get rabbitmqUrl(): string {
        return this.configService.get('RABBITMQ_URL');
    }

    get redisUrl(): string {
        return this.configService.get('REDIS_URL');
    }

    get swaggerDescription(): string {
        return this.configService.get('SWAGGER_DESCRIPTION');
    }

    // Swagger Configuration
    get swaggerTitle(): string {
        return this.configService.get('SWAGGER_TITLE');
    }

    get swaggerVersion(): string {
        return this.configService.get('SWAGGER_VERSION');
    }

    constructor(private readonly configService: NestConfigService<EnvironmentVariables>) {}
}
