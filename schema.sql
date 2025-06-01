CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- 1. Tenant Management

CREATE TABLE "tenant" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(100) UNIQUE NOT NULL,
  "api_key" VARCHAR(100) UNIQUE NOT NULL,
  "package_plan" VARCHAR(50) NOT NULL DEFAULT 'free',  -- free, silver, gold, enterprise
  "settings" JSONB DEFAULT '{}',
  "rate_limit" INTEGER NOT NULL DEFAULT 60,  -- requests per minute
  "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "tenant_user" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant_id" UUID NOT NULL REFERENCES "tenant"("id") ON DELETE CASCADE,
  "email" VARCHAR(255) NOT NULL,
  "role" VARCHAR(50) NOT NULL,  -- admin, editor, viewer
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE("tenant_id", "email")
);

-- 2. Product Management (Basic schema for flash sale products)
CREATE TABLE "product" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant_id" UUID NOT NULL REFERENCES "tenant"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "sku" VARCHAR(100),
  "regular_price" DECIMAL(15,2) NOT NULL,
  "stock_quantity" INTEGER NOT NULL DEFAULT 0,
  "category" VARCHAR(100),
  "image_url" TEXT,
  "description" TEXT,
  "status" VARCHAR(50) NOT NULL DEFAULT 'active',
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_product_tenant ON "product"("tenant_id");

-- 3. Voucher System
CREATE TABLE "voucher" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant_id" UUID NOT NULL REFERENCES "tenant"("id") ON DELETE CASCADE,
  "code" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "type" VARCHAR(50) NOT NULL,  -- percentage, fixed_amount, free_shipping
  "amount" DECIMAL(15,2) NOT NULL,  -- value of discount
  "minimum_order_amount" DECIMAL(15,2) DEFAULT 0,
  "max_uses" INTEGER DEFAULT NULL,  -- NULL = unlimited
  "used_count" INTEGER DEFAULT 0,  -- counter of usages
  "start_date" TIMESTAMP WITH TIME ZONE,
  "end_date" TIMESTAMP WITH TIME ZONE,
  "status" VARCHAR(50) NOT NULL DEFAULT 'draft',  -- draft, active, expired, archived
  "is_public" BOOLEAN NOT NULL DEFAULT TRUE,
  "user_group" VARCHAR(100) DEFAULT NULL,  -- can be used to target specific customer groups
  "tags" TEXT[] DEFAULT '{}',
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE("tenant_id", "code")
);
CREATE INDEX idx_voucher_tenant ON "voucher"("tenant_id");
CREATE INDEX idx_voucher_status ON "voucher"("tenant_id", "status");

CREATE TABLE "voucher_usage" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant_id" UUID NOT NULL REFERENCES "tenant"("id") ON DELETE CASCADE,
  "voucher_id" UUID NOT NULL REFERENCES "voucher"("id") ON DELETE CASCADE,
  "user_id" VARCHAR(255),  -- can be email, phone or ID
  "order_id" VARCHAR(255),
  "amount" DECIMAL(15,2) NOT NULL,  -- discount amount applied
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_voucher_usage_tenant ON "voucher_usage"("tenant_id");
CREATE INDEX idx_voucher_usage_voucher ON "voucher_usage"("voucher_id");

-- 4. Flash Sale System
CREATE TABLE "flash_sale_campaign" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant_id" UUID NOT NULL REFERENCES "tenant"("id") ON DELETE CASCADE,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "start_date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "end_date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "status" VARCHAR(50) NOT NULL DEFAULT 'draft',  -- draft, scheduled, active, ended, cancelled
  "category" VARCHAR(100),
  "user_group" VARCHAR(100) DEFAULT NULL,
  "banner_url" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_flash_sale_tenant ON "flash_sale_campaign"("tenant_id");
CREATE INDEX idx_flash_sale_status ON "flash_sale_campaign"("tenant_id", "status");
CREATE INDEX idx_flash_sale_dates ON "flash_sale_campaign"("start_date", "end_date");

CREATE TABLE "flash_sale_item" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant_id" UUID NOT NULL REFERENCES "tenant"("id") ON DELETE CASCADE,
  "campaign_id" UUID NOT NULL REFERENCES "flash_sale_campaign"("id") ON DELETE CASCADE,
  "product_id" UUID NOT NULL REFERENCES "product"("id") ON DELETE CASCADE,
  "sale_price" DECIMAL(15,2) NOT NULL,
  "stock_limit" INTEGER NOT NULL,  -- max units available for flash sale
  "stock_sold" INTEGER NOT NULL DEFAULT 0,  -- units sold during flash sale
  "per_customer_limit" INTEGER DEFAULT NULL,  -- max units per customer, NULL = no limit
  "status" VARCHAR(50) NOT NULL DEFAULT 'active',  -- active, sold_out, disabled
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE("campaign_id", "product_id")
);
CREATE INDEX idx_flash_sale_item_tenant ON "flash_sale_item"("tenant_id");
CREATE INDEX idx_flash_sale_item_campaign ON "flash_sale_item"("campaign_id");

-- 5. Order System (Basic schema - simplification)
CREATE TABLE "order" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant_id" UUID NOT NULL REFERENCES "tenant"("id") ON DELETE CASCADE,
  "order_number" VARCHAR(100) NOT NULL,
  "user_id" VARCHAR(255) NOT NULL,  -- can be email, phone or ID
  "total_amount" DECIMAL(15,2) NOT NULL,
  "discount_amount" DECIMAL(15,2) DEFAULT 0,
  "voucher_id" UUID REFERENCES "voucher"("id") ON DELETE SET NULL,
  "flash_sale_ids" UUID[],  -- array of flash sale campaign IDs
  "status" VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, confirmed, processing, completed, failed, cancelled
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE("tenant_id", "order_number")
);
CREATE INDEX idx_order_tenant ON "order"("tenant_id");
CREATE INDEX idx_order_user ON "order"("tenant_id", "user_id");

-- 6. Notification System
CREATE TABLE "notification" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant_id" UUID NOT NULL REFERENCES "tenant"("id") ON DELETE CASCADE,
  "title" VARCHAR(255) NOT NULL,
  "message" TEXT NOT NULL,
  "type" VARCHAR(50) NOT NULL,  -- system, flash_sale, voucher, order
  "target_user_ids" TEXT[] DEFAULT '{}',  -- can be empty for broadcast
  "reference_id" UUID,  -- can reference campaign_id, voucher_id, etc.
  "status" VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending, sent, failed
  "send_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_notification_tenant ON "notification"("tenant_id");
CREATE INDEX idx_notification_status ON "notification"("tenant_id", "status");

-- 7. Audit Logs
CREATE TABLE "audit_log" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant_id" UUID NOT NULL REFERENCES "tenant"("id") ON DELETE CASCADE,
  "user_id" VARCHAR(255),
  "action" VARCHAR(100) NOT NULL,  -- create, update, delete, view
  "entity_type" VARCHAR(100) NOT NULL,  -- voucher, campaign, product, order
  "entity_id" UUID NOT NULL,
  "old_value" JSONB,
  "new_value" JSONB,
  "ip_address" VARCHAR(100),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_audit_log_tenant ON "audit_log"("tenant_id");
CREATE INDEX idx_audit_log_entity ON "audit_log"("entity_type", "entity_id");

CREATE TABLE "tenant_package" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(100) NOT NULL UNIQUE,         -- free, silver, gold
  "description" TEXT,
  "max_products" INTEGER DEFAULT 50,           -- số sản phẩm tối đa
  "max_vouchers" INTEGER DEFAULT 100,          -- số voucher tối đa
  "max_flash_sales" INTEGER DEFAULT 10,        -- số flash sale tối đa
  "support_realtime_tracking" BOOLEAN DEFAULT FALSE,
  "support_schedule" BOOLEAN DEFAULT FALSE,
  "support_dashboard" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 8. Job Queue Logs (For monitoring worker processes)
CREATE TABLE "job_log" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant_id" UUID NOT NULL REFERENCES "tenant"("id") ON DELETE CASCADE,
  "job_id" VARCHAR(255) NOT NULL,
  "queue_name" VARCHAR(100) NOT NULL,
  "job_type" VARCHAR(100) NOT NULL,  -- process-order, start-campaign, etc.
  "status" VARCHAR(50) NOT NULL,  -- queued, processing, completed, failed
  "data" JSONB,
  "result" JSONB,
  "error" TEXT,
  "started_at" TIMESTAMP WITH TIME ZONE,
  "completed_at" TIMESTAMP WITH TIME ZONE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_job_log_tenant ON "job_log"("tenant_id");
CREATE INDEX idx_job_log_status ON "job_log"("tenant_id", "status");

-- Add extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for text search