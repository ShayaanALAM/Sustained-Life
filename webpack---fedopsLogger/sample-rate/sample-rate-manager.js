import {
    VERTICALS_LIST,
    SAMPLED_APP_NAMES,
    PHASES_WHITE_LIST,
} from './sample-rate-lists';

export class SampleRateManager {
    constructor(enableSampleRateForAppNames) {
        this.enableSampleRateForAppNames = enableSampleRateForAppNames;
    }

    shouldSampleAppNameEvent(appName, eventId, name) {
        const isEventAndNameWhiteListed = PHASES_WHITE_LIST[name] ? .includes(
            eventId,
        );
        const isAppNameInList = SAMPLED_APP_NAMES.includes(appName);
        if (!isAppNameInList ||
            !this.enableSampleRateForAppNames ||
            isEventAndNameWhiteListed
        ) {
            return false;
        }

        const sampledEventIds = VERTICALS_LIST[appName] ? ? [];
        const isEventIdInSamplingList = sampledEventIds.includes(eventId);

        return this.enableSampleRateForAppNames && isEventIdInSamplingList;
    }
}