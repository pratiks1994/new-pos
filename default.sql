-- customers create table 

CREATE TABLE "customers" (
	"id"	integer NOT NULL,
	"web_id" INTEGER DEFAULT NULL,
	"sync" INTEGER DEFAULT 0,
	"name"	varchar(255),
	"due_total" REAL DEFAULT 0,
	"number"	varchar(255) DEFAULT NULL,
	"status"	integer DEFAULT '1',
	"created_at"	timestamp DEFAULT (datetime('now', 'localtime')),
	"updated_at"	timestamp DEFAULT (datetime('now', 'localtime')),
	PRIMARY KEY("id" AUTOINCREMENT)
) ;


-- customer addresses table create

CREATE TABLE `customer_addresses` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT
,  `customer_id` integer  DEFAULT NULL
,  `web_id` integer  DEFAULT NULL
,  `latitude` varchar(255) DEFAULT NULL
,  `longitude` varchar(255) DEFAULT NULL
,  `complete_address` text COLLATE BINARY
,  `landmark` text COLLATE BINARY
,  `type` text  DEFAULT 'home'
,  `pincode` varchar(255) DEFAULT NULL
,  `city_id` integer DEFAULT NULL
,  `created_at` timestamp NULL DEFAULT (datetime('now', 'localtime'))
,  `updated_at` timestamp NULL DEFAULT (datetime('now', 'localtime'))
,  CONSTRAINT `customer_addresses_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
,  CONSTRAINT `customer_addresses_ibfk_2` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ;

CREATE TABLE "kot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "restaurant_id" INTEGER,
    "token_no" INTEGER,
    "order_type" TEXT,
    "customer_id" REAL,
    "customer_name" TEXT DEFAULT NULL,
    "phone_number" TEXT DEFAULT NULL,
    "address" TEXT DEFAULT NULL,
    "landmark" TEXT DEFAULT NULL,
    "table_id" INTEGER,
    "table_no" TEXT,
    "print_count" INTEGER,
    "created_at" INTEGER DEFAULT (datetime('now', 'localtime')),
    "updated_at" INTEGER DEFAULT (datetime('now', 'localtime')),
    "kot_status" TEXT,
    "pos_order_id" INTEGER DEFAULT NULL,
    "description" TEXT,
    FOREIGN KEY ("customer_id") REFERENCES "customers" ("id")
);

CREATE TABLE "pos_orders" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "web_id" integer DEFAULT NULL,
    "customer_id" integer,
    "bill_no" varchar(255) DEFAULT NULL,
    "restaurant_id" integer DEFAULT NULL,
    "customer_name" varchar(255) DEFAULT NULL,
    "complete_address" text DEFAULT NULL,
    "delivery_distance" decimal(11, 2) DEFAULT NULL,
    "biller_name" TEXT DEFAULT NULL,
    "biller_id" INTEGER DEFAULT NULL,
    "rider_id" integer DEFAULT NULL,
    "phone_number" varchar(255) DEFAULT NULL,
    "city_id" integer DEFAULT NULL,
    "pincode" varchar(255) DEFAULT NULL,
    "customer_address_id" integer DEFAULT NULL,
    "order_type" text DEFAULT 'delivery',
    "dine_in_table_id" integer DEFAULT NULL,
    "dine_in_table_no" varchar(255) DEFAULT NULL,
    "description" text COLLATE BINARY,
    "item_total" decimal(11, 2) DEFAULT NULL,
    "total_discount" decimal(11, 2) DEFAULT NULL,
    "total_tax" decimal(11, 2) DEFAULT NULL,
    "tax_details" TEXT DEFAULT NULL,
    "delivery_charges" decimal(11, 2) DEFAULT '0.00',
    "total" decimal(11, 2) DEFAULT NULL,
    "promo_id" integer DEFAULT NULL,
    "promo_code" varchar(255) DEFAULT NULL,
    "promo_discount" decimal(11, 2) DEFAULT NULL,
    "platform" text DEFAULT 'android',
    "payment_type" text DEFAULT 'cash',
    "order_status" text DEFAULT 'accepted',
    "created_at" timestamp DEFAULT (datetime('now', 'localtime')),
    "updated_at" timestamp DEFAULT (datetime('now', 'localtime')),
    "extra_data" TEXT DEFAULT NULL,
    "settle_amount" REAL DEFAULT NULL,
    "print_count" INTEGER DEFAULT 0,
    "tip" REAL DEFAULT 0,
    "bill_paid" INTEGER DEFAULT 0,
    "discount_percent" REAL DEFAULT NULL,
    "sync" integer DEFAULT 0,
    CONSTRAINT "orders_ibfk_1" FOREIGN KEY("restaurant_id") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
);


CREATE TABLE "pos_order_items" (
	"id"	integer NOT NULL,
  "web_id" integer DEFAULT NULL,
	"pos_order_id"	integer DEFAULT NULL,
	"item_id"	integer DEFAULT NULL,
	"item_name"	varchar(255) DEFAULT NULL,
	"item_discount"	decimal(11, 2) DEFAULT NULL,
	"price"	decimal(11, 2) DEFAULT NULL,
	"final_price"	decimal(11, 2) DEFAULT NULL,
	"quantity"	integer DEFAULT NULL,
	"description"	text COLLATE BINARY,
	"variation_name"	varchar(255) DEFAULT NULL,
	"variation_id"	integer DEFAULT NULL,
	"contains_free_item"	integer DEFAULT '0',
	"main_order_item_id"	integer DEFAULT NULL,
  "sync" integer DEFAULT 0,
  "status" integer DEFAULT 1,
	"created_at"	timestamp DEFAULT (datetime('now', 'localtime')),
	"updated_at"	timestamp DEFAULT (datetime('now', 'localtime')),
	"item_addon_items"	TEXT DEFAULT NULL, tax REAL, tax_id INTEGER, discount_detail TEXT DEFAULT '[]',
	CONSTRAINT "order_items_ibfk_1" FOREIGN KEY("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
	CONSTRAINT "order_items_ibfk_2" FOREIGN KEY("pos_order_id") REFERENCES "pos_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY("id" AUTOINCREMENT)
) 

-- multipay table order_id rename

ALTER TABLE multipays
RENAME COLUMN order_id to pos_order_id;


SELECT a.id, a.web_id, c.web_id AS customer_web_id, a.complete_address , a.landmark, a.created_at, a.updated_at FROM customer_addresses AS a JOIN customers AS c ON a.customer_id = c.id  WHERE a.sync = 0 AND c.web_id IS NOT NULL 


UPDATE pos_orders SET web_id = ? ,sync = CASE WHEN updated_at = ? THEN ? ELSE ? END WHERE id = ? 
  










