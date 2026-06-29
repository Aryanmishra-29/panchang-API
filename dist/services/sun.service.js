"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SunService = void 0;
const astronomy_engine_1 = require("astronomy-engine");
const luxon_1 = require("luxon");
class SunService {
    /**
     * Get exact Sunrise and Sunset for a given date and location.
     */
    static getSunDetails(dateStr, lat, lon, tz = 'UTC') {
        const observer = new astronomy_engine_1.Observer(lat, lon, 0);
        // We want the sunrise and sunset that occur ON the local calendar date provided.
        // We create a luxon DateTime representing midnight local time for the requested date.
        const localMidnight = luxon_1.DateTime.fromISO(`${dateStr}T00:00:00`, { zone: tz });
        // We start searching a few hours before local midnight to catch the local day's events perfectly.
        // Astronomy engine searches forward chronologically.
        const searchStart = localMidnight.minus({ hours: 6 }).toJSDate();
        const startTime = (0, astronomy_engine_1.MakeTime)(searchStart);
        // Hindu sunrise/sunset corresponds to upper limb touching horizon + standard refraction.
        // This is equivalent to an altitude of -50 arcminutes (-0.833333 degrees).
        const altitude = -50 / 60;
        // We look for the first sunrise and sunset that happen after this start point.
        const sunriseEvent = (0, astronomy_engine_1.SearchAltitude)(astronomy_engine_1.Body.Sun, observer, +1, startTime, 2, altitude);
        let sunsetEvent = null;
        if (sunriseEvent) {
            // Search for sunset starting from the exact sunrise time
            sunsetEvent = (0, astronomy_engine_1.SearchAltitude)(astronomy_engine_1.Body.Sun, observer, -1, sunriseEvent.date, 2, altitude);
        }
        return {
            sunrise: sunriseEvent ? sunriseEvent.date : null,
            sunset: sunsetEvent ? sunsetEvent.date : null,
        };
    }
}
exports.SunService = SunService;
