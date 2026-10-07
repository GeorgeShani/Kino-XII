import { type RefObject, useEffect } from "react";

const DRAG_THRESHOLD_PX = 5;

export function useDragScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let pressed = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      pressed = true;
      moved = false;
      startX = event.clientX;
      startScroll = element.scrollLeft;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pressed) return;
      const delta = event.clientX - startX;

      if (!moved && Math.abs(delta) > DRAG_THRESHOLD_PX) {
        moved = true;
        element.setPointerCapture(event.pointerId);
        element.style.cursor = "grabbing";
      }
      if (moved) element.scrollLeft = startScroll - delta;
    };

    const onPointerEnd = () => {
      pressed = false;
      element.style.cursor = "";
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    };

    const onDragStart = (event: DragEvent) => event.preventDefault();

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerEnd);
    element.addEventListener("pointercancel", onPointerEnd);
    element.addEventListener("click", onClickCapture, true);
    element.addEventListener("dragstart", onDragStart);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerEnd);
      element.removeEventListener("pointercancel", onPointerEnd);
      element.removeEventListener("click", onClickCapture, true);
      element.removeEventListener("dragstart", onDragStart);
    };
  }, [ref]);
}
