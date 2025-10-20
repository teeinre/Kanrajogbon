import dotenv from 'dotenv';
import path from 'path';

// Load environment variables first with explicit path
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
const { Pool } = pg;
import { categories } from '../shared/schema.ts';

// Database connection - using the same setup as the main app
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('railway') ? { rejectUnauthorized: false } : false
});
const db = drizzle({ client: pool });

const categoriesToInsert = [
  {
    id: "07345e90-b65a-4daf-ae79-0244522c0640",
    name: "Research & Data Lookup",
    description: "Price checks, market scans, academic papers",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "112f96d9-f59c-4e13-b6d6-0e562958b4dd",
    name: "Rentals & Real Estate",
    description: "Vacation homes, short lets, equipment rentals",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "3cf63115-4dfc-4809-b1d4-aa6f55662b97",
    name: "Creative & Props",
    description: "Film & theatre props, costumes & wardrobe, set design materials, rare collectibles, location scouting support",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "403d9bba-f772-4aed-a626-e1488d0d75b6",
    name: "Consumer Products",
    description: "Electronics, fashion, auto parts, collectibles",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "47b7dce2-290e-439f-993e-21d5d20dc378",
    name: "Deals & Discount Hunts",
    description: "Bargain hunting, alternatives, cheaper suppliers",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "49f33aed-b452-46ea-b59a-025cccfb900c",
    name: "Business & B2B Sourcing",
    description: "Wholesale suppliers, packaging, custom manufacturing",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "4bfaba26-247b-4493-be90-fecb11b1e3e0",
    name: "Documents & Bureaucracy",
    description: "Permits, government forms, certificates, notarization",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "575f9fd6-3a68-4b12-9cdd-4def53512384",
    name: "Education & Mentorship",
    description: "Tutors, trainers, academic resources",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "7ecb4c21-aeaa-4c1b-93d5-348ab3dc0f46",
    name: "Events & Vendors",
    description: "Caterers, decorators, DJs, venues",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "955d24d3-a3e0-4519-a933-c3e0c2419379",
    name: "Healthcare & Appointments",
    description: "Specialist referrals, diagnostics, rare drugs",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "a5091490-d012-416a-af2c-f1e6d9c889e7",
    name: "Digital Assets",
    description: "Domains, social handles, verified accounts",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "a5ebed22-0945-4eee-b82e-b0309a911ab0",
    name: "Others",
    description: "Miscellaneous finds that don't neatly fit into any main category",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "c67dd6bd-e766-48c5-ab97-afe3dc3f3212",
    name: "Travel & Experiences",
    description: "Tours, flights, event tickets, visa assistance",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "cd34fa1d-ac59-4a51-b6ec-581d23ba9cc8",
    name: "Expert/People",
    description: "Niche consultants, lawyers, skilled professionals",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "cd63d5b6-164d-4309-a4db-1ac9570f9cd2",
    name: "Aso Ebi",
    description: "Custom fabrics, tailors, group orders for weddings/parties",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "ce32af7b-ba2c-43ee-9600-b11c4ee4ddc0",
    name: "Local Services & Artisans",
    description: "Repairs, tailoring, carpentry, appliance techs",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "dbaacfaa-4907-4b81-978d-888a18f6ba97",
    name: "Logistics & Dispatch",
    description: "Couriers, inter-state or cross-border delivery",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  },
  {
    id: "e107e09b-38fa-4e1d-a12a-f3ed6919bcc1",
    name: "Repairs & Maintenance",
    description: "Home, auto, gadgets",
    isActive: true,
    createdAt: new Date("2025-10-12T15:49:49.174Z")
  }
];

async function seedCategories() {
  try {
    console.log('Starting to seed categories...');
    
    // Insert categories one by one to handle potential conflicts
    for (const category of categoriesToInsert) {
      try {
        const result = await db.insert(categories).values(category).returning();
        console.log(`✅ Inserted category: ${category.name} (ID: ${category.id})`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`⚠️  Category already exists: ${category.name} (ID: ${category.id})`);
        } else {
          console.error(`❌ Error inserting category ${category.name}:`, error.message);
        }
      }
    }
    
    console.log('✅ Category seeding completed!');
  } catch (error) {
    console.error('❌ Error during category seeding:', error);
  } finally {
    await pool.end();
  }
}

// Run the seeding function
seedCategories();