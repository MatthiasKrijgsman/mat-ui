import * as React from "react";
import { autoUpdate, type Placement, size, useFloating } from "@floating-ui/react";
import { PopoverBase } from "@/popover/PopoverBase.tsx";


export type UsePopoverProps = {
  placement?: Placement;
  onOutsideClick?: () => void;
  fullWidth?: boolean;
  minWidth?: number;
  maxWidth?: number;
};

export type PopoverRendererProps = {
  open: boolean;
  children: React.ReactNode;
  className?: string
}

export type PopoverBaseRefProps = {
  onOutsideClick?: () => void;
  floatingStyles: React.CSSProperties;
  setFloating: React.RefCallback<HTMLDivElement>;
  placement: Placement;
}

export type UsePopoverResult = {
  anchorRef: React.RefCallback<HTMLDivElement | null>;
  Popover: React.ComponentType<PopoverRendererProps>;
}

export const usePopover = (props: UsePopoverProps): UsePopoverResult => {
  const { placement = "bottom", onOutsideClick, fullWidth, minWidth, maxWidth } = props;

  const middleware = React.useMemo(() => {
    return [
      size({
        apply({ rects, elements }) {
          if (fullWidth) {
            elements.floating.style.width = `${ rects.reference.width }px`;
          }
          if (minWidth) {
            elements.floating.style.minWidth = `${ minWidth }px`;
          }
          if (maxWidth) {
            elements.floating.style.maxWidth = `${ maxWidth }px`;
          }
        },
      })
    ];
  }, [fullWidth, maxWidth, minWidth]);

  const { refs, floatingStyles } = useFloating({
    placement,
    middleware,
    whileElementsMounted: autoUpdate,
  });

  const latest = React.useRef<PopoverBaseRefProps>({
    onOutsideClick,
    floatingStyles,
    setFloating: refs.setFloating,
    placement,
  });
  latest.current = {
    onOutsideClick,
    floatingStyles,
    setFloating: refs.setFloating,
    placement,
  };

  const Popover = React.useMemo<React.ComponentType<PopoverRendererProps>>(() => {
    const Renderer = (rendererProps: PopoverRendererProps) => {
      const { floatingStyles, setFloating, onOutsideClick, placement } = latest.current;
      const { className, open, children } = rendererProps;
      return (
        <PopoverBase
          open={ open }
          className={ className }
          onOutsideClick={ onOutsideClick }
          floatingStyles={ floatingStyles }
          setFloating={ setFloating }
          placement={ placement }
        >
          { children }
        </PopoverBase>
      );
    };
    return React.memo(Renderer);
  }, []);

  return {
    anchorRef: refs.setReference,
    Popover: Popover,
  };
};
