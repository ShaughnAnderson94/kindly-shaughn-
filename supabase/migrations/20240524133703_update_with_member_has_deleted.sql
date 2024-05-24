drop function if exists "public"."fetch_profile_message_and_item"(uc_conversation_id bigint, uc_item_id bigint, uc_partner_id uuid);

drop function if exists "public"."fetch_user_conversations"(p_user_id uuid);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.fetch_conversation_card_details(uc_conversation_id bigint, uc_item_id bigint, uc_partner_id uuid)
 RETURNS TABLE(partner_avatar text, message_text character varying, created_at timestamp with time zone, item_name text, member_has_deleted boolean)
 LANGUAGE plpgsql
AS $function$BEGIN
    RETURN QUERY
    SELECT
        p.avatar,
        m.message_text,
        m.created_at,
        i.item_name,
        c.member_has_deleted 
    FROM
        profiles p
    LEFT JOIN messages m ON m.conversation_id = uc_conversation_id
    LEFT JOIN conversations c ON c.id = uc_conversation_id
    LEFT JOIN items i ON i.id = uc_item_id
    WHERE
        p.id = uc_partner_id
    ORDER BY
        m.created_at DESC
    LIMIT 1;
END;$function$
;

CREATE OR REPLACE FUNCTION public.fetch_user_conversations(p_user_id uuid)
 RETURNS TABLE(id bigint, conversation_id bigint, user_id uuid, partner_id uuid, partner_username text, partner_avatar text, message_text character varying, created_at timestamp with time zone, item_name text, item_image text, member_has_deleted boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (uc.conversation_id)
    uc.id as id,
    uc.conversation_id AS conversation_id,
    uc.user_id AS user_id,
    uc.partner_id AS partner_id,
    p.username AS partner_username,
    p.avatar AS partner_avatar,
    m.message_text AS message_text,
    m.created_at AS created_at,
    i.item_name AS item_name,
    i."imageSrc" AS item_image,
    c.member_has_deleted AS member_has_deleted

  FROM
    user_conversations uc
  LEFT JOIN profiles p ON p.id = uc.partner_id
  LEFT JOIN conversations c ON c.id = uc.conversation_id
  LEFT JOIN LATERAL (
    SELECT
        m.message_text,
        m.created_at
    FROM
        messages m
    WHERE
        m.conversation_id = uc.conversation_id
    ORDER BY
        m.created_at DESC
    LIMIT 1
  ) m ON TRUE
  LEFT JOIN items i ON i.id = uc.item_id
  WHERE
    uc.user_id = p_user_id 
  ORDER BY
    uc.conversation_id, m.created_at DESC;
END;
$function$
;


