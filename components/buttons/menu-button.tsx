import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import React from "react";

interface MenuButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "lg";
  variant?: "secondary" | "menu";
}

const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ children, onClick, className, size = "sm", variant = "menu" }, ref) => {
    return (
      <Button
        variant={variant}
        className={cn(
          size === "sm" ? "px-[10px] py-[10px] mx-1" : "h-[60px] w-[60px]",
          size === "sm" ? "rounded-full" : "rounded-full",
          className,
        )}
        onClick={onClick}
        ref={ref}
      >
        {children}
      </Button>
    );
  },
);

MenuButton.displayName = "MenuButton";

export { MenuButton };
