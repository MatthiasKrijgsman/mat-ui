import * as React from "react";
import { autoUpdate, flip, FloatingNode, offset as offsetMiddleware, type Placement, shift, size, useDismiss, useFloating, useFloatingNodeId, useInteractions } from "@floating-ui/react";
import { PopoverBase } from "@/popover/PopoverBase.tsx";


export type UsePopoverProps = {
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  fullWidth?: boolean;
  minWidth?: number;
  maxWidth?: number;
  offset?: number;
};

export type PopoverRendererProps = {
  open: boolean;
  children: React.ReactNode;
  className?: string
}

export type PopoverBaseRefProps = {
  floatingStyles: React.CSSProperties;
  setFloating: React.RefCallback<HTMLDivElement>;
  placement: Placement;
}

type PopoverLatestProps = PopoverBaseRefProps & {
  getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
  nodeId: string | undefined;
}

export type UsePopoverResult = {
  anchorRef: React.RefCallback<HTMLDivElement | null>;
  Popover: React.ComponentType<PopoverRendererProps>;
}

export const usePopover = (props: UsePopoverProps): UsePopoverResult => {
  const { placement = "bottom", open, onOpenChange, fullWidth, minWidth, maxWidth, offset } = props;

  const middleware = React.useMemo(() => {
    return [
      ...(offset !== undefined ? [offsetMiddleware(offset)] : []),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
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
  }, [fullWidth, maxWidth, minWidth, offset]);

  const nodeId = useFloatingNodeId();

  const { refs, floatingStyles, context, placement: resolvedPlacement } = useFloating({
    nodeId,
    placement,
    open,
    onOpenChange,
    middleware,
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context, {
    enabled: !!onOpenChange,
    outsidePress: true,
    escapeKey: false,
  });

  const { getFloatingProps } = useInteractions([dismiss]);

  const latest = React.useRef<PopoverLatestProps>({
    floatingStyles,
    setFloating: refs.setFloating,
    placement,
    getFloatingProps,
    nodeId,
  });
  latest.current = {
    floatingStyles,
    setFloating: refs.setFloating,
    placement: resolvedPlacement,
    getFloatingProps,
    nodeId,
  };

  const Popover = React.useMemo<React.ComponentType<PopoverRendererProps>>(() => {
    const Renderer = (rendererProps: PopoverRendererProps) => {
      const { floatingStyles, setFloating, placement, getFloatingProps, nodeId } = latest.current;
      const { className, open, children } = rendererProps;
      return (
        <FloatingNode id={ nodeId }>
          <PopoverBase
            open={ open }
            className={ className }
            floatingStyles={ floatingStyles }
            setFloating={ setFloating }
            placement={ placement }
            floatingProps={ getFloatingProps() as React.HTMLProps<HTMLDivElement> }
          >
            { children }
          </PopoverBase>
        </FloatingNode>
      );
    };
    return React.memo(Renderer);
  }, []);

  return {
    anchorRef: refs.setReference,
    Popover: Popover,
  };
};
