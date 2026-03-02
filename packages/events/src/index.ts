import EventEmitter, { EventsMap, NormalizedEventsMap } from './EventEmitter';
import EventsManager, { passiveEvents } from './EventsManager';

export { passiveEvents, EventsManager, EventEmitter, type EventsMap, type NormalizedEventsMap };
export default EventsManager;
