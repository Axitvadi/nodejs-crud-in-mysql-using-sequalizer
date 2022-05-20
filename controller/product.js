const db = require("../config/db.config");
const Product = db.product;
const sequelize = require("sequelize");
const axios = require("axios");

exports.create = async (req, res) => {
  try {
    if (!req.body.name && !req.body.price) {
      return res.status(400).send({
        message: "name and price can not be empty!",
      });
    }
    const product = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
    };

    const createdProduct = await Product.create(product);
    if (!createdProduct) {
      return res.status(400).json({
        isSuccess: false,
        message: "failed to create product !",
      });
    }
    res.status(200).json({
      isSuccess: true,
      message: "product created successfully !",
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const products = await Product.findAll();
    if (!products) {
      return res.status(200).json({
        isSuccess: false,
        message: "fail to found product",
      });
    }
    return res.status(200).json({
      isSuccess: true,
      message: "products found successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
};

exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const date = formatDate();
    const source = "USD";
    const currencies = (req.query.currencies || "USD").toUpperCase();
    if (currencies.length != 3) {
      return res.status(400).json({
        isSuccess: false,
        message: "please enter valid currencies",
      });
    }
    const product = await Product.findOne({ where: { id: id, deleted: 0 } });
    if (!product) {
      return res.status(200).json({
        isSuccess: false,
        message: "fail to found product",
      });
    }
    const productPrice = +product.price;
    try {
      const options = {
        method: "GET",
        url: `https://api.apilayer.com/currency_data/convert?to=${currencies}&from=${source}&amount=${productPrice}&date=${date}`,
        headers: {
          apikey: process.env.API_KEY,
        },
      };
      const response = await axios.request(options);
      if (!response.data.success) {
        return res.status(400).json({
          isSuccess: false,
          error: "please enter valid three character of currency code.",
        });
      }
      product.price = response.data.result + " " + currencies;
    } catch (error) {
      return res.status(500).json({
        error: error,
      });
    }
    //increase view of products
    await Product.update(
      { views: sequelize.literal("views + 1") },
      { where: { id: id } }
    );
    return res.status(200).json({
      isSuccess: true,
      message: "products found successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
};

exports.mostViewed = async (req, res) => {
  try {
    const products = await Product.findAll({
      // for set limit of most viewed product
      limit: 10,
      // Add order conditions here....
      order: [["views", "DESC"]],
      attributes: ["id", "name", "price", "description", "views"],
      row: true,
    });
    if (!products) {
      return res.status(400).json({
        isSuccess: true,
        message: "fails to get product",
      });
    }
    return res.status(200).json({
      isSuccess: true,
      message: "successfully found products",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedProduct = await Product.update(
      {
        deleted: 1,
      },
      { where: { id: id } }
    );
    if (!deletedProduct) {
      return res.status(400).json({
        isSuccess: false,
        message: "fail to delete product",
      });
    }
    return res.status(200).json({
      isSuccess: true,
      message: "product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
    });
  }
};

function formatDate() {
  let d = new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
