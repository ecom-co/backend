import * as Joi from 'joi';

export interface EnvironmentVariables {
    // Application Configuration
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: number;

    // Database Configuration
    DATABASE_URL: string;

    // Swagger Configuration
    SWAGGER_TITLE: string;
    SWAGGER_DESCRIPTION: string;
    SWAGGER_VERSION: string;

    // Redis Configuration
    REDIS_URL: string;

    // RabbitMQ Configuration
    RABBITMQ_URL: string;

    // Elasticsearch Configuration (optional)
    ELASTICSEARCH_URL?: string;
    ELASTICSEARCH_USERNAME?: string;
    ELASTICSEARCH_PASSWORD?: string;

    // gRPC Configuration
    GRPC_PORT?: number;
    GRPC_PACKAGE?: string;
    GRPC_PROTO_PATH?: string;
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
    PORT: Joi.number().port().default(3012),

    // Database Configuration - Use string instead of uri for flexibility
    DATABASE_URL: Joi.string().required().description('Database URL for the PostgreSQL server'),

    // Swagger Configuration
    SWAGGER_TITLE: Joi.string().default('E-commerce API'),
    SWAGGER_DESCRIPTION: Joi.string().default('E-commerce platform REST API documentation'),
    SWAGGER_VERSION: Joi.string().default('1.0.0'),

    // Redis Configuration - Use string instead of uri
    REDIS_URL: Joi.string().required().description('Redis URL for the Redis server'),

    // RabbitMQ Configuration - Use string instead of uri
    RABBITMQ_URL: Joi.string().required().description('AMQP URL for the RabbitMQ server'),

    // Elasticsearch Configuration (optional) - Use string instead of uri
    ELASTICSEARCH_URL: Joi.string().default('http://localhost:9201').description('Elasticsearch URL'),
    ELASTICSEARCH_USERNAME: Joi.string().optional().description('Elasticsearch username'),
    ELASTICSEARCH_PASSWORD: Joi.string().optional().description('Elasticsearch password'),

    // gRPC Configuration
    GRPC_PORT: Joi.number().default(50051),
    GRPC_PACKAGE: Joi.string().default('example'),
    GRPC_PROTO_PATH: Joi.string().default('src/proto/example.proto'),
});
