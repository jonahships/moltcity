type LogoProps = {
  className?: string;
  alt?: string;
};

export default function Logo({ className, alt = "Molt City logo" }: LogoProps) {
  return (
    <img
      src="/images/logo.png"
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
