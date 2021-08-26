import * as React from 'react'
import { AnalyticsProvider, useFirebaseApp, useAnalytics } from 'reactfire';
import { getAnalytics, logEvent } from 'firebase/analytics'


function MyPageViewLogger() {
  const analytics = useAnalytics()

  React.useEffect(() => {
      logEvent(analytics, 'page_view', { page_location: location.href });
    }, [location.href])

  return null
}

export function Analytics() {
  const app = useFirebaseApp();
  return (
      <AnalyticsProvider sdk={getAnalytics(app)}>
        <MyPageViewLogger />
      </AnalyticsProvider>
  );
}
