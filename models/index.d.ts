import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type FeedbackMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type BlockMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ChatUsersMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ChatDataMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MatchesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type WaitlingListMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Feedback {
  readonly id: string;
  readonly type: string;
  readonly message?: string | null;
  readonly sub?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Feedback, FeedbackMetaData>);
  static copyOf(source: Feedback, mutator: (draft: MutableModel<Feedback, FeedbackMetaData>) => MutableModel<Feedback, FeedbackMetaData> | void): Feedback;
}

export declare class Block {
  readonly id: string;
  readonly by: string;
  readonly to: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Block, BlockMetaData>);
  static copyOf(source: Block, mutator: (draft: MutableModel<Block, BlockMetaData>) => MutableModel<Block, BlockMetaData> | void): Block;
}

export declare class ChatUsers {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly message: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ChatUsers, ChatUsersMetaData>);
  static copyOf(source: ChatUsers, mutator: (draft: MutableModel<ChatUsers, ChatUsersMetaData>) => MutableModel<ChatUsers, ChatUsersMetaData> | void): ChatUsers;
}

export declare class ChatData {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly message: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ChatData, ChatDataMetaData>);
  static copyOf(source: ChatData, mutator: (draft: MutableModel<ChatData, ChatDataMetaData>) => MutableModel<ChatData, ChatDataMetaData> | void): ChatData;
}

export declare class Matches {
  readonly id: string;
  readonly user1: string;
  readonly user2: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Matches, MatchesMetaData>);
  static copyOf(source: Matches, mutator: (draft: MutableModel<Matches, MatchesMetaData>) => MutableModel<Matches, MatchesMetaData> | void): Matches;
}

export declare class WaitlingList {
  readonly id: string;
  readonly user1: string;
  readonly user2: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<WaitlingList, WaitlingListMetaData>);
  static copyOf(source: WaitlingList, mutator: (draft: MutableModel<WaitlingList, WaitlingListMetaData>) => MutableModel<WaitlingList, WaitlingListMetaData> | void): WaitlingList;
}

export declare class User {
  readonly id: string;
  readonly name: string;
  readonly age: string;
  readonly bio: string;
  readonly gender: string;
  readonly sub: string;
  readonly image: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}