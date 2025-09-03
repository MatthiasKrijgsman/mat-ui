import * as React from "react";
import { Scrollbars } from 'react-custom-scrollbars';

export type ScrollAreaProps = {
  children?: React.ReactNode;
}

export const ScrollArea = (props: ScrollAreaProps) => {
  const {
    children
  } = props;
  return (
    <Scrollbars
      style={ { height: '100%', width: '100%' } }
    >
      { children }
    </Scrollbars>
  );
};