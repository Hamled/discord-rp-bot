import {Message} from './message';

type MessageCollection = Map<string, Message>;

type CollectorEvent = 'collect' | 'end';
type CollectEventCallback = (element: any, collector: MessageCollector) => void;
type EndEventCallback = (collected: MessageCollection, reason: string) => void;
type CollectorCallback = CollectEventCallback | EndEventCallback;

type CollectorFilter = (...args: any[]) => boolean;

interface MessageCollector {
  on(event: CollectorEvent, callback: CollectorCallback): void;
  stop(reason?: string): void;
}

export {
  MessageCollector,
  MessageCollection,
  CollectEventCallback,
  EndEventCallback,
  CollectorCallback,
  CollectorEvent,
  CollectorFilter
};
