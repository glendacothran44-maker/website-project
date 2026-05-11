# Supreme Mobile Notary - Supabase Setup Guide

## Supabase Project Credentials
- **URL**: https://kjnvbposqpncmeedyzjw.supabase.co
- **Publishable Key**: sb_publishable_q1fRfGhAGa39SRxMoDQ2wQ_nK7gcJG7

## Database Setup

### 1. Create Tables in Supabase SQL Editor

Copy and paste the following SQL commands into your Supabase SQL Editor (https://app.supabase.com > SQL Editor > New Query):

```sql
-- ==========================================
-- CLIENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- SERVICES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert Services Data
INSERT INTO services (service_name, category, description, base_price, unit) VALUES
('Notarial Act (per signature)', 'Standard', 'State-regulated notarizations', 5.00, 'per act'),
('Mobile Service Fee', 'Standard', 'Base fee for mobile service', 25.00, 'flat'),
('After-Hours Surcharge', 'Surcharge', 'Before 8am or after 7pm', 15.00, 'flat'),
('Same-Day / Rush', 'Surcharge', 'Within 2 hours of appointment', 20.00, 'flat'),
('Purchase / Sale', 'Real Estate', 'Real estate closing', 150.00, 'flat'),
('Refinance', 'Real Estate', 'Refinance closing', 125.00, 'flat'),
('HELOC / Equity', 'Real Estate', 'Home equity loan', 100.00, 'flat'),
('Power of Attorney', 'Estate & Legal', 'POA document', 40.00, 'flat'),
('Last Will & Testament', 'Estate & Legal', 'Will signing', 50.00, 'flat'),
('Living Trust', 'Estate & Legal', 'Trust document', 60.00, 'flat'),
('Advance Directive', 'Estate & Legal', 'Healthcare directive', 40.00, 'flat');

-- ==========================================
-- BOOKINGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_phone VARCHAR(20),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  location VARCHAR(500),
  notes TEXT,
  estimated_cost DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- QUOTE REQUESTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_name VARCHAR(255) NOT NULL,
  requester_email VARCHAR(255),
  requester_phone VARCHAR(20),
  service_type VARCHAR(255) NOT NULL,
  location VARCHAR(500),
  notes TEXT,
  estimated_cost DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- BOOKINGS STATUS (Analytics Table)
-- ==========================================
CREATE TABLE IF NOT EXISTS booking_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_bookings INT,
  pending_bookings INT,
  confirmed_bookings INT,
  completed_bookings INT,
  total_revenue DECIMAL(15, 2),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- ENABLE RLS (Row Level Security) - OPTIONAL BUT RECOMMENDED
-- ==========================================
-- ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- CREATE INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_appointment_date ON bookings(appointment_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_quote_status ON quote_requests(status);
CREATE INDEX idx_services_category ON services(category);
```

### 2. Run the SQL

1. Go to https://app.supabase.com
2. Select your project
3. Click "SQL Editor" in the sidebar
4. Click "New Query"
5. Paste the entire SQL code above
6. Click "Run"

### 3. Verify Tables

All tables should now appear in your Supabase dashboard under the "Tables" section:
- clients
- services
- bookings
- quote_requests
- booking_analytics

### 4. Update RLS Policies (Optional)

For production, enable RLS and create policies:

```sql
-- Example: Allow all reads, authenticated writes
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all reads" ON clients
  FOR SELECT USING (true);

CREATE POLICY "Allow insert" ON clients
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update" ON clients
  FOR UPDATE USING (true);
```

## Website Integration

All HTML files are pre-configured to use these credentials:
- **booking.html** - Create bookings
- **dashboard.html** - View bookings & analytics
- **quote.html** - Request quotes
- **pricing.html** - Manage clients

No additional setup needed—just deploy and test!

## Testing

1. Open booking.html → Fill form → Submit
2. Check Supabase dashboard → bookings table should have new entry
3. Open dashboard.html → See all bookings
4. Test quote calculator in quote.html

## Support

For issues, check:
1. Supabase credentials in config
2. Network tab in browser DevTools
3. Supabase logs in your dashboard
