//Based on https://github.com/AlexWebLab/bootstrap-5-breakpoint-react-hook/issues/1 and the original repository
import { useEffect, useState } from 'react'

export const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']
const breakpointSizes = [576, 768, 992, 1200, 1440]

export type Breakpoint = typeof breakpoints[number]

const resolveSizeIndex = (): number => {
  const width = window.innerWidth
  const filter = breakpointSizes.filter((v) => v < width)
  return filter.length
};

const isSmallerThanCutoff = (cutoff: Breakpoint): boolean => {
  // Get the current breakpoint as a number
  const currentSizeIndex = resolveSizeIndex()
  // Get the chosen breakpoint cutoff as a number
  const cutoffIndex = breakpoints.indexOf(cutoff)
  return currentSizeIndex <= cutoffIndex
}

const isLargerThanCutoff = (cutoff: Breakpoint): boolean => {
  // Get the current breakpoint as a number
  const currentSizeIndex = resolveSizeIndex()
  // Get the chosen breakpoint cutoff as a number
  const cutoffIndex = breakpoints.indexOf(cutoff)
  return currentSizeIndex >= cutoffIndex
}

export function useBreakpointUp(cutoff: Breakpoint) {
  const [passesCutoff, setPassesCutoff] = useState(isLargerThanCutoff(cutoff))

  useEffect(() => {
    const calcInnerWidth = () => {
      setPassesCutoff(isLargerThanCutoff(cutoff))
    }
    window.addEventListener('resize', calcInnerWidth)
    return () => window.removeEventListener('resize', calcInnerWidth)
  }, [cutoff])

  return passesCutoff
}

export function useBreakpointDown(cutoff: Breakpoint) {
  const [passesCutoff, setPassesCutoff] = useState(isSmallerThanCutoff(cutoff))

  useEffect(() => {
    const calcInnerWidth = () => {
      setPassesCutoff(isSmallerThanCutoff(cutoff))
    }
    window.addEventListener('resize', calcInnerWidth)
    return () => window.removeEventListener('resize', calcInnerWidth)
  }, [cutoff])

  return passesCutoff
}

export function useBreakpointIdx() {
  const [breakpointIdx, setBreakpointIdx] = useState(resolveSizeIndex())

  useEffect(() => {
    const calcInnerWidth = () => {
      setBreakpointIdx(resolveSizeIndex())
    }
    window.addEventListener('resize', calcInnerWidth)
    return () => window.removeEventListener('resize', calcInnerWidth)
  }, [])

  return breakpointIdx
}

export default function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState(breakpoints[resolveSizeIndex()])

  useEffect(() => {
    const calcInnerWidth = () => {
      setBreakpoint(breakpoints[resolveSizeIndex()])
    }
    window.addEventListener('resize', calcInnerWidth)
    return () => window.removeEventListener('resize', calcInnerWidth)
  }, [])

  return breakpoint
}
