// apps/server/src/modules/ai/adapters/sse.adapter.ts
import { Observable } from 'rxjs';
import { MessageEvent } from '@nestjs/common';
import { SseEvent } from '../schemas/chat.schema';

export function toSseObservable(
  producer: (push: (evt: SseEvent) => void, done: (final?: SseEvent) => void, fail: (e: Error) => void) => void
): Observable<MessageEvent> {
  return new Observable<MessageEvent>((subscriber) => {
    const push = (evt: SseEvent) => subscriber.next({ type: evt.type, data: JSON.stringify(evt.data) });
    const done = (final?: SseEvent) => {
      if (final) subscriber.next({ type: final.type, data: JSON.stringify(final.data) });
      subscriber.complete();
    };
    const fail = (e: Error) => subscriber.error(e);
    try { producer(push, done, fail); } catch (e: any) { fail(e); }
  });
}
