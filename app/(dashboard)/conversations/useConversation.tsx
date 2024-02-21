import { createContext } from 'react';
import {
  AllConversationsType,
  ConversationCardType,
} from '@/utils/messaging/messagingTypes';

type ConversationProviderProps = {
  allConversations: AllConversationsType;
  setAllConversations: React.Dispatch<
    React.SetStateAction<AllConversationsType>
  >;
  currentConversation: ConversationCardType;
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<ConversationCardType>
  > | null;
};

const defaultContext: ConversationProviderProps = {
  allConversations: [],
  setAllConversations: () => [],
  currentConversation: {
    joined_at: new Date().toString(),
    conversation_id: 2,
    user_id: 'default',
    item_id: 'default',
    conversations: {
      id: 1,
      messages: [],
      created_at: new Date().toString(),
    },
  },
  setCurrentConversation: () => null,
};

const useConversation = createContext(defaultContext);

export default useConversation;
