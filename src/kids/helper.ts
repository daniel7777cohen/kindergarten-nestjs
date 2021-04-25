import * as moment from 'moment';

export const validateAge = (birthDate: Date, minAge: number) => {
  const birthDateFormatted = moment(birthDate).format('DD/MM/YYYY');
  const kidAge = moment().diff(birthDateFormatted, 'years');
  return kidAge === minAge;
};
