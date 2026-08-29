# Agile Model Selector

Future-proof model selection system for the Freedom Audit report generation.

## Overview

The model selector automatically picks the best available Anthropic model based on:
- **Preference order** - newest Sonnet models first, then fallbacks
- **Availability** - validates models are actually available
- **Caching** - avoids repeated lookups (1 hour TTL)

## How It Works

When a user completes the assessment:

1. The generate API calls `selectBestModel(apiKey)`
2. The selector checks its cache (valid for 1 hour)
3. If cache is stale, it fetches available models
4. It picks the first model from the preference list that's available
5. The report is generated using that model

## Model Preference Order

1. **claude-sonnet-4-5-20250929** (current latest)
2. claude-sonnet-4-5-20250514
3. claude-sonnet-4-5
4. claude-sonnet-4-20250514
5. claude-sonnet-4
6. claude-3-7-sonnet-20250219
7. claude-3-5-sonnet-20241022
8. claude-3-5-sonnet-20240620
9. claude-opus-4-20250514 (fallback)
10. claude-3-opus-20240229 (final fallback)

## When Anthropic Updates

**You don't need to change the code immediately.** The selector will keep using the latest available model from the list.

### To add a new model:

1. Edit `app/lib/model-selector.ts`
2. Add the new model ID to the top of `MODEL_PREFERENCE`
3. Deploy (Vercel auto-deploys on push to main)

Example:
```typescript
const MODEL_PREFERENCE = [
  // Add new model here
  'claude-sonnet-5-20260101',  // ← NEW
  
  // Existing models...
  'claude-sonnet-4-5-20250929',
  'claude-sonnet-4-5-20250514',
  // ...
];
```

### To check which model is currently being used:

```bash
curl https://freedomaudit.com/api/admin/model-info
```

Response:
```json
{
  "current_model": "claude-sonnet-4-5-20250929",
  "timestamp": "2026-08-29T21:00:00.000Z",
  "cache_info": "Model cache is valid for 1 hour"
}
```

### To force a cache refresh:

```bash
curl -X POST 'https://freedomaudit.com/api/admin/model-info?action=clear-cache'
```

This is useful if:
- Anthropic just released a new model
- You updated the preference list
- You want to test the selector logic

## Error Handling

The selector has multiple fallback layers:

1. **First choice**: Best available model from preference list
2. **Second choice**: Any available model
3. **Last resort**: Newest known model (even if validation fails)

If a model fails during actual report generation, the API will return a 500 error with the specific message. The user sees "Generation failed" but we get logs showing the exact issue.

## Future Enhancements

When Anthropic adds a `/v1/models` endpoint:
- Update `fetchAvailableModels()` to query it
- This will make the selector truly dynamic
- Until then, we manage the preference list manually

## Files

- **`app/lib/model-selector.ts`** - Core selector logic
- **`app/api/generate/route.ts`** - Report generation (uses selector)
- **`app/api/admin/model-info/route.ts`** - Admin endpoint for inspection

## Maintenance Schedule

**Monthly**: Check Anthropic's model documentation for new releases
**On Error**: If users report generation failures, check model availability

## Testing

To test locally:

```bash
cd freedom-audit-public
npm run dev

# In another terminal:
curl http://localhost:3000/api/admin/model-info
```

The selector will log to console:
```
[Model Selector] Selected: claude-sonnet-4-5-20250929
[Generate API] Using model: claude-sonnet-4-5-20250929
```
