import React from "react";
import {
	AbsoluteFill,
	Audio,
	Easing,
	interpolate,
	Sequence,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const DURATION = 900;
const NAVY = "#101B2A";
const NAVY_LIGHT = "#1B2B3F";
const NAVY_ALT = "#162437";
const PANEL = "#203249";
const BLUE = "#36A9FF";
const ORANGE = "#F28C28";
const INK = "#172334";
const MUTED = "#A7B5C6";
const WHITE = "#F7F9FC";
const smooth = {
	easing: Easing.bezier(0.22, 1, 0.36, 1),
	extrapolateLeft: "clamp" as const,
	extrapolateRight: "clamp" as const,
};

const SceneFrame: React.FC<{
	background: string;
	frameCount: number;
	sceneIndex: number;
	fadeOut?: boolean;
	children: React.ReactNode;
}> = ({ background, frameCount, sceneIndex, fadeOut = true, children }) => {
	const frame = useCurrentFrame();
	const entrance = interpolate(frame, [0, 16], [0, 1], smooth);
	const exit = fadeOut ? interpolate(frame, [frameCount - 16, frameCount], [1, 0], smooth) : 1;
	const direction = sceneIndex % 2 === 0 ? 1 : -1;
	const entranceX = interpolate(frame, [0, 16], [direction * 72, 0], smooth);
	const exitX = fadeOut ? interpolate(frame, [frameCount - 16, frameCount], [0, direction * -56], smooth) : 0;
	const cameraZoom = interpolate(frame, [0, frameCount - 1], [0, 0.035], smooth);
	const cameraX = Math.sin(frame / 54 + sceneIndex) * 7;
	const cameraY = Math.cos(frame / 68 + sceneIndex) * 4;
	return (
		<AbsoluteFill style={{ overflow: "hidden" }}>
			<AbsoluteFill
				style={{
					background: `linear-gradient(180deg, ${background} 0%, #111E2D 56%, #0A111B 100%)`,
					opacity: entrance * exit,
					transform: `translate3d(${entranceX + exitX + cameraX}px, ${cameraY}px, 0) scale(${1.025 - entrance * 0.025 + cameraZoom})`,
					transformOrigin: "center",
				}}
			>
				<div
					style={{
						position: "absolute",
						inset: 0,
						opacity: 0.2,
						pointerEvents: "none",
					}}
				>
					<svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" height="100%" aria-hidden="true">
						<path d="M0 1130L175 1020H905L1080 1130V1460H0Z" fill="#17283A" opacity=".24" />
						<path d="M75 1125L230 1038H850L1005 1125M180 1038V1320M385 1038V1320M695 1038V1320M900 1038V1320" fill="none" stroke="#91A8BE" strokeOpacity=".12" strokeWidth="8" />
						<path d="M0 1460H1080M0 1745H1080" stroke="#A8BBD0" strokeOpacity=".12" strokeWidth="4" />
						{[0, 1, 2, 3].map((index) => (
							<g key={index} opacity=".2">
								<rect x={250 + index * 190} y="1065" width="118" height="120" rx="4" fill="#A8C6DF" />
								<path d={`M${309 + index * 190} 1065V1185M${250 + index * 190} 1125H${368 + index * 190}`} stroke="#24364B" strokeWidth="5" />
							</g>
						))}
					</svg>
				</div>
				{children}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const BrandBar: React.FC<{ light: boolean; chapter: string; number: string; frame: number }> = ({
	light,
	chapter,
	number,
	frame,
}) => {
	const progress = interpolate(frame, [0, 15], [0, 1], smooth);

	return (
		<div
			style={{
				position: "absolute",
				top: 72,
				left: 70,
				right: 70,
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				color: light ? WHITE : INK,
				opacity: progress,
				transform: `translateY(${(1 - progress) * -16}px)`,
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: 16 }}>
				<div style={{ width: 42, height: 6, borderRadius: 4, backgroundColor: ORANGE, transform: `scaleX(${progress})`, transformOrigin: "left" }} />
				<span style={{ fontSize: 17, fontWeight: 800, letterSpacing: 3 }}>ORION / TOYOTA WAY</span>
			</div>
			<span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2, opacity: 0.7 }}>
				{number} / 04
			</span>
			<span style={{ position: "absolute", top: 43, left: 58, fontSize: 13, fontWeight: 700, letterSpacing: 2, opacity: 0.64 }}>
				{chapter}
			</span>
		</div>
	);
};

const KineticLines: React.FC<{
	lines: string[];
	frame: number;
	color: string;
	accentLast?: boolean;
	fontSize: number;
	lineHeight?: number;
	revealPerLine?: boolean;
}> = ({ lines, frame, color, accentLast = false, fontSize, lineHeight = 0.98, revealPerLine = false }) => {
	const { fps } = useVideoConfig();

	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
			{lines.map((line, index) => {
				const words = line.split(" ");
				return (
					<div key={line} style={{ display: "flex", columnGap: fontSize * 0.18, whiteSpace: "nowrap" }}>
						{words.map((word, wordIndex) => {
							const progress = spring({
								frame: frame - index * 8 - (revealPerLine ? 0 : wordIndex * 5),
								fps,
								config: { damping: 19, mass: 0.7, stiffness: 88 },
							});
							const reveal = Math.max(0, Math.min(1, progress));
							const drift = Math.sin(frame / 38 + index * 0.7 + wordIndex * 0.4) * 2;
							return (
								<span
									key={`${word}-${wordIndex}`}
									style={{
										display: "inline-block",
										color: accentLast && index === lines.length - 1 ? ORANGE : color,
										fontSize,
										fontWeight: 900,
										lineHeight,
										letterSpacing: -fontSize * 0.055,
										opacity: reveal,
										transform: `translate3d(${(1 - reveal) * (index % 2 === 0 ? -54 : 54) + drift}px, ${(1 - reveal) * 22}px, 0) scale(${0.9 + reveal * 0.1})`,
									}}
								>
									{word}
								</span>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

const KineticCaption: React.FC<{
	frame: number;
	color: string;
	fontSize?: number;
	children: React.ReactNode;
}> = ({ frame, color, fontSize = 36, children }) => {
	const progress = spring({
		frame: frame - 14,
		fps: FPS,
		config: { damping: 20, stiffness: 76 },
	});
	const reveal = Math.max(0, Math.min(1, progress));
	const words = typeof children === "string" ? children.trim().split(/\s+/) : null;

	return (
		<div
			style={{
				marginTop: 28,
				maxWidth: 790,
				color,
				fontSize,
				lineHeight: 1.35,
				fontWeight: 500,
				opacity: reveal,
				transform: `translateY(${(1 - reveal) * 20}px)`,
				display: "flex",
				flexWrap: "wrap",
				columnGap: 9,
				rowGap: 0,
			}}
		>
			{words
				? words.map((word, index) => {
					const wordProgress = spring({
						frame: frame - 14 - index * 2,
						fps: FPS,
						config: { damping: 20, stiffness: 76 },
					});
					const wordReveal = Math.max(0, Math.min(1, wordProgress));
					return (
						<span
							key={`${word}-${index}`}
							style={{
								display: "inline-block",
								opacity: wordReveal,
								transform: `translateY(${(1 - wordReveal) * 14}px) scale(${0.94 + wordReveal * 0.06})`,
							}}
						>
							{word}
						</span>
					);
				})
				: children}
		</div>
	);
};

const SceneProgress: React.FC<{ frame: number }> = ({ frame }) => (
	<div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, backgroundColor: "#FFFFFF24" }}>
		<div
			style={{
				height: "100%",
				width: `${interpolate(frame, [0, DURATION - 1], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`,
				backgroundColor: ORANGE,
			}}
		/>
	</div>
);

const Worker: React.FC<{
	x: number;
	y: number;
	frame: number;
	scale?: number;
	accent?: string;
	activity?: "assembly" | "inspection" | "teamwork";
}> = ({ x, y, frame, scale = 1, accent = ORANGE, activity }) => {
	const bob = Math.sin(frame / 8) * 2;
	const armSwing = activity === "inspection" ? 0 : Math.sin(frame / 12) * 5;
	const inspecting = activity === "inspection";
	const assembling = activity === "assembly";
	const leftArm = inspecting
		? "M31 85L14 103L-30 131"
		: assembling
			? "M31 85L18 104L25 131"
			: activity === "teamwork"
				? "M31 85L14 103L-4 122"
				: "M31 85L17 104L10 139";
	const leftHandX = inspecting ? -34 : assembling ? 25 : activity === "teamwork" ? -8 : 10;
	const leftHandY = inspecting ? 135 : assembling ? 135 : activity === "teamwork" ? 126 : 143;

	return (
		<g transform={`translate(${x} ${y}) scale(${scale})`}>
			<ellipse cx="60" cy="266" rx="54" ry="12" fill="#050A11" opacity=".38" />
			<g transform={`translate(0 ${bob})`}>
				<path d="M33 76L57 66L83 76L91 151L76 163H42L26 151Z" fill="#DCE5EE" stroke="#8498AD" strokeWidth="4" />
				<path d="M31 104H86L89 119H28Z" fill={accent} />
				<path d="M37 157L57 158L53 225L37 225Z" fill="#42566E" />
				<path d="M62 158L81 154L91 224L73 227Z" fill="#34485F" />
				<path d="M36 222L55 222L54 241H29Q25 233 36 222ZM73 222L91 220L101 239H74Z" fill="#202E3E" />
				<path d={leftArm} fill="none" stroke="#DCE5EE" strokeWidth="16" strokeLinecap="round" />
				<path d={`M83 84L101 104L${108 + armSwing} 132`} fill="none" stroke="#DCE5EE" strokeWidth="16" strokeLinecap="round" />
				<circle cx={leftHandX} cy={leftHandY} r="9" fill="#D5A27D" />
				<circle cx={108 + armSwing} cy="136" r="9" fill="#D5A27D" />
				{inspecting && (
					<g transform="translate(-39 130) rotate(-90)">
						<rect x="-10" y="-15" width="20" height="31" rx="5" fill="#26394F" stroke={WHITE} strokeWidth="3" />
						<circle cx="0" cy="-19" r="6" fill={BLUE} stroke={ORANGE} strokeWidth="2" />
					</g>
				)}
				{assembling && (
					<g transform="translate(25 135) rotate(24)">
						<rect x="-4" y="-19" width="8" height="28" rx="3" fill={ORANGE} />
						<path d="M-9 -19H9L5 -25H-5Z" fill="#F7B453" />
					</g>
				)}
				<path d="M45 73Q59 65 74 73L70 85H49Z" fill="#D5A27D" />
				<circle cx="60" cy="48" r="25" fill="#D5A27D" />
				<path d="M35 44Q38 16 61 19Q83 20 85 45L77 38L42 39Z" fill="#263547" />
				<path d="M30 37Q59 7 89 37L85 44H34Z" fill={accent} stroke="#F7B453" strokeWidth="3" />
				<path d="M30 40H87" stroke="#F7B453" strokeWidth="5" />
			</g>
		</g>
	);
};

const OpeningScene: React.FC = () => {
	const frame = useCurrentFrame();
	const carX = interpolate(frame, [0, 42, 94, 108, 158, 174, 280, 306], [105, 235, 235, 540, 540, 835, 1010, 1070], smooth);
	const activeStation = frame < 108 ? 0 : frame < 174 ? 1 : 2;
	const beltFrame = frame < 42 ? frame : frame < 108 ? 42 : frame < 158 ? frame - 66 : frame < 174 ? 92 : frame - 82;
	const beltOffset = -beltFrame * 2.5;
	const draw = interpolate(frame, [18, 55], [0, 1], smooth);
	const flowX = interpolate(frame, [0, 42, 94, 108, 158, 174, 280, 306], [115, 225, 225, 540, 540, 855, 855, 855], smooth);

	return (
		<SceneFrame background={NAVY} frameCount={307} sceneIndex={0}>
			<BrandBar light chapter="FILOSOFI DI BALIK KEUNGGULAN" number="01" frame={frame} />
			<div style={{ position: "absolute", left: 72, top: 270, right: 72 }}>
				<KineticLines lines={["TOYOTA WAY"]} frame={frame} color={WHITE} fontSize={104} />
				<div
					style={{
						width: 102,
						height: 7,
						marginTop: 32,
						backgroundColor: ORANGE,
						transform: `scaleX(${interpolate(frame, [15, 42], [0, 1], smooth)})`,
						transformOrigin: "left",
					}}
				/>
				<KineticCaption frame={frame} color="#D8E5F2">
					Keunggulan dimulai dari cara berpikir, setiap hari.
				</KineticCaption>
			</div>

			<svg
				viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
				style={{
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					transform: `translate(${Math.sin(frame / 45) * 5}px, ${-330 - draw * 10}px) scale(${1.14 + draw * 0.012})`,
					transformOrigin: "center",
				}}
				aria-hidden="true"
			>
				<path d="M105 1552H975" stroke="#536A82" strokeWidth="38" strokeLinecap="round" />
				<path d="M117 1552H963" stroke={BLUE} strokeWidth="5" strokeDasharray="14 28" strokeDashoffset={beltOffset} />
				<path d="M135 1570V1642M945 1570V1642" stroke="#71859A" strokeWidth="12" strokeLinecap="round" />
				{[0, 1, 2].map((index) => {
					const x = 225 + index * 315;
					const enter = spring({
						frame: frame - 17 - index * 9,
						fps: FPS,
						config: { damping: 18, stiffness: 92 },
					});
					const active = activeStation === index;
					return (
						<g key={index} opacity={enter} transform={`translate(0 ${(1 - enter) * 22})`}>
							<rect x={x - 116} y="1155" width="232" height="286" rx="14" fill="#142438" stroke={active ? ORANGE : "#50647A"} strokeWidth={active ? "4" : "2"} />
							<circle cx={x - 84} cy="1196" r="18" fill={active ? ORANGE : "#41566C"} />
							<text x={x - 84} y="1202" textAnchor="middle" fill={WHITE} fontSize="16" fontWeight="900">{index + 1}</text>
							<text x={x + 8} y="1202" textAnchor="middle" fill={active ? WHITE : MUTED} fontSize="21" fontWeight="900" letterSpacing="1">
								{["RAKIT", "PERIKSA", "KIRIM"][index]}
							</text>
							<path d={`M${x - 83} 1240H${x + 83}`} stroke={active ? ORANGE : "#50647A"} strokeWidth="3" />
							<path d={`M${x - 76} 1438V1385H${x + 76}V1438`} fill="#24384E" stroke="#71859A" strokeWidth="4" />
							<Worker
								x={x - 38}
								y={1223}
								frame={frame + index * 7}
								scale={0.9}
								accent={active ? ORANGE : BLUE}
								activity={index === 1 ? "inspection" : "assembly"}
							/>
							<circle cx={x + 64} cy="1303" r={active ? 10 : 7} fill={active ? ORANGE : BLUE} opacity={0.72} />
						</g>
					);
				})}
				<g opacity={interpolate(frame, [26, 44], [0, 1], smooth)}>
					<text x="540" y="928" textAnchor="middle" fill="#C9D8E8" fontSize="20" fontWeight="900" letterSpacing="2">
						ALUR PRODUKSI
					</text>
					<path d="M225 980H855" stroke="#71859A" strokeWidth="5" strokeLinecap="round" />
					<path d="M510 968L526 980L510 992M825 968L841 980L825 992" fill="none" stroke={BLUE} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
					{["RAKIT", "PERIKSA", "KIRIM"].map((step, index) => {
						const x = 225 + index * 315;
						const active = activeStation === index;
						return (
							<g key={step}>
								<circle cx={x} cy="980" r={active ? 17 : 12} fill={active ? ORANGE : "#344B64"} stroke={WHITE} strokeWidth="2" />
								<text x={x} y="1024" textAnchor="middle" fill={active ? WHITE : MUTED} fontSize="19" fontWeight="900" letterSpacing="1">
									{step}
								</text>
							</g>
						);
					})}
					<circle cx={flowX} cy="980" r="8" fill={WHITE} stroke={ORANGE} strokeWidth="4" />
				</g>
				<g transform={`translate(${carX} 1512) scale(1.08)`}>
					<path d="M-70 22L-54 -12Q-49 -21 -34 -22H25Q40 -21 51 -4L66 8V28H-70Z" fill={WHITE} stroke="#8EA0B5" strokeWidth="4" />
					<path d="M-29 -17H-3V0H-43ZM5 -17H25Q36 -15 43 0H5Z" fill="#91B7D7" />
					<circle cx="-43" cy="29" r="11" fill="#111A27" stroke="#7C91A9" strokeWidth="4" />
					<circle cx="40" cy="29" r="11" fill="#111A27" stroke="#7C91A9" strokeWidth="4" />
					<path d="M-60 8H-47M51 8H62" stroke={ORANGE} strokeWidth="5" strokeLinecap="round" />
				</g>
				<g opacity={draw}>
					<path d={`M${carX} 1418V1370H${225 + activeStation * 315}V1342`} fill="none" stroke={ORANGE} strokeWidth="4" strokeDasharray="8 10" strokeDashoffset={-frame * 1.6} />
					<circle cx={carX} cy="1418" r="8" fill={ORANGE} />
				</g>
			</svg>
			<div style={{ position: "absolute", left: 70, bottom: 94, color: "#C9D8E8", fontSize: 18, fontWeight: 800, letterSpacing: 2 }}>
				PRINSIP, BUKAN SEKADAR PROSES
			</div>
			<SceneProgress frame={frame} />
		</SceneFrame>
	);
};

const KaizenScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const phase = frame < 29 ? 0 : frame < 50 ? 1 : frame < 75 ? 2 : 3;
	const entrance = interpolate(frame, [4, 20], [0, 1], smooth);
	const toolX = interpolate(frame, [0, 46, 64, 104], [842, 842, 352, 352], smooth);
	const partX = interpolate(frame, [0, 20, 29, 68, 80, 104], [170, 470, 470, 470, 815, 925], smooth);
	const beltOffset = -(Math.min(frame, 29) * 2.5 + Math.max(0, frame - 75) * 5);
	const steps = ["TEMUKAN", "AMATI", "PERBAIKI", "HASIL"];
	const stageProgress = interpolate(frame, [0, 29, 50, 75, 104], [0, 1 / 3, 2 / 3, 1, 1], smooth);
	const stageCopy = [
		{ title: "TEMUKAN MASALAH", detail: "Operator harus menjangkau alat", signal: "MUTU: PERIKSA" },
		{ title: "PERIKSA AKAR PENYEBAB", detail: "Amati gerak di titik kerja", signal: "AKAR: JARAK ALAT" },
		{ title: "LAKUKAN PERBAIKAN", detail: "Pindahkan alat ke dekat operator", signal: "ALAT: LEBIH DEKAT" },
		{ title: "HASIL MENINGKAT", detail: "Gerak lebih singkat, alur lancar", signal: "MUTU: TERJAGA" },
	][phase];

	return (
		<SceneFrame background={NAVY_ALT} frameCount={104} sceneIndex={1}>
			<BrandBar light chapter="01 / PERBAIKAN BERKELANJUTAN" number="02" frame={frame} />
			<div style={{ position: "absolute", left: 72, right: 72, top: 246 }}>
				<KineticLines lines={["KAIZEN"]} frame={frame} color={WHITE} fontSize={104} />
				<KineticCaption frame={frame} color="#C9D8E8" fontSize={27}>
					Temukan masalah. Perbaiki prosesnya.
				</KineticCaption>
			</div>
			<svg
				viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
				style={{
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					opacity: entrance,
				}}
				aria-hidden="true"
			>
				<rect x="68" y="650" width="944" height="800" rx="28" fill="#101D2C" stroke="#60768D" strokeWidth="4" />
				<path d="M104 822H976" stroke="#3B5066" strokeWidth="3" />
				<circle cx="132" cy="738" r="24" fill={phase === 3 ? BLUE : ORANGE} />
				<text x="132" y="746" textAnchor="middle" fill={INK} fontSize="22" fontWeight="900">{phase + 1}</text>
				<text x="176" y="746" fill={WHITE} fontSize="34" fontWeight="900" letterSpacing=".4">{stageCopy.title}</text>
				<text x="112" y="794" fill="#C9D8E8" fontSize="26" fontWeight="600">{stageCopy.detail}</text>

				<rect x="642" y="850" width="332" height="150" rx="14" fill="#203249" stroke={phase === 3 ? BLUE : ORANGE} strokeWidth="3" />
				<text x="666" y="882" fill={MUTED} fontSize="18" fontWeight="800" letterSpacing="1.2">JARAK ALAT KE OPERATOR</text>
				<text x="666" y="922" fill="#FFC078" fontSize="20" fontWeight="900">SEBELUM: 3 GERAK</text>
				{[0, 1, 2].map((index) => (
					<circle key={`before-${index}`} cx={908 + index * 16} cy="915" r="6" fill={ORANGE} />
				))}
				<g opacity={interpolate(frame, [50, 61], [0, 1], smooth)}>
					<text x="666" y="964" fill="#9DDCFF" fontSize="20" fontWeight="900">SESUDAH: 1 GERAK</text>
					<circle cx="908" cy="957" r="7" fill={BLUE} />
					<circle cx="924" cy="957" r="6" fill="#45586C" />
					<circle cx="940" cy="957" r="6" fill="#45586C" />
				</g>

				<path d="M92 1280H988" stroke="#536A82" strokeWidth="32" strokeLinecap="round" />
				<path d="M104 1280H976" stroke={BLUE} strokeWidth="5" strokeDasharray="15 24" strokeDashoffset={-beltOffset} />
				<path d="M128 1298V1350M952 1298V1350" stroke="#71859A" strokeWidth="11" strokeLinecap="round" />
				<path d="M306 1168H966V1190H306Z" fill="#3E536A" stroke="#8599AE" strokeWidth="4" />
				<path d="M342 1190V1260M922 1190V1260" stroke="#657B91" strokeWidth="9" />
				<Worker x={160} y={875} frame={frame} scale={1.4} accent={phase >= 3 ? BLUE : ORANGE} activity={phase >= 2 ? "assembly" : "inspection"} />
				<path d={`M132 1068L${toolX} 1088`} fill="none" stroke={phase >= 2 ? BLUE : ORANGE} strokeWidth="5" strokeDasharray="10 12" strokeDashoffset={-frame * 1.8} />
				<g transform={`translate(${toolX} 1110)`}>
					<rect x="-11" y="-44" width="22" height="64" rx="8" fill={phase >= 2 ? BLUE : ORANGE} stroke={WHITE} strokeWidth="3" />
					<path d="M-32 -44H32L21 -58H-21Z" fill="#F7B453" stroke={WHITE} strokeWidth="2" />
					<circle cx="0" cy="27" r="10" fill={phase >= 2 ? BLUE : ORANGE} />
				</g>
				{phase === 1 && (
					<g transform={`translate(${toolX} 1090)`}>
						<circle r="54" fill="none" stroke={ORANGE} strokeWidth="5" opacity=".8" />
						<circle r="34" fill="none" stroke={WHITE} strokeWidth="3" opacity=".8" />
						<path d="M39 39L72 72" stroke={ORANGE} strokeWidth="9" strokeLinecap="round" />
					</g>
				)}
				<g transform={`translate(${partX} 1230)`}>
					<rect x="-42" y="-33" width="84" height="58" rx="10" fill={phase === 3 ? "#DCEEFF" : WHITE} stroke={phase === 3 ? BLUE : "#91A7BD"} strokeWidth="4" />
					<path d="M-24 -20H22M-24 -5H12" stroke={phase === 3 ? BLUE : "#91A7BD"} strokeWidth="5" strokeLinecap="round" />
					{phase < 2 && (
						<g>
							<circle cx="31" cy="-23" r="17" fill={ORANGE} />
							<path d="M31 -31V-22M31 -16V-15" stroke={INK} strokeWidth="4" strokeLinecap="round" />
						</g>
					)}
					{phase === 3 && (
						<g>
							<circle cx="31" cy="-23" r="17" fill={BLUE} />
							<path d="M23 -23L29 -17L40 -30" fill="none" stroke={WHITE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
						</g>
					)}
				</g>
				<path d="M604 1045V1122" stroke="#8195AA" strokeWidth="3" strokeDasharray="6 10" opacity=".7" />
				<circle cx="604" cy="1045" r="10" fill={phase >= 2 ? BLUE : ORANGE} />

				<path d="M138 1390H942" stroke="#455A70" strokeWidth="5" strokeLinecap="round" />
				<path d={`M138 1390H${138 + stageProgress * 804}`} stroke={phase === 3 ? BLUE : ORANGE} strokeWidth="6" strokeLinecap="round" />
				{steps.map((step, index) => {
					const passed = index <= phase;
					const x = 138 + index * 268;
					const markerScale = frame >= [0, 29, 50, 75][index] && frame < [29, 50, 75, 104][index]
						? 1 + Math.sin(frame * 0.35) * 0.12
						: 1;
					return (
						<g key={step}>
							<circle cx={x} cy="1390" r={17 * markerScale} fill={passed ? (phase === 3 ? BLUE : ORANGE) : "#344B64"} stroke={WHITE} strokeWidth="2" />
							<text x={x} y="1430" textAnchor="middle" fill={passed ? WHITE : MUTED} fontSize="19" fontWeight="900">{step}</text>
						</g>
					);
				})}
			</svg>
			<div style={{ position: "absolute", left: 72, bottom: 118, color: "#C9D8E8", fontSize: 18, fontWeight: 800, letterSpacing: 1.5 }}>
				KAIZEN  /  PERBAIKAN KECIL, DAMPAK NYATA
			</div>
			<SceneProgress frame={frame + 300} />
		</SceneFrame>
	);
};

const QualityScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const carX = interpolate(frame, [0, 44, 100, 224], [135, 410, 410, 930], smooth);
	const stopProgress = interpolate(frame, [38, 47, 94, 104], [0, 1, 1, 0], smooth);
	const defectProgress = interpolate(frame, [43, 52, 67, 75], [0, 1, 1, 0], smooth);
	const repairProgress = interpolate(frame, [66, 74, 89, 98], [0, 1, 1, 0], smooth);
	const resumeProgress = interpolate(frame, [90, 100, 172, 190], [0, 1, 1, 0], smooth);
	const checkProgress = interpolate(frame, [95, 106, 170, 190], [0, 1, 1, 0], smooth);
	const statusPanelProgress = interpolate(frame, [43, 52, 172, 184], [0, 1, 1, 0], smooth);
	const beltFrame = frame < 47 ? frame : frame < 104 ? 47 : frame - 57;
	const activeStep = frame < 47 ? -1 : frame < 72 ? 0 : frame < 104 ? 1 : 2;
	const beltOffset = -beltFrame * 2.8;
	const scanPulse = Math.sin(frame / 4) * 3;
	const cameraPush = interpolate(frame, [0, 223], [0, 0.025], smooth);
	const cameraX = interpolate(frame, [0, 223], [0, -8], smooth);
	const status = frame < 69
		? { headline: "MASALAH DITEMUKAN", detail: "LINI BERHENTI" }
		: frame < 96
			? { headline: "MASALAH DITANGANI", detail: "PERIKSA DAN PERBAIKI" }
			: { headline: "MUTU DIJAGA", detail: "PROSES BERJALAN KEMBALI" };

	return (
		<SceneFrame background={NAVY_LIGHT} frameCount={224} sceneIndex={2}>
			<BrandBar light chapter="02 / KUALITAS DI SUMBERNYA" number="03" frame={frame} />
			<div style={{ position: "absolute", left: 72, right: 72, top: 252 }}>
				<KineticLines
					lines={["JIDOKA", "MUTU DI SUMBERNYA"]}
					frame={frame}
					color={WHITE}
					accentLast
					fontSize={68}
					revealPerLine
				/>
				<KineticCaption frame={frame} color="#C9D8E8" fontSize={31}>
					Genchi Genbutsu: amati masalah langsung, hentikan lini, perbaiki penyebabnya.
				</KineticCaption>
			</div>
			<svg
				viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
				style={{
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					transform: `translate(${cameraX}px, -255px) scale(${1.14 + cameraPush})`,
					transformOrigin: "center",
				}}
				aria-hidden="true"
			>
				<g transform="translate(0 -220)">
					<path d="M75 1105H1005" stroke="#FFFFFF25" strokeWidth="3" />
					<path d="M150 1405H930" stroke="#FFFFFF38" strokeWidth="14" strokeLinecap="round" />
					<path d="M165 1405H915" stroke={BLUE} strokeWidth="4" strokeDasharray="16 26" strokeDashoffset={beltOffset} />
					<path d="M270 1510V1300H810V1510" fill="#192A3D55" stroke="#FFFFFF48" strokeWidth="5" />
					<path d="M252 1300H828V1278H252Z" fill="#344960" stroke="#8195AA" strokeWidth="4" />
					<path d="M410 1300V1350" stroke={ORANGE} strokeWidth="5" strokeDasharray="8 10" strokeDashoffset={-frame * 1.8} opacity={0.45 + stopProgress * 0.55} />
					<circle cx="410" cy="1358" r={17 + scanPulse * stopProgress} fill={NAVY} stroke={ORANGE} strokeWidth="5" opacity={0.6 + stopProgress * 0.4} />
					<path d="M824 1320V1395" stroke="#7388A0" strokeWidth="9" strokeLinecap="round" />
					<rect x="812" y="1304" width="24" height="76" rx="12" fill="#26394F" stroke="#93A5B8" strokeWidth="3" />
					<circle cx="824" cy="1320" r="7" fill={BLUE} opacity={0.5} />
					<circle cx="824" cy="1342" r="7" fill={ORANGE} opacity={0.35 + stopProgress * 0.65} />
					<circle cx="824" cy="1364" r="7" fill={BLUE} opacity={resumeProgress * 0.9} />
					<g opacity={statusPanelProgress}>
						<rect x="604" y="1165" width="328" height="98" rx="12" fill={PANEL} stroke="#60748A" strokeWidth="3" />
						<rect x="604" y="1165" width="9" height="98" rx="4" fill={ORANGE} />
						<g>
							<text x="635" y="1208" fill={ORANGE} fontSize="19" fontWeight="900" letterSpacing="1.2">{status.headline}</text>
							<text x="635" y="1238" fill={WHITE} fontSize="20" fontWeight="700">{status.detail}</text>
						</g>
					</g>
					<g transform={`translate(${carX} 1351)`}>
						<path d="M-80 54L-62 15Q-58 6 -45 3L-24 -20H31Q47 -18 59 3L76 15L88 26V54Z" fill={WHITE} stroke="#8EA0B5" strokeWidth="4" />
						<path d="M-16 -12H12V6H-33ZM20 -12H31Q41 -10 49 6H20Z" fill="#90B9DD" />
						<circle cx="-45" cy="54" r="14" fill={INK} />
						<circle cx="55" cy="54" r="14" fill={INK} />
						<path d="M-70 23H-51M61 22H78" stroke={ORANGE} strokeWidth="5" strokeLinecap="round" />
						<g opacity={defectProgress}>
							<circle cx="28" cy="14" r={12 + scanPulse * 0.35} fill={ORANGE} />
							<path d="M28 7V15M28 19V20" stroke={INK} strokeWidth="3" strokeLinecap="round" />
						</g>
						<g opacity={checkProgress}>
							<circle cx="28" cy="14" r="12" fill={BLUE} />
							<path d="M22 14L27 19L35 9" fill="none" stroke={WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
						</g>
					</g>
					<path
						d={`M461 1352L${carX + 28} 1365`}
						fill="none"
						stroke={frame < 69 ? ORANGE : BLUE}
						strokeWidth="4"
						strokeDasharray="7 7"
						strokeDashoffset={-frame * 2}
						opacity={Math.max(defectProgress, repairProgress) * 0.9}
					/>
					<Worker x={500} y={1216} frame={frame} scale={1.32} activity="inspection" />
				</g>
				<path d="M150 1590H930" stroke="#FFFFFF25" strokeWidth="2" />
				<path d="M322 1664H438M642 1664H758" stroke="#8195AA" strokeWidth="4" />
				<path d="M428 1656L440 1664L428 1672M748 1656L760 1664L748 1672" fill="none" stroke="#8195AA" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
				{["HENTIKAN", "TANGANI", "CEGAH"].map((label, index) => {
					const active = activeStep === index;
					const progress = spring({
						frame: frame - 18 - index * 9,
						fps,
						config: { damping: 18, stiffness: 92 },
					});
					const x = 220 + index * 320;
					return (
						<g key={label} opacity={progress} transform={`translate(0 ${(1 - progress) * 15})`}>
							<rect x={x - 110} y="1628" width="220" height="72" rx="12" fill={active ? "#263B51" : NAVY_ALT} stroke={active ? ORANGE : "#526982"} strokeWidth={active ? "4" : "2"} />
							<circle cx={x - 75} cy="1664" r="18" fill={active ? ORANGE : "#40566F"} />
							<text x={x - 75} y="1670" textAnchor="middle" fill={WHITE} fontSize="14" fontWeight="900">
								0{index + 1}
							</text>
							<text x={x + 16} y="1671" textAnchor="middle" fill={active ? WHITE : MUTED} fontSize="21" fontWeight="900" letterSpacing="1">
								{label}
							</text>
						</g>
					);
				})}
			</svg>
			<div style={{ position: "absolute", left: 72, bottom: 118, color: "#C9D8E8", fontSize: 18, fontWeight: 800, letterSpacing: 2 }}>
				JIDOKA  /  TEMUKAN • HENTIKAN • PERBAIKI
			</div>
			<SceneProgress frame={frame + 390} />
		</SceneFrame>
	);
};

const ClosingScene: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const checklist = [
		interpolate(frame, [45, 59], [0, 1], smooth),
		interpolate(frame, [65, 79], [0, 1], smooth),
		interpolate(frame, [85, 99], [0, 1], smooth),
	];
	const boardPush = interpolate(frame, [18, 110], [0.98, 1.025], smooth);

	return (
		<SceneFrame background={NAVY_ALT} frameCount={307} sceneIndex={3} fadeOut={false}>
			<BrandBar light chapter="PENUTUP / TERUS BERTUMBUH" number="04" frame={frame} />
			<div style={{ position: "absolute", left: 72, right: 72, top: 250 }}>
				<KineticLines lines={["KEUNGGULAN", "DIMULAI DARI KITA"]} frame={frame} color={WHITE} accentLast fontSize={72} revealPerLine />
				<div style={{ width: 86, height: 6, marginTop: 29, backgroundColor: ORANGE, transform: `scaleX(${interpolate(frame, [16, 43], [0, 1], smooth)})`, transformOrigin: "left" }} />
				<KineticCaption frame={frame} color="#C9D8E8" fontSize={29}>
					Belajar. Memperbaiki. Menjaga kualitas—bersama, setiap hari.
				</KineticCaption>
			</div>
			<svg
				viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
				style={{
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					transform: `translateY(-100px) scale(${boardPush})`,
					transformOrigin: "center",
				}}
				aria-hidden="true"
			>
				<path d="M80 1628H1000" stroke="#FFFFFF25" strokeWidth="3" />
				<path d="M150 1548H930" stroke="#71859A" strokeWidth="6" strokeLinecap="round" />
				<path d="M150 1548H930" stroke={BLUE} strokeWidth="3" strokeDasharray="12 24" strokeDashoffset={-frame * 1.5} />
				<rect x="150" y="900" width="780" height="350" rx="22" fill="#15263A" stroke="#62778D" strokeWidth="4" />
				<path d="M188 940H892" stroke="#536A82" strokeWidth="3" />
				<text x="204" y="980" fill={MUTED} fontSize="22" fontWeight="900" letterSpacing="2">TINJAUAN TIM</text>
				<g transform="translate(810 962)">
					<path d="M-48 21L-37 -2Q-34 -8 -26 -8H20Q30 -8 36 4L46 12V23H-48Z" fill={WHITE} stroke="#8EA0B5" strokeWidth="3" />
					<path d="M-22 -4H-3V8H-29ZM2 -4H19Q25 -2 29 8H2Z" fill="#90B9D7" />
					<circle cx="-28" cy="23" r="7" fill={INK} />
					<circle cx="27" cy="23" r="7" fill={INK} />
				</g>
				{["BELAJAR", "MEMPERBAIKI", "MENJAGA MUTU"].map((label, index) => {
					const enter = spring({
						frame: frame - 30 - index * 16,
						fps,
						config: { damping: 18, stiffness: 94 },
					});
					const y = 1030 + index * 68;
					const done = checklist[index];
					return (
						<g key={label} opacity={enter} transform={`translate(${(1 - enter) * -24} 0)`}>
							<circle cx="220" cy={y - 7} r="20" fill={done ? ORANGE : "#344B64"} />
							<text x="220" y={y - 1} textAnchor="middle" fill={WHITE} fontSize="17" fontWeight="900">{index + 1}</text>
							<text x="265" y={y} fill={WHITE} fontSize="30" fontWeight="800" letterSpacing="1">{label}</text>
							<path d={`M625 ${y - 7}H735`} stroke="#40566F" strokeWidth="4" />
							<circle cx="830" cy={y - 7} r="21" fill={done ? "#153E54" : "#1C2E42"} stroke={done ? BLUE : "#526982"} strokeWidth="3" />
							<path
								d={`M820 ${y - 7}L827 ${y}L840 ${y - 15}`}
								fill="none"
								stroke={WHITE}
								strokeWidth="4"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeDasharray="40"
								strokeDashoffset={40 * (1 - done)}
							/>
						</g>
					);
				})}
				{[0, 1, 2].map((index) => {
					const enter = spring({
						frame: frame - 70 - index * 12,
						fps,
						config: { damping: 17, stiffness: 90 },
					});
					const x = [48, 470, 900][index];
					return (
						<g key={index} opacity={enter} transform={`translate(0 ${(1 - enter) * 32})`}>
							<Worker x={x} y={1280} frame={frame + index * 6} scale={0.84} accent={index === 1 ? ORANGE : BLUE} activity="teamwork" />
							<circle cx={x + 50} cy="1295" r="8" fill={ORANGE} opacity={enter} />
						</g>
					);
				})}
				<path d="M225 1260H855" stroke={BLUE} strokeWidth="4" strokeDasharray="9 16" strokeDashoffset={-frame * 1.4} opacity=".82" />
				<path d="M348 1486H732" stroke="#536A82" strokeWidth="22" strokeLinecap="round" />
				<path d="M362 1486H718" stroke={BLUE} strokeWidth="4" strokeDasharray="12 23" strokeDashoffset={-frame * 2.1} />
				<g transform={`translate(${interpolate(frame, [64, 144, 238, 290], [380, 520, 670, 750], smooth)} 1482)`}>
					<path d="M-36 11L-26 -10Q-23 -15 -15 -15H16Q25 -14 31 0L38 7V14H-36Z" fill={WHITE} stroke="#8EA0B5" strokeWidth="3" />
					<path d="M-12 -11H2V-1H-19ZM6 -11H17Q22 -9 26 -1H6Z" fill="#90B9D7" />
					<circle cx="-20" cy="14" r="7" fill={INK} />
					<circle cx="23" cy="14" r="7" fill={INK} />
				</g>
			</svg>
			<div style={{ position: "absolute", left: 72, bottom: 118, color: MUTED, fontSize: 18, fontWeight: 800, letterSpacing: 2 }}>
				TOYOTA WAY  /  BERGERAK MAJU
			</div>
			<SceneProgress frame={frame + 600} />
		</SceneFrame>
	);
};

const ToyotaWay: React.FC = () => (
	<AbsoluteFill
		style={{
			backgroundColor: NAVY,
			color: WHITE,
			fontFamily: "Arial, Helvetica, sans-serif",
			overflow: "hidden",
		}}
	>
		<Audio src={staticFile("toyota-way-music.wav")} volume={0.14} />
		<Audio src={staticFile("toyota-way-sfx.wav")} volume={0.22} />
		<Audio src={staticFile("audio/toyota-way-vo-final.wav")} volume={1} />

		<Sequence from={0} durationInFrames={307} premountFor={0}>
			<OpeningScene />
		</Sequence>
		<Sequence from={293} durationInFrames={104} premountFor={0}>
			<KaizenScene />
		</Sequence>
		<Sequence from={383} durationInFrames={224} premountFor={0}>
			<QualityScene />
		</Sequence>
		<Sequence from={593} durationInFrames={307} premountFor={0}>
			<ClosingScene />
		</Sequence>
	</AbsoluteFill>
);

export { ToyotaWay };
