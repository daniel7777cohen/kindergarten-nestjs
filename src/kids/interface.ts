export interface CREATE_KID {
  passportId: number;
  fullName: string;
  birthDate: Date;
}

export interface REGISTER {
  kidId: number;
  kindergartenId: number;
}

export interface UPDATE_KID_KG {
  kidId: number;
  newKindergartenId: number;
}
export interface KID_RESPONSE {
  kindergarten: string;
  id: number;
  passportId: number;
  fullName: string;
  birthDate: Date;
}
