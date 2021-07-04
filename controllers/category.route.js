const express = require("express");
const categoriesModel = require("../models/category.model");
const router = express.Router();

router.get('/category/:catlink', async function(req,res) {
    const categoryList = await categoriesModel.getArticlesByCat(req.params.catlink);
    console.log(categoryList);
    res.render("vwCategory/category",{
        categoryArticle: categoryList,
        empty: categoryList.length === 0,
        layout: "main1.hbs"
    });
});

// router.post('/add/', async function(req, res) {
//     const category = {
//         CatName: req.body.txtCatName
//     }
//     await categoriesModel.add(category);
//     const list = await categoriesModel.all();
//     res.render("common",{
//         categories: list,
//         empty: list.length === 0,
//     });
// })

module.exports = router;

//common js
//es modules <=> import/export