import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RBAcPermissions } from './rbac/decorators/rbac.permissions.decorator';
import { RBAcGuard } from './rbac/guards/rbac.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @RBAcPermissions('post@delete')
  @UseGuards(RBAcGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
