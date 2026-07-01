import { useEffect, useRef, useState, type RefObject } from 'react'

const DRAG_THRESHOLD = 6

export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const draggedRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let isPointerDown = false
    let isDragActive = false
    let startX = 0
    let scrollStart = 0
    let activePointerId = -1

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return

      isPointerDown = true
      isDragActive = false
      draggedRef.current = false
      startX = event.clientX
      scrollStart = el.scrollLeft
      activePointerId = event.pointerId
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!isPointerDown || event.pointerId !== activePointerId) return

      const delta = event.clientX - startX
      if (!isDragActive && Math.abs(delta) <= DRAG_THRESHOLD) return

      if (!isDragActive) {
        isDragActive = true
        draggedRef.current = true
        setIsDragging(true)
        el.setPointerCapture(event.pointerId)
      }

      el.scrollLeft = scrollStart - delta
    }

    const endDrag = (event: PointerEvent) => {
      if (!isPointerDown || event.pointerId !== activePointerId) return

      isPointerDown = false

      if (isDragActive) {
        el.releasePointerCapture(event.pointerId)
        setIsDragging(false)
        window.setTimeout(() => {
          draggedRef.current = false
        }, 0)
      }

      isDragActive = false
      activePointerId = -1
    }

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return

      event.preventDefault()
      el.scrollLeft += event.deltaY
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', endDrag)
    el.addEventListener('pointercancel', endDrag)
    el.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', endDrag)
      el.removeEventListener('pointercancel', endDrag)
      el.removeEventListener('wheel', onWheel)
    }
  }, [])

  return { ref: ref as RefObject<T>, draggedRef, isDragging }
}
