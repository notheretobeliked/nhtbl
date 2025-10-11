// Energy usage state management using Svelte 5 runes
// This replaces traditional stores with modern runes-based state

export type EnergyMode = 'none' | 'low' | 'high'

// Global energy usage state using runes
class EnergyUsageState {
  // Private state - start with 'low' for progressive enhancement
  #mode = $state<EnergyMode>('low')
  #isHydrated = $state(false)
  
  // Public getter
  get mode(): EnergyMode {
    return this.#mode
  }
  
  // Public setter
  set mode(value: EnergyMode) {
    this.#mode = value
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('energyUsageMode', value)
    }
  }
  
  // Check if the app has been hydrated
  get isHydrated(): boolean {
    return this.#isHydrated
  }
  
  // Initialize from localStorage and mark as hydrated
  init() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('energyUsageMode') as EnergyMode
      if (saved && ['none', 'low', 'high'].includes(saved)) {
        this.#mode = saved
      } else {
        // Default to 'high' if no saved preference
        this.#mode = 'high'
      }
      this.#isHydrated = true
    }
  }
  
  // Convenience methods
  get isNone() {
    return this.#mode === 'none'
  }
  
  get isLow() {
    return this.#mode === 'low'
  }
  
  get isHigh() {
    return this.#mode === 'high'
  }
  
  // Mode descriptions for UI
  get modeDescription() {
    switch (this.#mode) {
      case 'none':
        return 'No images (accessibility mode)'
      case 'low':
        return 'Low resolution images'
      case 'high':
        return 'High resolution images'
    }
  }
}

// Create singleton instance
export const energyUsage = new EnergyUsageState()

// Initialize on client-side
if (typeof window !== 'undefined') {
  energyUsage.init()
}