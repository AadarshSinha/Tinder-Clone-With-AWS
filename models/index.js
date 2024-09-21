// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Feedback, Block, ChatUsers, ChatData, Matches, WaitlingList, User } = initSchema(schema);

export {
  Feedback,
  Block,
  ChatUsers,
  ChatData,
  Matches,
  WaitlingList,
  User
};