import { SunService } from './sun.service';
import { MuhuratService } from './muhurat.service';
import { getTithi, getNakshatra, getAmritKaal } from '../utils/astro.util';

export class PanchangService {
  /**
   * Generates full Panchang data for a given date and location.
   */
  static getDailyPanchang(dateStr: string, lat: number, lon: number, tz: string = 'UTC') {
    const sunDetails = SunService.getSunDetails(dateStr, lat, lon, tz);
    
    if (!sunDetails.sunrise || !sunDetails.sunset) {
      throw new Error('Could not determine sunrise or sunset for the given location and date.');
    }

    const tithiAtSunrise = getTithi(sunDetails.sunrise);
    const nakshatraAtSunrise = getNakshatra(sunDetails.sunrise);

    // Muhurats
    const muhurats = MuhuratService.getMuhurats(sunDetails.sunrise, sunDetails.sunset, dateStr, lat, lon, tz);
    
    // Amrit Kaal
    const amritKaal = getAmritKaal(sunDetails.sunrise);

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
