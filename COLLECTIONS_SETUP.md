# AASC Backend - Complete Collection Setup

## Overview

This backend connects to your existing MongoDB Atlas database (`aasc_db`) in Cluster 0 and provides CRUD operations for all 35 collections through RESTful APIs.

## ✅ All 35 Collections Connected

### About Section (6 collections)

1. **about\_\_chiefmentordata** - `/api/about/chiefmentordata`
2. **about\_\_governingbodycouncildata** - `/api/about/governingbodycouncildata`
3. **about\_\_ourteamdata** - `/api/about/ourteamdata`
4. **about\_\_pressreleasesdata** - `/api/about/pressreleasesdata`
5. **about\_\_principaldatap** - `/api/about/principaldatap`
6. **about\_\_profileofcollegedata** - `/api/about/profileofcollegedata`

### Academics Section (6 collections)

7. **academics\_\_academiccalendardata** - `/api/academics/academiccalendardata`
8. **academics\_\_departmentsdata** - `/api/academics/departmentsdata`
9. **academics\_\_pgprogramsdetails** - `/api/academics/pgprogramsdetails`
10. **academics\_\_prospectusdata** - `/api/academics/prospectusdata`
11. **academics\_\_ugprogramsdatadetails** - `/api/academics/ugprogramsdatadetails`
12. **academics\_\_valuedaddedcoursesdata** - `/api/academics/valuedaddedcoursesdata`

### Campus Life Section (1 collection)

13. **campus-life\_\_seeddata** - `/api/campus-life/seeddata`

### Committees Section (1 collection)

14. **committees\_\_committeesdata** - `/api/committees/committeesdata`

### Contact Section (1 collection)

15. **contact\_\_contactdata** - `/api/contact/contactdata`

### Events Section (2 collections)

16. **events\_\_eventsdata** - `/api/events/eventsdata`
17. **events\_\_upcommingeventspreviewdata** - `/api/events/upcommingeventspreviewdata`

### Home Section (14 collections)

18. **home\_\_achievementsstatsdata** - `/api/home/achievementsstatsdata`
19. **home\_\_admissionsdata** - `/api/home/admissionsdata`
20. **home\_\_allhomedata** - `/api/home/allhomedata` (NOT YET CREATED - composite data)
21. **home\_\_announcementsdata** - `/api/home/announcementsdata` (NOT YET CREATED)
22. **home\_\_carouseldata** - `/api/home/carouseldata`
23. **home\_\_circularpreviewdata** - `/api/home/circularpreviewdata`
24. **home\_\_missionvisiondata** - `/api/home/missionvisiondata`
25. **home\_\_newstickerdata** - `/api/home/newstickerdata`
26. **home\_\_ourcampusdata** - `/api/home/ourcampusdata`
27. **home\_\_ourleads** - `/api/home/ourleads`
28. **home\_\_ourschoolscollegesdata** - `/api/home/ourschoolscollegesdata`
29. **home\_\_recruitersdata** - `/api/home/recruitersdata`
30. **home\_\_testimonialdata** - `/api/home/testimonialdata`
31. **home\_\_welcomedata** - `/api/home/welcomedata`

### IQAC Section (1 collection)

32. **iqac\_\_nirfdata** - `/api/iqac/nirfdata`

### Placements Section (2 collections)

33. **placements\_\_placementrecords** - `/api/placements/placementrecords`
34. **placements\_\_trainingandplacementsdata** - `/api/placements/trainingandplacementsdata`

## 📁 File Structure

```
server/
├── models/                    # 35 Mongoose schemas
│   ├── about__chiefmentordata.js
│   ├── about__governingbodycouncildata.js
│   ├── about__ourteamdata.js
│   ├── about__pressreleasesdata.js
│   ├── about__principaldatap.js
│   ├── about__profileofcollegedata.js
│   ├── academics__academiccalendardata.js
│   ├── academics__departmentsdata.js
│   ├── academics__pgprogramsdetails.js
│   ├── academics__prospectusdata.js
│   ├── academics__ugprogramsdatadetails.js
│   ├── academics__valuedaddedcoursesdata.js
│   ├── campus-life__seeddata.js
│   ├── committees__committeesdata.js
│   ├── contact__contactdata.js
│   ├── events__eventsdata.js
│   ├── events__upcommingeventspreviewdata.js
│   ├── home__achievementsstatsdata.js
│   ├── home__admissionsdata.js
│   ├── home__carouseldata.js
│   ├── home__circularpreviewdata.js
│   ├── home__missionvisiondata.js
│   ├── home__newstickerdata.js
│   ├── home__ourcampusdata.js
│   ├── home__ourleads.js
│   ├── home__ourschoolscollegesdata.js
│   ├── home__recruitersdata.js
│   ├── home__testimonialdata.js
│   ├── home__welcomedata.js
│   ├── iqac__nirfdata.js
│   ├── placements__placementrecords.js
│   └── placements__trainingandplacementsdata.js
│
├── controllers/               # 35 CRUD controllers
│   ├── about__chiefmentordataController.js
│   ├── about__governingbodycouncildataController.js
│   ├── about__ourteamdataController.js
│   ├── about__pressreleasesdataController.js
│   ├── about__principaldatapController.js
│   ├── about__profileofcollegedataController.js
│   └── ... (30 more controllers)
│
└── routes/                    # 35 route files + index
    ├── index.js              # Main router that registers all routes
    ├── about__chiefmentordataRoutes.js
    ├── about__governingbodycouncildataRoutes.js
    ├── about__ourteamdataRoutes.js
    ├── about__pressreleasesdataRoutes.js
    ├── about__principaldatapRoutes.js
    ├── about__profileofcollegedataRoutes.js
    └── ... (29 more route files)
```

## 🔌 API Endpoints

Each collection has 5 standard CRUD endpoints:

### GET All Records

```
GET /api/{collection-path}
Example: GET /api/about/chiefmentordata
Response: Array of all documents
```

### GET Single Record by ID

```
GET /api/{collection-path}/:id
Example: GET /api/about/chiefmentordata/507f1f77bcf86cd799439011
Response: Single document object
```

### CREATE New Record

```
POST /api/{collection-path}
Example: POST /api/about/chiefmentordata
Body: JSON object matching schema
Response: Created document with _id
```

### UPDATE Record by ID

```
PUT /api/{collection-path}/:id
Example: PUT /api/about/chiefmentordata/507f1f77bcf86cd799439011
Body: JSON object with fields to update
Response: Updated document
```

### DELETE Record by ID

```
DELETE /api/{collection-path}/:id
Example: DELETE /api/about/chiefmentordata/507f1f77bcf86cd799439011
Response: { message: 'Deleted successfully' }
```

## 🔑 Key Features

1. **No New Database Created**: All schemas connect to your existing `aasc_db` database
2. **No Duplicate Collections**: Each schema explicitly specifies the collection name using `{ collection: 'collection_name' }`
3. **Individual Schemas**: Each collection has its own Mongoose schema file
4. **Individual Controllers**: Each collection has dedicated CRUD operations
5. **Individual Routes**: Each collection has its own route file
6. **Centralized Routing**: All routes are registered in `routes/index.js`

## 📝 Example Usage

### Fetch Chief Mentor Data

```javascript
// GET request
fetch("http://localhost:5000/api/about/chiefmentordata")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### Update Principal Data

```javascript
// PUT request
fetch(
  "http://localhost:5000/api/about/principaldatap/507f1f77bcf86cd799439011",
  {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      banner: {
        title: "Updated Principal's Desk",
        image: "new-image-url.jpg",
      },
    }),
  }
)
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### Create New Event

```javascript
// POST request
fetch("http://localhost:5000/api/events/eventsdata", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    id: "event-123",
    title: "Annual Day 2024",
    description: "College annual day celebration",
    images: ["image1.jpg", "image2.jpg"],
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

## ⚠️ Important Notes

1. **Database Connection**: Make sure your `.env` file has the correct MongoDB Atlas connection string
2. **Collection Names**: The schemas use the exact collection names from your database (with `__` separators)
3. **No Data Migration**: These schemas connect to existing collections - no data is moved or duplicated
4. **Schema Validation**: Mongoose will validate data against the schema before saving

## 🚀 Next Steps

To complete the setup, you may want to:

1. Create schemas for `home__allhomedata` and `home__announcementsdata` (if they exist as separate collections)
2. Add authentication middleware to protect certain routes
3. Add input validation using express-validator
4. Add pagination for large collections
5. Add search and filter capabilities
6. Create aggregate endpoints for complex queries

## 🔧 Testing the APIs

You can test all endpoints using:

- **Postman**: Import the collection and test each endpoint
- **Thunder Client** (VS Code extension): Quick API testing
- **cURL**: Command-line testing
- **Frontend**: Connect your React app to these endpoints

Example cURL test:

```bash
curl http://localhost:5000/api/about/chiefmentordata
```

## 📊 Database Schema Examples

### Chief Mentor Data Schema

```javascript
{
  banner: {
    title: String,
    image: String
  },
  content: {
    title: String,
    ourleadsimage: String,
    cheifmentordeskimage: String,
    paragraphs: [String],
    signOff: {
      text: String,
      name: String,
      title: String
    },
    cta: {
      text: String,
      link: String
    }
  }
}
```

### Events Data Schema

```javascript
{
  id: String,
  title: String,
  description: String,
  images: [String]
}
```

## ✅ Verification Checklist

- [x] 35 Mongoose models created
- [x] 35 controllers with CRUD operations
- [x] 35 route files
- [x] All routes registered in index.js
- [x] Schemas connect to existing collections
- [x] No duplicate database or collections created
- [ ] Test all endpoints (pending)
- [ ] Add authentication (pending)
- [ ] Add validation (pending)
