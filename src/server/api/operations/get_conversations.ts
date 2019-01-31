import { Option } from 'funfix';

import { Conversation, MessageDetail } from '../../../types';
import { InternalState } from '../.';
import { Message } from '../../../aggregates/messages/messages-by-thread-id';

export default async (ctx: any) => {
  // TODO: Be a lot stricter with types!!
  try {
    ctx.body = await get_conversations(ctx.state.auth.user_id, ctx.state.global);
  } catch (e) {
    ctx.throw(500, "INTERNAL ERROR");
  }
};

const get_conversations = async (user_id: string, state: InternalState): Promise<Conversation[]> => {
  console.log({user_id});
  const user_threads = (await state.aggregates.ThreadyByUserId(user_id))
    .map((obj: any) => (Object as any).values(obj))
    .getOrElse([]);

  const thread_member_user_detail = await Promise.all(
    user_threads.map(async (thread: any): Promise<Conversation> => { // TODO: Define types
      // TODO: hydrate the account information
      const promised_hydrated_accounts = await Promise.all(thread.members.map(
        (account_id: string) => state.aggregates.AccountById(account_id).catch((e: any) => console.log(e))));

      const hydrated_accounts = promised_hydrated_accounts
        .filter((opt: any) => opt.nonEmpty())
        .map((opt: any) => opt.orElseL(() => console.log("error")));

      const prefilled_messages = (await state.aggregates.MessagesByThread(thread.thread_id))
        .getOrElse([]);

      const hydrated_messages = await Promise.all(prefilled_messages
        .map(async (pre: Message) => {
          return {
            from: (await state.aggregates.AccountById(pre.from)).orUndefined(),
            message: pre.message,
            thread_id: pre.thread_id,
            time: pre.time,
          };
        }));
      // This won't fit the type because the userdetail is left out
      //
      return {
        conversation_id: thread.thread_id,
        topic: thread.topic,
        members: hydrated_accounts.map((thing) => thing.get()),
        messages: hydrated_messages,
      } as any;
    }),
  );
  return thread_member_user_detail as any;
};
