import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState
} from "react";
import {
	AMENITIES,
	CLUSTERS,
	PLOTS,
	STATUS_LABEL
} from "../data/masterplan.js";

const MAP_IMAGE = `${import.meta.env.BASE_URL}images/masterplan-127-clean.jpeg`;

const FILTERS = [
	{ cluster: "all", label: "All" },
	{ cluster: "north", label: CLUSTERS.north },
	{ cluster: "west", label: CLUSTERS.west },
	{ cluster: "riverside", label: CLUSTERS.riverside }
];

function formatSqft(n) {
	return n ? n.toLocaleString("en-IN") + " sq.ft" : "On request";
}

function useMediaQuery(query) {
	const [matches, setMatches] = useState(function () {
		if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
			return false;
		}
		return window.matchMedia(query).matches;
	});

	useEffect(function () {
		if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
			return undefined;
		}
		const mql = window.matchMedia(query);
		const onChange = function () {
			setMatches(mql.matches);
		};
		setMatches(mql.matches);
		if (typeof mql.addEventListener === "function") {
			mql.addEventListener("change", onChange);
			return function () {
				mql.removeEventListener("change", onChange);
			};
		}
		mql.addListener(onChange);
		return function () {
			mql.removeListener(onChange);
		};
	}, [query]);

	return matches;
}

export default function Masterplan() {
	const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
	const canHover = useMediaQuery("(hover: hover)");

	const [activeCluster, setActiveCluster] = useState("all");
	const [active, setActive] = useState(null);
	const [tooltipVisible, setTooltipVisible] = useState(false);
	const [tooltipPos, setTooltipPos] = useState({ left: 0, top: 0 });
	const [expanded, setExpanded] = useState(false);
	const [isIn, setIsIn] = useState(false);
	const [remaining, setRemaining] = useState(0);
	const [progress, setProgress] = useState(0);

	/* the map opens with a video fly-over; the illustrated plan (and its plot
	   markers) only appear once that clip has finished */
	const videoRef = useRef(null);
	const videoStartedRef = useRef(false);
	const reduceMotionQuery = useMediaQuery("(prefers-reduced-motion: reduce)");
	const [videoDone, setVideoDone] = useState(false);
	const [planShown, setPlanShown] = useState(false);

	const mapRef = useRef(null);
	const markersRef = useRef(null);
	const tooltipRef = useRef(null);
	const expandBtnRef = useRef(null);
	const activeMarkerElRef = useRef(null);
	const activeRef = useRef(null);
	const activeClusterRef = useRef("all");
	const expandedRef = useRef(false);
	const countRafRef = useRef(0);
	const remainingRef = useRef(0);
	const countedRef = useRef(false);

	const stats = useMemo(function () {
		const list =
			activeCluster === "all"
				? PLOTS
				: PLOTS.filter(function (p) {
						return p[1] === activeCluster;
					});
		const available = list.filter(function (p) {
			return p[5] === "available";
		}).length;
		return { available: available, total: list.length };
	}, [activeCluster]);

	const animateCount = useCallback(
		function (to) {
			const from = remainingRef.current || 0;
			cancelAnimationFrame(countRafRef.current);
			if (
				reduceMotion ||
				typeof window === "undefined" ||
				typeof window.requestAnimationFrame !== "function"
			) {
				remainingRef.current = to;
				setRemaining(to);
				return;
			}
			let start = null;
			const step = function (t) {
				if (!start) start = t;
				let k = Math.min((t - start) / 900, 1);
				k = 1 - Math.pow(1 - k, 3);
				const value = Math.round(from + (to - from) * k);
				remainingRef.current = value;
				setRemaining(value);
				if (k < 1) {
					countRafRef.current = requestAnimationFrame(step);
				}
			};
			countRafRef.current = requestAnimationFrame(step);
		},
		[reduceMotion]
	);

	const syncStats = useCallback(
		function (cluster) {
			const list = PLOTS.filter(function (p) {
				return cluster === "all" || p[1] === cluster;
			});
			const available = list.filter(function (p) {
				return p[5] === "available";
			}).length;
			setProgress(list.length ? (available / list.length) * 100 : 0);
			animateCount(available);
		},
		[animateCount]
	);

	const hideTooltip = useCallback(function () {
		activeMarkerElRef.current = null;
		activeRef.current = null;
		setActive(null);
		setTooltipVisible(false);
	}, []);

	const showTooltip = useCallback(function (marker, element) {
		activeMarkerElRef.current = element;
		activeRef.current = marker;
		setActive(marker);
	}, []);

	const setExpandedMode = useCallback(
		function (on) {
			hideTooltip();
			expandedRef.current = on;
			setExpanded(on);
			const btn = expandBtnRef.current;
			if (btn) {
				btn.focus({ preventScroll: true });
			}
		},
		[hideTooltip]
	);

	const handleFilter = useCallback(
		function (cluster) {
			activeClusterRef.current = cluster;
			setActiveCluster(cluster);
			hideTooltip();
			syncStats(cluster);
		},
		[hideTooltip, syncStats]
	);

	useEffect(function () {
		return function () {
			cancelAnimationFrame(countRafRef.current);
		};
	}, []);

	useEffect(
		function () {
			document.body.classList.toggle("masterplan-lock", expanded);
			return function () {
				document.body.classList.remove("masterplan-lock");
			};
		},
		[expanded]
	);

	useEffect(
		function () {
			const onKeyDown = function (e) {
				if (e.key !== "Escape") return;
				if (expandedRef.current) setExpandedMode(false);
				else if (activeRef.current) hideTooltip();
			};
			document.addEventListener("keydown", onKeyDown);
			return function () {
				document.removeEventListener("keydown", onKeyDown);
			};
		},
		[hideTooltip, setExpandedMode]
	);

	useEffect(
		function () {
			const onDocumentClick = function (e) {
				if (!activeRef.current) return;
				const target = e.target;
				if (markersRef.current && markersRef.current.contains(target)) return;
				if (tooltipRef.current && tooltipRef.current.contains(target)) return;
				hideTooltip();
			};
			document.addEventListener("click", onDocumentClick);
			return function () {
				document.removeEventListener("click", onDocumentClick);
			};
		},
		[hideTooltip]
	);

	useEffect(
		function () {
			const onResize = function () {
				hideTooltip();
			};
			window.addEventListener("resize", onResize);
			return function () {
				window.removeEventListener("resize", onResize);
			};
		},
		[hideTooltip]
	);

	useLayoutEffect(
		function () {
			if (!active) return;
			const map = mapRef.current;
			const tooltip = tooltipRef.current;
			const marker = activeMarkerElRef.current;
			if (!map || !tooltip || !marker) return;

			const mapRect = map.getBoundingClientRect();
			const markerRect = marker.getBoundingClientRect();
			const cx = markerRect.left + markerRect.width / 2 - mapRect.left;
			const cy = markerRect.top + markerRect.height / 2 - mapRect.top;
			const tw = tooltip.offsetWidth;
			const th = tooltip.offsetHeight;
			const gap = 18;
			const pad = 10;
			let left = Math.min(Math.max(cx - tw / 2, pad), mapRect.width - tw - pad);
			let top = cy - th - gap;
			if (top < pad) top = cy + gap;
			if (top + th > mapRect.height - pad) {
				top = Math.min(Math.max(cy - th / 2, pad), mapRect.height - th - pad);
				left = cx + gap + tw < mapRect.width - pad ? cx + gap : cx - gap - tw;
				left = Math.max(pad, left);
			}
			setTooltipPos({ left: left, top: top });
			setTooltipVisible(true);
		},
		[active]
	);

	useEffect(
		function () {
			const map = mapRef.current;
			if (!map) return undefined;

			const reveal = function () {
				setIsIn(true);
				if (!countedRef.current) {
					countedRef.current = true;
					syncStats(activeClusterRef.current);
				}
			};

			if (typeof window !== "undefined" && "IntersectionObserver" in window) {
				const io = new IntersectionObserver(
					function (entries) {
						if (entries[0] && entries[0].isIntersecting) {
							reveal();
							io.disconnect();
						}
					},
					{ threshold: 0.35 }
				);
				io.observe(map);
				return function () {
					io.disconnect();
				};
			}

			reveal();
			return undefined;
		},
		[syncStats]
	);

	/* play the fly-over the first time the map is on screen; any failure
	   (autoplay blocked, missing file, reduced motion) falls straight through
	   to the illustrated plan */
	useEffect(
		function () {
			if (!isIn || videoStartedRef.current) return;
			videoStartedRef.current = true;
			const video = videoRef.current;
			if (!video || reduceMotionQuery) {
				setVideoDone(true);
				return;
			}
			/* fly-over runs at 1.5x so the plan arrives sooner */
			video.defaultPlaybackRate = 4;
			video.playbackRate = 4;
			const played = video.play();
			if (played && typeof played.catch === "function") {
				played.catch(function () {
					setVideoDone(true);
				});
			}
		},
		[isIn, reduceMotionQuery]
	);

	/* hold the plot markers back until the video has faded into the plan, so the
	   numbers settle in on top of the illustration rather than mid-dissolve */
	useEffect(
		function () {
			if (reduceMotionQuery) {
				setPlanShown(true);
				return undefined;
			}
			if (!videoDone) return undefined;
			const timer = window.setTimeout(function () {
				setPlanShown(true);
			}, 700);
			return function () {
				window.clearTimeout(timer);
			};
		},
		[videoDone, reduceMotionQuery]
	);

	const handleMarkerEnter = function (e, marker) {
		if (!canHover) return;
		showTooltip(marker, e.currentTarget);
	};

	const handleMarkerClick = function (e, marker) {
		const same =
			activeRef.current &&
			activeRef.current.type === marker.type &&
			activeRef.current.index === marker.index;
		if (same && !canHover) {
			hideTooltip();
		} else {
			showTooltip(marker, e.currentTarget);
		}
	};

	const handleMarkerFocus = function (e, marker) {
		if (e.currentTarget.matches(":focus-visible")) {
			showTooltip(marker, e.currentTarget);
		}
	};

	const handleMapLeave = function () {
		if (canHover) hideTooltip();
	};

	const handleBoxClick = function (e) {
		if (e.target === e.currentTarget) setExpandedMode(false);
	};

	let tooltipContent = null;
	if (active && active.type === "plot") {
		const p = PLOTS[active.index];
		tooltipContent = (
			<>
				<div className="masterplan-tooltip-head">
					<h4>Plot {p[0]}</h4>
					<span className="masterplan-tooltip-status">
						<span className={`dot is-${p[5]}`}></span>
						{STATUS_LABEL[p[5]]}
					</span>
				</div>
				<ul>
					<li>
						<span>Size</span>
						<span>{p[4] ? formatSqft(p[4]) : "On request"}</span>
					</li>
					<li>
						<span>Guntas</span>
						<span>{p[6] != null ? p[6].toFixed(2) + " guntas" : "On request"}</span>
					</li>
				</ul>
				{p[5] !== "sold" && (
					<a href={`/contact?plot=${p[0]}`}>
						Enquire about this plot{" "}
						<i className="fa-solid fa-arrow-right"></i>
					</a>
				)}
			</>
		);
	} else if (active && active.type === "amenity") {
		const a = AMENITIES[active.index];
		tooltipContent = (
			<>
				<div className="masterplan-tooltip-head">
					<h4>{a.name}</h4>
				</div>
				<p>{a.text}</p>
			</>
		);
	}

	return (
		<div className="masterplan" id="masterplan">
			<div className="container">
				<div className="row align-items-center">
					<div className="col-xl-5">
						<div className="masterplan-content">
							<div className="section-title">
									<span className="section-sub-title">
										The Living Masterplan
									</span>
									<h2 className="masterplan-title">
										The Whole Land.
										<br />
										<em>Every Plot.</em>
									</h2>

								<p
									className="wow fadeInUp"
									data-wow-delay="0.2s"
								>
									A conceptual layout of the estate - three plot clusters
									woven around tree-lined pathways, a riverside clubhouse and
									a stream along the eastern edge. Trace any plot to see its
									size and availability.
								</p>
							</div>

							<div
								className="masterplan-availability wow fadeInUp"
								data-wow-delay="0.3s"
							>
								<div className="masterplan-progress">
									<span
										className="masterplan-progress-bar"
										style={{ width: `${progress}%` }}
									></span>
								</div>
								<p className="masterplan-remaining">
									<span className="masterplan-remaining-count">{remaining}</span>{" "}
									of <span className="masterplan-total-count">{stats.total}</span>{" "}
									farm plots remain
								</p>
								<ul className="masterplan-legend">
									<li>
										<span className="dot is-available"></span>Available
									</li>
									<li>
										<span className="dot is-reserved"></span>Reserved
									</li>
									<li>
										<span className="dot is-sold"></span>Sold
									</li>
								</ul>
							</div>

							<div className="masterplan-filter wow fadeInUp" data-wow-delay="0.4s">
								<h3>Filter by cluster</h3>
								<div
									className="masterplan-filter-list"
									role="group"
									aria-label="Filter plots by cluster"
								>
									{FILTERS.map(function (filter) {
										return (
											<button
												key={filter.cluster}
												type="button"
												className={
													activeCluster === filter.cluster
														? "is-active"
														: undefined
												}
												data-cluster={filter.cluster}
												onClick={function () {
													handleFilter(filter.cluster);
												}}
											>
												{filter.label}
											</button>
										);
									})}
								</div>
							</div>
						</div>
					</div>

					<div className="col-xl-7">
						<div
							className={
								"masterplan-map-box" + (expanded ? " is-expanded" : "")
							}
							onClick={handleBoxClick}
						>
							<div className="masterplan-map-header">
								<span>EarthyRoots Farm &middot; Conceptual Layout</span>
								<button
									ref={expandBtnRef}
									type="button"
									className="masterplan-expand"
									aria-label={expanded ? "Close expanded map" : "Expand map"}
									onClick={function () {
										setExpandedMode(!expandedRef.current);
									}}
								>
									<i
										className={
											expanded
												? "fa-solid fa-xmark"
												: "fa-solid fa-expand"
										}
									></i>
									<span>{expanded ? "Close" : "Expand"}</span>
								</button>
							</div>

							<div
								ref={mapRef}
								className={
									"masterplan-map" +
									(isIn && planShown ? " is-in" : "") +
									(videoDone || reduceMotionQuery ? " is-plan-visible" : "") +
									(active ? " has-focus" : "")
								}
								onMouseLeave={handleMapLeave}
							>
								<img
									src={MAP_IMAGE}
									alt="Illustrated aerial masterplan of EarthyRoots Farm plots"
								/>
								<video
									ref={videoRef}
									className={
										"masterplan-video" +
										(videoDone || reduceMotionQuery ? " is-done" : "")
									}
									src={`${import.meta.env.BASE_URL}images/added/map-video.mp4`}
									poster={MAP_IMAGE}
									muted
									playsInline
									preload="metadata"
									onLoadedMetadata={function (e) {
										/* some browsers reset the rate when metadata lands */
										e.currentTarget.playbackRate = 4;
									}}
									aria-hidden="true"
									onEnded={function () {
										setVideoDone(true);
									}}
									onError={function () {
										setVideoDone(true);
									}}
								/>
								<div className="mp-clouds" aria-hidden="true">
									<span className="cloud c1"></span>
									<span className="cloud c2"></span>
									<span className="cloud c3"></span>
									<span className="cloud-shadow c1"></span>
									<span className="cloud-shadow c2"></span>
									<span className="cloud-shadow c3"></span>
								</div>
								<div ref={markersRef} className="masterplan-markers">
									{PLOTS.map(function (p, i) {
										const marker = { type: "plot", index: i };
										const isCurrent =
											active &&
											active.type === "plot" &&
											active.index === i;
										const dimmed =
											activeCluster !== "all" && p[1] !== activeCluster;
										return (
											<button
												key={`plot-${p[0]}`}
												type="button"
												className={
													`plot-marker is-${p[5]}` +
													(dimmed ? " is-dimmed" : "") +
													(isCurrent ? " is-current" : "")
												}
												style={{
													left: `${p[2]}%`,
													top: `${p[3]}%`,
													"--i": i
												}}
												data-cluster={p[1]}
												aria-label={`Plot ${p[0]}, ${STATUS_LABEL[p[5]]}, ${formatSqft(p[4])}`}
												onMouseEnter={function (e) {
													handleMarkerEnter(e, marker);
												}}
												onClick={function (e) {
													handleMarkerClick(e, marker);
												}}
												onFocus={function (e) {
													handleMarkerFocus(e, marker);
												}}
											>
												{p[0]}
											</button>
										);
									})}
									{AMENITIES.map(function (a, i) {
										const marker = { type: "amenity", index: i };
										const isCurrent =
											active &&
											active.type === "amenity" &&
											active.index === i;
										const dimmed = activeCluster !== "all";
										return (
											<button
												key={`amenity-${a.name}`}
												type="button"
												className={
													"plot-marker is-amenity" +
													(dimmed ? " is-dimmed" : "") +
													(isCurrent ? " is-current" : "")
												}
												style={{
													left: `${a.x}%`,
													top: `${a.y}%`,
													"--i": PLOTS.length + i
												}}
												aria-label={a.name}
												onMouseEnter={function (e) {
													handleMarkerEnter(e, marker);
												}}
												onClick={function (e) {
													handleMarkerClick(e, marker);
												}}
												onFocus={function (e) {
													handleMarkerFocus(e, marker);
												}}
											>
												<i className={`fa-solid ${a.icon}`}></i>
											</button>
										);
									})}
								</div>
								<div
									ref={tooltipRef}
									className={
										"masterplan-tooltip" +
										(tooltipVisible ? " is-visible" : "")
									}
									role="status"
									aria-live="polite"
									style={{ left: tooltipPos.left, top: tooltipPos.top }}
								>
									{tooltipContent}
								</div>
							</div>

							<p className="masterplan-hint">
								Hover or tap a marker to see plot details
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
