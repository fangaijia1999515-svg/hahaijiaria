"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TrailImage {
  id: string
  x: number
  y: number
  width: number
  rotation: number
  imageUrl: string
  shouldExit: boolean
}

// Unsplash 占位图 URL 数组（abstract, design, shape 关键词）
const IMAGE_URLS = [
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop&q=80", // abstract shapes
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=400&fit=crop&q=80", // geometric design
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=400&fit=crop&q=80", // colorful shapes
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop&q=80", // abstract art
  "https://images.unsplash.com/photo-1557683311-ea0c0a0b0e0e?w=400&h=400&fit=crop&q=80", // design elements
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=400&fit=crop&q=80", // modern shapes
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop&q=80", // abstract patterns
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=400&fit=crop&q=80", // geometric patterns
]

export function ImageTrail() {
  const [images, setImages] = useState<TrailImage[]>([])
  const lastCreateTime = useRef<number>(0)

  // 生成随机宽度（180px 到 260px）
  const getRandomWidth = () => Math.floor(Math.random() * 80) + 180

  // 生成随机旋转角度（-15deg 到 15deg）
  const getRandomRotation = () => Math.floor(Math.random() * 30) - 15

  // 获取随机图片 URL
  const getRandomImage = () => IMAGE_URLS[Math.floor(Math.random() * IMAGE_URLS.length)]

  // 处理鼠标移动（添加节流，每 100ms 最多创建一张图片）
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now()
    if (now - lastCreateTime.current < 100) return // 节流：100ms 内最多创建一张

    // 检查鼠标是否在顶部 80px 范围内（导航栏区域），如果是则直接返回
    if (e.clientY < 80) return

    const container = document.getElementById("image-trail-container")
    if (!container) return

    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // 检查鼠标是否在容器范围内
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      lastCreateTime.current = now

      const newImage: TrailImage = {
        id: `${Date.now()}-${Math.random()}`,
        x,
        y,
        width: getRandomWidth(),
        rotation: getRandomRotation(),
        imageUrl: getRandomImage(),
        shouldExit: false,
      }

      setImages((prev) => [...prev, newImage])

      // 停留 0.5s 后标记为退出
      setTimeout(() => {
        setImages((prev) =>
          prev.map((img) => (img.id === newImage.id ? { ...img, shouldExit: true } : img))
        )
      }, 500)
    }
  }, [])

  // 移除图片（动画结束后）
  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [handleMouseMove])

  return (
    <div
      id="image-trail-container"
      className="absolute top-0 left-0 w-full h-[50vh] z-10 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {images.map((image) => (
          <motion.div
            key={image.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: image.shouldExit ? 0.8 : 1,
              opacity: image.shouldExit ? 0 : 1,
              transition: image.shouldExit
                ? {
                    duration: 0.3,
                    ease: "easeInOut",
                  }
                : {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  },
            }}
            onAnimationComplete={() => {
              if (image.shouldExit) {
                removeImage(image.id)
              }
            }}
            style={{
              position: "absolute",
              left: `${image.x}px`,
              top: `${image.y}px`,
              transform: `translate(-50%, -50%) rotate(${image.rotation}deg)`,
              width: `${image.width}px`,
              height: `${image.width}px`,
              pointerEvents: "none",
            }}
            className="rounded-2xl overflow-hidden"
          >
            <img
              src={image.imageUrl}
              alt="Trail image"
              className="w-full h-full object-cover rounded-2xl"
              loading="lazy"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

