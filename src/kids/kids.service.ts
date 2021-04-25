import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { Kid } from './kids.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Kindergarten } from 'src/kindergarten/kindergarten.entity';
import { CREATE_KID, KID_RESPONSE, REGISTER, UPDATE_KID_KG } from './interface';
import { validateAge } from './helper';

@Injectable()
export class KidsService {
  constructor(
    @InjectRepository(Kid) private kidsRepository: Repository<Kid>,
    @InjectRepository(Kindergarten)
    private kindergartenRepository: Repository<Kindergarten>,
  ) {}

  async getKid(kidId: number): Promise<KID_RESPONSE> {
    const kidResponse = await this.validateAndGetKidFromDb(kidId);
    const kidResponseProcessed = {
      ...kidResponse,
      kindergarten: kidResponse.kindergarten.name,
    };
    return kidResponseProcessed;
  }

  async createKid(params: CREATE_KID) {
    try {
      const { birthDate, fullName, passportId } = params;
      if (!birthDate || !fullName || !passportId) {
        throw new HttpException(
          'missing credentials for request',
          HttpStatus.BAD_REQUEST,
        );
      }
      const birthDateFormatted = new Date(birthDate);

      const newKid = new Kid();
      newKid.passportId = passportId;
      newKid.fullName = fullName;
      newKid.birthDate = birthDateFormatted;

      const response = await this.kidsRepository.save(newKid);
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async registerKid(params: REGISTER) {
    //validate params
    const { kidId, kindergartenId } = params;
    if (!kidId || !kindergartenId) {
      throw new HttpException(
        'missing credentials for request',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      //validate kidId exsist on db
      const kidResponse = await this.validateAndGetKidFromDb(kidId);

      //validate kid isnt registered allready to any kindergarten
      await this.isKidRegistered(kidResponse);

      //validate kindergartenId exist in db
      const kindergartenResponse = await this.validateAndGetKgFromDb(
        kindergartenId,
      );

      //validate kid age to kindergarten required age
      const { minAge } = kindergartenResponse;
      const isAgeValid = validateAge(kidResponse.birthDate, minAge);
      if (!isAgeValid) {
        throw new HttpException(
          `your kid's age is not valid for that kindergarten. The required age is ${minAge}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      //register kid
      kidResponse.kindergarten = kindergartenResponse;
      const response = await this.kidsRepository.save(kidResponse);
      console.log(response);

      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updateKidKindergarten(params: UPDATE_KID_KG) {
    const { kidId, newKindergartenId } = params;
    //validate params
    if (!kidId || !newKindergartenId) {
      throw new HttpException(
        'missing credentials for request',
        HttpStatus.BAD_REQUEST,
      );
    }

    //validate kid exsists
    const kidResponse = await this.validateAndGetKidFromDb(kidId);

    //validate kid is registered
    if (!kidResponse.kindergarten) {
      throw new HttpException(
        `unable to update ${kidResponse.fullName}'s kindergarten. kid is not registered at all. Maybe you should register him instead?`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //validate kid isnt allready registered to the new kindergarten
    if (
      kidResponse.kindergarten.id.toString() === newKindergartenId.toString()
    ) {
      throw new HttpException(
        `${kidResponse.fullName} is allready registered to ${kidResponse.kindergarten.name}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //validate kindergartenId exist in db
    const newKindergartenResponse = await this.validateAndGetKgFromDb(
      newKindergartenId,
    );

    //validate kid age to kindergarten required age
    const { minAge } = newKindergartenResponse;
    const isAgeValid = validateAge(kidResponse.birthDate, minAge);
    if (!isAgeValid) {
      throw new HttpException(
        `your kid's age is not valid for that kindergarten. The required age is ${minAge}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //update kid's new kindergarten
    kidResponse.kindergarten = newKindergartenResponse;
    await this.kidsRepository.save(kidResponse);
    return {
      msg: `${kidResponse.fullName} successfully changed kindergarten to ${kidResponse.kindergarten.name}`,
    };

    // this.kidsRepository.save();
  }

  async deleteKidFromKg(kidId: number) {
    //validate params
    if (!kidId) {
      throw new HttpException(
        'missing credentials for request',
        HttpStatus.BAD_REQUEST,
      );
    }
    //validate kid exsists
    const kidResponse = await this.validateAndGetKidFromDb(kidId);
    //validate kid isnt registered to any kindergarten
    const src = 'delete';
    await this.isKidRegistered(kidResponse, src);

    //delete kid from kindergarten
    kidResponse.kindergarten = null;
    await this.kidsRepository.save(kidResponse);
    return kidResponse;
  }

  private async validateAndGetKidFromDb(kidId: number) {
    const options: FindOneOptions<Kid> = {
      where: { id: kidId },
      relations: ['kindergarten'],
    };
    const kidResponse = await this.kidsRepository.findOne(options);
    if (!kidResponse) {
      throw new HttpException('kid not found on db', HttpStatus.BAD_REQUEST);
    }
    return kidResponse;
  }

  private async isKidRegistered(kidResponse: Kid, src = 'register') {
    if (kidResponse.kindergarten && src === 'register') {
      throw new HttpException(
        `${kidResponse.fullName} is allready registered to ${kidResponse.kindergarten.name}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!kidResponse.kindergarten && src === 'delete') {
      throw new HttpException(
        `${kidResponse.fullName} is not registered to any kindergarten`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async validateAndGetKgFromDb(kindergartenId: number) {
    const kindergartenResponse = await this.kindergartenRepository.findOne({
      id: kindergartenId,
    });
    if (!kindergartenResponse) {
      throw new HttpException(
        'kindergarten not found on db',
        HttpStatus.BAD_REQUEST,
      );
    }
    return kindergartenResponse;
  }
}
