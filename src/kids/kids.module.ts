import { Module } from '@nestjs/common';
import { KidsService } from './kids.service';
import { KidsController } from './kids.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kid } from './kids.entity';
import { Kindergarten } from 'src/kindergarten/kindergarten.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kid, Kindergarten])],
  providers: [KidsService],
  controllers: [KidsController],
})
export class KidsModule {}
