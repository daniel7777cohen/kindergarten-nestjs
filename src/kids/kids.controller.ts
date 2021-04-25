import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { KidsService } from './kids.service';
import { CREATE_KID, REGISTER, UPDATE_KID_KG } from './interface';

@Controller('kids')
export class KidsController {
  constructor(private service: KidsService) {}

  @Get(':kidId')
  get(@Param() params: { kidId: number }) {
    return this.service.getKid(params.kidId);
  }

  @Post('create')
  createKid(@Body() params: CREATE_KID) {
    return this.service.createKid(params);
  }

  @Post('register')
  registerKid(@Body() params: REGISTER) {
    return this.service.registerKid(params);
  }

  @Put('/:kidId/:newKindergartenId')
  updateKidKindergarten(@Param() params: UPDATE_KID_KG) {
    return this.service.updateKidKindergarten(params);
  }

  @Delete(':kidId')
  deleteKidFromKg(@Param() params: { kidId: number }) {
    return this.service.deleteKidFromKg(params.kidId);
  }
}
