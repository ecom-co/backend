import { Module } from '@nestjs/common';

import { AuthClientModule } from '@/modules/auth/auth.client.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { ConfigModule } from '@/modules/config/config.module';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

@Module({
    imports: [ConfigModule, AuthClientModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
