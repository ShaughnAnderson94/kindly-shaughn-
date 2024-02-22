import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

const selectUserConversationsandItemNames = async (
  supabase: SupabaseClient,
  userId?: string
) => {
  try {
    const { data: allConversations } = await supabase
      .from('user_conversations')
      .select(
        `
      id, 
      joined_at, 
      conversation_id,
      user_id,
      item_id,
      items!inner(item_name, imageSrc)
    `
      )
      .eq('user_id', userId);

    return allConversations ?? [];
  } catch (error) {
    console.error(`Failed to fetch conversations from database: ${error}`);
    throw error;
  }
};

export default selectUserConversationsandItemNames;