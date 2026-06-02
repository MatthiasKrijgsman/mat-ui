import * as React from "react";
import {
  autoUpdate,
  flip,
  type Placement,
  shift,
  size,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
} from "@floating-ui/react";
import { PopoverBase } from "@/popover/PopoverBase.tsx";


export type UseSelectPopoverProps = {
  placement?: Placement;
  fullWidth?: boolean;
  minWidth?: number;
  maxWidth?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listRef: React.MutableRefObject<Array<HTMLElement | null>>;
  activeIndex: number | null;
  onNavigate: (index: number | null) => void;
  loop?: boolean;
  disabledIndices?: number[];
};

export type SelectPopoverRendererProps = {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

type SelectPopoverBaseRefProps = {
  floatingStyles: React.CSSProperties;
  setFloating: React.RefCallback<HTMLDivElement>;
  placement: Placement;
  getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
}

export type UseSelectPopoverResult = {
  anchorRef: React.RefCallback<HTMLDivElement | null>;
  Popover: React.ComponentType<SelectPopoverRendererProps>;
  getReferenceProps: (userProps?: React.HTMLProps<Element>) => Record<string, unknown>;
  getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
}

export const useSelectPopover = (props: UseSelectPopoverProps): UseSelectPopoverResult => {
  const {
    placement = "bottom",
    fullWidth,
    minWidth,
    maxWidth,
    open,
    onOpenChange,
    listRef,
    activeIndex,
    onNavigate,
    loop = true,
    disabledIndices,
  } = props;

  const middleware = React.useMemo(() => {
    return [
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
  }, [fullWidth, maxWidth, minWidth]);

  const { refs, floatingStyles, context, placement: resolvedPlacement } = useFloating({
    placement,
    open,
    onOpenChange,
    middleware,
    whileElementsMounted: autoUpdate,
  });

  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate,
    loop,
    virtual: true,
    focusItemOnOpen: false,
    disabledIndices,
  });

  const dismiss = useDismiss(context, {
    outsidePress: true,
    escapeKey: false,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([listNavigation, dismiss]);

  const latest = React.useRef<SelectPopoverBaseRefProps>({
    floatingStyles,
    setFloating: refs.setFloating,
    placement,
    getFloatingProps,
  });
  latest.current = {
    floatingStyles,
    setFloating: refs.setFloating,
    placement: resolvedPlacement,
    getFloatingProps,
  };

  const Popover = React.useMemo<React.ComponentType<SelectPopoverRendererProps>>(() => {
    const Renderer = (rendererProps: SelectPopoverRendererProps) => {
      const { floatingStyles, setFloating, placement, getFloatingProps } = latest.current;
      const { className, open, children } = rendererProps;
      return (
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
      );
    };
    return React.memo(Renderer);
  }, []);

  return {
    anchorRef: refs.setReference,
    Popover,
    getReferenceProps,
    getItemProps,
  };
};
