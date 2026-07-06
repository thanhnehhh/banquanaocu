type Thickness = "thin" | "normal" | "thick";
type Variant = "solid" | "dashed";

interface HorizontalDividerProps {
  text?: string;
  className?: string;
  variant?: Variant;
  thickness?: Thickness;
}

const thicknessStyles: Record<Thickness, string> = {
  thin: "h-px",
  normal: "h-[1.5px]",
  thick: "h-1",
};

const HorizontalDivider = ({
  text,
  className = "",
  variant = "solid",
  thickness = "normal",
}: HorizontalDividerProps) => {
  const baseLine = "border-t border-black";
  const styleVariant = variant === "dashed" ? "border-dashed" : "";
  const height = thicknessStyles[thickness];

  const lineClass = `${height} ${baseLine} ${styleVariant}`;

  return (
    <div className={`flex items-center gap-3 ${className}  justify-center`}>
      <div className={`${lineClass} w-10/12`} />

      {text && (
        <>
          <span className="text-xs uppercase tracking-[1.2px] text-brand-social-text">
            {text}
          </span>
          <div className={`flex-1 ${lineClass}`} />
        </>
      )}
    </div>
  );
};

export default HorizontalDivider;
