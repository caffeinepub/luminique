import React from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import RoutineScreen from './screens/RoutineScreen';
import ShopScreen from './screens/ShopScreen';
import CommunityScreen from './screens/CommunityScreen';
import ProfileScreen from './screens/ProfileScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import { ToastContainer } from './components/Toast';
import { useToast } from './hooks/useToast';

function RootLayout() {
  const { toasts, dismissToast } = useToast();
  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <Outlet />
    </>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SplashScreen,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: OnboardingScreen,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: HomeScreen,
});

const routineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/routine',
  component: RoutineScreen,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: ShopScreen,
});

const communityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/community',
  component: CommunityScreen,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfileScreen,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPolicyScreen,
});

const routeTree = rootRoute.addChildren([
  splashRoute,
  onboardingRoute,
  homeRoute,
  routineRoute,
  shopRoute,
  communityRoute,
  profileRoute,
  privacyRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
