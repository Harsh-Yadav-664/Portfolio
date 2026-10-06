/* Themed auto-diagram used when a project has no image configured.
   Three abstract variants; zero text so it always matches the site.
   Strokes/fills use `currentColor`, set by `.schematic-ink` in index.css so
   the linework follows the active palette (volt in console-dark, warm amber
   in the cream/coffee theme). */

function VariantFlow() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full schematic-ink" fill="none" aria-hidden="true">
      <rect x="24" y="104" width="88" height="92" stroke="currentColor" strokeWidth="1.2" opacity="0.9" />
      <path d="M40 128h56M40 150h56M40 172h40" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M112 150h52" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" />
      <path d="M160 142l12 8-12 8" stroke="currentColor" strokeWidth="1.2" />
      <rect x="176" y="56" width="74" height="40" stroke="currentColor" strokeWidth="1.2" />
      <rect x="176" y="130" width="74" height="40" stroke="currentColor" strokeWidth="1.2" />
      <rect x="176" y="204" width="74" height="40" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      <path d="M250 76h40M250 150h40M250 224h40" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <rect x="292" y="44" width="84" height="212" stroke="currentColor" strokeWidth="1.2" opacity="0.85" />
      <path d="M308 78h52M308 112h52M308 146h52M308 180h52" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      {[150, 76, 150, 224].map((y, i) => (
        <circle key={i} cx={i === 0 ? 164 : 288} cy={y} r="3" fill="currentColor" />
      ))}
    </svg>
  );
}

function VariantPipeline() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full schematic-ink" fill="none" aria-hidden="true">
      <ellipse cx="70" cy="92" rx="34" ry="10" stroke="currentColor" strokeWidth="1.2" />
      <path d="M36 92v70c0 6 15 10 34 10s34-4 34-10V92" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="70" cy="162" rx="34" ry="10" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      <path d="M104 127h44" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" />
      <polygon points="176,100 206,127 176,154 146,127" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="176" cy="127" r="12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M206 127h38" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" />
      {[72, 105, 138, 171, 204].map((y, i) => (
        <rect key={i} x="252" y={y} width="120" height="22" stroke="currentColor" strokeWidth="1.1" opacity={1 - i * 0.16} />
      ))}
      <polygon points="244,127 252,122 252,132" fill="currentColor" />
      <circle cx="126" cy="127" r="3" fill="currentColor" />
    </svg>
  );
}

function VariantNetwork() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full schematic-ink" fill="none" aria-hidden="true">
      <circle cx="200" cy="150" r="96" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <ellipse cx="200" cy="150" rx="96" ry="38" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <ellipse cx="200" cy="150" rx="38" ry="96" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <path d="M200 54v192M104 150h192" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
      {[
        [132, 112], [268, 108], [232, 206], [168, 204], [200, 74], [118, 168], [284, 162],
      ].map(([x, y], i) => (
        <g key={i}>
          <path d={`M200 150 L${x} ${y}`} stroke="currentColor" strokeWidth="0.8" opacity="0.45" />
          <rect
            x={x - 5}
            y={y - 5}
            width="10"
            height="10"
            transform={`rotate(45 ${x} ${y})`}
            stroke="currentColor"
            strokeWidth="1.1"
          />
        </g>
      ))}
      <circle cx="200" cy="150" r="6" fill="currentColor" />
    </svg>
  );
}

const VARIANTS = [VariantFlow, VariantPipeline, VariantNetwork];

export function SchematicFallback({ index = 0 }: { index?: number }) {
  const V = VARIANTS[index % VARIANTS.length];
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <V />
    </div>
  );
}
