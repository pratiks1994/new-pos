import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import styles from "./Categories.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setBigMenu } from "../Redux/bigMenuSlice";
import { useQuery } from "react-query";

function Categories({ getActiveId }) {
      // const [categories, setCategories] = useState([]);

      const {categories} = useSelector((state) => state.bigMenu);
      const { IPAddress } = useSelector((state) => state.serverConfig);
      const [active, setActive] = useState();

      useEffect(() => {
            getActiveId(active);
      }, [active]);

      const dispatch = useDispatch();

      // api call everytime component Mounts to get FULL MENU items and set as bigMenu redux state

      const getCategories = async () => {
            let { data } = await axios.get(`http://${IPAddress}:3001/menuData`);

            return data;
      };

      //   react query api call for data chashing, loading and error state management
      const { data, status, isLoading } = useQuery("bigMenu", getCategories, {
            staleTime: 1200000,
            onSuccess:(data)=> dispatch(setBigMenu({ data }))
      });

      // useEffect(() => {
      //       if (status === "success") {
      //             dispatch(setBigMenu({ data }));
      //       }
      // }, [status, data]);

      return (
            <div className={`${styles.categoryList}`}>
                  {isLoading ? (
                        <div>Loading...</div>
                  ) : (
                        categories.map((cat) => <CategoryItem key={cat.id} id={cat.id} display_name={cat.display_name} setActive={setActive} active={active} />)
                  )}
            </div>
      );
}

export default Categories;

// CREATE TABLE "kot" (
// 	"id"	INTEGER NOT NULL,
// 	"restaurant_id"	INTEGER,
// 	"token_no"	INTEGER,
// 	"order_type"	TEXT,
// 	"user_id"	INTEGER,
// 	"customer_name"	INTEGER DEFAULT NULL,
// 	"phone_number"	INTEGER DEFAULT NULL,
// 	"address"	TEXT DEFAULT NULL,
// 	"landmark"	TEXT DEFAULT NULL,
// 	"table_id"	INTEGER,
// 	"table_no"	INTEGER,
// 	"print_count"	INTEGER,
// 	"created_at"	INTEGER DEFAULT (datetime('now', 'localtime')),
// 	"updated_at"	INTEGER DEFAULT (datetime('now', 'localtime')),
// 	"kot_status"	TEXT,
// 	"order_id"	INTEGER DEFAULT NULL,
// 	PRIMARY KEY("id" AUTOINCREMENT)
// );


// CREATE TABLE "kot_items" (
// 	"id"	integer NOT NULL,
// 	"kot_id"	integer DEFAULT NULL,
// 	"item_id"	integer DEFAULT NULL,
// 	"item_name"	varchar(255) DEFAULT NULL,
// 	"quantity"	integer DEFAULT NULL,
// 	"description"	text COLLATE BINARY,
// 	"variation_name"	varchar(255) DEFAULT NULL,
// 	"variation_id"	integer DEFAULT NULL,
// 	"contains_free_item"	integer DEFAULT '0',
// 	"main_order_item_id"	integer DEFAULT NULL,
// 	"created_at"	timestamp DEFAULT current_timestamp,
// 	"updated_at"	timestamp DEFAULT current_timestamp,
// 	"item_tax"	TEXT,
// 	"item_addons"	TEXT DEFAULT NULL,
// 	"price"	REAL,
// 	"final_price"	REAL,
// 	PRIMARY KEY("id" AUTOINCREMENT)
// );


// CREATE TABLE "order_item_addongroupitems" (
// 	"id"	integer NOT NULL,
// 	"order_item_id"	integer DEFAULT NULL,
// 	"addongroupitem_id"	integer DEFAULT NULL,
// 	"name"	varchar(255) DEFAULT NULL,
// 	"price"	decimal(11, 2) DEFAULT NULL,
// 	"quantity"	integer DEFAULT NULL,
// 	"created_at"	timestamp DEFAULT current_timestamp,
// 	"updated_at"	timestamp DEFAULT current_timestamp,
// 	PRIMARY KEY("id" AUTOINCREMENT),
// 	CONSTRAINT "order_item_addongroupitems_ibfk_1" FOREIGN KEY("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE,
// 	CONSTRAINT "order_item_addongroupitems_ibfk_2" FOREIGN KEY("addongroupitem_id") REFERENCES "addongroupitems"("id") ON DELETE RESTRICT ON UPDATE RESTRICT
// );


// CREATE TABLE "order_item_taxes" (
// 	"id"	integer NOT NULL,
// 	"order_item_id"	integer DEFAULT NULL,
// 	"tax_id"	integer DEFAULT NULL,
// 	"tax"	decimal(11, 2) DEFAULT NULL,
// 	"tax_amount"	decimal(11, 2) DEFAULT NULL,
// 	"created_at"	timestamp DEFAULT current_timestamp,
// 	"updated_at"	timestamp DEFAULT current_timestamp,
// 	CONSTRAINT "order_item_taxes_ibfk_1" FOREIGN KEY("tax_id") REFERENCES "taxes"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
// 	CONSTRAINT "order_item_taxes_ibfk_2" FOREIGN KEY("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE,
// 	PRIMARY KEY("id" AUTOINCREMENT)
// );


// CREATE TABLE "multipays" (
// 	"id"	INTEGER NOT NULL UNIQUE,
// 	"order_id"	INTEGER,
// 	"payment_type"	TEXT,
// 	"amount"	REAL DEFAULT 0.00,
// 	"created_at"	timestamp DEFAULT (datetime('now', 'localtime')),
// 	"updated_at"	timestamp DEFAULT (datetime('now', 'localtime')),
// 	PRIMARY KEY("id" AUTOINCREMENT)
// );


// CREATE TABLE "order_item_taxes" (
// 	"id"	integer NOT NULL,
// 	"order_item_id"	integer DEFAULT NULL,
// 	"tax_id"	integer DEFAULT NULL,
// 	"tax"	decimal(11, 2) DEFAULT NULL,
// 	"tax_amount"	decimal(11, 2) DEFAULT NULL,
// 	"created_at"	timestamp DEFAULT current_timestamp,
// 	"updated_at"	timestamp DEFAULT current_timestamp,
// 	CONSTRAINT "order_item_taxes_ibfk_2" FOREIGN KEY("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE,
// 	CONSTRAINT "order_item_taxes_ibfk_1" FOREIGN KEY("tax_id") REFERENCES "taxes"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
// 	PRIMARY KEY("id" AUTOINCREMENT)
// );

// CREATE TABLE "order_items" (
// 	"id"	integer NOT NULL,
// 	"order_id"	integer DEFAULT NULL,
// 	"item_id"	integer DEFAULT NULL,
// 	"item_name"	varchar(255) DEFAULT NULL,
// 	"item_discount"	decimal(11, 2) DEFAULT NULL,
// 	"price"	decimal(11, 2) DEFAULT NULL,
// 	"final_price"	decimal(11, 2) DEFAULT NULL,
// 	"quantity"	integer DEFAULT NULL,
// 	"description"	text COLLATE BINARY,
// 	"variation_name"	varchar(255) DEFAULT NULL,
// 	"variation_id"	integer DEFAULT NULL,
// 	"contains_free_item"	integer DEFAULT '0',
// 	"main_order_item_id"	integer DEFAULT NULL,
// 	"created_at"	timestamp DEFAULT (datetime('now', 'localtime')),
// 	"updated_at"	timestamp DEFAULT (datetime('now', 'localtime')),
// 	CONSTRAINT "order_items_ibfk_1" FOREIGN KEY("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
// 	CONSTRAINT "order_items_ibfk_2" FOREIGN KEY("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
// 	PRIMARY KEY("id" AUTOINCREMENT)
// );


// CREATE TABLE "orders" (
// 	"id"	integer NOT NULL,
// 	"user_id"	integer,
// 	"order_number"	varchar(255) DEFAULT NULL,
// 	"restaurant_id"	integer DEFAULT NULL,
// 	"customer_name"	varchar(255) DEFAULT NULL,
// 	"complete_address"	text COLLATE BINARY,
// 	"delivery_lat"	varchar(255) DEFAULT NULL,
// 	"delivery_long"	varchar(255) DEFAULT NULL,
// 	"delivery_distance"	decimal(11, 2) DEFAULT NULL,
// 	"aerial_distance"	decimal(11, 2) DEFAULT NULL,
// 	"normal_delivery_radius"	integer DEFAULT NULL,
// 	"rider_id"	integer DEFAULT NULL,
// 	"phone_number"	varchar(255) DEFAULT NULL,
// 	"city_id"	integer DEFAULT NULL,
// 	"pincode"	varchar(255) DEFAULT NULL,
// 	"user_address_id"	integer DEFAULT NULL,
// 	"order_type"	text DEFAULT 'delivery',
// 	"dine_in_table_id"	integer DEFAULT NULL,
// 	"dine_in_table_no"	varchar(255) DEFAULT NULL,
// 	"description"	text COLLATE BINARY,
// 	"item_total"	decimal(11, 2) DEFAULT NULL,
// 	"total_discount"	decimal(11, 2) DEFAULT NULL,
// 	"total_tax"	decimal(11, 2) DEFAULT NULL,
// 	"delivery_charges"	decimal(11, 2) DEFAULT '0.00',
// 	"total"	decimal(11, 2) DEFAULT NULL,
// 	"promo_id"	integer DEFAULT NULL,
// 	"promo_code"	varchar(255) DEFAULT NULL,
// 	"promo_discount"	decimal(11, 2) DEFAULT NULL,
// 	"platform"	text DEFAULT 'android',
// 	"app_version"	varchar(255) DEFAULT NULL,
// 	"payment_type"	text DEFAULT 'cod',
// 	"order_status"	text DEFAULT 'pending',
// 	"reason"	text,
// 	"pp_order_json"	json DEFAULT NULL,
// 	"ordered_at"	timestamp DEFAULT NULL,
// 	"pg_order_id"	varchar(255) DEFAULT NULL,
// 	"pg_payment_id"	varchar(255) DEFAULT NULL,
// 	"created_at"	timestamp DEFAULT current_timestamp,
// 	"updated_at"	timestamp DEFAULT current_timestamp,
// 	"user_paid"	INTEGER DEFAULT NULL,
// 	"settle_amount"	INTEGER DEFAULT NULL,
// 	"print_count"	INTEGER DEFAULT 0,
// 	"tip"	REAL DEFAULT 0,
// 	CONSTRAINT "orders_ibfk_3" FOREIGN KEY("user_address_id") REFERENCES "user_addresses"("id") ON DELETE SET NULL ON UPDATE SET NULL,
// 	CONSTRAINT "orders_ibfk_1" FOREIGN KEY("restaurant_id") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
// 	CONSTRAINT "promo_id" FOREIGN KEY("promo_id") REFERENCES "promos"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
// 	CONSTRAINT "orders_dine_in_table_id" FOREIGN KEY("dine_in_table_id") REFERENCES "dine_in_tables"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
// 	CONSTRAINT "orders_ibfk_5" FOREIGN KEY("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
// 	CONSTRAINT "orders_ibfk_4" FOREIGN KEY("rider_id") REFERENCES "riders"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
// 	CONSTRAINT "orders_ibfk_2" FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT,
// 	PRIMARY KEY("id" AUTOINCREMENT)
// );

// CREATE TABLE "printers" (
// 	"id"	INTEGER NOT NULL,
// 	"restaurant_id"	INTEGER DEFAULT 0,
// 	"printer_name"	VARCHAR,
// 	"printer_type"	INTEGER DEFAULT (1),
// 	"printer_type_report_flag"	INTEGER DEFAULT (0),
// 	"printer_display_name"	VARCHAR,
// 	"multiple_print_settings"	TEXT,
// 	"status"	INTEGER DEFAULT (1),
// 	"created"	VARCHAR DEFAULT (null),
// 	"modified"	VARCHAR DEFAULT (null),
// 	"sync"	INTEGER DEFAULT (0),
// 	PRIMARY KEY("id")
// );