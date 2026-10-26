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
export const PLOTS = [
	[1, "north", 43, 15, 10890, "sold", "East"],
	[2, "north", 43, 24, 10890, "available", "East"],
	[3, "north", 48, 15, 12100, "sold", "North"],
	[4, "north", 48, 24, 12100, "reserved", "South"],
	[5, "north", 56, 13, 14520, "sold", "North"],
	[6, "north", 56, 23, 14520, "available", "South"],
	[7, "north", 64, 14, 13068, "sold", "North"],
	[8, "north", 64, 24, 13068, "available", "East"],
	[9, "north", 70, 14, 10890, "sold", "East"],
	[10, "north", 70, 24, 10890, "available", "East"],
	[11, "north", 40.5, 36, 11616, "sold", "West"],
	[12, "north", 47, 36, 12100, "available", "North"],
	[13, "north", 47, 43, 12100, "sold", "South"],
	[14, "north", 55.5, 37, 14520, "reserved", "North"],
	[15, "north", 55.5, 44.5, 14520, "available", "South"],
	[16, "north", 63, 37, 13068, "sold", "East"],
	[17, "north", 63, 44, 13068, "available", "East"],
	[18, "west", 22.5, 43, 21780, "sold", "West"],
	[19, "west", 22.5, 52, 21780, "available", "West"],
	[20, "west", 22.5, 61, 21780, "sold", "West"],
	[21, "west", 29, 47, 17424, "sold", "North"],
	[22, "west", 29, 56, 17424, "available", "East"],
	[23, "west", 29, 63, 17424, "reserved", "South"],
	[24, "west", 36, 49, 16335, "sold", "North"],
	[25, "west", 36, 58, 16335, "available", "East"],
	[26, "west", 36, 65, 16335, "sold", "South"],
	[27, "west", 45, 52, 18150, "available", "North"],
	[28, "west", 45, 60, 18150, "sold", "East"],
	[29, "west", 45, 66.5, 18150, "available", "South"],
	[30, "west", 53.5, 55, 15246, "sold", "River"],
	[31, "west", 53.5, 64, 15246, "reserved", "River"],
	[32, "riverside", 34, 76, 19602, "sold", "North"],
	[33, "riverside", 34, 85, 19602, "available", "South"],
	[34, "riverside", 43.5, 77, 20328, "sold", "North"],
	[35, "riverside", 43.5, 86, 20328, "available", "River"]
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
