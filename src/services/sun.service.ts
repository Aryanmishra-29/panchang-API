import { Observer, SearchAltitude, Body, MakeTime } from 'astronomy-engine';
import { DateTime } from 'luxon';

export class SunService {
  /**
   * Get exact Sunrise and Sunset for a given date and location.
   */
  static getSunDetails(dateStr: string, lat: number, lon: number, tz: string = 'UTC'): { sunrise: Date | null; sunset: Date | null } {
    const observer = new Observer(lat, lon, 0);
    
    // We want the sunrise and sunset that occur ON the local calendar date provided.
    // We create a luxon DateTime representing midnight local time for the requested date.
    const localMidnight = DateTime.fromISO(`${dateStr}T00:00:00`, { zone: tz });
    
    // We start searching a few hours before local midnight to catch the local day's events perfectly.
    // Astronomy engine searches forward chronologically.
    const searchStart = localMidnight.minus({ hours: 6 }).toJSDate();
    const startTime = MakeTime(searchStart); 
    
    // Hindu sunrise/sunset corresponds to upper limb touching horizon + standard refraction.
    // This is equivalent to an altitude of -50 arcminutes (-0.833333 degrees).
    const altitude = -50 / 60;
    
    // We look for the first sunrise and sunset that happen after this start point.
    const sunriseEvent = SearchAltitude(Body.Sun, observer, +1, startTime, 2, altitude);
    
    let sunsetEvent = null;
    if (sunriseEvent) {
      // Search for sunset starting from the exact sunrise time
      sunsetEvent = SearchAltitude(Body.Sun, observer, -1, sunriseEvent.date, 2, altitude);
    }

    return {
      sunrise: sunriseEvent ? sunriseEvent.date : null,
      sunset: sunsetEvent ? sunsetEvent.date : null,
    };
  }
}
