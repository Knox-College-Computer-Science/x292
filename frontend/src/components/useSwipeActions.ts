import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type SwipeActionsOptions = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  verticalTolerance?: number;
};

type SwipeStart = {
  x: number;
  y: number;
  pointerId: number;
};

export default function useSwipeActions({
  onSwipeLeft,
  onSwipeRight,
  threshold = 80,
  verticalTolerance = 56,
}: SwipeActionsOptions) {
  const swipeStartRef = useRef<SwipeStart | null>(null);

  function clearSwipeStart() {
    swipeStartRef.current = null;
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    swipeStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLElement>) {
    const swipeStart = swipeStartRef.current;
    if (!swipeStart || swipeStart.pointerId !== event.pointerId) {
      clearSwipeStart();
      return;
    }

    const deltaX = event.clientX - swipeStart.x;
    const deltaY = event.clientY - swipeStart.y;
    const isHorizontalSwipe =
      Math.abs(deltaX) >= threshold &&
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaY) <= verticalTolerance;

    clearSwipeStart();

    if (!isHorizontalSwipe) {
      return;
    }

    if (deltaX < 0) {
      onSwipeLeft?.();
      return;
    }

    onSwipeRight?.();
  }

  function handlePointerCancel() {
    clearSwipeStart();
  }

  return {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
  };
}