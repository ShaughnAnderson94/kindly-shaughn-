'use client';

import { MessageType } from '@/types/messagingTypes';
import MessageCard from './MessageCard';
import MessageForm from './MessageForm';
import { ConversationPartner } from './ConversationPartner';
import { useEffect, useState, useRef } from 'react';
import { createSupabaseClient as supabase } from '../../utils/supabase/createSupabaseClient';
import { useConversationContext } from '../../context/conversationContext';
import selectMessagesByConversationId from '@/utils/messaging/selectMessagesByConversationId';
import {
  formatTimeMarker,
  formatDateMarker,
} from '../../utils/messaging/formatTimeStamp';

const CurrentConversation: React.FC = () => {
  const {
    allConversations,
    setAllConversations,
    currentConversation,
    setCurrentConversation,
  } = useConversationContext();
  const [currentMessages, setCurrentMessages] = useState<MessageType[]>([]);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentConversation && setCurrentConversation(allConversations[0]);
  }, [allConversations, setCurrentConversation]);

  useEffect(() => {
    const setMessagesForCurrentConversation = async () => {
      const selectedMessages = await selectMessagesByConversationId(
        currentConversation?.conversation_id as number
      );
      setCurrentMessages(selectedMessages);
    };
    setMessagesForCurrentConversation();
  }, [currentConversation, setCurrentMessages]);

  useEffect(() => {
    const channel = supabase
      .channel('realtime messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          if (
            payload.new.conversation_id === currentConversation?.conversation_id
          ) {
            setCurrentMessages((prevMessages) => [
              ...prevMessages,
              payload.new as MessageType,
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, currentMessages, setCurrentMessages]);

  useEffect(() => {
    console.log('use effect has run');
    const conversationsChannel = supabase
      .channel('realtime conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        (conversationPayload) => {
          console.log(conversationPayload);
          if (
            !allConversations.some(
              (conversation) =>
                conversation.conversation_id === conversationPayload.new.id
            )
          ) {
            console.log('condition ran');
            setAllConversations([
              ...allConversations,
              {
                ...currentConversation,
                conversations: {
                  member_has_deleted:
                    conversationPayload.new.member_has_deleted,
                },
              } as ConversationCardType,
            ]);
          }

          // if(conversationPayload.new.member_has_deleted === false){

          // console.log("all conversations: ", allConversations)
          // }

          // setCurrentConversation({...currentConversation, conversations: {member_has_deleted: conversationPayload.new.member_has_deleted}} as ConversationCardType)
          // console.log("current conversation payload :", {...currentConversation, conversations: {member_has_deleted: conversationPayload.new.member_has_deleted}} as ConversationCardType)
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
    };
  }, [
    supabase,
    currentConversation,
    setCurrentConversation,
    allConversations,
    setAllConversations,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      const debounce = setTimeout(() => {
        setIsScrolling(false);
      }, 3000);

      return () => clearTimeout(debounce);
    };

    chatWindowRef?.current?.addEventListener('scroll', handleScroll);

    return () => {
      chatWindowRef?.current?.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolling, setIsScrolling]);

  return (
    <div className='conversation-height flex flex-1 flex-col justify-between bg-[#fafaf9] shadow-inner'>
      <div className='p-5'>
        <ConversationPartner
          conversation_id={currentConversation?.conversation_id as number}
        />
      </div>
      <div
        className='relative flex h-full flex-col-reverse overflow-y-auto overflow-x-hidden'
        ref={chatWindowRef}
      >
        {currentMessages
          .map((message: MessageType, index: number) => (
            <div key={`${message.id}`}>
              {formatDateMarker(message.created_at) !==
                formatDateMarker(currentMessages[index - 1]?.created_at) && (
                <div
                  className={`${isScrolling ? 'opacity-100' : 'opacity-0'} sticky top-4 z-10 my-[-15px] ml-[calc((100%_-_120px)/2)] h-[30px] w-[120px] rounded-xl bg-stone-50 object-center p-1 text-center text-lg font-semibold text-slate-400 transition-opacity ease-in-out`}
                >
                  {formatDateMarker(message.created_at)}
                </div>
              )}
              <MessageCard
                senderId={message.sender_id}
                createdAt={formatTimeMarker(message.created_at)}
                messageText={message.message_text}
                currentUser={currentConversation?.user_id}
                messageId={message.id}
              />
            </div>
          ))
          .reverse()}
      </div>
      <MessageForm
        user_id={currentConversation?.user_id}
        conversation_id={currentConversation?.conversation_id}
        member_has_deleted={
          currentConversation?.conversations.member_has_deleted
        }
        partner_id={currentConversation?.partner_id}
        item_id={currentConversation?.item_id}
      />
    </div>
  );
};

export default CurrentConversation;
