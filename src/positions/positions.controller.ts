import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { AuthGuard } from '../guards/guard';

@UseGuards(AuthGuard)
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  create(
    @Body('role_code') role_code: string,
    @Body('role_name') role_name: string,
    @Req() req: any,
  ) {
    return this.positionsService.create(role_code, role_name, req.userId);
  }

  @Get()
  findAll() {
    return this.positionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.positionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('role_code') role_code: string,
    @Body('role_name') role_name: string,
    @Req() req: any,
  ) {
    return this.positionsService.update(+id, role_code, role_name, req.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionsService.remove(+id);
  }
}
