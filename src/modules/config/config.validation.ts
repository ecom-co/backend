import * as Joi from 'joi';

export interface EnvironmentVariables {
    AUTH_GRPC_URL?: string;
    // Database Configuration
    DATABASE_URL: string;

    ELASTICSEARCH_PASSWORD?: string;
    // Elasticsearch Configuration (optional)
    ELASTICSEARCH_URL?: string;

    ELASTICSEARCH_USERNAME?: string;
    // gRPC Configuration
    GRPC_PACKAGE?: string;

    GRPC_PORT?: number;

    GRPC_PROTO_PATH?: string;

    // Application Configuration
    NODE_ENV: 'development' | 'production' | 'test';

    PORT: number;
    // RabbitMQ Configuration
    RABBITMQ_URL: string;
    // Redis Configuration
    REDIS_URL: string;

    SWAGGER_DESCRIPTION: string;
    // Swagger Configuration
    SWAGGER_TITLE: string;
    SWAGGER_VERSION: string;
}

export const validate = (config: Record<string, unknown>): EnvironmentVariables => {
    const result = validationSchema.validate(config, {
        abortEarly: false,
        allowUnknown: true,
    });

    if (result.error) {
        throw new Error(`Config validation error: ${result.error.message}`);
    }

    return result.value as EnvironmentVariables;
};

export const validationSchema = Joi.object({
    AUTH_GRPC_URL: Joi.string().default('localhost:50052').description('Auth microservice gRPC URL'),
    // Database Configuration - Use string instead of uri for flexibility
    DATABASE_URL: Joi.string().required().description('Database URL for the PostgreSQL server'),
    // Elasticsearch Configuration (optional) - Use string instead of uri for flexibility
    ELASTICSEARCH_PASSWORD: Joi.string().optional().description('Elasticsearch password'),
    ELASTICSEARCH_URL: Joi.string().default('http://localhost:9201').description('Elasticsearch URL'),

    ELASTICSEARCH_USERNAME: Joi.string().optional().description('Elasticsearch username'),
    // gRPC Configuration
    GRPC_PACKAGE: Joi.string().default('example'),

    GRPC_PORT: Joi.number().default(50051),
    GRPC_PROTO_PATH: Joi.string().default('src/proto/example.proto'),

    // Application Configuration
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

    PORT: Joi.number().port().default(3012),
    // RabbitMQ Configuration - Use string instead of uri
    RABBITMQ_URL: Joi.string().required().description('AMQP URL for the RabbitMQ server'),
    // Redis Configuration - Use string instead of uri
    REDIS_URL: Joi.string().required().description('Redis URL for the Redis server'),

    SWAGGER_DESCRIPTION: Joi.string().default('E-commerce platform REST API documentation'),
    // Swagger Configuration
    SWAGGER_TITLE: Joi.string().default('E-commerce API'),
    SWAGGER_VERSION: Joi.string().default('1.0.0'),
});
