import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUserActivities } from '@/lib/static-dashboard-data';
import { moodStore } from '@/lib/mood-store';

/**
 * @swagger
 * /api/activities/today: 
 *   get: 
 *     summary: Get today's activities for the authenticated user
 *     description: Fetches all activities recorded by the authenticated user for the current day
 *     tags: [Activities]
 *     responses: 
 *       200: 
 *         description: Successfully fetched today's activities
 *         content: 
 *           application/json: 
 *             schema: 
 *               type: array
 *               items: 
 *                 type: object
 *                 properties: 
 *                   id: 
 *                     type: string
 *                   userId: 
 *                     type: string
 *                   type: 
 *                     type: string
 *                   name: 
 *                     type: string
 *                   description: 
 *                     type: string
 *                     nullable: true
 *                   duration: 
 *                     type: number
 *                     nullable: true
 *                   timestamp: 
 *                     type: string
 *                     format: date-time
 *       401: 
 *         description: Unauthorized - User not authenticated
 *       500: 
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  try {
    // Mock activities for development - bypasses backend entirely
    if (process.env.NODE_ENV !== "production") {
      console.log("Mock /api/activities/today called");
      
      // Return mock activities for today with recent timestamps
      const now = new Date();
      const mockActivities = [
        {
          id: "2",
          userId: "mock-user-id",
          type: "meditation",
          name: "Morning Meditation",
          description: "10-minute mindfulness session",
          duration: 10,
          completed: true,
          timestamp: new Date(now.getTime() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
        },
        {
          id: "3",
          userId: "mock-user-id",
          type: "exercise",
          name: "Walking",
          description: "30-minute walk in the park",
          duration: 30,
          completed: true,
          timestamp: new Date(now.getTime() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
        },
        {
          id: "4",
          userId: "mock-user-id",
          type: "journal",
          name: "Journal Entry",
          description: "Reflecting on today's goals and achievements",
          duration: 15,
          completed: true,
          timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        },
      ];
      
      // Add stored mood activities from today
      const todaysMoods = moodStore.getTodaysMoods();
      console.log(`Returning ${todaysMoods.length} mood activities from store`);
      
      return NextResponse.json([...todaysMoods, ...mockActivities], { status: 200 });
    }

    // Production: use real backend
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const activities = await getUserActivities(session.user.id);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      return activityDate >= today && activityDate < tomorrow;
    });
    
    return NextResponse.json(todayActivities, { status: 200 });
  } catch (error) {
    console.error('Error fetching today\'s activities:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}