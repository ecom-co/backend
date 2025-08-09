import { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ConfigServiceApp } from '@/modules/config/config.service';

export const setUpSwagger = (app: NestApplication, configService: ConfigServiceApp) => {
    const config = new DocumentBuilder()
        .setTitle(configService.swaggerTitle)
        .setDescription(configService.swaggerDescription)
        .setVersion(configService.swaggerVersion)
        .addBearerAuth()
        .addCookieAuth('refresh_token', {
            type: 'http',
            in: 'cookie',
            name: 'refresh_token',
            description: 'Refresh token stored in httpOnly cookie',
        })
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            docExpansion: 'none',
            filter: true,
            showRequestDuration: true,
        },
    });
};
