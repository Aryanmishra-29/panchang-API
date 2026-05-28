import { DateTime } from 'luxon';

export class MuhuratService {
  /**
   * Calculates Abhijit, Godhuli, Vijay Muhurats and standard LMT-based Rahu Kaal.
   */
  static getMuhurats(sunrise: Date, sunset: Date, dateStr: string, lat: number, lon: number, tz: string = 'UTC'): { 
    abhijit: { start: Date; end: Date }; 
    godhuli: { start: Date; end: Date };
    vijay: { start: Date; end: Date };
    rahuKaal: { start: Date; end: Date }; 
  } {
    const srTime = sunrise.getTime();
    const ssTime = sunset.getTime();
    const dayDurationMs = ssTime - srTime;
    
    // Daylight is divided into 15 equal Muhurats
    const muhuratDuration = dayDurationMs / 15;

    // Abhijit Muhurat: 8th Muhurat
    const abhijitStart = new Date(srTime + 7 * muhuratDuration);
    const abhijitEnd = new Date(srTime + 8 * muhuratDuration);

    // Vijay Muhurat: 11th Muhurat
    const vijayStart = new Date(srTime + 10 * muhuratDuration);
    const vijayEnd = new Date(srTime + 11 * muhuratDuration);

    // Godhuli Muhurat: 12 minutes before and after sunset
    const twelveMinsMs = 12 * 60 * 1000;
    const godhuliStart = new Date(ssTime - twelveMinsMs);
    const godhuliEnd = new Date(ssTime + twelveMinsMs);

    // LMT Correction for Rahu Kaal
    const dt = DateTime.fromISO(`${dateStr}T12:00:00`, { zone: tz });
    const offsetHours = dt.offset / 60;
    const standardMeridian = offsetHours * 15;
    const lmtCorrectionMins = (standardMeridian - lon) * 4;

    // Standard Rahu Kaal starts (hours from midnight, LMT)
    // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    const standardRahuKaalStarts = [16.5, 7.5, 15, 12, 13.5, 10.5, 9];
    const weekdayJS = dt.weekday % 7;
    const rkStartLmtHour = standardRahuKaalStarts[weekdayJS];

    const rkStartLocalHour = rkStartLmtHour + (lmtCorrectionMins / 60);
    const rkEndLocalHour = rkStartLocalHour + 1.5;

    const midnight = DateTime.fromISO(`${dateStr}T00:00:00`, { zone: tz });
    const rahuKaalStart = midnight.plus({ hours: rkStartLocalHour }).toJSDate();
    const rahuKaalEnd = midnight.plus({ hours: rkEndLocalHour }).toJSDate();

    return {
      abhijit: { start: abhijitStart, end: abhijitEnd },
      godhuli: { start: godhuliStart, end: godhuliEnd },
      vijay: { start: vijayStart, end: vijayEnd },
      rahuKaal: { start: rahuKaalStart, end: rahuKaalEnd }
    };
  }
}
