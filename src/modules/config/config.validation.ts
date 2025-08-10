import * as Joi from 'joi';

export interface EnvironmentVariables {
    // Application Configuration
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: number;

    // Database Configuration
    DATABASE_URL?: string;

    // Swagger Configuration
    SWAGGER_TITLE: string;
    SWAGGER_DESCRIPTION: string;
    SWAGGER_VERSION: string;

    // Redis Configuration
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASSWORD: string;
    REDIS_DB: number;
    REDIS_KEY_PREFIX: string;
    REDIS_URL: string;

    // RabbitMQ Configuration
    RABBITMQ_URL: string;
}

export const validate = (config: Record<string, unknown>): EnvironmentVariables => {
    const result = validationSchema.validate(config, {
        allowUnknown: true,
        abortEarly: false,
    });

    if (result.error) {
        throw new Error(`Config validation error: ${result.error.message}`);
    }

    return result.value as EnvironmentVariables;
};

export const validationSchema = Joi.object({
    // Application Configuration
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().port().default(3000),

    // Database Configuration
    DATABASE_URL: Joi.string().uri().required().description('Database URL for the PostgreSQL server'),

    // Swagger Configuration
    SWAGGER_TITLE: Joi.string().default('API Documentation'),
    SWAGGER_DESCRIPTION: Joi.string().default('API Documentation'),
    SWAGGER_VERSION: Joi.string().default('1.0'),

    // Redis Configuration
    REDIS_HOST: Joi.string().default('localhost'),
    REDIS_PORT: Joi.number().port().default(6379),
    REDIS_PASSWORD: Joi.string().allow(''),
    REDIS_DB: Joi.number().default(0),
    REDIS_KEY_PREFIX: Joi.string().default(''),
    REDIS_URL: Joi.string().uri().required().description('Redis URL for the Redis server'),
    // RabbitMQ Configuration
    RABBITMQ_URL: Joi.string().uri().required().description('AMQP URL for the RabbitMQ server'),
});
