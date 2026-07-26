const PALETTES = [
  ["#B9C7AE", "#8FA283"],
  ["#EDE3D3", "#DCCBAE"],
  ["#E1C784", "#C9A24B"],
  ["#FBF8F2", "#EDE3D3"],
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function ProductImage({
  url,
  alt,
  seed,
  className = "",
}: {
  url?: string;
  alt: string;
  seed: string;
  className?: string;
}) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={alt} className={`h-full w-full object-cover ${className}`} />;
  }

  const palette = PALETTES[hashString(seed) % PALETTES.length];

  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex h-full w-full items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`,
      }}
    >
      <svg
        width="35%"
        height="35%"
        viewBox="0 0 24 24"
        fill="none"
        className="opacity-70"
      >
        <path
          d="M12 2c1.1 0 2 .9 2 2 0 .74-.4 1.38-1 1.72V7h2a5 5 0 0 1 5 5v1h1a1 1 0 0 1 0 2h-1v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2H3a1 1 0 1 1 0-2h1v-1a5 5 0 0 1 5-5h2V5.72C10.4 5.38 10 4.74 10 4c0-1.1.9-2 2-2Z"
          fill="#FBF8F2"
        />
      </svg>
    </div>
  );
}
