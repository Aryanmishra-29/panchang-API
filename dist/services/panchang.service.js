"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanchangService = void 0;
const sun_service_1 = require("./sun.service");
const muhurat_service_1 = require("./muhurat.service");
const astro_util_1 = require("../utils/astro.util");
class PanchangService {
    /**
     * Generates full Panchang data for a given date and location.
     */
    static getDailyPanchang(dateStr, lat, lon, tz = 'UTC') {
        const sunDetails = sun_service_1.SunService.getSunDetails(dateStr, lat, lon, tz);
        if (!sunDetails.sunrise || !sunDetails.sunset) {
            throw new Error('Could not determine sunrise or sunset for the given location and date.');
        }
        const tithiAtSunrise = (0, astro_util_1.getTithi)(sunDetails.sunrise);
        const nakshatraAtSunrise = (0, astro_util_1.getNakshatra)(sunDetails.sunrise);
        // Muhurats
        const muhurats = muhurat_service_1.MuhuratService.getMuhurats(sunDetails.sunrise, sunDetails.sunset, dateStr, lat, lon, tz);
        // Amrit Kaal
        const amritKaal = (0, astro_util_1.getAmritKaal)(sunDetails.sunrise);
        return {
            date: dateStr,
            location: { lat, lon },
            sunDetails: {
                sunrise: sunDetails.sunrise.toISOString(),
                sunset: sunDetails.sunset.toISOString()
            },
            tithi: {
                number: tithiAtSunrise.index,
                name: tithiAtSunrise.name,
                percentageCompletedAtSunrise: (tithiAtSunrise.percentage * 100).toFixed(2) + '%'
            },
            nakshatra: {
                number: nakshatraAtSunrise.index,
                name: nakshatraAtSunrise.name,
                percentageCompletedAtSunrise: (nakshatraAtSunrise.percentage * 100).toFixed(2) + '%'
            },
            muhurat: {
                abhijit: {
                    start: muhurats.abhijit.start.toISOString(),
                    end: muhurats.abhijit.end.toISOString()
                },
                godhuli: {
                    start: muhurats.godhuli.start.toISOString(),
                    end: muhurats.godhuli.end.toISOString()
                },
                vijay: {
                    start: muhurats.vijay.start.toISOString(),
                    end: muhurats.vijay.end.toISOString()
                },
                rahuKaal: {
                    start: muhurats.rahuKaal.start.toISOString(),
                    end: muhurats.rahuKaal.end.toISOString()
                },
                amritKaal: {
                    start: amritKaal.start.toISOString(),
                    end: amritKaal.end.toISOString()
                }
            }
        };
    }
}
exports.PanchangService = PanchangService;
