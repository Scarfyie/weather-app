import { NextResponse }  from 'next/server'
import { openApiSpec }   from '@/lib/openapi'

/**
 * GET /api/docs
 * Returns the OpenAPI 3.0 specification as JSON.
 * Consumed by the Swagger UI page at /docs.
 */
export async function GET() {
  return NextResponse.json(openApiSpec)
}