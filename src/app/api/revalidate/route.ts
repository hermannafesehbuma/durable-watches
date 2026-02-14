import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Server-side revalidation functions (moved from cache-utils.ts)
function revalidatePathsOnServer(paths: string[]) {
  paths.forEach((path) => {
    try {
      revalidatePath(path);
      console.log(`Revalidated path: ${path}`);
    } catch (error) {
      console.error(`Failed to revalidate path ${path}:`, error);
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const { paths } = await request.json();

    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json(
        { error: 'Invalid paths provided' },
        { status: 400 }
      );
    }

    // Use the server-side revalidation function
    revalidatePathsOnServer(paths);

    return NextResponse.json(
      { message: 'Revalidation completed', revalidatedPaths: paths },
      { status: 200 }
    );
  } catch (error) {
    console.error('Revalidation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
