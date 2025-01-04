CREATE TABLE IF NOT EXISTS addresses (
  address_id VARCHAR(26) NOT NULL PRIMARY KEY,
  address1 TEXT NOT NULL,
  address2 TEXT,
  city TEXT,
  country TEXT NOT NULL,
  province TEXT,
  zip TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME
);
CREATE INDEX addresses_index ON addresses (country, city);
CREATE TABLE IF NOT EXISTS companies (
  company_id VARCHAR(26) NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  additional_information JSON,
  address_id VARCHAR(26) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME,
  FOREIGN KEY (address_id) REFERENCES addresses (address_id) ON DELETE CASCADE
);
CREATE INDEX companies_index ON companies (name, email);
CREATE TABLE IF NOT EXISTS customers (
  customer_id VARCHAR(26) NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  additional_information JSON,
  address_id VARCHAR(26) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME,
  FOREIGN KEY (address_id) REFERENCES addresses (address_id) ON DELETE CASCADE
);
CREATE INDEX customers_index ON customers (name, email);
CREATE TABLE IF NOT EXISTS services (
  service_id VARCHAR(26) NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  rate NUMERIC NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME
);
CREATE INDEX services_index ON services (name, rate);
CREATE TABLE IF NOT EXISTS taxes (
  tax_id VARCHAR(26) NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  rate NUMERIC NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME
);
CREATE INDEX taxes_index ON taxes (name, rate);
CREATE TABLE IF NOT EXISTS invoices (
  invoice_id VARCHAR(26) NOT NULL PRIMARY KEY,
  identifier TEXT NOT NULL,
  identifier_type TEXT NOT NULL,
  locale VARCHAR(4) NOT NULL,
  country_code VARCHAR(2) NOT NULL,
  date DATETIME NOT NULL,
  due_date DATETIME,
  company_id VARCHAR(26) NOT NULL,
  customer_id VARCHAR(26) NOT NULL,
  subtotal_amount NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  note JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at DATETIME,
  FOREIGN KEY (company_id) REFERENCES companies (company_id),
  FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
);
CREATE INDEX invoices_index ON invoices (
  locale,
  country_code,
  date,
  subtotal_amount,
  total_amount
);
CREATE TABLE IF NOT EXISTS invoice_services (
  invoice_service_id VARCHAR(26) NOT NULL PRIMARY KEY,
  service_id VARCHAR(26) NOT NULL,
  invoice_id VARCHAR(26) NOT NULL,
  quantity NUMERIC NOT NULL,
  tax_id VARCHAR(26) NOT NULL,
  FOREIGN KEY (service_id) REFERENCES services (service_id),
  FOREIGN KEY (invoice_id) REFERENCES invoices (invoice_id),
  FOREIGN KEY (tax_id) REFERENCES taxes (tax_id)
);