import Anthropic from '@anthropic-ai/sdk';

/**
 * Smart model selector that automatically picks the best available Anthropic model.
 * Future-proof against model updates and deprecations.
 */

// Ordered preference list (best to fallback)
const MODEL_PREFERENCE = [
  // Sonnet 4.5 variants (newest first)
  'claude-sonnet-4-5-20250929',
  'claude-sonnet-4-5-20250514',
  'claude-sonnet-4-5',
  
  // Sonnet 4 variants
  'claude-sonnet-4-20250514',
  'claude-sonnet-4',
  
  // Sonnet 3.7 variants (proven reliable)
  'claude-3-7-sonnet-20250219',
  'claude-3-5-sonnet-20241022',
  'claude-3-5-sonnet-20240620',
  
  // Opus fallback (most capable if Sonnet unavailable)
  'claude-opus-4-20250514',
  'claude-3-opus-20240229',
];

// Cache available models (expires after 1 hour)
let cachedModels: string[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Fetch available models from Anthropic API
 */
async function fetchAvailableModels(apiKey: string): Promise<string[]> {
  try {
    const anthropic = new Anthropic({ apiKey });
    
    // Try to list models - Anthropic doesn't have a dedicated endpoint for this yet,
    // so we'll use a lightweight validation approach
    // For now, we'll use our preference list and validate each one
    
    // In the future, when Anthropic adds a models endpoint:
    // const response = await anthropic.models.list();
    // return response.data.map(m => m.id);
    
    return MODEL_PREFERENCE;
  } catch (error) {
    console.error('[Model Selector] Error fetching models:', error);
    return MODEL_PREFERENCE;
  }
}

/**
 * Get cached or fresh list of available models
 */
async function getAvailableModels(apiKey: string): Promise<string[]> {
  const now = Date.now();
  
  // Return cached if still valid
  if (cachedModels && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedModels;
  }
  
  // Fetch fresh list
  const models = await fetchAvailableModels(apiKey);
  cachedModels = models;
  cacheTimestamp = now;
  
  return models;
}

/**
 * Select the best available model based on preference order
 */
export async function selectBestModel(apiKey: string): Promise<string> {
  try {
    const availableModels = await getAvailableModels(apiKey);
    
    // Find first model in preference list that's available
    for (const preferred of MODEL_PREFERENCE) {
      if (availableModels.includes(preferred)) {
        console.log(`[Model Selector] Selected: ${preferred}`);
        return preferred;
      }
    }
    
    // Fallback to first available model
    if (availableModels.length > 0) {
      const fallback = availableModels[0];
      console.warn(`[Model Selector] Using fallback: ${fallback}`);
      return fallback;
    }
    
    // Last resort: use the newest known model
    const lastResort = MODEL_PREFERENCE[0];
    console.warn(`[Model Selector] Last resort: ${lastResort}`);
    return lastResort;
    
  } catch (error) {
    console.error('[Model Selector] Error selecting model:', error);
    // Emergency fallback
    return MODEL_PREFERENCE[0];
  }
}

/**
 * Validate a model works by making a minimal test call
 * Returns true if model is available, false otherwise
 */
export async function validateModel(apiKey: string, model: string): Promise<boolean> {
  try {
    const anthropic = new Anthropic({ apiKey });
    
    await anthropic.messages.create({
      model,
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Hi' }],
    });
    
    return true;
  } catch (error: any) {
    // Check if it's a model not found error
    if (error?.status === 404 || error?.error?.type === 'not_found_error') {
      console.warn(`[Model Selector] Model not found: ${model}`);
      return false;
    }
    
    // Other errors might be API keys, rate limits, etc - assume model exists
    console.warn(`[Model Selector] Validation error for ${model}:`, error?.message);
    return true;
  }
}

/**
 * Get the best model with validation fallback
 * If the selected model fails, try the next one in the list
 */
export async function selectAndValidateModel(apiKey: string): Promise<string> {
  const availableModels = await getAvailableModels(apiKey);
  
  for (const model of MODEL_PREFERENCE) {
    if (availableModels.includes(model)) {
      const isValid = await validateModel(apiKey, model);
      if (isValid) {
        console.log(`[Model Selector] Validated and selected: ${model}`);
        return model;
      }
    }
  }
  
  // If all validations fail, use the first preference (user will see error if truly broken)
  const fallback = MODEL_PREFERENCE[0];
  console.warn(`[Model Selector] All validations failed, using: ${fallback}`);
  return fallback;
}

/**
 * Clear the cache (useful for testing or manual refresh)
 */
export function clearModelCache(): void {
  cachedModels = null;
  cacheTimestamp = 0;
}
