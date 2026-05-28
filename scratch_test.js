const A = require('astronomy-engine');

function getTrueAyanamsa(date) {
  // Rough Lahiri Ayanamsa: 23.85 at J2000 (year 2000)
  // Increases by approx 50.29 arcseconds per year = 0.013969 degrees per year
  const year = date.getUTCFullYear() + date.getUTCMonth() / 12 + date.getUTCDate() / 365;
  return 23.85 + (year - 2000) * 0.013969;
}

function test(date) {
  const t = A.MakeTime(date);
  
  // Apparent geocentric equatorial coordinates
  const observer = new A.Observer(0, 0, 0);
  
  // Ecliptic coordinates of date
  // astronomy-engine A.Ecliptic returns ecliptic coordinates for J2000.
  // To get ecliptic of date, we might have to use A.Equator then convert, or just use J2000 which might be off by a little.
  // Wait, EclipticLongitude returns what?
  // Let's just try A.SunPosition(t).elon and A.EclipticGeoMoon(t).elon (wait, EclipticGeoMoon returns Equator or EclipticCoordinates?)
  // Actually A.EclipticGeoMoon(t) doesn't exist? A.GeoMoon(t) exists.
  
  const moonEq = A.GeoMoon(t);
  const sunEq = A.GeoVector(A.Body.Sun, t, true);
  
  // Convert eq vector to ecliptic longitude?
  // A.Ecliptic(vector) converts to J2000 ecliptic.
  const moonEcl = A.Ecliptic(moonEq);
  const sunEcl = A.SunPosition(t); // returns J2000 ecliptic coordinates of sun
  
  const diff = (moonEcl.elon - sunEcl.elon) % 360;
  const diffNorm = diff < 0 ? diff + 360 : diff;
  const tithi = Math.floor(diffNorm / 12) + 1;
  
  const ayanamsa = getTrueAyanamsa(date);
  const nirayanaMoon = (moonEcl.elon - ayanamsa) % 360;
  const moonNorm = nirayanaMoon < 0 ? nirayanaMoon + 360 : nirayanaMoon;
  const nakshatra = Math.floor(moonNorm / (360/27)) + 1;

  console.log(`Date: ${date.toISOString()}`);
  console.log(`Ayanamsa: ${ayanamsa}`);
  console.log(`Moon elon: ${moonEcl.elon}, Sun elon: ${sunEcl.elon}`);
  console.log(`Diff: ${diffNorm}, Tithi: ${tithi}`);
  console.log(`Nakshatra: ${nakshatra}`);
}

test(new Date('2026-05-27T00:00:00Z'));
