# Advanced Google Analytics Implementation for Mechanics of Motherhood

## Overview

This implementation provides comprehensive tracking for user interactions throughout the Mechanics of Motherhood recipe application. It includes enhanced ecommerce tracking, custom events, and detailed user engagement analytics.

## 🚀 Features Implemented

### 1. **Enhanced Google Tag Manager Setup**

- ✅ Google Analytics 4 (GA4) with tracking ID `G-M7TYR1V6KP`
- ✅ Enhanced ecommerce configuration
- ✅ Custom dimensions and metrics
- ✅ Cross-domain tracking ready

### 2. **Core Analytics Library** (`/src/lib/analytics.ts`)

#### Key Event Types

- **Recipe Interactions**: View, search, category browsing
- **Navigation Tracking**: Menu clicks, page views, search queries
- **User Engagement**: Scroll depth, time on page, section views
- **Conversion Events**: Recipe completion, category exploration

#### Advanced Features

- **Enhanced Ecommerce**: Treats recipes as products for engagement tracking
- **Custom Dimensions**: Recipe category, difficulty, prep time, engagement level
- **Scroll Depth Tracking**: 25%, 50%, 75%, 100% milestones
- **Time-based Engagement**: Tracks meaningful interaction time
- **Debug Mode**: Development environment logging

### 3. **React Analytics Hook** (`/src/hooks/useAnalytics.ts`)

#### useAnalytics Hook Features

- Automatic page view tracking
- Recipe interaction tracking
- Search event tracking
- Button and navigation click tracking
- Form submission tracking
- Custom event tracking

#### useRecipeAnalytics Hook Features

- Detailed recipe engagement tracking
- Section view tracking (ingredients, instructions, nutrition, notes)
- Recipe completion analytics
- Time-based engagement metrics

### 4. **Component-Level Tracking**

#### Recipe Detail Page (`/src/pages/recipe-detail.tsx`)

- ✅ Recipe view events with complete metadata
- ✅ Ingredients section engagement tracking
- ✅ Instructions section engagement tracking
- ✅ Recipe completion tracking on navigation
- ✅ Back button interaction analytics

#### Recipes Listing Page (`/src/pages/recipes.tsx`)

- ✅ Search query tracking with results count
- ✅ Category filter analytics
- ✅ Recipe card click tracking
- ✅ Pagination interaction tracking

#### Category Pages (`/src/pages/category-recipes.tsx`)

- ✅ Category view analytics with recipe count
- ✅ Category-specific search tracking
- ✅ Recipe interaction from category context

#### Navigation Component (`/src/components/navigation.tsx`)

- ✅ Menu navigation click tracking
- ✅ Search form submissions
- ✅ Mobile menu interaction analytics

#### Featured Recipes Component (`/src/components/featured-recipes.tsx`)

- ✅ "Build It" button tracking with recipe context
- ✅ "Browse Full Manual" conversion tracking

## 📊 Analytics Events Reference

### Custom Events Tracked

| Event Name | Description | Context Data |
|------------|-------------|--------------|
| `recipe_view` | User views recipe detail page | Recipe ID, name, category, ratings |
| `recipe_search` | User searches for recipes | Search term, results count, search type |
| `recipe_category_view` | User browses recipe category | Category name, recipe count |
| `button_click` | User clicks tracked buttons | Button name, context, location |
| `navigation_click` | User clicks navigation links | Link text, URL, section |
| `content_engagement` | User engagement milestones | Type, value, page path |
| `recipe_complete_view` | User completes recipe viewing | Time spent, sections viewed |
| `form_submit` | User submits tracked forms | Form name, location, data |

### Enhanced Ecommerce Events

| Event Name | Description | Data Structure |
|------------|-------------|----------------|
| `view_item` | Recipe viewed as product | Item ID, name, category, value |
| `view_item_list` | Category browsed as product list | List ID, name, items array |
| `search` | Recipe search performed | Search term, results |

## 🔧 Configuration

### Analytics Configuration Object

```typescript
const ANALYTICS_CONFIG = {
  TRACKING_ID: 'G-M7TYR1V6KP',
  ENHANCED_ECOMMERCE: true,
  CUSTOM_DIMENSIONS: {
    RECIPE_CATEGORY: 'custom_dimension_1',
    RECIPE_DIFFICULTY: 'custom_dimension_2', 
    RECIPE_PREP_TIME: 'custom_dimension_3',
    USER_ENGAGEMENT_LEVEL: 'custom_dimension_4'
  }
};
```

## 📈 Key Metrics Being Tracked

### Recipe Engagement Metrics

- Recipe page views with detailed metadata
- Time spent viewing recipes
- Recipe section engagement (ingredients, instructions)
- Recipe completion rates
- Search-to-recipe conversion

### User Behavior Analytics

- Navigation patterns across the site
- Search behavior and query analysis
- Category exploration patterns
- Button interaction rates
- Scroll depth and page engagement

### Conversion Tracking

- Recipe discovery to viewing funnel
- Search to recipe engagement
- Category browsing to recipe selection
- Featured recipe click-through rates

## 🛠 Usage Examples

### Basic Usage

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function MyComponent() {
  const analytics = useAnalytics();
  
  const handleClick = () => {
    analytics.trackButtonClick('my_button', 'component_context');
  };
}
```

### Recipe Specific Tracking

```typescript
import { useRecipeAnalytics } from '@/hooks/useAnalytics';

function RecipeComponent({ recipe }) {
  const analytics = useRecipeAnalytics(recipe);
  
  const handleIngredientView = () => {
    analytics.trackIngredientView();
  };
}
```

## 🔍 Debug Mode

In development environment, analytics events are logged to console:

```
📊 Analytics Event: {
  command: "event",
  eventName: "recipe_view",
  eventParams: { recipe_id: "123", recipe_name: "Pasta Recipe" }
}
```

## 📋 Testing Checklist

- [ ] Google Analytics dashboard receiving events
- [ ] Recipe view events with correct metadata
- [ ] Search tracking with results count
- [ ] Category navigation analytics
- [ ] Button click tracking across components
- [ ] Enhanced ecommerce events in GA4
- [ ] Custom dimensions populated correctly
- [ ] Scroll depth milestones triggering
- [ ] Recipe completion tracking working
- [ ] Debug mode logging in development

## 🚀 Deployment Considerations

1. **Production Environment**: Debug mode automatically disabled
2. **Performance**: All events are non-blocking and async
3. **Privacy**: Respects user consent settings
4. **Data Quality**: Validates data before sending to GA4
5. **Error Handling**: Graceful degradation if GA4 unavailable

## 📊 Expected Analytics Insights

Once deployed, you'll be able to analyze:

- **Most Popular Recipes**: Track which recipes get the most engagement
- **Search Patterns**: Understand what users are looking for
- **User Journey**: See how users navigate through categories
- **Engagement Quality**: Measure time spent and interaction depth
- **Conversion Funnels**: Track from discovery to recipe completion
- **Mobile vs Desktop**: Compare engagement across devices
- **Content Performance**: Identify high-performing recipe categories

## 🔮 Future Enhancements

Potential future additions:

- User segmentation based on engagement patterns
- A/B testing framework integration
- Recipe recommendation tracking
- Email capture and newsletter signup analytics
- Social sharing tracking
- Print recipe functionality analytics
- User feedback and rating analytics

---

**Implementation Status**: ✅ Complete and Ready for Production

The advanced analytics implementation provides comprehensive tracking for user behavior, recipe engagement, and conversion metrics throughout the Mechanics of Motherhood application.
