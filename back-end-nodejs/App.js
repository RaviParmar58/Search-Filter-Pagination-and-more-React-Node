const app = require('express')();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const productModel = require('./ProductSchema')
var cors = require('cors')
app.use(cors())

app.use(bodyParser.json()) 

mongoose.connect('mongodb://127.0.0.1:27017/shoping').then(() => console.log('DB Connected'))
.catch((err) => console.log(err));


app.post('/product', async (req, res) => {
    const {limit, pageNum} = req.body;
    const skip = pageNum * limit

    try {
        // const data = await productModel.find({}).skip(skip).limit(limit)
        const response = await productModel.aggregate([
            {
                $facet: {
                    totalProductsCount: [
                        {$count: "count"}
                    ],
                    productsData: [
                        {$skip: skip},
                        {$limit: limit}
                    ]
                }
            }
        ])
        const totalProductsCount = response[0].totalProductsCount[0].count;
        const productData = response[0].productsData;
        res.json({productData, totalProductsCount}).status(200)
    } catch (error) {
        res.json(error).status(4001)
    }
})

app.listen(3000, () => {
    console.log('server 3000');
})