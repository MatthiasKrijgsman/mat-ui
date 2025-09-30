export const ScrollbarTest = () => {

  // const { ref: containerRef, height: containerHeight } = useResizeObserver<HTMLDivElement>();
  // const { ref: contentRef, height: contentHeight } = useResizeObserver<HTMLDivElement>();
  //
  // const [ scrollTop, setScrollTop ] = useState(0);
  //
  // const handleScroll = (e) => {
  //   const target = e.currentTarget;
  //   setScrollTop(target.scrollTop);
  // };
  //
  // const thumbTop = containerHeight && contentHeight ? (scrollTop / contentHeight) * containerHeight : 0;
  // const thumbHeight = containerHeight && contentHeight ? Math.max((containerHeight / contentHeight) * containerHeight, 20) : 20;


  return (
    <div></div>
    // <div
    //   className={ 'relative' }
    //   style={ { height: 200 } }
    // >
    //   <div
    //     className={ 'relative overflow-scroll mat-ui-hide-scrollbars border h-full w-full border-red-500' }
    //     ref={ containerRef }
    //     onScroll={ handleScroll }
    //   >
    //
    //     {/* Content */ }
    //     <div ref={ contentRef } className={ 'absolute flex flex-col gap-3' } style={ { height: 600, width: 1000 } }>
    //       <div className={ 'bg-amber-100 flex-1' }></div>
    //       <div className={ 'bg-amber-100 flex-1' }></div>
    //       <div className={ 'bg-amber-100 flex-1' }></div>
    //       <div className={ 'bg-amber-100 flex-1' }></div>
    //       <div className={ 'bg-amber-100 flex-1' }></div>
    //     </div>
    //
    //   </div>
    //   {/*Track*/ }
    //   <div className={ 'absolute top-px right-px bottom-px w-5 bg-blue-100' }>
    //     {/*Thumb*/ }
    //     <div
    //       onMouseDown={ e => {
    //         console.log('start drag')
    //       } }
    //       style={ { top: thumbTop, height: thumbHeight } }
    //       className={ 'absolute top-0 bg-blue-600 w-3 right-px' }
    //     />
    //   </div>
    // </div>
  );
};