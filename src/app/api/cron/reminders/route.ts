import { NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

webpush.setVapidDetails(
  'mailto:support@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY || ''
)

export async function GET(req: Request) {
  // Optional: add basic auth or check for a cron secret header if exposed to public
  try {
    // We need service role to query all users
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Find users who have subscriptions
    const { data: subscriptions } = await supabase.from('push_subscriptions').select('user_id, endpoint, p256dh, auth')
    
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'No subscriptions found' })
    }

    let sentCount = 0

    // In a real scenario, you'd check if they haven't logged food in N hours.
    // For simplicity, we just send to everyone who has a subscription right now.
    for (const sub of subscriptions) {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.auth,
          p256dh: sub.p256dh
        }
      }

      const payload = JSON.stringify({
        title: 'Не забудьте залогувати їжу! 🍽️',
        body: 'Зайдіть, щоб записати що ви сьогодні їли.',
        url: '/diary'
      })

      try {
        await webpush.sendNotification(pushSubscription, payload)
        sentCount++
      } catch (err: any) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          // Subscription expired or invalid, remove from DB
          await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
        } else {
          console.error('Push error:', err)
        }
      }
    }

    return NextResponse.json({ success: true, sent: sentCount })
  } catch (error: any) {
    console.error('Cron error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
