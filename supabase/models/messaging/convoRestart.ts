import newClient from '@/supabase/utils/newClient';
import { markAsDeleted } from './markAsDeleted';

export default async function convoRestart(
  conversation_id: number | undefined,
  user_id: string | undefined,
  partner_id: string | undefined,
  item_id: number | undefined
) {
  if (conversation_id && user_id && partner_id && item_id) {
    try {
      const supabase = newClient();
      await supabase.from('user_conversations').insert([
        {
          conversation_id: conversation_id,
          user_id: partner_id,
          item_id: item_id,
          partner_id: user_id,
        },
      ]);
      markAsDeleted(conversation_id, false);
      console.log('convo restart has run');
    } catch (error) {
      console.error(error);
    }
  } else {
    alert('Something went wrong!');
  }
}