// src/stores/animationQueueStore.ts
import { writable } from 'svelte/store'

const createAnimationQueue = () => {
  let queue: (() => Promise<void>)[] = []
  let isRunning = false

  const run = async () => {
    if (isRunning || queue.length === 0) return
    isRunning = true
    while (queue.length > 0) {
        const currentAnimation = queue.shift()
        if (currentAnimation) { // This check ensures currentAnimation is not undefined.
            await currentAnimation()
        }
    }
    isRunning = false
}

  const add = (animation: () => Promise<void>) => {
    queue.push(animation)
    run()
  }

  return {
    add,
  }
}

export const animationQueue = createAnimationQueue()
