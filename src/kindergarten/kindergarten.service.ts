import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Kindergarten } from './kindergarten.entity';

@Injectable()
export class KindergartenService {
  constructor(
    @InjectRepository(Kindergarten)
    private kindergartenRepository: Repository<Kindergarten>,
  ) {}

  async getAllSortedInventory() {
    try {
      const sortedList = await this.kindergartenRepository
        .createQueryBuilder('kg')
        .select(['kg.name'])
        .orderBy('name', 'DESC')
        .leftJoin('kg.kids', 'kid')
        .addSelect(['kid.fullName', 'kid.birthDate'])
        .addOrderBy('birthDate', 'DESC')
        .getMany();

      //an extra query
      const sqlQueryInventory = await this.kindergartenRepository.query(
        'select k.fullName, k.passportId, kg.name as kindergartenName from kid as k join kindergarten as kg on k.kinderGartenId = kg.id ;',
      );
      return { sortedList, sqlQueryInventory };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createKindergarten(name: string, minAge: number) {
    try {
      const newKindergarten = new Kindergarten();
      newKindergarten.minAge = minAge;
      newKindergarten.name = name;

      const response = await this.kindergartenRepository.save(newKindergarten);
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
