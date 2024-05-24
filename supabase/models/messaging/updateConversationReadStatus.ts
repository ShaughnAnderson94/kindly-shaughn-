import newClient from '@/supabase/utils/newClient';

export default async function updateConversationReadStatus(
  conversationId: number,
  userId: string,
  hasUnreadMessages: boolean
) {
  try {
    const supabase = newClient();
    const { error } = await supabase
      .from('user_conversations')
      .update({ has_unread_messages: hasUnreadMessages })
      .match({ conversation_id: conversationId, user_id: userId });

    if (error) throw error;
  } catch (error) {
    console.error(`Error marking conversation as unread: ${error}`);
    throw error;
  }
}
