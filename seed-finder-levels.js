import pkg from 'pg';
const { Pool } = pkg;

// Database connection
const pool = new Pool({
  connectionString: 'postgresql://postgres:uuCCbIilayUEBGulotmYCkWZRakrhcBJ@tramway.proxy.rlwy.net:23182/railway',
  ssl: {
    rejectUnauthorized: false
  }
});

const finderLevels = [
  {
    id: '9fda3622-9ed5-4f04-a25f-cf7ca72f8945',
    name: 'Novice',
    description: 'The First Step on the Path - New finders starting their journey on FinderMeister',
    min_earned_amount: '0.00',
    min_jobs_completed: 0,
    min_rating: '0.00',
    min_five_star_count: 0,
    monthly_tokens: 20,
    token_bonus_per_proposal: 0,
    vip_invitations_per_month: 0,
    badge_icon: 'leaf',
    badge_emoji: '🍃',
    color: '#10b981',
    order: 1,
    is_active: true,
    created_at: '2025-10-12T16:29:04.803Z',
    updated_at: '2025-10-12T16:29:04.803Z'
  },
  {
    id: 'a9cdf061-c317-4d54-aded-2e90e896069d',
    name: 'Pathfinder',
    description: 'The Trailblazer of New Routes - Building experience with successful finds',
    min_earned_amount: '0.00',
    min_jobs_completed: 2,
    min_rating: '4.00',
    min_five_star_count: 0,
    monthly_tokens: 20,
    token_bonus_per_proposal: 0,
    vip_invitations_per_month: 0,
    badge_icon: 'compass',
    badge_emoji: '🧭',
    color: '#f59e0b',
    order: 2,
    is_active: true,
    created_at: '2025-10-12T16:29:04.826Z',
    updated_at: '2025-10-12T16:29:04.826Z'
  },
  {
    id: 'b4217a7c-a6ba-41ae-9265-926ffcb50e96',
    name: 'Seeker',
    description: 'The Knowledge Collector - Skilled finders with proven excellence',
    min_earned_amount: '0.00',
    min_jobs_completed: 4,
    min_rating: '4.00',
    min_five_star_count: 0,
    monthly_tokens: 20,
    token_bonus_per_proposal: 5,
    vip_invitations_per_month: 0,
    badge_icon: 'eye',
    badge_emoji: '👁️',
    color: '#3b82f6',
    order: 3,
    is_active: true,
    created_at: '2025-10-12T16:29:04.843Z',
    updated_at: '2025-10-12T16:29:04.843Z'
  },
  {
    id: '622b06ef-6c55-4194-b0c2-b2e6dbe306d8',
    name: 'Meister',
    description: 'The Master of Craft - Expert finders with exceptional performance',
    min_earned_amount: '0.00',
    min_jobs_completed: 8,
    min_rating: '5.00',
    min_five_star_count: 0,
    monthly_tokens: 30,
    token_bonus_per_proposal: 5,
    vip_invitations_per_month: 2,
    badge_icon: 'torch',
    badge_emoji: '🔥',
    color: '#8b5cf6',
    order: 4,
    is_active: true,
    created_at: '2025-10-12T16:29:04.859Z',
    updated_at: '2025-10-12T16:29:04.859Z'
  },
  {
    id: '02a38483-c853-4851-a47c-ba399de5d37e',
    name: 'GrandMeister',
    description: 'The Legendary Elite - Pinnacle of FinderMeister achievement',
    min_earned_amount: '0.00',
    min_jobs_completed: 12,
    min_rating: '5.00',
    min_five_star_count: 0,
    monthly_tokens: 50,
    token_bonus_per_proposal: 5,
    vip_invitations_per_month: 999,
    badge_icon: 'crown',
    badge_emoji: '👑',
    color: '#000000',
    order: 5,
    is_active: true,
    created_at: '2025-10-12T16:29:04.875Z',
    updated_at: '2025-10-12T16:29:04.875Z'
  }
];

async function seedFinderLevels() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting finder levels seeding...');
    
    // First, check if the finder_levels table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'finder_levels'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ finder_levels table does not exist. Creating table...');
      
      // Create the finder_levels table
      await client.query(`
        CREATE TABLE finder_levels (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          min_earned_amount DECIMAL(10,2) DEFAULT 0.00,
          min_jobs_completed INTEGER DEFAULT 0,
          min_rating DECIMAL(3,2) DEFAULT 0.00,
          min_five_star_count INTEGER DEFAULT 0,
          monthly_tokens INTEGER DEFAULT 0,
          token_bonus_per_proposal INTEGER DEFAULT 0,
          vip_invitations_per_month INTEGER DEFAULT 0,
          badge_icon VARCHAR(50),
          badge_emoji VARCHAR(10),
          color VARCHAR(7),
          "order" INTEGER,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      
      console.log('✅ finder_levels table created successfully');
    }
    
    // Clear existing data
    await client.query('DELETE FROM finder_levels');
    console.log('🧹 Cleared existing finder levels');
    
    // Insert new data
    for (const level of finderLevels) {
      await client.query(`
        INSERT INTO finder_levels (
          id, name, description, min_earned_amount, min_jobs_completed, 
          min_rating, min_five_star_count, monthly_tokens, token_bonus_per_proposal,
          vip_invitations_per_month, badge_icon, badge_emoji, color, "order",
          is_active, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      `, [
        level.id, level.name, level.description, level.min_earned_amount,
        level.min_jobs_completed, level.min_rating, level.min_five_star_count,
        level.monthly_tokens, level.token_bonus_per_proposal, level.vip_invitations_per_month,
        level.badge_icon, level.badge_emoji, level.color, level.order,
        level.is_active, level.created_at, level.updated_at
      ]);
      
      console.log(`✅ Inserted ${level.name} (${level.badge_emoji})`);
    }
    
    // Verify the data
    const result = await client.query('SELECT name, badge_emoji, "order" FROM finder_levels ORDER BY "order"');
    console.log('\n📊 Seeded finder levels:');
    result.rows.forEach(row => {
      console.log(`   ${row.order}. ${row.name} ${row.badge_emoji}`);
    });
    
    console.log('\n🎉 Finder levels seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding finder levels:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seeding
seedFinderLevels()
  .then(() => {
    console.log('✨ Seeding process finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });