import { Controller, Post, Body, Get } from '@nestjs/common';
import { KindergartenService } from './kindergarten.service';

interface CREATE {
  name: string;
  minAge: number;
}
@Controller('kindergarten')
export class KindergartenController {
  constructor(private service: KindergartenService) {}

  @Post('create')
  createKindergarten(@Body() params: CREATE) {
    return this.service.createKindergarten(params.name, params.minAge);
  }

  @Get('sorted-inventory')
  getAllSortedInventory() {
    return this.service.getAllSortedInventory();
  }
}
