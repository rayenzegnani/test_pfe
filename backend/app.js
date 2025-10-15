const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const port = 3000;
const categoryRouter = require('./routes/category');
app.get('/', (req, res) => {
    res.send('server is running');
});
app.use("/categories",categoryRouter);
app.use(express.json());


async function connectDB(){
    await mongoose.connect('mongodb://localhost:27017',{
        dbName:"SOA_project",
    });
    console.log("connected to DB");
}
connectDB().catch((err)=>{
    console.error(err);
})
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

