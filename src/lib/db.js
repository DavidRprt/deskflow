import { Sequelize } from "sequelize"

// Force require pg module for Next.js compatibility
if (typeof window === "undefined") {
  require("pg")
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectModule: require("pg"),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  define: {
    timestamps: false,
    underscored: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
})

sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Database connection failed:", err))

export default sequelize
