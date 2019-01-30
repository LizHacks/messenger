import { Option } from 'funfix';

import { Conversation } from '../../../types';
import { InternalState } from '../.';

export default async (ctx: any) => {
  // TODO: Be a lot stricter with types!!
  try {
    ctx.body = await get_conversations(ctx.state.auth.user_id, ctx.state.global);
  } catch (e) {
    ctx.throw(500, "INTERNAL ERROR");
  }
};

const get_conversations = async (user_id: string, state: InternalState): Promise<Conversation[]> => {
  const user_threads = (await state.aggregates.ThreadyByUserId(user_id))
    .map((obj: any) => (Object as any).values(obj))
    .getOrElse([]);

  const thread_member_user_detail = await Promise.all(
    user_threads.map(async (thread: any): Promise<Conversation> => { // TODO: Define types
      // TODO: hydrate the account information
      const hydrated_accounts = thread.members.map(
        (thread_id: string) => state.aggregates.AccountById(thread_id))
        .filter((opt: Option<any>) => opt.nonEmpty())
        .map((opt: Option<any>) => opt.get());
      //
      const hydrated_messages = (await state.aggregates.MessagesByThread(thread.thread_id))
        .getOrElse([]);
      // This won't fit the type because the userdetail is left out

      return {
        conversation_id: thread.thread_id,
        topic: thread.topic,
        members: hydrated_accounts,
        messages: hydrated_messages,
      };
    }),
  );
  return thread_member_user_detail as any;
};
