import Hero from '@/features/home/components/Hero'
import WhyOffiMeal from '@/features/home/components/WhyOffiMeal'
import FeaturedMeals from '@/features/home/components/FeaturedMeals'
import HowItWorks from '@/features/home/components/HowItWorks'
import SubscriptionPlans from '@/features/home/components/SubscriptionPlans'
import NutritionPreview from '@/features/home/components/NutritionPreview'
import WorkoutPreview from '@/features/home/components/WorkoutPreview'

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyOffiMeal />
      <FeaturedMeals />
      <HowItWorks />
      <SubscriptionPlans />
      <NutritionPreview />
      <WorkoutPreview />
    </>
  )
}
