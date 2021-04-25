import { Module } from '@nestjs/common';
import { KidsModule } from './kids/kids.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KindergartenModule } from './kindergarten/kindergarten.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'a636pzw4' /* :D */,
      database: 'kinder_garden',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    KidsModule,
    KindergartenModule,
  ],
})
export class AppModule {}
