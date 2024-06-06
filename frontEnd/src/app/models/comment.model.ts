import { User } from "./user.model";

export class Comment {
  id!: number;
  comment!: string;
  employeeTo!: any;
  userFrom!: User;
  date!: Date
}
