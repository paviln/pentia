import Message from '../../../models/message';
import User from '../../../models/user';

export default interface MessageUserDto {
  message: Message;
  user?: User;
}
