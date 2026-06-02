import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    // Create a flag file that the Python watcher will detect
    const flagPath = path.join('D:', 'D', 'ai therepist', 'launch_flappy.flag');
    fs.writeFileSync(flagPath, 'launch');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error launching Flappy Bird:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to launch Flappy Bird' },
      { status: 500 }
    );
  }
}