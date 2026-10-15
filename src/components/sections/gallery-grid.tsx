'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { galleryMedia } from '@/data/media'

import styles from './landing-sections.module.css'

export function GalleryGrid() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([])
  const openerIndexRef = useRef<number | null>(null)
  const reduceMotion = useReducedMotion()
  const isOpen = selectedIndex !== null

  const closeLightbox = () => {
    const returnIndex = openerIndexRef.current
    const dialog = dialogRef.current
    if (dialog?.open) dialog.close()
    setSelectedIndex(null)
    openerIndexRef.current = null
    if (returnIndex !== null) {
      window.setTimeout(() => triggerRefs.current[returnIndex]?.focus(), 0)
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !isOpen) return

    const previousOverflow = document.body.style.overflow
    if (!dialog.open) dialog.showModal()
    document.body.style.overflow = 'hidden'

    const navigate = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setSelectedIndex((current) =>
          current === null ? 0 : (current + 1) % galleryMedia.length,
        )
      }
      if (event.key === 'ArrowLeft') {
        setSelectedIndex((current) =>
          current === null
            ? galleryMedia.length - 1
            : (current - 1 + galleryMedia.length) % galleryMedia.length,
        )
      }
    }

    document.addEventListener('keydown', navigate)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', navigate)
    }
  }, [isOpen])

  const previous = () =>
    setSelectedIndex((current) =>
      current === null
        ? galleryMedia.length - 1
        : (current - 1 + galleryMedia.length) % galleryMedia.length,
    )

  const next = () =>
    setSelectedIndex((current) =>
      current === null ? 0 : (current + 1) % galleryMedia.length,
    )

  const selectedAsset =
    selectedIndex === null ? null : galleryMedia[selectedIndex]

  return (
    <>
      <div className={styles.galleryGrid}>
        {galleryMedia.map((asset, index) => (
          <button
            ref={(element) => {
              triggerRefs.current[index] = element
            }}
            className={styles.galleryItem}
            type="button"
            aria-label={`Открыть изображение ${index + 1}: ${asset.alt}`}
            key={asset.src}
            onClick={() => {
              openerIndexRef.current = index
              setSelectedIndex(index)
            }}
          >
            <Image
              src={asset.src}
              alt={asset.alt}
              fill
              sizes={
                index === 0 || index === 4
                  ? '(max-width: 767px) 100vw, 58vw'
                  : '(max-width: 767px) 100vw, 42vw'
              }
              style={{ objectPosition: asset.focalPoint }}
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        aria-label="Просмотр галереи"
        onCancel={(event) => {
          event.preventDefault()
          closeLightbox()
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeLightbox()
        }}
      >
        {selectedAsset && selectedIndex !== null ? (
          <motion.div
            className={styles.lightboxContent}
            key={selectedAsset.src}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
          >
            <div className={styles.lightboxImage}>
              <Image
                src={selectedAsset.src}
                alt={selectedAsset.alt}
                fill
                sizes="100vw"
                style={{ objectPosition: selectedAsset.focalPoint }}
              />
            </div>
            <p className={styles.lightboxCaption}>{selectedAsset.alt}</p>
            <p
              className={`${styles.lightboxCounter} font-display`}
              aria-live="polite"
            >
              {selectedIndex + 1} / {galleryMedia.length}
            </p>
          </motion.div>
        ) : null}

        <button
          className={styles.lightboxClose}
          type="button"
          aria-label="Закрыть галерею"
          onClick={closeLightbox}
        >
          <X aria-hidden="true" />
        </button>
        <button
          className={`${styles.lightboxArrow} ${styles.lightboxPrevious}`}
          type="button"
          aria-label="Предыдущее изображение"
          onClick={previous}
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          className={`${styles.lightboxArrow} ${styles.lightboxNext}`}
          type="button"
          aria-label="Следующее изображение"
          onClick={next}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </dialog>
    </>
  )
}
