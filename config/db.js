const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://localhost:27017/esmagico", { useUnifiedTopology: true })
.then(() => {
    console.log("connted to Database")
}).catch((err) => {
    console.error(err)
})

module.exports = mongoose;