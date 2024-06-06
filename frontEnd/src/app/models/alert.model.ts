import { BusinessUnit } from "./businessUnit.model";
import { User } from "./user.model";

export class Alert {
  id!: number;
  user!: User;
  businessUnit!: BusinessUnit;
  date!: Date;
  pourcentageMin!: number;
  pourcentageMax!: number;
  alertType!: string;
}
