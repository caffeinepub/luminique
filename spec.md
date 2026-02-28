# Specification

## Summary
**Goal:** Build Luminique, a fully frontend gamified skincare self-care app with routine tracking, a points/tier system, an in-app shop, community feed, and a personalized onboarding flow — all persisted via Zustand + localStorage.

**Planned changes:**
- Set up four Zustand stores (userStore, routineStore, shopStore, communityStore) all persisted to localStorage
- Implement React Router with 7 routes: `/` (Splash), `/onboarding`, `/home`, `/routine`, `/shop`, `/community`, `/profile`; new users routed to onboarding, returning users to home after 2.5s splash
- Build SplashScreen with animated lotus SVG logo, tagline "Glow. Grow. Bloom.", and beige-to-lavender animated gradient background
- Build 8-step OnboardingScreen with progress indicator, gender/age/skin type/concerns/routine preference selections, mock AI skin scan step, and profile creation form; all data saved to userStore
- Build HomeScreen with time-aware greeting, GlowPoints badge, FlowerEngine component (Seed/Bud/Bloom/Withered states), 7-day streak calendar strip, quick action cards for morning/evening routines, today's tip card, and GlowPoints summary card
- Build FlowerEngine SVG/CSS component with four animated states (seed, bud with sway, bloom with pulse-glow, withered with droop) and smooth state transitions
- Build RoutineScreen with month calendar view (morning ☀️ / evening 🌙 dots), morning and evening step checklists with completion percentages, streak stats card, and 7-entry log history
- Build ShopScreen with filter chips, personalized product banner, 2-column 12-product grid with wishlist toggles and cart, product detail modal, slide-up cart drawer with GlowPoints discount toggle, and mock checkout flow with confetti on success
- Build CommunityScreen with trending products horizontal scroll, 5 pre-seeded mock posts with like toggles, achievement sharing card, and top-5 leaderboard with current user highlighted
- Build ProfileScreen with stats grid, tier progress card, achievements badge grid (locked/unlocked), routine summary, wishlist grid, notification/privacy settings toggles, and Privacy Policy sub-screen
- Implement gamification logic: GlowPoints awards (+10 morning, +10 evening, +5 both-same-day bonus, +50 seven-day streak, +15 review, +25 first purchase), tier thresholds (Starter/GlowUp/GlowPro), flower state function, floating "+10" text animation, and streak number-roll animation
- Implement global UI effects: CSS confetti (20–30 particles, 1.5s, lavender/pink/mint/gold), Web Audio API chime (880Hz sine, 0.8s decay), and slide-in toast notification system with 5 contextual messages
- Apply all page/UI animations: fade+slide-up route transitions, horizontal onboarding step slides, card hover scale, cart badge bounce, and checkmark draw animation on step completion
- Apply Luminique design system across all screens: beige-to-lavender gradient, brand color palette, glass morphism cards with backdrop-blur, Poppins font from Google Fonts, 430px max-width mobile container centered on desktop with phone frame, 44px min touch targets, no horizontal scroll
- Build inline SVG Logo component with 5-petal lotus (violet-to-lavender gradient), mint green leaves, warm beige container, and "luminique" Poppins wordmark
- Implement `getRecommendations(user)` utility filtering products by skinType/skinConcerns, sorted by rating descending, returning top 6 for the Shop's personalized section

**User-visible outcome:** Users can open Luminique, complete a personalized onboarding flow, track daily morning and evening skincare routines, earn GlowPoints and tier badges, watch their flower grow with their streak, browse and wishlist/cart skincare products with personalized recommendations, view a community feed and leaderboard, and manage their profile — all within a polished mobile-styled app that persists state across sessions.
