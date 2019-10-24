import {MessageCollector, CollectorFilter} from './message_collector';

export interface TextChannel {
  id: string;

  createMessageCollector(filter: CollectorFilter, options?: object): MessageCollector;
}
