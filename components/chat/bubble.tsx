interface Props {
  children?: React.ReactNode;
  isVisible: boolean;
  response?: boolean;
  size: "sm" | "md" | "lg";
  y: "top" | "bottom";
  x: "left" | "right" | "center";
  anchor?: boolean;
  onClick?: () => void;
}
export function Bubble({
  children,
  response,
  size,
  isVisible,
  onClick,
  anchor = true,
  x,
  y,
}: Props) {
  if (!anchor) {
    return (
      <section
        className="shadow-md"
        data-bubble
        data-size={size}
        data-mounted={isVisible ? "true" : "false"}
        data-chat-response={response ? "true" : "false"}
        data-y-position={y}
        data-x-position={x}
        onClick={onClick}
      >
        {children}
      </section>
    );
  }
  return (
    <div
      data-bubble-anchor={anchor}
      data-y-position={y}
      data-chat-response={response ? "true" : "false"}
    >
      <section
        className="shadow-md"
        data-bubble
        data-size={size}
        data-mounted={isVisible ? "true" : "false"}
        data-chat-response={response ? "true" : "false"}
        data-y-position={y}
        data-x-position={x}
        onClick={onClick}
      >
        {children}
      </section>
    </div>
  );
}
