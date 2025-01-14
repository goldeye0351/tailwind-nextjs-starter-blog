'use client'
import styles from './toc.module.css'
import { useState, useEffect } from 'react'

const TOC = ({ headings }: { headings: any }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    const throttle = (func: Function, limit: number) => {
      let inThrottle: boolean
      return function (this: any, ...args: any[]) {
        if (!inThrottle) {
          func.apply(this, args)
          inThrottle = true
          setTimeout(() => (inThrottle = false), limit)
        }
      }
    }

    const actionSectionScrollSpy = throttle(() => {
      const sections = document.getElementsByClassName('content-header')

      let prevBBox: DOMRect | null = null
      let currentSectionId: string | null = null

      for (let i = 0; i < sections.length; ++i) {
        const section = sections[i]
        if (!section || !(section instanceof Element)) continue
        const bbox = section.getBoundingClientRect()
        const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
        const offset = Math.max(150, prevHeight / 4)
        if (bbox.top - offset < 0) {
          currentSectionId = section.getAttribute('id')
          prevBBox = bbox
          continue
        }

        break
      }

      if (currentSectionId !== activeSection) {
        setActiveSection(currentSectionId)
      }
    }, 100)

    window.addEventListener('scroll', actionSectionScrollSpy)
    return () => window.removeEventListener('scroll', actionSectionScrollSpy)
  }, [activeSection])

  return (
    <nav className="bg-mycardcolor  rounded-xl p-1   " aria-label="目录导航">
      <ul>
        {headings.map(({ value, url, depth }) => (
          <li
            key={url}
            className={`mb-2 ${
              depth === 3 ? 'ml-4' : depth === 4 ? 'ml-8' : depth === 5 ? 'ml-12' : ''
            }`}
          >
            <a
              href={`${url}`}
              className={`block transition-all duration-300 ${
                activeSection === url.substring(1) ? styles.activeLine : ''
              }`}
            >
              <div
                className={`hover:bg-myrightcolor cursor-pointer rounded-xl  p-1
                              italic duration-300 hover:p-3 
                              hover:blur-0 ${
                                activeSection === url.substring(1)
                                  ? 'rounded-xl border-2 border-green-500 font-extrabold text-green-500 blur-0 '
                                  : 'blur-[1px]'
                              }`}
              >
                {value}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TOC
