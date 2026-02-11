import pg from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_egv5riXRsk4W@ep-nameless-field-adizhuhg-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function alterAvatarColumn() {
  const client = new pg.Client({ connectionString });

  try {
    await client.connect();

    await client.query('ALTER TABLE persona ALTER COLUMN avatar TYPE TEXT;');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

alterAvatarColumn();
