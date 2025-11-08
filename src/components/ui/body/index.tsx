import { useCallback } from "react";
import { differenceWith } from "./differenceWith";

import { bodyFront } from "./bodyFront";
import { bodyBack } from "./bodyBack";
import { SvgMaleWrapper } from "./SvgMaleWrapper";
import { bodyFemaleFront } from "./bodyFemaleFront";
import { bodyFemaleBack } from "./bodyFemaleBack";
import { SvgFemaleWrapper } from "./SvgFemaleWrapper";

export const SlugList = [
	"abs",
	"adductors",
	"ankles",
	"biceps",
	"calves",
	"chest",
	"deltoids",
	"feet",
	"forearm",
	"gluteal",
	"hamstring",
	"hands",
	"hair",
	"head",
	"knees",
	"lower-back",
	"neck",
	"obliques",
	"quadriceps",
	"tibialis",
	"trapezius",
	"tricep",
	"upper-back",
] as const;

export type Slug = (typeof SlugList)[number];

export interface BodyPart {
	intensity: number;
	slug: Slug;
	side?: "left" | "right";
	path?: {
		common?: string[];
		left?: string[];
		right?: string[];
	};
}

export type BodyProps = {
	data: ReadonlyArray<BodyPart>;
	scale?: number;
	side?: "front" | "back";
	sex?: "male" | "female";
	onBodyPartPress?: (b: BodyPart, side?: "left" | "right") => void;
	border?: string | "none";
	disabledParts?: Slug[];
	hiddenParts?: Slug[];
};

const comparison = (a: BodyPart, b: BodyPart) => a.slug === b.slug;
const createTransparentColor = (percent: number) =>
	`color-mix(in srgb, var(--protein) ${percent}%, transparent)`;
const Body = ({
	data,
	scale = 1,
	side = "front",
	sex = "male",
	onBodyPartPress,
	border = "#dfdfdf",
	disabledParts = [],
	hiddenParts = [],
}: BodyProps) => {
	const mergedBodyParts = useCallback(
		(dataSource: ReadonlyArray<BodyPart>) => {
			const filteredDataSource = dataSource.filter(
				(part) => !hiddenParts.includes(part.slug!),
			);
			const filteredMap = new Map(filteredDataSource.map((e) => [e.slug, e]));
			const dataMap = new Map(data.map((e) => [e.slug, e]));

			const coloredBodyParts = data
				.filter((d) => filteredMap.has(d.slug))
				.map((d) => {
					const basePart = filteredMap.get(d.slug)!;
					const intensity = dataMap.get(d.slug)?.intensity;
					return {
						...basePart,
						color:
							intensity === 0
								? "#3f3f3f"
								: (createTransparentColor(intensity) ?? "#3f3f3f"),
					};
				});
			const formattedBodyParts = differenceWith(
				comparison,
				filteredDataSource,
				data,
			);

			return [...formattedBodyParts, ...coloredBodyParts];
		},
		[data, hiddenParts],
	);

	const getColorToFill = (bodyPart: BodyPart) => {
		if (bodyPart.slug && disabledParts.includes(bodyPart.slug)) {
			return "#EBEBE4";
		}

		return createTransparentColor(bodyPart.intensity);
	};

	const isPartDisabled = (slug?: Slug) => slug && disabledParts.includes(slug);

	const renderBodySvg = (bodyToRender: ReadonlyArray<BodyPart>) => {
		const SvgWrapper = sex === "male" ? SvgMaleWrapper : SvgFemaleWrapper;

		return (
			<SvgWrapper side={side} scale={scale} border={"none"}>
				{mergedBodyParts(bodyToRender).map((bodyPart: BodyPart) => {
					const commonPaths = (bodyPart.path?.common || []).map((path) => {
						const dataCommonPath = data.find((d) => d.slug === bodyPart.slug)
							?.path?.common;

						return (
							<path
								key={path}
								onClick={
									isPartDisabled(bodyPart.slug)
										? undefined
										: () => onBodyPartPress?.(bodyPart)
								}
								aria-disabled={isPartDisabled(bodyPart.slug)}
								id={bodyPart.slug}
								fill={dataCommonPath ? getColorToFill(bodyPart) : "#3f3f3f"}
								d={path}
								stroke={border}
								strokeWidth="1"
								strokeOpacity="50%"
								vectorEffect="non-scaling-stroke"
							/>
						);
					});

					const leftPaths = (bodyPart.path?.left || []).map((path) => {
						const isOnlyRight =
							data.find((d) => d.slug === bodyPart.slug)?.side === "right";

						return (
							<path
								key={path}
								onClick={
									isPartDisabled(bodyPart.slug)
										? undefined
										: () => onBodyPartPress?.(bodyPart, "left")
								}
								id={bodyPart.slug}
								fill={isOnlyRight ? "#3f3f3f" : bodyPart.color}
								d={path}
								stroke={border}
								strokeWidth="1"
								strokeOpacity="50%"
								vectorEffect="non-scaling-stroke"
							/>
						);
					});
					const rightPaths = (bodyPart.path?.right || []).map((path) => {
						const isOnlyLeft =
							data.find((d) => d.slug === bodyPart.slug)?.side === "left";

						return (
							<path
								key={path}
								onClick={
									isPartDisabled(bodyPart.slug)
										? undefined
										: () => onBodyPartPress?.(bodyPart, "right")
								}
								id={bodyPart.slug}
								fill={isOnlyLeft ? "#3f3f3f" : bodyPart.color}
								d={path}
								stroke={border}
								strokeWidth="1"
								strokeOpacity="50%"
								vectorEffect="non-scaling-stroke"
							/>
						);
					});

					return [...commonPaths, ...leftPaths, ...rightPaths];
				})}
			</SvgWrapper>
		);
	};

	if (sex === "female") {
		return renderBodySvg(side === "front" ? bodyFemaleFront : bodyFemaleBack);
	}

	return renderBodySvg(side === "front" ? bodyFront : bodyBack);
};

export default Body;
