import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'

export interface FixedDropdownPosition {
  top: number
  right: number
}

export function useFixedDropdown() {
  const anchorRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<FixedDropdownPosition | null>(null)

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current
    if (!anchor) return

    const rect = anchor.getBoundingClientRect()
    setPosition({
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    })
  }, [])

  useEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, updatePosition])

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: globalThis.MouseEvent) => {
      const target = event.target as Node
      if (
        anchorRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const toggle = (event?: ReactMouseEvent) => {
    event?.stopPropagation()
    setOpen((prev) => !prev)
  }

  const close = () => setOpen(false)

  return {
    anchorRef,
    dropdownRef,
    open,
    position,
    toggle,
    close,
  }
}
