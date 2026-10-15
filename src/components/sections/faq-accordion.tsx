'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

import { faqItems } from '@/data/faq'

import styles from './landing-sections.module.css'

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const reduceMotion = useReducedMotion()

  return (
    <div className={styles.faqList}>
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index
        const answerId = `faq-answer-${index}`

        return (
          <div className={styles.faqItem} key={item.question}>
            <h3>
              <button
                className={styles.faqTrigger}
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                {item.question}
                <span aria-hidden="true" />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={answerId}
                  className={styles.faqAnswer}
                  role="region"
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.22 }}
                >
                  <p>{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
