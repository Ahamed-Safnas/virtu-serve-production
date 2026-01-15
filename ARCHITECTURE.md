# Production Architecture - Virtu Serve Admin Dashboard

## **System Architecture**

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          GLOBAL CDN (Vercel Edge)                        │
│                    Distributed across 300+ cities                        │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                    React Application (SPA)                      │    │
│  │                                                                │    │
│  │  - Vite optimized bundle (~764 KB gzipped → 217 KB minified) │    │
│  │  - React 18 with TypeScript                                   │    │
│  │  - React Router v7 for navigation                             │    │
│  │  - Tailwind CSS for styling                                   │    │
│  │  - Recharts for analytics visualization                       │    │
│  │  - Lucide React for icons                                     │    │
│  │                                                                │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │    │
│  │  │ Public Site  │  │ Admin Login  │  │ Admin Panel  │        │    │
│  │  ├──────────────┤  ├──────────────┤  ├──────────────┤        │    │
│  │  │ Services     │  │ Username     │  │ Analytics    │        │    │
│  │  │ Testimonials │  │ Password     │  │ Services Mgmt│        │    │
│  │  │ Contact Info │  │ Credentials  │  │ Testimonials │        │    │
│  │  │ Visitor Data │  │ Hash-based   │  │ Contact Info │        │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘        │    │
│  │         │                  │                  │               │    │
│  │         └──────────────────┴──────────────────┘               │    │
│  │                        │ HTTPS Requests                        │    │
│  └────────────────────────┼────────────────────────────────────────┘    │
│                           │                                             │
└───────────────────────────┼─────────────────────────────────────────────┘
                            │
                    HTTPS/TLS + Public Keys
                    (No secrets exposed)
                            │
              ┌─────────────────────────────┐
              │   Supabase Platform         │
              │                             │
              │  ┌──────────────────────┐   │
              │  │  Edge Functions      │   │
              │  ├──────────────────────┤   │
              │  │ - admin-login        │   │  ◄── Service Role Key
              │  │ - admin-update-*     │   │       (Server-only)
              │  │ - admin-record-visit │   │
              │  └──────────────────────┘   │
              │          │                  │
              │          ▼                  │
              │  ┌──────────────────────┐   │
              │  │   PostgreSQL DB      │   │
              │  ├──────────────────────┤   │
              │  │ - services (16)      │   │
              │  │ - testimonials (8)   │   │
              │  │ - contact_info (1)   │   │
              │  │ - visitor_stats      │   │
              │  │ - admin_users (1)    │   │
              │  │                      │   │
              │  │ Hashed Passwords     │   │
              │  │ Bcrypt + Salt        │   │
              │  └──────────────────────┘   │
              │                             │
              │  Automatic backups          │
              │  Real-time subscriptions    │
              │  Connection pooling         │
              │                             │
              └─────────────────────────────┘
```

---

## **DATA FLOW DIAGRAMS**

### **Public User Flow**

```
User visits website
       ↓
   [Vercel CDN]
       ↓
App fetches data from Supabase (read-only)
       ↓
   [Edge Function: Fetch Calls]
       ↓
       ├─→ Fetch services
       ├─→ Fetch testimonials
       ├─→ Fetch contact_info
       └─→ Fetch visitor_stats
       ↓
   [Public tables - no RLS needed]
       ↓
Display on homepage
       ↓
Record visit via admin-record-visit
       ↓
Increment visitor count for today
```

### **Admin Authentication Flow**

```
Admin enters credentials
       ↓
Form submitted to /admin
       ↓
Frontend calls Edge Function: admin-login
       ↓
   [Request sent via HTTPS + anon_key]
       ↓
Edge Function receives request
       ↓
   [Using service role key - server-side]
       ↓
Query admin_users table by username
       ↓
Compare bcrypt hashed password
       ↓
   ┌─ Passwords match?
   │
   ├─ YES → Return success + adminId
   │
   └─ NO → Return 401 Unauthorized
       ↓
Frontend handles response
       ↓
Set admin login state
       ↓
Redirect to dashboard
```

### **Admin Update Flow**

```
Admin makes change (e.g., add service)
       ↓
Frontend sends data to Edge Function
       ↓
   [POST /admin-update-services]
   [Request body: { services: [...] }]
   [Authorization: Bearer ANON_KEY]
       ↓
Edge Function receives request
       ↓
   [Using service role key - server-side]
   [Anon key used only for identification]
       ↓
Delete all existing services
       ↓
Insert new services array
       ↓
Return success response
       ↓
Frontend receives confirmation
       ↓
Update local state
       ↓
   (No localStorage - all Supabase)
       ↓
Auto-fetch fresh data
       ↓
Reflect changes on page
```

---

## **API Endpoints**

### **Read Endpoints (Public)**

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/services` | GET | Anon Key | Fetch all services |
| `/testimonials` | GET | Anon Key | Fetch all testimonials |
| `/contact_info` | GET | Anon Key | Fetch contact info |
| `/visitor_stats` | GET | Anon Key | Fetch visitor data |

### **Write Endpoints (Private)**

| Endpoint | Method | Auth | Purpose | Service Role? |
|----------|--------|------|---------|---------------|
| `/functions/v1/admin-login` | POST | Anon Key | Admin authentication | ✅ Yes |
| `/functions/v1/admin-update-services` | POST | Anon Key | Update services | ✅ Yes |
| `/functions/v1/admin-update-testimonials` | POST | Anon Key | Update testimonials | ✅ Yes |
| `/functions/v1/admin-update-contact` | POST | Anon Key | Update contact info | ✅ Yes |
| `/functions/v1/admin-record-visit` | POST | Anon Key | Record visitor | ✅ Yes |

---

## **Technology Stack**

### **Frontend**

```
┌─ Language
│  └─ TypeScript 5.5
│
├─ Framework
│  ├─ React 18.3
│  └─ React DOM 18.3
│
├─ Build Tool
│  ├─ Vite 5.4
│  └─ @vitejs/plugin-react
│
├─ Styling
│  ├─ Tailwind CSS 3.4
│  ├─ PostCSS 8.4
│  └─ Autoprefixer 10.4
│
├─ Routing
│  └─ React Router DOM 7.8
│
├─ Database Client
│  └─ @supabase/supabase-js 2.89
│
└─ UI Components
   ├─ Lucide React 0.344 (Icons)
   └─ Recharts 3.1 (Charts)
```

### **Backend**

```
┌─ Serverless Functions
│  └─ Supabase Edge Functions (Deno)
│     ├─ Language: TypeScript/JavaScript
│     ├─ Runtime: Deno 1.x
│     └─ Deployment: Global Deno Deploy
│
├─ Database
│  └─ PostgreSQL 15+
│     ├─ Connection Pooling: PgBouncer
│     ├─ Indexes: Optimized for queries
│     └─ Extensions: uuid-ossp, pgcrypto
│
├─ Authentication
│  └─ Bcrypt Password Hashing
│     ├─ Algorithm: bcrypt
│     ├─ Salt rounds: 12
│     └─ Storage: admin_users.password_hash
│
└─ Storage
   ├─ Images: External (Pexels CDN)
   └─ Data: PostgreSQL
```

### **Deployment**

```
┌─ Frontend Hosting
│  ├─ Vercel
│  ├─ Global CDN (300+ cities)
│  ├─ Automatic scaling
│  └─ Serverless functions available
│
├─ Backend Hosting
│  ├─ Supabase Edge Functions
│  ├─ Global deployment
│  ├─ Sub-millisecond latency
│  └─ Auto-scaling
│
└─ Database Hosting
   ├─ Supabase (AWS backend)
   ├─ PostgreSQL managed service
   ├─ Automated backups
   ├─ Connection pooling
   └─ Multi-region replication available
```

---

## **Security Architecture**

### **Key Management**

```
┌─ Anon Key (Public)
│  ├─ Used by frontend
│  ├─ Sent in HTTP headers
│  ├─ Restricted to SELECT operations
│  └─ Safe to expose
│
├─ Service Role Key (Private)
│  ├─ Used in Edge Functions only
│  ├─ Never sent to client
│  ├─ Full database access
│  ├─ Stored in Supabase secrets
│  └─ NOT in repository or .env
│
└─ Environment Variables
   ├─ Vercel Dashboard (encrypted)
   ├─ .env file (local only)
   └─ GitHub Actions (if automated)
```

### **Authentication Flow**

```
Request with Anon Key
       ↓
Edge Function receives
       ↓
Authenticates with Service Role Key
       ↓
   ┌─ Validation
   │  ├─ Signature verification
   │  ├─ Expiry check
   │  └─ Scope validation
   │
   └─ Authorization
      ├─ Username lookup
      ├─ Password hash comparison
      └─ Response generation
       ↓
Service Role Key NEVER leaves server
       ↓
Anon Key safely remains on client
```

### **Password Security**

```
User password
       ↓
Edge Function receives
       ↓
Hash with bcrypt(password, salt)
       ↓
Compare with stored hash
       ↓
   ✅ Match → Success
   ❌ No match → Fail
       ↓
Original password NEVER stored
Plaintext NEVER transmitted
```

---

## **Database Schema**

```sql
-- Services (16 items)
CREATE TABLE services (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Testimonials (8 items)
CREATE TABLE testimonials (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  designation text NOT NULL,
  rating integer (1-5),
  comment text NOT NULL,
  avatar text NOT NULL,
  date_added date,
  created_at timestamptz DEFAULT now()
);

-- Contact Info (1 singleton row)
CREATE TABLE contact_info (
  id uuid PRIMARY KEY,
  phone text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  business_hours jsonb,
  social_media jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Visitor Stats (1 row per day)
CREATE TABLE visitor_stats (
  id uuid PRIMARY KEY,
  date date UNIQUE,
  visitors integer,
  created_at timestamptz DEFAULT now()
);

-- Admin Users (hashed passwords)
CREATE TABLE admin_users (
  id uuid PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

---

## **Performance Metrics**

### **Target Metrics**

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | < 1.5s | Vercel Analytics |
| Largest Contentful Paint | < 2.5s | Vercel Analytics |
| Cumulative Layout Shift | < 0.1 | Vercel Analytics |
| Time to Interactive | < 3s | Vercel Analytics |
| Database Query Time | < 100ms | Supabase Logs |
| Edge Function Execution | < 500ms | Supabase Logs |
| Lighthouse Score | > 85 | PageSpeed Insights |

### **Monitoring**

```
Vercel Dashboard
├─ Real-time analytics
├─ Page load times
├─ Error rates
├─ Traffic patterns
└─ Status page

Supabase Dashboard
├─ Database stats
├─ Query performance
├─ Function logs
├─ Connection status
└─ Storage usage
```

---

## **Scaling & Capacity**

### **Vercel**

- Automatic scaling
- Global CDN distribution
- Handles unlimited traffic
- Automatic HTTPS
- 99.99% uptime SLA

### **Supabase**

- Auto-scaling database
- Connection pooling (PgBouncer)
- Unlimited Edge Function invocations
- Automated backups
- Read replicas available

### **Estimated Capacity**

```
Database
├─ Rows: ~1000 records supported
├─ Storage: Up to 5 GB (free tier)
└─ Concurrent connections: 100+

Edge Functions
├─ Concurrency: Unlimited
├─ Execution time: Up to 60 seconds
└─ Memory: 512 MB per function

Frontend
├─ Visitors: 10,000+ per day
├─ Concurrent users: 1,000+
└─ Bandwidth: Unlimited CDN
```

---

## **Disaster Recovery**

### **Backup Strategy**

```
Supabase
├─ Automatic daily backups
├─ 7-day retention
├─ Point-in-time restore
├─ Cross-region replication available
└─ Manual backups exportable via SQL

GitHub
├─ Source code version control
├─ Rollback to any commit
├─ Branch protection
└─ All history preserved

Vercel
├─ Deployment history
├─ One-click rollback
├─ Preview deployments
└─ Staging environment
```

### **Recovery Time**

| Scenario | RTO | RPO |
|----------|-----|-----|
| Frontend build fails | 1 min | 0 min (last successful) |
| Code regression | 5 min | 0 min (git rollback) |
| Database corruption | 1 hour | 24 hours (daily backup) |
| Complete data loss | 24 hours | 7 days (backup retention) |

---

## **Cost Breakdown (Approximate)**

```
Vercel
├─ Hobby plan: Free
│  ├─ 100 GB bandwidth/month
│  ├─ Unlimited builds
│  └─ Suitable for small teams
│
└─ Pro plan: $20/month
   ├─ Priority support
   ├─ Advanced analytics
   └─ For production apps

Supabase
├─ Free tier: Free
│  ├─ 500 MB database
│  ├─ 1 GB bandwidth
│  ├─ 100 MB file storage
│  └─ Limited to 2 concurrent connections
│
└─ Pro plan: $25/month
   ├─ 8 GB database
   ├─ 250 GB bandwidth
   ├─ 100 GB storage
   └─ Unlimited connections

Domain (Optional)
├─ .com: $12/year average
└─ Other TLDs: varies

Total Monthly (Production)
└─ $45-50/month for full production setup
```

---

## **Compliance & Security**

- ✅ HTTPS/TLS encryption
- ✅ Password hashing (bcrypt)
- ✅ CORS configured
- ✅ Input validation on Edge Functions
- ✅ SQL injection prevention (prepared statements)
- ✅ XSS protection via React
- ✅ CSRF tokens if needed
- ✅ Rate limiting available on Edge Functions
- ✅ DDoS protection (Vercel + Supabase)
- ✅ GDPR compatible (data processing agreements available)

---

## **Monitoring & Alerts**

### **Recommended Alerts**

1. **Build failures** - Email to team
2. **Database connection errors** - Slack webhook
3. **High error rate** (> 5%) - SMS
4. **High latency** (> 2s) - Email
5. **Storage approaching limit** - Email
6. **Failed authentication attempts** - Dashboard

### **Health Checks**

```bash
# Frontend health
curl https://your-deployment.vercel.app

# API health
curl https://your-project.supabase.co/functions/v1/admin-login

# Database health
# Check in Supabase Dashboard → Database → Stats
```

