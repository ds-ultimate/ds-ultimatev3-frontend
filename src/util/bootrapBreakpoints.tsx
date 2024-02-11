/* 
Copyright (c) 2023 extremecrazycoder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

//Based on https://github.com/AlexWebLab/bootstrap-5-breakpoint-react-hook/issues/1 and the original repository
import {useEffect, useState} from 'react'

export const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']
const breakpointSizes = [576, 768, 992, 1250, 1440]

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
