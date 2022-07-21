let express = require('express');
let app = express();
let morgan = require('morgan');
let dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 9870;
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let mongoUrl = process.env.MongoLocalURL;
let db;

app.use(morgan('common'))
app.get('/',(req,res)=>{
    res.send("Response from ShoppingHub");

})

app.get('/collectiontype',(req,res)=>{
    db.collection('collectionCategory').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

app.get('/brandlist',(req,res)=>{
    db.collection('brand').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

app.get('/imagecollection',(req,res)=>{
    let query = {}
    let collectionId = Number(req.query.collectionId);
    let brandId = Number(req.query.brandId);
    let discountId = Number(req.query.discountId)
    if(collectionId){
        query = {collectionCategory_id:collectionId}
    }else if(brandId){
        query = {brand_id:brandId}
    }else if(discountId){
        query = {discount_id:discountId}
    }else{
        query = {}
    }
    db.collection('imageList').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

app.get('/products',(req,res)=>{
    let query = {}
    let brandId = Number(req.query.brandId);
    if(brandId){
        query = {"brands.brand_id":brandId}
    }else{
        query = {}
    }
    db.collection('product').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})


app.get('/filter/:brandId',(req,res) => {
    let query = {}
    let brandId = Number(req.params.brandId);
    let sizeId = Number(req.query.sizeId);
    let genderId = Number(req.query.genderId);
    let ocationId = Number(req.query.ocationId);
    if(sizeId && genderId && occationId){
        query = {
            "brands.brand_id":brandId,
            size_id:sizeId,
            ocation_id:ocationId,
            gender_id:genderId
        }
    }
    else if(sizeId){
        query = {
            "brands.brand_id":brandId,
             size_id:sizeId
        }
    }else if(genderId){
        query = {
            "brands.brand_id":brandId,
            gender_id:genderId
        }
    }else if(ocationId){
        query = {
            "brands.brand_id":brandId,
            ocation_id:ocationId
        }
    } else{
        query = {
            "brands.brand_id":brandId,
        }
    }
    db.collection('product').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })

})

app.get('/details/:id',(req,res)=>{
    let id = Number(req.params.id);
    db.collection('product').find({product_id:id}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

MongoClient.connect(mongoUrl, (err,client)=> {
     if(err){console.log("Error While Connecting")}
     else{
         db = client.db('shoppinghub');
         app.listen(port, ()=> {
             console.log(`Listening on port ${port}`)
         })
     }
})
