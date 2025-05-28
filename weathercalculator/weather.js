var WeatherFinder = {

getWeather(timeMillis, zone) {

	var modulo = 0;

	// Sum up the array of numbers to get the modulo value
	this.weatherRateList[zone].forEach(chanceNumber => {modulo += chanceNumber});

	return this.weatherName(zone,this.calculateForecastTarget(timeMillis, modulo))
},

weatherName: function(zone, moduloValue) {
	
	var sum = 0;
	var i = 0;

	// Cycle through array of numbers to find the number range that the moduloValue falls inside of
	while (i < this.weatherRateList[zone].length && moduloValue >= sum + this.weatherRateList[zone][i]) {
		sum += this.weatherRateList[zone][i];
		i++;
	}

	// Parse list of weather names
	return this.weatherLists[zone][i]
},

calculateForecastTarget: function(timeMillis, moduloValue) { 
    // Thanks to Rogueadyn's SaintCoinach library for this calculation.
	// Modifications needed, credit to Caf Coleo

    var unixSeconds = parseInt(timeMillis / 1000);
    // Get Eorzea hour for weather start
    var bell = unixSeconds / 175;

    // Do the magic 'cause for calculations 16:00 is 0, 00:00 is 8 and 08:00 is 16
    var increment = (bell + 8 - (bell % 8)) % 24;

    // Take Eorzea days since unix epoch
    var totalDays = unixSeconds / 4200;
    totalDays = (totalDays << 32) >>> 0; // Convert to uint

    // Add increment
    var calcBase = totalDays * 100 + increment;

    // Perform one round of Xorshift RNG
    var step1 = ((calcBase << 11) ^ calcBase) >>> 0;
    var step2 = ((step1 >>> 8) ^ step1) >>> 0;

    // Modulo the result to fit the weather number ranges
    // It's not always 100, thanks to Caf Coleo for testing this!
    return step2 % moduloValue;
},

getEorzeaHour: function(timeMillis) {
    var unixSeconds = parseInt(timeMillis / 1000);
    // Get Eorzea hour
    var bell = (unixSeconds / 175) % 24;
    return Math.floor(bell);
},

getWeatherTimeFloor: function(date) {
    var unixSeconds = parseInt(date.getTime() / 1000);
    // Get Eorzea hour for weather start
    var bell = (unixSeconds / 175) % 24;
    var startBell = bell - (bell % 8);
    var startUnixSeconds = unixSeconds - (175 * (bell - startBell));
    return new Date(startUnixSeconds * 1000);
},

weatherRateList: {
// Zone name, and array of the numbers used to determine the weather in that zone.
// Need another array to hold the weather names for each number range
"Limsa Lominsa": [20, 30, 30, 10, 10],
"Middle La Noscea": [20, 30, 20, 10, 10, 10],
"Lower La Noscea": [20, 30, 20, 10, 10, 10],
"Eastern La Noscea": [5, 45, 30, 10, 5, 5],
"Western La Noscea": [10, 30, 20, 20, 10, 10],
"Upper La Noscea": [30, 20, 20, 10, 10, 10],
"Outer La Noscea": [30, 20, 20, 15, 15],
"Mist": [20, 30, 30, 10, 10],
"Unnamed Island": [25, 45, 10, 10, 5, 5],
"Gridania": [20, 10, 10, 15, 30, 15],
"Central Shroud": [5, 15, 10, 10, 15, 30, 15],
"East Shroud": [5, 15, 10, 10, 15, 30, 15],
"South Shroud": [5, 5, 15, 5, 10, 30, 30],
"North Shroud": [5, 5, 15, 5, 10, 30, 30],
"The Lavender Beds": [5, 15, 10, 10, 15, 30, 15],
"Ul'dah": [40, 20, 25, 10, 5],
"Western Thanalan": [40, 20, 25, 10, 5],
"Central Thanalan": [15, 40, 20, 10, 10, 5],
"Eastern Thanalan": [40, 20, 10, 10, 5, 15],
"Southern Thanalan": [20, 40, 20, 10, 10],
"Northern Thanalan": [5, 15, 30, 50],
"The Goblet": [40, 20, 25, 10, 5],
"Mor Dhona": [15, 15, 30, 15, 25],
"Ishgard": [60, 10, 5, 15, 10],
"Empyreum": [5, 20, 40, 15, 10],
"Coerthas Central Highlands": [20, 40, 10, 5, 15, 10],
"Coerthas Western Highlands": [20, 40, 10, 5, 15, 10],
"The Sea of Clouds": [30, 30, 10, 10, 10, 10],
"Azys Lla": [35, 35, 30],
"The Dravanian Forelands": [10, 10, 10, 10, 30, 30],
"The Dravanian Hinterlands": [10, 10, 10, 10, 30, 30],
"The Churning Mists": [10, 10, 20, 30, 30],
"Idyllshire": [10, 10, 10, 10, 30, 30],
"Rhalgr's Reach": [15, 45, 20, 10, 10],
"The Fringes": [15, 45, 20, 10, 10],
"The Peaks": [10, 50, 15, 10, 10, 5],
"The Lochs": [20, 40, 20, 10, 10],
"Kugane": [10, 10, 20, 40, 20],
"Shirogane": [10, 10, 20, 40, 20],
"The Ruby Sea": [10, 10, 15, 40, 25],
"Yanxia": [5, 10, 10, 15, 40, 20],
"The Azim Steppe": [5, 5, 7, 8, 10, 40, 25],
"Eureka Anemos": [30, 30, 30, 10],
"Eureka Pagos": [10, 18, 18, 18, 18, 18],
"Eureka Pyros": [10, 18, 18, 18, 18, 18],
"Eureka Hydatos": [12, 22, 22, 22, 22],
"The Crystarium": [20, 40, 15, 10, 10, 5],
"Eulmore": [10, 10, 10, 15, 40, 15],
"Lakeland": [20, 40, 15, 10, 10, 5],
"Kholusia": [10, 10, 10, 15, 40, 15],
"Amh Araeng": [45, 15, 10, 10, 20],
"Il Mheg": [10, 10, 15, 10, 15, 40],
"The Rak'tika Greatwood": [10, 10, 10, 15, 40, 15],
"The Tempest": [20, 60, 20],
"Old Sharlayan": [10, 40, 20, 15, 15],
"Labyrinthos": [15, 45, 25, 15],
"Radz-at-Han": [10, 15, 15, 45, 15],
"Thavnair": [10, 10, 5, 15, 45, 15],
"Garlemald": [45, 5, 5, 5, 25, 10, 5],
"Mare Lamentorum": [15, 15, 70],
"Elpis": [25, 15, 45, 15],
"Ultima Thule": [15, 70, 15],
"Tuliyollal": [40, 40, 5, 10, 5],
"Urqopacha": [20, 30, 20, 10, 10, 10],
"Kozama'uka": [25, 35, 15, 10, 10, 5],
"Yak T'el": [15, 40, 15, 15, 15],
"Shaaloani": [5, 45, 20, 15, 15],
"Heritage Found": [5, 20, 15, 5, 5, 50],
"Living Memory": [10, 10, 20, 60],
"Sinus Ardorum": [15, 70, 15],
"South Horn": [10, 45, 15, 10, 15, 5]
},

weatherLists: {
"Limsa Lominsa": ["Clouds","Clear Skies","Fair Skies","Fog","Rain"],
"Middle La Noscea": ["Clouds","Clear Skies","Fair Skies","Wind","Fog","Rain"],
"Lower La Noscea": ["Clouds","Clear Skies","Fair Skies","Wind","Fog","Rain"],
"Eastern La Noscea": ["Fog","Clear Skies","Fair Skies","Clouds","Rain","Showers"],
"Western La Noscea": ["Fog","Clear Skies","Fair Skies","Clouds","Wind","Gales"],
"Upper La Noscea": ["Clear Skies","Fair Skies","Clouds","Fog","Thunder","Thunderstorms"],
"Outer La Noscea": ["Clear Skies","Fair Skies","Clouds","Fog","Rain" ],
"Mist": ["Clouds","Clear Skies","Fair Skies","Fog","Rain" ],
"Unnamed Island": ["Clear Skies","Fair Skies","Clouds","Rain","Fog","Showers" ],
"Gridania": ["Rain","Fog","Clouds","Fair Skies","Clear Skies","Fair Skies"],//why did you do this devs?
"Central Shroud": ["Thunder","Rain","Fog","Clouds","Fair Skies","Clear Skies"],
"East Shroud": ["Thunder","Rain","Fog","Clouds","Fair Skies","Clear Skies"],
"South Shroud": ["Fog","Thunderstorms","Thunder","Clouds","Fair Skies","Clear Skies"],
"North Shroud": ["Fog","Showers","Rain","Clouds","Fair Skies","Clear Skies"],
"The Lavender Beds": ["Clouds","Rain","Fog","Fair Skies","Clear Skies"],
"Ul'dah": ["Clear Skies","Fair Skies","Clouds","Fog","Rain"],
"Western Thanalan": ["Clear Skies","Fair Skies","Clouds","Fog","Rain"],
"Central Thanalan": ["Dust Storms","Clear Skies","Fair Skies","Clouds","Fog","Rain"],
"Eastern Thanalan": ["Clear Skies","Fair Skies","Clouds","Fog","Rain","Showers"],
"Southern Thanalan": ["Heat Waves","Clear Skies","Fair Skies","Clouds","Fog"],
"Northern Thanalan": ["Clear Skies","Fair Skies","Clouds","Fog"],
"The Goblet": ["Clear Skies","Fair Skies","Clouds","Fog","Rain"],
"Mor Dhona": ["Clouds", "Fog", "Gloom", "Clear Skies", "Fair Skies"],
"Ishgard": ["Snow", "Fair Skies", "Clear Skies", "Clouds", "Fog"],
"Empyreum": ["Snow", "Fair Skies", "Clear Skies", "Clouds", "Fog"],
"Coerthas Central Highlands": ["Blizzards", "Snow", "Fair Skies", "Clear Skies", "Clouds", "Fog"],
"Coerthas Western Highlands": ["Blizzards", "Snow", "Fair Skies", "Clear Skies", "Clouds", "Fog"],
"The Sea of Clouds": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Wind", "Umbral Wind"],
"Azys Lla": ["Fair Skies", "Clouds", "Thunder"],
"The Dravanian Forelands": ["Clouds", "Fog", "Thunder", "Dust Storms", "Clear Skies", "Fair Skies"],
"The Dravanian Hinterlands": ["Clouds", "Fog", "Rain", "Showers", "Clear Skies", "Fair Skies"],
"The Churning Mists": ["Clouds", "Gales", "Umbral Static", "Clear Skies", "Fair Skies"],
"Idyllshire": ["Clouds", "Fog", "Rain", "Showers", "Clear Skies", "Fair Skies"],
"Rhalgr's Reach": ["Clear Skies","Fair Skies","Clouds","Fog","Thunder"],
"The Fringes": ["Clear Skies","Fair Skies","Clouds","Fog","Thunder"],
"The Peaks": ["Clear Skies","Fair Skies","Clouds","Fog","Wind","Dust Storms"],
"The Lochs": ["Clear Skies","Fair Skies","Clouds","Fog","Thunderstorms"],
"Kugane": ["Rain","Fog","Clouds","Fair Skies","Clear Skies"],
"Shirogane": ["Rain","Fog","Clouds","Fair Skies","Clear Skies"],
"The Ruby Sea": ["Thunder","Wind","Clouds","Fair Skies","Clear Skies"],
"Yanxia": ["Showers","Rain","Fog","Clouds","Fair Skies","Clear Skies"],
"The Azim Steppe": ["Gales","Wind","Rain","Fog","Clouds","Fair Skies","Clear Skies"],
"Eureka Anemos": ["Fair Skies", "Gales", "Showers", "Snow"],
"Eureka Pagos": ["Clear Skies", "Fog", "Heat Waves", "Snow", "Thunder", "Brizzards"],
"Eureka Pyros": ["Fair Skies", "Heat Waves", "Thunder", "Blizzards", "Umbral Wind", "Snow"],
"Eureka Hydatos": ["Fair Skies", "Showers", "Gloom", "Thunderstorms", "Snow"],
"The Crystarium": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Rain", "Thunderstorms"],
"Eulmore": ["Gales", "Rain", "Fog", "Clouds", "Fair Skies", "Clear Skies"],
"Lakeland": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Rain", "Thunderstorms"],
"Kholusia": ["Gales", "Rain", "Fog", "Clouds", "Fair Skies", "Clear Skies"],
"Amh Araeng": ["Fair Skies", "Clouds", "Dust Storms", "Heat Waves", "Clear Skies"],
"Il Mheg": ["Rain", "Fog", "Clouds", "Thunderstorms", "Clear Skies", "Fair Skies"],
"The Rak'tika Greatwood": ["Fog", "Rain", "Umbral Wind", "Clear Skies", "Fair Skies", "Clouds"],
"The Tempest": ["Clouds", "Fair Skies", "Clear Skies"],
"Old Sharlayan": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Snow"],
"Labyrinthos": ["Clear Skies", "Fair Skies", "Clouds", "Rain"],
"Radz-at-Han": ["Fog", "Rain", "Clear Skies", "Fair Skies", "Clouds"],
"Thavnair": ["Fog", "Rain", "Showers", "Clear Skies", "Fair Skies", "Clouds"],
"Garlemald": ["Snow", "Thunderstorms", "Rain", "Fog", "Clouds", "Fair Skies", "Clear Skies"],
"Mare Lamentorum": ["Umbral Wind", "Moon Dust", "Fair Skies"],
"Elpis": ["Clouds", "Umbral Wind", "Fair Skies", "Clear Skies"],
"Ultima Thule": ["Astromagnetic Storm", "Fair Skies", "Umbral Wind"],
"Tuliyollal": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Rain"],
"Urqopacha": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Wind", "Snow"],
"Kozama'uka": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Rain", "Showers"],
"Yak T'el": ["Clear Skies", "Fair Skies", "Clouds", "Fog", "Rain"],
"Shaaloani": ["Clear Skies", "Fair Skies", "Clouds", "Dust Storms", "Gales"],
"Heritage Found": ["Fair Skies", "Clouds", "Fog", "Rain", "Thunderstorms", "Umbral Static"],
"Living Memory": ["Rain", "Fog", "Clouds", "Fair Skies"],
"Sinus Ardorum": ["Moon Dust", "Fair Skies", "Umbral Wind"],
"South Horn": ["Clear Skies", "Fair Skies", "Clouds", "Rain", "Atmospheric Phantasms", "Illusory Disturbances"]
}
};
