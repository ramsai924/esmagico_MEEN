const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb+srv://ramsai:ramsai@cluster0.iz4na.mongodb.net/esmagico?retryWrites=true&w=majority", { useUnifiedTopology: true })
.then(() => {
    console.log("connted to Database")
}).catch((err) => {
    console.error(err)
})

module.exports = mongoose;