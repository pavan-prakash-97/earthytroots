import {
	Fragment,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState
} from "react";
import { DESTINATIONS, FARM, LOCAL_PINS } from "../data/masterplan.js";

const MAP_IMAGE = `${import.meta.env.BASE_URL}images/location-image.jpeg`;
const MAP_WIDTH = 1280;
const MAP_HEIGHT = 720;
const DESTINATION_OFFSET = 1 + LOCAL_PINS.length;

const PIN_DEFS = [
	{
		key: "farm",
		kind: "farm",
		x: FARM.x,
		y: FARM.y,
		icon: "fa-seedling",
		stem: 120,
		label: "AAMRA",
		sub: "You are here"
	}
].concat(
	LOCAL_PINS.map(function (p) {
		return {
			key: `local-${p.name}`,
			kind: "local",
			x: p.x,
			y: p.y,
			icon: p.icon,
			stem: p.stem,
			label: p.name,
			sub: null
		};
	}),
	DESTINATIONS.map(function (d) {
		return {
			key: `destination-${d.name}`,
			kind: "destination",
			x: d.x,
			y: d.y,
			icon: d.icon,
			stem: d.stem || 56,
			label: d.name,
			sub: `${d.km} km · ${d.mins} min`
		};
	})
);

function clamp01(value) {
	return Math.min(1, Math.max(0, value));
}

function easeOutCubic(t) {
	return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t) {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeInOutQuad(t) {
	return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function easeOutBack(t) {
	const c1 = 2;
	const c3 = c1 + 1;
	return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
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

export default function Location3D() {
	const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
	const canHover = useMediaQuery("(hover: hover)");
	const isMobile = useMediaQuery("(max-width: 767px)");
	const isWide = useMediaQuery("(min-width: 1200px)");

	const [rings, setRings] = useState(false);
	const [routed, setRouted] = useState(false);

	const sectionRef = useRef(null);
	const stageRef = useRef(null);
	const introRef = useRef(null);
	/* horizontal drag: lets a phone user slide the map to read every chip */
	const dragRef = useRef({ active: false, startX: 0, x: 0 });

	const applyDrag = function () {
		const stage = stageRef.current;
		if (!stage) return;
		const lift = typeof window !== "undefined" && window.innerWidth <= 900 ? " -7vh" : " 0px";
		stage.style.transform = "translate3d(" + dragRef.current.x.toFixed(1) + "px," + lift + ", 0px)";
	};

	const onDragStart = function (e) {
		if (window.innerWidth > 900) return;
		dragRef.current.active = true;
		dragRef.current.startX = e.clientX - dragRef.current.x;
		if (e.currentTarget.setPointerCapture) {
			try {
				e.currentTarget.setPointerCapture(e.pointerId);
			} catch {
				/* ignore */
			}
		}
	};

	const onDragMove = function (e) {
		const drag = dragRef.current;
		if (!drag.active) return;
		const max = window.innerWidth * 0.18;
		drag.x = Math.max(-max, Math.min(max, e.clientX - drag.startX));
		applyDrag();
	};

	const onDragEnd = function () {
		dragRef.current.active = false;
	};

	/* lift the map on phones even before the first drag */
	useEffect(function () {
		const settle = function () {
			if (window.innerWidth <= 900) {
				applyDrag();
			} else if (stageRef.current) {
				dragRef.current.x = 0;
				stageRef.current.style.transform = "";
			}
		};
		settle();
		window.addEventListener("resize", settle);
		return function () {
			window.removeEventListener("resize", settle);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const panelRef = useRef(null);
	const listRef = useRef(null);
	const groundRefs = useRef([]);
	const pinRefs = useRef([]);
	const stemRefs = useRef([]);
	const innerRefs = useRef([]);
	const baseRefs = useRef([]);
	const flowRefs = useRef([]);

	const layoutDestinations = useCallback(
		function () {
			const reach = isMobile ? 0.6 : isWide ? 1 : 0.85;
			const fx = (FARM.x / 100) * MAP_WIDTH;
			const fy = (FARM.y / 100) * MAP_HEIGHT;

			DESTINATIONS.forEach(function (d, i) {
				const index = DESTINATION_OFFSET + i;
				const x = FARM.x + (d.x - FARM.x) * reach;
				const y = FARM.y + (d.y - FARM.y) * reach;
				const pin = pinRefs.current[index];
				const ground = groundRefs.current[index];
				if (pin) {
					pin.style.left = x + "%";
					pin.style.top = y + "%";
				}
				if (ground) {
					ground.style.left = x + "%";
					ground.style.top = y + "%";
				}

				const tx = (x / 100) * MAP_WIDTH;
				const ty = (y / 100) * MAP_HEIGHT;
				const dx = tx - fx;
				const dy = ty - fy;
				const cx = (fx + tx) / 2 - dy * 0.18;
				const cy = (fy + ty) / 2 + dx * 0.18;
				const path = "M" + fx + " " + fy + " Q" + cx + " " + cy + " " + tx + " " + ty;
				const base = baseRefs.current[i];
				if (base) base.setAttribute("d", path);
				const flow = flowRefs.current[i];
				if (flow) flow.setAttribute("d", path);
			});
		},
		[isMobile, isWide]
	);

	useLayoutEffect(
		function () {
			layoutDestinations();
		},
		[layoutDestinations]
	);

	useLayoutEffect(
		function () {
			const section = sectionRef.current;
			const stage = stageRef.current;
			if (!section || !stage) return undefined;

			const intro = introRef.current;
			const panel = panelRef.current;
			const list = listRef.current;
			const grounds = groundRefs.current;
			const pins = pinRefs.current;
			const stems = stemRefs.current;
			const inners = innerRefs.current;
			const bases = baseRefs.current;

			const clearAnimatedStyles = function () {
				["--s", "--ty", "--rx", "--rz", "--vig", "--radius", "--tx", "--mx", "--my"].forEach(
					function (name) {
						stage.style.removeProperty(name);
					}
				);
				if (intro) {
					intro.style.removeProperty("opacity");
					intro.style.removeProperty("visibility");
					intro.style.removeProperty("transform");
				}
				for (let i = 0; i < PIN_DEFS.length; i += 1) {
					if (grounds[i]) grounds[i].style.removeProperty("opacity");
					if (stems[i]) stems[i].style.removeProperty("transform");
					if (inners[i]) {
						inners[i].style.removeProperty("opacity");
						inners[i].style.removeProperty("transform");
					}
				}
				if (panel) {
					panel.style.removeProperty("opacity");
					panel.style.removeProperty("visibility");
					panel.style.removeProperty("transform");
				}
				if (list) {
					Array.prototype.forEach.call(list.children, function (li) {
						li.style.removeProperty("opacity");
						li.style.removeProperty("visibility");
						li.style.removeProperty("transform");
					});
				}
				bases.forEach(function (base) {
					if (base) base.style.setProperty("stroke-dashoffset", "0");
				});
			};

			if (reduceMotion) {
				clearAnimatedStyles();
				return undefined;
			}

			let rafId = 0;
			let loopId = 0;
			let targetP = 0;
			let easedP = 0;

			const apply = function (progressValue) {
				const p = clamp01(progressValue);

				const stageT = clamp01((p - 0.03) / 0.4);
				const stageEase = easeInOutCubic(stageT);
				const scale = 0.56 + (1.2 - 0.56) * stageEase;
				const ty = 13 + ((isMobile ? 3 : 2) - 13) * stageEase;
				const rx = 56 * stageEase;
				let rz = -14 * stageEase;
				const vig = stageEase;
				const radius = 22 * (1 - stageEase);
				const tx = (isWide ? 9 : 0) * stageEase;
				if (p > 0.43) {
					rz += -6 * clamp01((p - 0.43) / 0.57);
				}
				stage.style.setProperty("--s", scale.toFixed(4));
				stage.style.setProperty("--ty", ty.toFixed(4));
				stage.style.setProperty("--rx", rx.toFixed(4));
				stage.style.setProperty("--rz", rz.toFixed(4));
				stage.style.setProperty("--vig", vig.toFixed(4));
				stage.style.setProperty("--radius", radius.toFixed(4));
				stage.style.setProperty("--tx", tx.toFixed(4));

				if (intro) {
					const introT = clamp01(p / 0.22);
					const introEase = introT * introT;
					const alpha = 1 - introEase;
					intro.style.opacity = String(alpha);
					intro.style.visibility = alpha > 0.001 ? "visible" : "hidden";
					intro.style.transform = `translateY(${(-70 * introEase).toFixed(3)}%)`;
				}

				const applyPin = function (
					index,
					start,
					groundDuration,
					stemStart,
					stemDuration,
					innerStart,
					innerDuration,
					fromY
				) {
					const ground = grounds[index];
					if (ground) {
						const groundT = clamp01((p - start) / groundDuration);
						ground.style.opacity = String(easeOutCubic(groundT));
					}
					const stem = stems[index];
					if (stem) {
						const stemT = clamp01((p - stemStart) / stemDuration);
						stem.style.transform = "scaleY(" + easeOutCubic(stemT).toFixed(4) + ")";
					}
					const inner = inners[index];
					if (inner) {
						const innerT = clamp01((p - innerStart) / innerDuration);
						const eased = easeOutBack(innerT);
						const scaleValue = 0.6 + 0.4 * eased;
						const yValue = (1 - eased) * fromY;
						inner.style.opacity = String(clamp01(innerT));
						inner.style.transform =
							"translate3d(0px, " +
							yValue.toFixed(3) +
							"px, 0px) scale(" +
							scaleValue.toFixed(4) +
							")";
						/* the words follow the chip, so each pin reads one at a time */
						const label = inner.firstElementChild;
						const words = label ? label.lastElementChild : null;
						if (words) {
							const wordsT = clamp01((p - (innerStart + 0.035)) / 0.06);
							words.style.opacity = String(easeOutCubic(wordsT));
							words.style.transform = "translateX(" + ((1 - wordsT) * -10).toFixed(2) + "px)";
						}
					}
				};

				applyPin(0, 0.36, 0.04, 0.37, 0.08, 0.39, 0.08, 30);
				LOCAL_PINS.forEach(function (_, i) {
					const at = 0.47 + i * 0.03;
					applyPin(i + 1, at, 0.03, at, 0.05, at + 0.02, 0.05, 20);
				});

				/* spread the routes over a fixed share of the scroll so every
				   destination is fully drawn, however many there are */
				const destStep = DESTINATIONS.length > 1 ? 0.26 / (DESTINATIONS.length - 1) : 0;
				const destWindow = 0.14;

				DESTINATIONS.forEach(function (_, i) {
					const at = 0.44 + i * destStep;
					const index = DESTINATION_OFFSET + i;
					const base = bases[i];
					if (base) {
						const routeT = clamp01((p - at) / destWindow);
						base.style.strokeDashoffset = String(1 - easeInOutQuad(routeT));
					}
					applyPin(index, at + 0.11, 0.03, at + 0.11, 0.04, at + destWindow, 0.05, 20);
				});

				if (panel) {
					const panelT = clamp01((p - 0.86) / 0.06);
					const panelEase = easeOutCubic(panelT);
					panel.style.opacity = String(panelEase);
					panel.style.visibility = panelEase > 0.001 ? "visible" : "hidden";
					panel.style.transform = `translateY(${((1 - panelEase) * 40).toFixed(3)}px)`;
				}

				if (list) {
					const itemStep = list.children.length > 1 ? 0.09 / (list.children.length - 1) : 0;
					Array.prototype.forEach.call(list.children, function (li, i) {
						const itemT = clamp01((p - (0.87 + i * itemStep)) / 0.035);
						const itemEase = easeOutCubic(itemT);
						li.style.opacity = String(itemEase);
						li.style.visibility = itemEase > 0.001 ? "visible" : "hidden";
						li.style.transform = `translateX(${((1 - itemEase) * -14).toFixed(3)}px)`;
					});
				}

				setRings(p > 0.36);
				setRouted(p > 0.82);
			};

			const update = function () {
				rafId = 0;
				const rect = section.getBoundingClientRect();
				const range = rect.height - window.innerHeight;
				targetP = range > 0 ? clamp01(-rect.top / range) : 0;

				if (reduceMotion) {
					easedP = targetP;
					apply(easedP);
					return;
				}

				/* the stage chases the scroll position over a few frames, so the
				   line draw keeps easing to its final state after the wheel stops */
				if (!loopId) loopId = requestAnimationFrame(tick);
			};

			const tick = function () {
				loopId = 0;
				const delta = targetP - easedP;
				if (Math.abs(delta) < 0.0008) {
					easedP = targetP;
					apply(easedP);
					return;
				}
				easedP += delta * 0.12;
				apply(easedP);
				loopId = requestAnimationFrame(tick);
			};

			const schedule = function () {
				if (!rafId) rafId = requestAnimationFrame(update);
			};

			window.addEventListener("scroll", schedule, { passive: true });
			window.addEventListener("resize", schedule);
			update();

			return function () {
				if (rafId) cancelAnimationFrame(rafId);
				if (loopId) cancelAnimationFrame(loopId);
				window.removeEventListener("scroll", schedule);
				window.removeEventListener("resize", schedule);
			};
		},
		[reduceMotion, isMobile, isWide]
	);

	useEffect(
		function () {
			if (reduceMotion || !canHover) return undefined;
			const section = sectionRef.current;
			const stage = stageRef.current;
			if (!section || !stage) return undefined;

			let targetX = 0;
			let targetY = 0;
			let currentX = 0;
			let currentY = 0;
			let frame = 0;
			let last = 0;

			const tick = function (now) {
				frame = 0;
				if (!last) last = now;
				const dt = Math.min(Math.max((now - last) / 1000, 0), 0.1);
				last = now;
				const k = 1 - Math.exp(-dt / 0.22);
				currentX += (targetX - currentX) * k;
				currentY += (targetY - currentY) * k;
				stage.style.setProperty("--mx", currentX.toFixed(3));
				stage.style.setProperty("--my", currentY.toFixed(3));
				if (
					Math.abs(targetX - currentX) > 0.001 ||
					Math.abs(targetY - currentY) > 0.001
				) {
					frame = requestAnimationFrame(tick);
				} else {
					currentX = targetX;
					currentY = targetY;
					stage.style.setProperty("--mx", currentX.toFixed(3));
					stage.style.setProperty("--my", currentY.toFixed(3));
				}
			};

			const start = function () {
				if (!frame) {
					last = 0;
					frame = requestAnimationFrame(tick);
				}
			};

			const onMove = function (e) {
				const rect = section.getBoundingClientRect();
				const nx = (e.clientX - rect.left) / rect.width - 0.5;
				const ny = (e.clientY - rect.top) / rect.height - 0.5;
				targetX = nx * 7;
				targetY = -ny * 5;
				start();
			};

			const onLeave = function () {
				targetX = 0;
				targetY = 0;
				start();
			};

			section.addEventListener("mousemove", onMove, { passive: true });
			section.addEventListener("mouseleave", onLeave);

			return function () {
				if (frame) cancelAnimationFrame(frame);
				section.removeEventListener("mousemove", onMove);
				section.removeEventListener("mouseleave", onLeave);
				stage.style.setProperty("--mx", "0");
				stage.style.setProperty("--my", "0");
			};
		},
		[reduceMotion, canHover]
	);


	const sectionClass =
		"location-3d" +
		(reduceMotion ? " is-static" : "") +
		(reduceMotion || rings ? " is-rings" : "") +
		(reduceMotion || routed ? " is-routed" : "");

	const sectionStyle = reduceMotion
		? undefined
		: { height: isMobile ? "420vh" : "540vh" };
	const pinStyle = reduceMotion ? undefined : { position: "sticky", top: 0 };

	return (
		<div className={sectionClass} id="location" ref={sectionRef} style={sectionStyle}>
			<div className="location-3d-pin" style={pinStyle}>
				<div className="location-3d-intro" ref={introRef}>
					<span className="location-3d-eyebrow">Location</span>
					<h2>
						Rooted Where <em>The River Bends.</em>
					</h2>
					<p>Scroll to explore the land and its surroundings</p>
					<span className="location-3d-scroll" aria-hidden="true">
						<i></i>
					</span>
				</div>

				<div
						className="location-3d-stage"
						ref={stageRef}
						onPointerDown={onDragStart}
						onPointerMove={onDragMove}
						onPointerUp={onDragEnd}
						onPointerCancel={onDragEnd}
					>
					<div className="location-3d-scene">
						<div className="location-3d-plane">
							<img
								style={{ marginTop: "30px" }}
								className="location-3d-map"
								src={MAP_IMAGE}
								alt=""
							/>
							<span className="location-3d-sheen"></span>
							<span className="location-3d-vignette"></span>
							<svg
								className="location-3d-routes"
								viewBox="0 0 1280 720"
								preserveAspectRatio="none"
							>
								{DESTINATIONS.map(function (d, i) {
									return (
										<Fragment key={`route-${d.name}`}>
											<path
												ref={function (el) {
													baseRefs.current[i] = el;
												}}
												className="route-base"
												pathLength="1"
												style={{
													strokeDasharray: "1",
													strokeDashoffset: reduceMotion ? "0" : "1"
												}}
											/>
											<path
												ref={function (el) {
													flowRefs.current[i] = el;
												}}
												className="route-flow"
											/>
										</Fragment>
									);
								})}
							</svg>
							<div className="location-3d-rings">
								<span></span>
								<span></span>
								<span></span>
							</div>
							<div className="location-3d-clouds">
								<span className="cloud c1"></span>
								<span className="cloud c2"></span>
								<span className="cloud c3"></span>
								<span className="cloud-shadow c1"></span>
								<span className="cloud-shadow c2"></span>
								<span className="cloud-shadow c3"></span>
							</div>
							<div className="location-3d-pins">
								{PIN_DEFS.map(function (pin, index) {
									return (
										<Fragment key={pin.key}>
											<span
												ref={function (el) {
													groundRefs.current[index] = el;
												}}
												className="loc-ground"
												style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
											></span>
											<div
												ref={function (el) {
													pinRefs.current[index] = el;
												}}
												className={`loc-pin is-${pin.kind}`}
												style={{
													left: `${pin.x}%`,
													top: `${pin.y}%`,
													"--stem": `${pin.stem}px`
												}}
											>
												<div
													ref={function (el) {
														innerRefs.current[index] = el;
													}}
													className="loc-pin-inner"
												>
													<span className="loc-pin-label">
														<i className={`fa-solid ${pin.icon}`}></i>
														<span>
															<b>{pin.label}</b>
															{pin.sub ? <small>{pin.sub}</small> : null}
														</span>
													</span>
													<span
														ref={function (el) {
															stemRefs.current[index] = el;
														}}
														className="loc-pin-stem"
													></span>
													<span className="loc-pin-dot"></span>
												</div>
											</div>
										</Fragment>
									);
								})}
							</div>
						</div>
					</div>
				</div>

				<div className="location-3d-panel" ref={panelRef}>
					<span className="location-3d-eyebrow">Getting Here</span>
					<h3>
						Close To The City, <br /> Far From The Noise.
					</h3>
					<ul className="location-3d-list" ref={listRef}>
						{DESTINATIONS.map(function (d) {
							return (
								<li key={d.name}>
									<i className={`fa-solid ${d.icon}`}></i>
									<span>{d.name}</span>
									<b>
										{d.km} km <small>{d.mins} min</small>
									</b>
								</li>
							);
						})}
					</ul>
					<a href="/contact" className="btn-default btn-highlighted">
						Plan a Site Visit
					</a>
				</div>
			</div>
		</div>
	);
}
