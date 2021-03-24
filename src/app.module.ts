import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RbacModule } from './rbac/rbac.module';
import { RBACstorage } from './rbac/storage';

@Module({
  imports: [RbacModule.forRoot(RBACstorage)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
