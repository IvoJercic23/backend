const mongoose =require("mongoose")
const password="mojasifra"
const dbname="poruke-api" 
const url = `mongodb+srv://ijercic:${password}@cluster0.ermwf.mongodb.net/${dbname}?retryWrites=true&w=majority`


mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })


  const porukaSchema = new mongoose.Schema({
    sadrzaj: String,
    datum: Date,
    vazno: Boolean
  })
  
  const Poruka = mongoose.model('Poruka', porukaSchema)

  const novaPoruka = new Poruka({
      sadrzaj:"Mongoose je zabavan",
      datum:new Date(),
      vazno:false
  })
  
  Poruka.find({vazno:true})
  .then(result => {
      result.forEach(p => {
          console.log(p);          
      })
      mongoose.connection.close()
  })

  /*novaPoruka.save().then(result => {
      console.log("Poruka spremljena");
      console.log(result)
      mongoose.connection.close()    
  })
  */