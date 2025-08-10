import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { EnvironmentVariables } from '@/modules/config/config.validation';

@Injectable()
export class ConfigServiceApp {
    constructor(private readonly configService: NestConfigService<EnvironmentVariables>) {}

    // Application Configuration
    get nodeEnv(): string {
        return this.configService.get('NODE_ENV');
    }

    get port(): number {
        return this.configService.get('PORT');
    }

    get isDevelopment(): boolean {
        return this.nodeEnv === 'development';
    }

    get isProduction(): boolean {
        return this.nodeEnv === 'production';
    }
    get databaseUrl(): string | undefined {
        return this.configService.get('DATABASE_URL');
    }

    // Redis Configuration
    get redisHost(): string {
        return this.configService.get('REDIS_HOST', 'localhost');
    }

    get redisPort(): number {
        return this.configService.get('REDIS_PORT', 6379);
    }

    get redisPassword(): string | undefined {
        return this.configService.get('REDIS_PASSWORD');
    }

    get redisDb(): number {
        return this.configService.get('REDIS_DB', 0);
    }

    get redisKeyPrefix(): string {
        return this.configService.get('REDIS_KEY_PREFIX', '');
    }

    get redisUrl(): string {
        return this.configService.get('REDIS_URL');
    }

    // Swagger Configuration
    get swaggerTitle(): string {
        return this.configService.get('SWAGGER_TITLE');
    }

    get swaggerDescription(): string {
        return this.configService.get('SWAGGER_DESCRIPTION');
    }

    get swaggerVersion(): string {
        return this.configService.get('SWAGGER_VERSION');
    }

    // RabbitMQ Configuration
    get rabbitmqUrl(): string {
        return this.configService.get('RABBITMQ_URL');
    }
}
