import {Profile} from "@tt/data-access/profile";

export interface Chat {
  id: number;
  userFirst: Profile;
  userSecond: Profile;
  messages: Message[];
  companion?: Profile;
}

export interface MyChats {
  id: number;
  userFrom: Profile;
  message: Message[];
  createdAt: string;
  unreadMessages: number;
}

export interface Message {
  id: number;
  userFromId: number;
  personalChatId: number;
  text: string;
  createdAt: string;
  isRead: boolean;
  updatedAt?: string;
  user?: Profile;
  isMine?: boolean;
}

export interface LastMessageRes {
  id: number;
  userFrom: Profile;
  message: string | null;
  createdAt: string;
  unreadMessages: number;
}
