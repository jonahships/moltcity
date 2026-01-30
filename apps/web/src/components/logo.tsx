interface LogoProps {
	className?: string;
	alt?: string;
	width?: number;
	height?: number;
}

export default function Logo({
	className,
	alt = "Molt City logo",
	width = 48,
	height = 48,
}: LogoProps) {
	return (
		<img
			alt={alt}
			className={className}
			decoding="async"
			height={height}
			loading="lazy"
			src="/images/logo.png"
			width={width}
		/>
	);
}
