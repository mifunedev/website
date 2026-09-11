'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react'
import { X } from 'lucide-react'

interface ImageWithPreviewProps {
  src: string
  alt: string
  containerClassName?: string
  imageClassName?: string
}

export function ImageWithPreview({ 
  src, 
  alt, 
  containerClassName = "", 
  imageClassName = "" 
}: ImageWithPreviewProps) {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div 
        className={`cursor-pointer ${containerClassName}`}
        onClick={() => setIsOpen(true)}
      >
        <Image 
          src={src} 
          alt={alt} 
          fill
          className={imageClassName}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/80 transition-opacity duration-300 ease-out data-[closed]:opacity-0"
        />
        
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel 
              transition
              className="relative max-w-7xl overflow-hidden rounded-lg p-1 shadow-xl transition-all duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                    }}
                    className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors backdrop-blur-sm"
                >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                </button>
              <Image 
                src={src} 
                alt={alt} 
                width={1200}
                height={800}
                className="max-h-[85vh] w-auto object-contain rounded-md" 
                style={{ width: 'auto', height: 'auto' }}
                onClick={(e) => e.stopPropagation()}
              />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

