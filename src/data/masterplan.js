/*
 * Masterplan + Location 3D data (ported from js/masterplan-location.js)
 *
 *  - PLOTS:        x / y are % positions on images/location-image.jpeg
 *  - AMENITIES:    non-plot points of interest on the masterplan
 *  - LOCAL_PINS:   points on the land shown in the 3D section
 *  - DESTINATIONS: nearby places shown at the edge of the 3D map
 *                  (x / y are % positions on the map, may sit near the edge)
 * NOTE: all values are sample data - replace with real figures.
 */

export const CLUSTERS = {
	north: "North Meadow",
	west: "West Grove",
	riverside: "Riverside"
};

export const STATUS_LABEL = {
	available: "Available",
	reserved: "Reserved",
	sold: "Sold"
};

// [plot no, cluster, x%, y%, size (sq.ft), status, facing]
// [plot no, cluster, x%, y%, size (sq.ft), status, facing]
// 127 plots per the estate plan; all available at launch.
// [plot no, cluster, x%, y%, size (sq.ft), status, guntas]
// Sizes and guntas come from the AAMRA plot data sheet (126 plots).
export const PLOTS = [
	[1, "riverside", 88.24, 12.45, 10003, "available", 9.18],
	[2, "riverside", 87.22, 16.88, 6800, "available", 6.24],
	[3, "riverside", 86.57, 20.04, 6560, "available", 6.02],
	[4, "riverside", 85.65, 23.1, 6590, "available", 6.04],
	[5, "riverside", 84.35, 26.79, 6530, "available", 5.99],
	[6, "riverside", 82.87, 32.7, 9810, "available", 9.0],
	[7, "riverside", 80, 16.77, 6635, "available", 6.09],
	[8, "riverside", 78.98, 21.84, 6500, "available", 5.96],
	[9, "riverside", 78.61, 26.9, 6510, "available", 5.97],
	[10, "riverside", 78.15, 31.86, 7270, "available", 6.67],
	[11, "riverside", 75.65, 16.67, 6520, "available", 5.98],
	[12, "riverside", 75.28, 21.31, 6550, "available", 6.01],
	[13, "riverside", 74.35, 26.37, 6550, "available", 6.01],
	[14, "riverside", 74.07, 31.33, 7810, "available", 7.16],
	[15, "north", 69.81, 14.87, 6630, "available", 6.08],
	[16, "north", 69.26, 18.14, 6540, "available", 6.0],
	[17, "north", 68.7, 21.62, 6550, "available", 6.01],
	[18, "north", 68.8, 25.21, 6550, "available", 6.01],
	[19, "north", 67.87, 28.48, 6560, "available", 6.02],
	[20, "north", 67.69, 31.86, 6460, "available", 5.93],
	[21, "north", 62.22, 13.92, 9530, "available", 8.74],
	[22, "north", 61.85, 17.83, 10020, "available", 9.19],
	[23, "north", 61.67, 22.57, 10070, "available", 9.24],
	[24, "north", 61.39, 27.11, 10125, "available", 9.29],
	[25, "north", 61.11, 32.17, 10085, "available", 9.25],
	[26, "north", 54.07, 19.94, 6460, "available", 5.93],
	[27, "north", 53.7, 23.31, 6510, "available", 5.97],
	[28, "north", 53.33, 26.27, 6520, "available", 5.98],
	[29, "north", 53.43, 29.85, 6630, "available", 6.08],
	[30, "north", 53.24, 32.81, 6510, "available", 5.97],
	[31, "north", 47.5, 19.2, 10110, "available", 9.28],
	[32, "north", 47.69, 22.57, 6500, "available", 5.96],
	[33, "north", 46.94, 25.84, 6530, "available", 5.99],
	[34, "north", 46.76, 29.85, 6520, "available", 5.98],
	[35, "north", 40.09, 18.78, 10150, "available", 9.31],
	[36, "north", 39.44, 23, 9700, "available", 8.9],
	[37, "north", 40.74, 28.59, 7220, "available", 6.62],
	[38, "north", 37.22, 28.27, 7650, "available", 7.02],
	[39, "north", 38.15, 35.02, 9510, "available", 8.73],
	[40, "north", 37.69, 39.66, 10040, "available", 9.21],
	[41, "north", 37.04, 43.25, 11206, "available", 10.28],
	[42, "north", 46.11, 36.39, 7300, "available", 6.7],
	[43, "north", 45.83, 39.66, 7210, "available", 6.61],
	[44, "north", 45.46, 43.14, 6960, "available", 6.38],
	[45, "north", 45.37, 46.52, 6580, "available", 6.04],
	[46, "north", 53.15, 36.92, 6480, "available", 5.94],
	[47, "north", 52.5, 40.4, 6540, "available", 6.0],
	[48, "north", 51.94, 44.09, 6560, "available", 6.01],
	[49, "north", 51.76, 48.1, 7780, "available", 7.14],
	[50, "north", 60.74, 37.97, 10220, "available", 9.38],
	[51, "north", 60, 41.67, 6590, "available", 6.04],
	[52, "north", 59.72, 45.36, 9320, "available", 8.55],
	[53, "north", 58.61, 48.73, 6540, "available", 6.0],
	[54, "north", 67.22, 37.97, 6480, "available", 5.94],
	[55, "north", 66.3, 42.51, 6590, "available", 6.04],
	[56, "north", 65.83, 46.52, 6980, "available", 6.4],
	[57, "riverside", 74.17, 38.61, 10550, "available", 9.68],
	[58, "riverside", 72.31, 44.2, 10030, "available", 9.2],
	[59, "north", 58.61, 53.9, 10060, "available", 9.23],
	[60, "north", 57.22, 59.07, 6540, "available", 6.0],
	[61, "north", 55.74, 63.71, 6590, "available", 6.04],
	[62, "north", 54.63, 67.51, 8016, "available", 7.35],
	[63, "north", 48.24, 51.9, 8000, "available", 7.34],
	[64, "north", 47.69, 55.38, 9400, "available", 8.62],
	[65, "north", 47.31, 58.76, 9325, "available", 8.56],
	[66, "north", 46.67, 62.45, 9200, "available", 8.44],
	[67, "north", 46.11, 65.93, 9060, "available", 8.31],
	[68, "north", 48.43, 70.68, 7310, "available", 6.71],
	[69, "north", 44.26, 69.83, 6750, "available", 6.19],
	[70, "north", 41.11, 50.84, 9230, "available", 8.47],
	[71, "north", 40.93, 54.22, 6550, "available", 6.01],
	[72, "north", 40.28, 57.7, 6550, "available", 6.01],
	[73, "north", 40.09, 61.08, 6550, "available", 6.01],
	[74, "north", 39.44, 64.87, 6475, "available", 5.94],
	[75, "north", 38.98, 69.09, 6360, "available", 6.38],
	[76, "west", 34.07, 49.47, 9770, "available", 8.96],
	[77, "west", 33.8, 53.59, 6400, "available", 5.81],
	[78, "west", 33.24, 56.86, 6400, "available", 5.81],
	[79, "west", 32.87, 60.55, 6400, "available", 5.81],
	[80, "west", 32.41, 64.35, 6400, "available", 5.81],
	[81, "west", 32.04, 67.72, 8725, "available", 8.0],
	[82, "west", 29.35, 48, 9510, "available", 8.73],
	[83, "west", 26.02, 47.47, 7030, "available", 6.45],
	[84, "west", 27.04, 52.32, 7030, "available", 6.45],
	[85, "west", 26.67, 56.33, 7030, "available", 6.45],
	[86, "west", 26.57, 60.02, 7030, "available", 6.45],
	[87, "west", 26.02, 63.82, 6500, "available", 5.96],
	[88, "west", 25.56, 67.72, 7100, "available", 6.51],
	[89, "west", 21.02, 43.99, 10375, "available", 9.52],
	[90, "west", 21.02, 48.52, 6040, "available", 5.54],
	[91, "west", 20.28, 52.85, 6180, "available", 5.67],
	[92, "west", 19.63, 57.49, 6310, "available", 5.79],
	[93, "west", 18.89, 62.76, 6450, "available", 5.92],
	[94, "west", 18.98, 66.35, 6640, "available", 6.09],
	[95, "west", 17.13, 43.14, 6650, "available", 6.1],
	[96, "west", 16.94, 48, 6440, "available", 6.09],
	[97, "west", 15.93, 52.43, 6300, "available", 5.78],
	[98, "west", 15.28, 57.17, 6170, "available", 5.66],
	[99, "west", 14.81, 62.34, 6040, "available", 5.54],
	[100, "west", 14.17, 66.35, 10640, "available", 9.76],
	[101, "west", 9.81, 42.51, 10075, "available", 9.24],
	[102, "west", 9.17, 46.41, 10200, "available", 9.36],
	[103, "west", 8.33, 50.42, 10625, "available", 9.75],
	[104, "west", 7.41, 54.32, 8035, "available", 7.37],
	[105, "west", 8.06, 58.23, 6940, "available", 6.37],
	[106, "west", 7.5, 61.81, 7160, "available", 6.57],
	[107, "west", 7.13, 65.61, 8100, "available", 7.44],
	[108, "west", 25, 73.1, 6590, "available", 6.05],
	[109, "west", 24.54, 76.79, 6600, "available", 6.06],
	[110, "west", 24.17, 80.59, 6600, "available", 6.06],
	[111, "west", 23.52, 83.97, 7285, "available", 6.69],
	[112, "west", 22.5, 87.13, 6940, "available", 6.37],
	[113, "west", 31.2, 73.73, 6600, "available", 6.06],
	[114, "west", 30.74, 78.16, 6620, "available", 6.08],
	[115, "west", 30.09, 80.8, 6650, "available", 6.11],
	[116, "west", 29.44, 84.6, 8075, "available", 7.42],
	[117, "west", 28.98, 88.82, 8150, "available", 8.03],
	[118, "north", 39.91, 75.32, 6870, "available", 6.31],
	[119, "north", 39.63, 78.9, 6760, "available", 6.21],
	[120, "north", 38.98, 82.81, 6635, "available", 6.09],
	[121, "north", 38.15, 86.18, 6375, "available", 5.85],
	[122, "north", 36.3, 89.98, 6800, "available", 6.24],
	[123, "north", 46.39, 76.48, 7300, "available", 6.7],
	[124, "north", 46.67, 79.96, 9260, "available", 8.5],
	[125, "north", 45.65, 83.86, 9260, "available", 8.5],
	[126, "north", 43.8, 87.13, 10200, "available", 9.37],
	[127, "north", 42.04, 90.4, null, "available", null]
];

export const AMENITIES = [
	{ x: 57.5, y: 52, icon: "fa-house", name: "Riverside Clubhouse", text: "Pool, lounge and farm-to-table kitchen beside the stream." },
	{ x: 84.3, y: 25.5, icon: "fa-binoculars", name: "Viewpoint Deck", text: "A raised deck at the end of the river trail." },
	{ x: 66.5, y: 3, icon: "fa-road-barrier", name: "Main Entrance", text: "Gated entry with 24/7 security." }
];

export const FARM = { x: 45, y: 50 };

export const LOCAL_PINS = [
	{ x: 57.5, y: 52, icon: "fa-house", name: "Clubhouse", stem: 48 },
	{ x: 49, y: 82, icon: "fa-water", name: "Year-round stream", stem: 44 },
	{ x: 84.3, y: 25.5, icon: "fa-binoculars", name: "Viewpoint deck", stem: 24 }
];

export const DESTINATIONS = [
	{ x: 14, y: 1, icon: "fa-road", name: "NH-44 Highway", km: 6, mins: 10 },
	{ x: 80, y: 4, icon: "fa-mountain-sun", name: "Nandi Hills", km: 22, mins: 35 },
	{ x: 93, y: 42, icon: "fa-plane-departure", name: "Bengaluru Airport", km: 38, mins: 50, stem: 140 },
	{ x: 74, y: 94, icon: "fa-city", name: "Bengaluru City", km: 58, mins: 75 }
];
