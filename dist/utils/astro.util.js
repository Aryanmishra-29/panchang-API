"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAmritKaal = exports.findMoonLongitudeTime = exports.getNakshatra = exports.getTithi = exports.getLahiriAyanamsa = exports.normalizeAngle = void 0;
const astronomy_engine_1 = require("astronomy-engine");
/**
 * Normalizes an angle to 0-360 degrees
 */
const normalizeAngle = (angle) => {
    let a = angle % 360;
    if (a < 0)
        a += 360;
    return a;
};
exports.normalizeAngle = normalizeAngle;
/**
 * Calculates exact Lahiri Ayanamsa for a given date.
 */
const getLahiriAyanamsa = (date) => {
    // More precise approximation of Lahiri Ayanamsa (Chitra Paksha).
    // 23.85 degrees in year 2000. It moves ~50.29 arcsec/year (0.013969 deg/year).
    // JD 2451545.0 is Jan 1, 2000 12:00 TT
    const t = (0, astronomy_engine_1.MakeTime)(date);
    // astronomy-engine 't.ut' is days since Jan 1, 2000 12:00 UT.
    const yearsSince2000 = t.ut / 365.25;
    return 23.85 + (yearsSince2000 * 0.0139696);
};
exports.getLahiriAyanamsa = getLahiriAyanamsa;
/**
 * Gets exact geocentric apparent ecliptic longitudes for Sun and Moon
 */
const getEclipticLongitudes = (date) => {
    const t = (0, astronomy_engine_1.MakeTime)(date);
    // Apparent geocentric equatorial coordinates
    const moonEq = (0, astronomy_engine_1.GeoMoon)(t);
    // J2000 ecliptic coordinates
    const moonEcl = (0, astronomy_engine_1.Ecliptic)(moonEq);
    const sunEcl = (0, astronomy_engine_1.SunPosition)(t);
    return {
        moonLon: moonEcl.elon,
        sunLon: sunEcl.elon
    };
};
/**
 * Gets exact Tithi (lunar day) number (1-30) for a given time using Drik Siddhanta.
 * Tithi is exactly 12 degrees of difference between Moon and Sun longitudes.
 */
const getTithi = (date) => {
    const { moonLon, sunLon } = getEclipticLongitudes(date);
    const diff = (0, exports.normalizeAngle)(moonLon - sunLon);
    const tithiIndex = Math.floor(diff / 12) + 1;
    const percentage = (diff % 12) / 12;
    const tithiNames = [
        "Pratipada (S)", "Dwitiya (S)", "Tritiya (S)", "Chaturthi (S)", "Panchami (S)",
        "Shashthi (S)", "Saptami (S)", "Ashtami (S)", "Navami (S)", "Dashami (S)",
        "Ekadashi (S)", "Dwadashi (S)", "Trayodashi (S)", "Chaturdashi (S)", "Purnima",
        "Pratipada (K)", "Dwitiya (K)", "Tritiya (K)", "Chaturthi (K)", "Panchami (K)",
        "Shashthi (K)", "Saptami (K)", "Ashtami (K)", "Navami (K)", "Dashami (K)",
        "Ekadashi (K)", "Dwadashi (K)", "Trayodashi (K)", "Chaturdashi (K)", "Amavasya"
    ];
    return {
        index: tithiIndex,
        name: tithiNames[tithiIndex - 1],
        percentage
    };
};
exports.getTithi = getTithi;
/**
 * Gets exact Nirayana Nakshatra index (1-27) applying true Lahiri Ayanamsa.
 */
const getNakshatra = (date) => {
    const { moonLon } = getEclipticLongitudes(date);
    const ayanamsa = (0, exports.getLahiriAyanamsa)(date);
    const nirayanaMoonLon = (0, exports.normalizeAngle)(moonLon - ayanamsa);
    const nakshatraSize = 360 / 27; // 13.333333 degrees per Nakshatra
    const nakshatraIndex = Math.floor(nirayanaMoonLon / nakshatraSize) + 1;
    const percentage = (nirayanaMoonLon % nakshatraSize) / nakshatraSize;
    const nakshatraNames = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
        "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
        "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
        "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ];
    return {
        index: nakshatraIndex,
        name: nakshatraNames[nakshatraIndex - 1],
        percentage
    };
};
exports.getNakshatra = getNakshatra;
/**
 * Finds the exact time the moon reaches a specific Nirayana longitude.
 */
const findMoonLongitudeTime = (targetLon, startEstimate) => {
    let current = startEstimate.getTime();
    // Moon moves ~13.176 degrees per day = 0.549 deg/hour = 0.0001525 deg/ms
    for (let i = 0; i < 15; i++) {
        const d = new Date(current);
        const { moonLon } = getEclipticLongitudes(d);
        const ayanamsa = (0, exports.getLahiriAyanamsa)(d);
        const nirayana = (0, exports.normalizeAngle)(moonLon - ayanamsa);
        let diff = (0, exports.normalizeAngle)(targetLon - nirayana);
        if (diff > 180)
            diff -= 360;
        const timeAdjust = diff / 0.0001525;
        current += timeAdjust;
        if (Math.abs(diff) < 0.0001)
            break;
    }
    return new Date(current);
};
exports.findMoonLongitudeTime = findMoonLongitudeTime;
/**
 * Calculates the exact Amrit Kaal window for a given date.
 */
const getAmritKaal = (date) => {
    const currentNakshatra = (0, exports.getNakshatra)(date);
    // 0-indexed amrit ghati start times for the 27 Nakshatras
    const amritGhatiStarts = [
        54, 52, 38, 35, 54, 44, 56, 54, 44, 40,
        45, 44, 38, 38, 34, 50, 46, 42, 40, 40,
        38, 48, 44, 46, 40, 36, 30
    ];
    const startGhati = amritGhatiStarts[currentNakshatra.index - 1];
    const nakshatraSize = 360 / 27;
    const startLon = (currentNakshatra.index - 1) * nakshatraSize;
    const endLon = currentNakshatra.index * nakshatraSize;
    // Initial estimates (moon moves 1 nakshatra in ~24 hours)
    const startTimeEst = new Date(date.getTime() - 12 * 60 * 60 * 1000);
    const endTimeEst = new Date(date.getTime() + 12 * 60 * 60 * 1000);
    const startTime = (0, exports.findMoonLongitudeTime)(startLon, startTimeEst);
    const endTime = (0, exports.findMoonLongitudeTime)(endLon, endTimeEst);
    const totalMs = endTime.getTime() - startTime.getTime();
    const ghatiMs = totalMs / 60; // 1 Ghati duration
    const amritStart = new Date(startTime.getTime() + startGhati * ghatiMs);
    const amritEnd = new Date(startTime.getTime() + (startGhati + 4) * ghatiMs);
    return {
        start: amritStart,
        end: amritEnd
    };
};
exports.getAmritKaal = getAmritKaal;
