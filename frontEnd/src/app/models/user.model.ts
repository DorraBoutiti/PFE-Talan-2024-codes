import { BusinessUnit } from "./businessUnit.model";

export class User {
  id?: number;
  registrationNumber?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  description?: string;
  dateSendingRequest?: Date;
  role?: string;
  status?: string;
  businessUnit?: BusinessUnit;
}
