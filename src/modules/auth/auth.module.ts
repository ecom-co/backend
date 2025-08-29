import { Module } from '@nestjs/common';

import { AuthClientModule } from '@/modules/auth/auth.client.module';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';

@Module({
    imports: [AuthClientModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
