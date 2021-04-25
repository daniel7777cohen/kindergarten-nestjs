import { Module } from '@nestjs/common';
import { KindergartenService } from './kindergarten.service';
import { KindergartenController } from './kindergarten.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kindergarten } from './kindergarten.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kindergarten])],
  providers: [KindergartenService],
  controllers: [KindergartenController],
})
export class KindergartenModule {}
