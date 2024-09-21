import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

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

type EagerFeedback = {
  readonly id: string;
  readonly type: string;
  readonly message?: string | null;
  readonly sub?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFeedback = {
  readonly id: string;
  readonly type: string;
  readonly message?: string | null;
  readonly sub?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Feedback = LazyLoading extends LazyLoadingDisabled ? EagerFeedback : LazyFeedback

export declare const Feedback: (new (init: ModelInit<Feedback, FeedbackMetaData>) => Feedback) & {
  copyOf(source: Feedback, mutator: (draft: MutableModel<Feedback, FeedbackMetaData>) => MutableModel<Feedback, FeedbackMetaData> | void): Feedback;
}

type EagerBlock = {
  readonly id: string;
  readonly by: string;
  readonly to: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBlock = {
  readonly id: string;
  readonly by: string;
  readonly to: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Block = LazyLoading extends LazyLoadingDisabled ? EagerBlock : LazyBlock

export declare const Block: (new (init: ModelInit<Block, BlockMetaData>) => Block) & {
  copyOf(source: Block, mutator: (draft: MutableModel<Block, BlockMetaData>) => MutableModel<Block, BlockMetaData> | void): Block;
}

type EagerChatUsers = {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly message: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyChatUsers = {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly message: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ChatUsers = LazyLoading extends LazyLoadingDisabled ? EagerChatUsers : LazyChatUsers

export declare const ChatUsers: (new (init: ModelInit<ChatUsers, ChatUsersMetaData>) => ChatUsers) & {
  copyOf(source: ChatUsers, mutator: (draft: MutableModel<ChatUsers, ChatUsersMetaData>) => MutableModel<ChatUsers, ChatUsersMetaData> | void): ChatUsers;
}

type EagerChatData = {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly message: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyChatData = {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly message: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ChatData = LazyLoading extends LazyLoadingDisabled ? EagerChatData : LazyChatData

export declare const ChatData: (new (init: ModelInit<ChatData, ChatDataMetaData>) => ChatData) & {
  copyOf(source: ChatData, mutator: (draft: MutableModel<ChatData, ChatDataMetaData>) => MutableModel<ChatData, ChatDataMetaData> | void): ChatData;
}

type EagerMatches = {
  readonly id: string;
  readonly user1: string;
  readonly user2: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMatches = {
  readonly id: string;
  readonly user1: string;
  readonly user2: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Matches = LazyLoading extends LazyLoadingDisabled ? EagerMatches : LazyMatches

export declare const Matches: (new (init: ModelInit<Matches, MatchesMetaData>) => Matches) & {
  copyOf(source: Matches, mutator: (draft: MutableModel<Matches, MatchesMetaData>) => MutableModel<Matches, MatchesMetaData> | void): Matches;
}

type EagerWaitlingList = {
  readonly id: string;
  readonly user1: string;
  readonly user2: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyWaitlingList = {
  readonly id: string;
  readonly user1: string;
  readonly user2: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type WaitlingList = LazyLoading extends LazyLoadingDisabled ? EagerWaitlingList : LazyWaitlingList

export declare const WaitlingList: (new (init: ModelInit<WaitlingList, WaitlingListMetaData>) => WaitlingList) & {
  copyOf(source: WaitlingList, mutator: (draft: MutableModel<WaitlingList, WaitlingListMetaData>) => MutableModel<WaitlingList, WaitlingListMetaData> | void): WaitlingList;
}

type EagerUser = {
  readonly id: string;
  readonly name: string;
  readonly age: string;
  readonly bio: string;
  readonly gender: string;
  readonly sub: string;
  readonly image: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly id: string;
  readonly name: string;
  readonly age: string;
  readonly bio: string;
  readonly gender: string;
  readonly sub: string;
  readonly image: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User, UserMetaData>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}