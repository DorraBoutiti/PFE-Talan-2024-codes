import { User } from "./user.model";

export class Notification {
  id!: number;
  content!: string;
  userTo!: User;
  userFrom!: User;
  notificationType!: string;
  delivered!: string;
  read!: string;
}
