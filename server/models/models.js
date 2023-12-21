const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "mysql",
  dialectModule: require("mysql2"),
  host: process.env.HOST,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
});

//business
const Business = sequelize.define(
  "businesses",
  {
    bss_name: {
      type: DataTypes.STRING,
    },

    bss_email: {
      type: DataTypes.STRING,
    },
    bss_password: {
      type: DataTypes.STRING,
    },
    bss_contact: {
      type: DataTypes.STRING,
    },
    bss_country: {
      type: DataTypes.INTEGER,
    },
    fy_start: {
      type: DataTypes.DATE,
    },
    fy_end: {
      type: DataTypes.DATE,
    },
    industry: {
      type: DataTypes.INTEGER,
    },
    bss_logo: {
      type: DataTypes.STRING,
    },
    address_1: {
      type: DataTypes.STRING,
    },
    address_2: {
      type: DataTypes.STRING,
    },
  },
  { tableName: "businesses" }
);
// user model
const User = sequelize.define(
  "users",
  {
    bss_id: {
      type: DataTypes.NUMBER,
    },
    bss_name: {
      type: DataTypes.STRING,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    user_img: {
      type: DataTypes.STRING,
    },
  },
  {
    // timestamps: false,
    tableName: "users",
  }
);
// product model
const Product = sequelize.define(
  "products",
  {
    pdt_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pdt_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    pdt_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purchase_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    selling_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    re_order_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vat: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "products",
  }
);
//sale
const Sale = sequelize.define(
  "sale",
  {
    sale_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    discount: {
      type: DataTypes.INTEGER,
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "sale",
  }
);
//stock
const Stock = sequelize.define(
  "stock",
  {
    stock_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
    supplier: {
      type: DataTypes.STRING,
    },
    discount: {
      type: DataTypes.INTEGER,
    },
    vat: {
      type: DataTypes.INTEGER,
    },
    stock_in_date: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "stock",
  }
);
//supplier
const Supplier = sequelize.define(
  "suppliers",
  {
    supplier_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    supplier_name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "supplier",
  }
);
//unit
const Unit = sequelize.define(
  "units",
  {
    unit_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    unit: {
      type: DataTypes.STRING,
    },
  },
  { tableName: "units" }
);
//brand
const Brand = sequelize.define(
  "brand",
  {
    brand_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brand: {
      type: DataTypes.STRING,
    },
  },
  { tableName: "brand" }
);

//category
const Category = sequelize.define(
  "category",
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  { tableName: "category" }
);
//currency
const Currency = sequelize.define(
  "currency",
  {
    currency_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    currency: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "currency",
  }
);

module.exports = {
  sequelize,
  User,
  Product,
  Sale,
  Stock,
  Supplier,
  Unit,
  Brand,
  Business,
  Category,
  Currency,
};
