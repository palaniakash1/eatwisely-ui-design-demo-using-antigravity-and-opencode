# FSA (Food Standards Agency) Integration Documentation

## Table of Contents
1. [Overview](#overview)
2. [About FSA & FHRS](#about-fsa--fhrs)
3. [Architecture](#architecture)
4. [API Endpoints](#api-endpoints)
5. [Database Schema](#database-schema)
6. [Frontend Components](#frontend-components)
7. [Error Handling](#error-handling)
8. [Caching Strategy](#caching-strategy)
9. [Testing with Postman](#testing-with-postman)
10. [Frontend Testing Guide](#frontend-testing-guide)
11. [Swagger Documentation](#swagger-documentation)
12. [Postman Collection](#postman-collection)

---

## Overview

This document covers the Food Standards Agency (FSA) integration implemented in the EatWisely application. The integration allows restaurants to link their FSA hygiene ratings, display them on their public profile, and maintain them automatically.

---

## About FSA & FHRS

### What is FSA?
The **Food Standards Agency (FSA)** is a UK government department responsible for protecting public health in relation to food. It operates entirely independently from the food industry.

### What is FHRS?
The **Food Hygiene Rating Scheme (FHRS)** is a UK-wide scheme run by local authorities in partnership with the FSA. It provides information about hygiene standards in food businesses.

### Rating Scale
| Rating | Meaning |
|--------|---------|
| 5 | Very Good - Highest hygiene standards |
| 4 | Good |
| 3 | Generally Satisfactory |
| 2 | Improvement Necessary |
| 1 | Major Improvement Necessary |
| 0 | Urgent Improvement Necessary |
| Exempt | Business is exempt from inspection |

### FHRSID
Each food business registered with FHRS has a unique identifier called **FHRSID** (Food Hygiene Rating Scheme ID). This ID is used to fetch and link ratings.

### Official Resources
- **FSA Website**: https://www.food.gov.uk
- **FSA API**: https://api.ratings.food.gov.uk
- **Public Rating Lookup**: https://ratings.food.gov.uk

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │   FsaRating     │  │ FSARatingManager │  │FSAMatchSelector│  │
│  │   Component     │  │     Component    │  │   Component    │  │
│  └────────┬────────┘  └────────┬─────────┘  └───────┬────────┘  │
│           │                      │                     │          │
│           └──────────────────────┼─────────────────────┘          │
│                                  │                                │
│                          ┌───────▼───────┐                       │
│                          │   fsaApi.js   │                       │
│                          │   (Service)   │                       │
│                          └───────┬───────┘                       │
└──────────────────────────────────┼────────────────────────────────┘
                                   │ HTTP Requests
┌──────────────────────────────────▼────────────────────────────────┐
│                       Backend (Express/Node)                      │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    FSA Routes (/api/fsa)                   │  │
│  │  GET  /search          - Search FSA establishments        │  │
│  │  GET  /rating/:fhrsId  - Get rating by FHRSID             │  │
│  │  GET  /restaurant/:id  - Get restaurant rating status     │  │
│  │  POST /restaurant/:id/link - Link restaurant to FHRSID    │  │
│  │  POST /restaurant/:id/auto-link - Auto-match & link       │  │
│  │  DEL  /restaurant/:id/link - Unlink restaurant            │  │
│  │  POST /restaurant/:id/refresh - Refresh rating             │  │
│  └───────────────────────────┬────────────────────────────────┘  │
│                              │                                    │
│  ┌───────────────────────────▼────────────────────────────────┐  │
│  │                   FSA Controller                           │  │
│  │              (fsa.controller.js)                           │  │
│  └───────────────────────────┬────────────────────────────────┘  │
│                              │                                    │
│  ┌───────────────────────────▼────────────────────────────────┐  │
│  │                    FSA Service                             │  │
│  │              (fsa.service.js)                              │  │
│  │  - searchEstablishments()                                  │  │
│  │  - getEstablishmentByFHRSID()                              │  │
│  │  - findBestMatch()                                         │  │
│  │  - parseRatingValue()                                      │  │
│  │  - generateBadgeUrl()                                       │  │
│  └───────────────────────────┬────────────────────────────────┘  │
└──────────────────────────────┼────────────────────────────────────┘
                               │ HTTP Requests (with caching)
┌──────────────────────────────▼────────────────────────────────────┐
│                   External: FSA API                               │
│                   https://api.ratings.food.gov.uk                │
└───────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints

### Base URL
```
http://localhost:3000/api/fsa
```

### Endpoint Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/search?name=&postcode=` | Public | Search FSA establishments |
| GET | `/rating/:fhrsId` | Public | Get rating by FHRSID |
| GET | `/restaurant/:restaurantId` | Token | Get restaurant's FSA rating status |
| POST | `/restaurant/:restaurantId/link` | Token | Link restaurant to FHRSID |
| POST | `/restaurant/:restaurantId/auto-link` | Token | Auto-match and link |
| DELETE | `/restaurant/:restaurantId/link` | Token | Unlink restaurant |
| POST | `/restaurant/:restaurantId/refresh` | Token | Refresh rating from FSA |

---

### Endpoint 1: Search FSA Establishments

**Public endpoint** - No authentication required.

```
GET /api/fsa/search?name=<restaurant_name>&postcode=<optional_postcode>
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Restaurant name to search (min 2 characters) |
| postcode | string | No | UK postcode for more accurate matching |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "matched": true,
    "result": {
      "fhrsId": 123456,
      "name": "Restaurant Name",
      "address": {
        "line1": "123 Street",
        "line2": "Area",
        "line3": "City",
        "postcode": "AB12 3CD"
      },
      "rating": "5",
      "ratingDate": "2024-01-15",
      "hygieneScore": 5,
      "structuralScore": 5,
      "confidenceInManagementScore": 5
    },
    "multipleOptions": null,
    "score": 0.95
  }
}
```

**Multiple Matches Response (200):**
```json
{
  "success": true,
  "data": {
    "matched": true,
    "result": { ... },
    "multipleOptions": [
      { "fhrsId": 123456, "name": "Main Branch", ... },
      { "fhrsId": 123457, "name": "City Center", ... }
    ],
    "score": 0.85
  }
}
```

**No Match Response (200):**
```json
{
  "success": true,
  "data": {
    "matched": false,
    "result": null,
    "multipleOptions": null,
    "message": "No suitable match found"
  }
}
```

---

### Endpoint 2: Get Rating by FHRSID

**Public endpoint** - No authentication required.

```
GET /api/fsa/rating/:fhrsId
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fhrsId | number | Yes | FHRS ID of the establishment |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "fhrsId": 123456,
    "name": "Restaurant Name",
    "address": {
      "line1": "123 Street",
      "line2": "Area",
      "line3": "City",
      "postcode": "AB12 3CD"
    },
    "rating": "5",
    "ratingDate": "2024-01-15",
    "hygieneScore": 5,
    "structuralScore": 5,
    "confidenceInManagementScore": 5
  },
  "badgeUrl": "https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-5.svg"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "data": null,
  "error": "Establishment not found"
}
```

---

### Endpoint 3: Get Restaurant FSA Rating Status

**Authentication required** - Bearer token.

```
GET /api/fsa/restaurant/:restaurantId
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| restaurantId | string | Yes | MongoDB ObjectId of the restaurant |

**Success Response (200) - Linked:**
```json
{
  "success": true,
  "linked": true,
  "data": {
    "fhrsId": 123456,
    "rating": "5",
    "badgeUrl": "https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-5.svg",
    "lastRefreshed": "2024-01-20T10:30:00.000Z"
  }
}
```

**Success Response (200) - Not Linked:**
```json
{
  "success": true,
  "linked": false,
  "data": {
    "fhrsId": null,
    "rating": null,
    "badgeUrl": null,
    "lastRefreshed": null
  }
}
```

---

### Endpoint 4: Link Restaurant to FHRSID

**Authentication required** - Bearer token.

```
POST /api/fsa/restaurant/:restaurantId/link
```

**Request Body:**
```json
{
  "fhrsId": 123456
}
```

**Validation:**
- `fhrsId`: Required, positive integer

**Success Response (200):**
```json
{
  "success": true,
  "message": "Restaurant linked to FSA rating successfully",
  "data": {
    "restaurantId": "65a1f9c8a9c123456789abcd",
    "fhrsId": 123456,
    "rating": "5",
    "badgeUrl": "https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-5.svg",
    "lastRefreshed": "2024-01-20T10:30:00.000Z"
  }
}
```

---

### Endpoint 5: Auto-Link Restaurant

**Authentication required** - Bearer token. Automatically searches FSA by restaurant name and postcode, then links if a match is found.

```
POST /api/fsa/restaurant/:restaurantId/auto-link
```

**Success Response (200) - Match Found:**
```json
{
  "success": true,
  "linked": true,
  "data": {
    "restaurantId": "65a1f9c8a9c123456789abcd",
    "fhrsId": 123456,
    "rating": "5",
    "badgeUrl": "https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-5.svg",
    "lastRefreshed": "2024-01-20T10:30:00.000Z"
  },
  "matchScore": 0.92
}
```

**No Match Response (200):**
```json
{
  "success": false,
  "linked": false,
  "message": "No matching FSA establishment found",
  "data": null,
  "multipleOptions": [
    { "fhrsId": 123456, "name": "Similar Name", ... }
  ]
}
```

---

### Endpoint 6: Unlink Restaurant

**Authentication required** - Bearer token.

```
DELETE /api/fsa/restaurant/:restaurantId/link
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Restaurant unlinked from FSA rating successfully"
}
```

---

### Endpoint 7: Refresh Restaurant Rating

**Authentication required** - Bearer token. Fetches latest rating from FSA API.

```
POST /api/fsa/restaurant/:restaurantId/refresh
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Rating refreshed successfully",
  "data": {
    "fhrsId": 123456,
    "rating": "5",
    "badgeUrl": "https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-5.svg",
    "lastRefreshed": "2024-01-20T12:00:00.000Z"
  }
}
```

---

## Database Schema

### Restaurant Model - FSA Fields

```javascript
const restaurantSchema = {
  // ... other fields
  
  fhrsId: {
    type: Number,
    default: null,
    index: true
  },
  
  fsaRating: {
    value: {
      type: String,
      enum: ['0', '1', '2', '3', '4', '5', 'Exempt', null],
      default: null
    },
    lastRefreshed: {
      type: Date,
      default: null
    },
    isManuallyLinked: {
      type: Boolean,
      default: false
    }
  }
};
```

---

## Frontend Components

### 1. FsaRating Component

Displays the FSA hygiene rating badge on restaurant pages.

**Location:** `client/src/components/FsaRating.jsx`

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| fhrsId | number | - | FHRS ID to fetch rating for |
| showLabel | boolean | true | Show text label below badge |
| size | string | 'md' | Badge size: 'sm', 'md', 'lg' |
| className | string | '' | Additional CSS classes |

**Usage:**
```jsx
import FsaRating from './components/FsaRating';

// Display with badge and label
<FsaRating fhrsId={123456} size="md" showLabel={true} />

// Small badge without label
<FsaRating fhrsId={123456} size="sm" showLabel={false} />
```

**States:**
- Loading: Shows skeleton pulse animation
- Not Linked: Shows "Hygiene rating not available"
- Error: Shows "Hygiene rating not available"
- Success: Shows badge image with label

---

### 2. FSARatingManager Component

Full UI for managing FSA rating linking (Admin dashboard).

**Location:** `client/src/components/FSARatingManager.jsx`

**Features:**
- Auto-link: Search and auto-match FSA establishment
- Manual search: Search FSA with custom name/postcode
- View current status: Shows linked rating details
- Refresh: Fetch latest rating from FSA
- Unlink: Remove FSA rating link

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| restaurant | object | Restaurant object with fhrsId, fsaRating |
| onUpdate | function | Callback when rating is updated |

**Usage:**
```jsx
import FSARatingManager from './components/FSARatingManager';

<FSARatingManager 
  restaurant={restaurant}
  onUpdate={(updatedData) => console.log('Updated:', updatedData)}
/>
```

---

### 3. FSAMatchSelector Component

Modal for selecting from multiple FSA establishment matches.

**Location:** `client/src/components/FSAMatchSelector.jsx`

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| matches | array | Array of matching establishments |
| onSelect | function | Callback with selected match |
| onCancel | function | Callback to close modal |
| restaurantName | string | Original restaurant name |
| restaurantPostcode | string | Original restaurant postcode |

---

### 4. FSA API Service

**Location:** `client/src/services/fsaApi.js`

**Available Methods:**
```javascript
import fsaApi from '../services/fsaApi';

// Search for FSA establishments
const searchResults = await fsaApi.searchFSA('Pizza Palace', 'SW1A 1AA');

// Get rating by FHRSID
const rating = await fsaApi.getFsaRating(123456);

// Get restaurant's current FSA status
const status = await fsaApi.getRestaurantRating('restaurant-id');

// Link restaurant to FHRSID
const linked = await fsaApi.linkRestaurant('restaurant-id', 123456);

// Auto-link restaurant
const autoLinked = await fsaApi.autoLinkRestaurant('restaurant-id');

// Unlink restaurant
const unlinked = await fsaApi.unlinkRestaurant('restaurant-id');

// Refresh rating
const refreshed = await fsaApi.refreshRestaurantRating('restaurant-id');
```

---

## Error Handling

### Error Cases and Responses

| Scenario | API Response | Frontend Display |
|----------|-------------|-------------------|
| `fhrsId` is null | Shows not available | "Hygiene rating not available" |
| API returns no data | Shows not available | "Hygiene rating not available" |
| Invalid FHRSID | 404 error | "Hygiene rating not available" |
| Network error | 500 error | "Hygiene rating not available" |
| Rating value invalid | Returns null | "Hygiene rating not available" |

### Error Response Format

```json
{
  "success": false,
  "error": "Error message here",
  "data": null
}
```

### Rating Not-Found Handling Configuration

```javascript
const fsaNotFoundConfig = {
  feature: "fsa_rating_not_found_handling",
  condition: "fhrsId_null_or_no_match",
  ui: {
    type: "text",
    message: "Hygiene rating not available",
    style: "subtle_gray"  // text-gray-400
  },
  logic: {
    cases: [
      { when: "fhrsId_is_null", action: "show_not_available" },
      { when: "api_returns_no_data", action: "show_not_available" },
      { when: "invalid_rating_value", action: "show_not_available" }
    ]
  },
  constraints: [
    "do_not_show_exempt_for_unlisted",
    "do_not_show_fake_rating"
  ],
  fallback_strategy: "graceful_text_display",
  user_experience: "clear_honest_feedback_without_confusion",
  outcome: "maintain_trust_and_avoid_misleading_information"
};
```

---

## Caching Strategy

### Redis Cache Implementation

| Cache Key Pattern | TTL | Description |
|-------------------|-----|-------------|
| `fsa:establishment:{fhrsId}` | 12 hours | Establishment details |
| `fsa:rating:{fhrsId}` | 24 hours | Rating data |

### Cache Behavior

1. **On GET /rating/:fhrsId:**
   - Check Redis cache first
   - If cache hit, return cached data
   - If cache miss, fetch from FSA API and cache result

2. **On POST /restaurant/:id/refresh:**
   - Bypass cache, always fetch fresh from FSA API
   - Update cache after successful fetch

3. **Background Job (fsaRatingRefresh.job.js):**
   - Runs every 24 hours in production
   - Refreshes ratings older than 24 hours
   - Batch process: 50 restaurants per batch

---

## Testing with Postman

### Prerequisites

1. **Start the server:**
   ```bash
   cd api
   npm run dev
   ```

2. **Get authentication token:**
   - Login via `/api/auth/login` endpoint
   - Copy the `token` from response

3. **Set Postman environment variables:**
   ```
   baseUrl: http://localhost:3000/api
   token: <your_jwt_token>
   restaurantId: <test_restaurant_id>
   ```

---

### Test 1: Search FSA Establishments

**Request:**
```
GET {{baseUrl}}/fsa/search?name=Pizza Express&postcode=W1D 3QW
```

**Expected Response (200):**
```json
{
  "success": true,
  "matched": true,
  "data": {
    "fhrsId": 123456,
    "name": "Pizza Express",
    "address": {...},
    "rating": "5",
    ...
  }
}
```

---

### Test 2: Get Rating by FHRSID

**Request:**
```
GET {{baseUrl}}/fsa/rating/123456
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "fhrsId": 123456,
    "name": "Pizza Express",
    "rating": "5",
    "badgeUrl": "https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-5.svg"
  }
}
```

---

### Test 3: Search with Invalid Name

**Request:**
```
GET {{baseUrl}}/fsa/search?name=a
```

**Expected Response (400):**
```json
{
  "success": false,
  "error": "\"name\" must be at least 2 characters"
}
```

---

### Test 4: Get Restaurant FSA Status (Auth Required)

**Request:**
```
GET {{baseUrl}}/fsa/restaurant/{{restaurantId}}
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "linked": true,
  "data": {
    "fhrsId": 123456,
    "rating": "5",
    "badgeUrl": "...",
    "lastRefreshed": "2024-01-20T10:30:00.000Z"
  }
}
```

---

### Test 5: Link Restaurant to FHRSID (Auth Required)

**Request:**
```
POST {{baseUrl}}/fsa/restaurant/{{restaurantId}}/link
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "fhrsId": 123456
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Restaurant linked to FSA rating successfully",
  "data": {...}
}
```

---

### Test 6: Auto-Link Restaurant (Auth Required)

**Request:**
```
POST {{baseUrl}}/fsa/restaurant/{{restaurantId}}/auto-link
Authorization: Bearer {{token}}
```

**Expected Response (200) - Match found:**
```json
{
  "success": true,
  "linked": true,
  "matchScore": 0.92,
  "data": {...}
}
```

---

### Test 7: Unlink Restaurant (Auth Required)

**Request:**
```
DELETE {{baseUrl}}/fsa/restaurant/{{restaurantId}}/link
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Restaurant unlinked from FSA rating successfully"
}
```

---

### Test 8: Refresh Restaurant Rating (Auth Required)

**Request:**
```
POST {{baseUrl}}/fsa/restaurant/{{restaurantId}}/refresh
Authorization: Bearer {{token}}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Rating refreshed successfully",
  "data": {
    "fhrsId": 123456,
    "rating": "5",
    "badgeUrl": "...",
    "lastRefreshed": "2024-01-20T12:00:00.000Z"
  }
}
```

---

### Test 9: Test with Invalid FHRSID

**Request:**
```
GET {{baseUrl}}/fsa/rating/99999999
```

**Expected Response (404):**
```json
{
  "success": false,
  "data": null,
  "error": "Establishment not found"
}
```

---

### Test 10: Test with Invalid FHRSID Format

**Request:**
```
POST {{baseUrl}}/fsa/restaurant/{{restaurantId}}/link
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "fhrsId": -1
}
```

**Expected Response (400):**
```json
{
  "success": false,
  "error": "\"fhrsId\" must be a positive integer"
}
```

---

## Frontend Testing Guide

### Testing FsaRating Component

1. **Navigate to a restaurant page with FSA rating:**
   ```
   http://localhost:5173/restaurant/your-restaurant-slug
   ```

2. **Verify badge displays correctly:**
   - Check badge image loads
   - Verify rating text displays (e.g., "Hygiene Rating: 5/5")
   - Verify FSA attribution shows

3. **Test with null fhrsId:**
   - Create a restaurant without linking FSA
   - Navigate to its public page
   - Verify "Hygiene rating not available" text appears (gray color)

4. **Test different badge sizes:**
   - `size="sm"` - Should show small badge
   - `size="md"` - Should show medium badge
   - `size="lg"` - Should show large badge

---

### Testing FSARatingManager Component

1. **Access Admin Dashboard:**
   ```
   http://localhost:5173/admin
   ```

2. **Navigate to Restaurant Settings:**
   ```
   http://localhost:5173/admin/restaurants/:id/fsa-rating
   ```

3. **Test Auto-Link Flow:**
   - Click "Auto Link" button
   - Verify search is performed using restaurant name/postcode
   - If single match: Should auto-link
   - If multiple matches: Should show FSAMatchSelector modal
   - Select correct match from modal
   - Verify success message and updated rating

4. **Test Manual Search:**
   - Click "Search FSA"
   - Enter custom restaurant name
   - Optionally enter postcode
   - Click search
   - Verify results appear

5. **Test Refresh:**
   - Verify current rating displays
   - Click "Refresh Rating"
   - Verify loading state appears
   - Verify updated rating after refresh

6. **Test Unlink:**
   - Click "Unlink"
   - Confirm action
   - Verify "Not linked" status shows

---

### Testing Error States

1. **Test API Error:**
   - Temporarily break FSA API connection
   - Navigate to restaurant page
   - Verify "Hygiene rating not available" shows

2. **Test Loading State:**
   - Navigate to restaurant page
   - Verify skeleton loading animation shows initially

3. **Test Image Load Error:**
   - If badge image fails to load
   - Verify fallback text still shows

---

## Swagger Documentation

### fsa.swagger.js

```javascript
/**
 * @swagger
 * tags:
 *   - name: FSA Ratings
 *     description: Food Standards Agency (FSA) hygiene rating integration APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FSAEstablishment:
 *       type: object
 *       properties:
 *         fhrsId:
 *           type: integer
 *           example: 123456
 *         name:
 *           type: string
 *           example: Pizza Express
 *         address:
 *           type: object
 *           properties:
 *             line1:
 *               type: string
 *             line2:
 *               type: string
 *             line3:
 *               type: string
 *             postcode:
 *               type: string
 *         rating:
 *           type: string
 *           enum: ['0', '1', '2', '3', '4', '5', 'Exempt']
 *           example: '5'
 *         ratingDate:
 *           type: string
 *           format: date
 *           example: '2024-01-15'
 *         hygieneScore:
 *           type: integer
 *           example: 5
 *         structuralScore:
 *           type: integer
 *           example: 5
 *         confidenceInManagementScore:
 *           type: integer
 *           example: 5
 *
 *     FSARatingResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/FSAEstablishment'
 *         badgeUrl:
 *           type: string
 *           example: 'https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-5.svg'
 *
 *     FSARestaurantStatus:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         linked:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             fhrsId:
 *               type: integer
 *               example: 123456
 *             rating:
 *               type: string
 *               example: '5'
 *             badgeUrl:
 *               type: string
 *             lastRefreshed:
 *               type: string
 *               format: date-time
 *
 *     LinkFSARequest:
 *       type: object
 *       required:
 *         - fhrsId
 *       properties:
 *         fhrsId:
 *           type: integer
 *           minimum: 1
 *           example: 123456
 */
```

### Endpoint Documentation

#### Search Establishments
```javascript
/**
 * @swagger
 * /fsa/search:
 *   get:
 *     tags: [FSA Ratings]
 *     summary: Search FSA establishments (Public)
 *     description: >
 *       Search for food establishments in the UK Food Hygiene Rating Scheme.
 *       Returns best match with optional multiple options if confidence is similar.
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         description: Restaurant name to search (minimum 2 characters)
 *         schema:
 *           type: string
 *           minLength: 2
 *         example: Pizza Express
 *       - in: query
 *         name: postcode
 *         required: false
 *         description: UK postcode for more accurate matching
 *         schema:
 *           type: string
 *         example: W1D 3QW
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 matched:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/FSAEstablishment'
 *                 multipleOptions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FSAEstablishment'
 *                 score:
 *                   type: number
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
```

#### Get Rating by FHRSID
```javascript
/**
 * @swagger
 * /fsa/rating/{fhrsId}:
 *   get:
 *     tags: [FSA Ratings]
 *     summary: Get FSA rating by FHRSID (Public)
 *     description: >
 *       Fetch hygiene rating details for a specific food establishment
 *       using its FHRS (Food Hygiene Rating Scheme) ID.
 *     parameters:
 *       - in: path
 *         name: fhrsId
 *         required: true
 *         description: FHRS ID of the establishment
 *         schema:
 *           type: integer
 *         example: 123456
 *     responses:
 *       200:
 *         description: Rating found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FSARatingResponse'
 *       404:
 *         description: Establishment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
```

#### Get Restaurant FSA Status
```javascript
/**
 * @swagger
 * /fsa/restaurant/{restaurantId}:
 *   get:
 *     tags: [FSA Ratings]
 *     summary: Get restaurant's FSA rating status
 *     description: Get the current FSA rating link status for a restaurant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         description: MongoDB restaurant ID
 *         schema:
 *           type: string
 *         example: 65a1f9c8a9c123456789abcd
 *     responses:
 *       200:
 *         description: Status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FSARestaurantStatus'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Restaurant not found
 */
```

#### Link Restaurant
```javascript
/**
 * @swagger
 * /fsa/restaurant/{restaurantId}/link:
 *   post:
 *     tags: [FSA Ratings]
 *     summary: Link restaurant to FSA rating
 *     description: Manually link a restaurant to an FSA establishment by FHRSID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LinkFSARequest'
 *     responses:
 *       200:
 *         description: Successfully linked
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Restaurant not found
 */
```

#### Auto-Link Restaurant
```javascript
/**
 * @swagger
 * /fsa/restaurant/{restaurantId}/auto-link:
 *   post:
 *     tags: [FSA Ratings]
 *     summary: Auto-match and link restaurant
 *     description: >
 *       Automatically search for the restaurant in FSA database
 *       using its name and postcode, then link if a match is found.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Match found and linked, or multiple options returned
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Restaurant not found
 */
```

#### Unlink Restaurant
```javascript
/**
 * @swagger
 * /fsa/restaurant/{restaurantId}/link:
 *   delete:
 *     tags: [FSA Ratings]
 *     summary: Unlink restaurant from FSA rating
 *     description: Remove the FSA rating link from a restaurant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully unlinked
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Restaurant not found
 */
```

#### Refresh Rating
```javascript
/**
 * @swagger
 * /fsa/restaurant/{restaurantId}/refresh:
 *   post:
 *     tags: [FSA Ratings]
 *     summary: Refresh restaurant FSA rating
 *     description: Fetch latest rating from FSA API and update database
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rating refreshed successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Restaurant not found or not linked
 */
```

---

## Postman Collection

### fsa.postman_collection.json

```json
{
  "info": {
    "name": "MERN Restaurant - FSA Ratings API",
    "description": "Food Standards Agency hygiene rating integration endpoints",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {"key": "baseUrl", "value": "http://localhost:3000/api"},
    {"key": "token", "value": ""},
    {"key": "restaurantId", "value": ""},
    {"key": "fhrsId", "value": "123456"}
  ],
  "item": [
    {
      "name": "Public - Search FSA Establishments",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/fsa/search?name=Pizza Express&postcode=W1D 3QW",
          "query": [
            {"key": "name", "value": "Pizza Express"},
            {"key": "postcode", "value": "W1D 3QW"}
          ]
        }
      }
    },
    {
      "name": "Public - Get Rating by FHRSID",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/fsa/rating/{{fhrsId}}"
      }
    },
    {
      "name": "Auth - Get Restaurant FSA Status",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/fsa/restaurant/{{restaurantId}}",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ]
      }
    },
    {
      "name": "Auth - Link Restaurant to FHRSID",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/fsa/restaurant/{{restaurantId}}/link",
        "header": [
          {"key": "Content-Type", "value": "application/json"},
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"fhrsId\": {{fhrsId}}\n}"
        }
      }
    },
    {
      "name": "Auth - Auto-Link Restaurant",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/fsa/restaurant/{{restaurantId}}/auto-link",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ]
      }
    },
    {
      "name": "Auth - Unlink Restaurant",
      "request": {
        "method": "DELETE",
        "url": "{{baseUrl}}/fsa/restaurant/{{restaurantId}}/link",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ]
      }
    },
    {
      "name": "Auth - Refresh Restaurant Rating",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/fsa/restaurant/{{restaurantId}}/refresh",
        "header": [
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ]
      }
    },
    {
      "name": "Error - Invalid FHRSID (Negative)",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/fsa/restaurant/{{restaurantId}}/link",
        "header": [
          {"key": "Content-Type", "value": "application/json"},
          {"key": "Authorization", "value": "Bearer {{token}}"}
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"fhrsId\": -1\n}"
        }
      }
    },
    {
      "name": "Error - Not Found FHRSID",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/fsa/rating/99999999"
      }
    },
    {
      "name": "Error - Search Name Too Short",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{baseUrl}}/fsa/search?name=a",
          "query": [
            {"key": "name", "value": "a"}
          ]
        }
      }
    },
    {
      "name": "Error - Unauthorized Access",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/fsa/restaurant/{{restaurantId}}"
      }
    }
  ]
}
```

---

## Appendix: FHRS Rating Badge URLs

| Rating | Badge URL |
|--------|-----------|
| 0 | `https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-0.svg` |
| 1 | `https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-1.svg` |
| 2 | `https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-2.svg` |
| 3 | `https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-3.svg` |
| 4 | `https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-4.svg` |
| 5 | `https://ratings.food.gov.uk/images/badges/fhrs/3/fhrs-badge-5.svg` |
| Exempt | Use local `fhrs_exempt.png` asset |

---

## Appendix: FSA API Rate Limits

- **Base URL**: `https://api.ratings.food.gov.uk`
- **API Version**: 2
- **Rate Limit**: Not explicitly documented, but recommended to:
  - Cache responses (12-24 hours)
  - Use retry logic with exponential backoff
  - Batch operations when possible

---

## Appendix: Environment Variables

```env
# FSA Configuration (if needed for future extensions)
FSA_API_BASE_URL=https://api.ratings.food.gov.uk
FSA_API_VERSION=2

# Redis Cache TTL (in seconds)
FSA_CACHE_TTL_ESTABLISHMENT=43200  # 12 hours
FSA_CACHE_TTL_RATING=86400          # 24 hours
```

---

## Support & Troubleshooting

### Common Issues

1. **"Establishment not found"**: 
   - Verify the FHRSID is correct
   - Check if the establishment is registered with FSA

2. **"No suitable match found"**:
   - Try adding postcode to search
   - Check spelling of restaurant name
   - The establishment might not be in FHRS database

3. **Rating shows "not available"**:
   - Check browser console for errors
   - Verify API server is running
   - Check Redis cache is accessible

4. **Auto-link returns multiple options**:
   - This is expected behavior
   - User must manually select correct establishment

### Logs

FSA-related logs are prefixed with `fsa_api.*`:
- `fsa_api.cache_hit` - Cache hit for establishment
- `fsa_api.cache_miss` - Cache miss, fetching from API
- `fsa_api.search_error` - Search operation failed
- `fsa_api.fetch_error` - FHRSID fetch failed

---

*Document Version: 1.0*  
*Last Updated: 2024*  
*Maintained by: Development Team*
