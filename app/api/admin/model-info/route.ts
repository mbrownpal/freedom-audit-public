import { NextRequest, NextResponse } from 'next/server';
import { selectBestModel, clearModelCache } from '@/app/lib/model-selector';

/**
 * Admin endpoint to check current model selection and manage cache
 * 
 * GET  /api/admin/model-info - Get current model
 * POST /api/admin/model-info?action=clear-cache - Clear model cache
 */
export async function GET(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    const model = await selectBestModel(process.env.ANTHROPIC_API_KEY);

    return NextResponse.json({
      current_model: model,
      timestamp: new Date().toISOString(),
      cache_info: 'Model cache is valid for 1 hour',
    });
  } catch (error) {
    console.error('[Model Info] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get model info' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'clear-cache') {
      clearModelCache();
      
      // Get fresh model after clearing cache
      const model = await selectBestModel(process.env.ANTHROPIC_API_KEY!);

      return NextResponse.json({
        message: 'Model cache cleared',
        current_model: model,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: 'Unknown action. Use ?action=clear-cache' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[Model Info] POST Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
}
