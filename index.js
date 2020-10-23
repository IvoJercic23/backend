const express = require('express')
const app = express()

require("dotenv").config()
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))


const mongoose =require("mongoose")
const password=process.env.ATLAS_PASS
const dbname="poruke-api" 
const url = `mongodb+srv://ijercic:${password}@cluster0.ermwf.mongodb.net/${dbname}?retryWrites=true&w=majority`
mongoose.connect(url, {
    useNewUrlParser: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false    
  })

  

  const porukaSchema = new mongoose.Schema({
    sadrzaj: {
        type:String,
        required:true,
        minlength:5
    },
    datum: {
        type:Date,
        required:true,
        minlength:5        
    },
    vazno:{
        type:Boolean,
        default:false             
    }
  })
  
  porukaSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = doc._id.toString()
        delete ret._id
        delete ret.__v
        return ret
    }
})


const Poruka = mongoose.model('Poruka', porukaSchema)


const zahtjevInfo = (req, res, next) => {
    console.log('Metoda:', req.method)
    console.log('Putanja:', req.path)
    console.log('Tijelo:', req.body)
    console.log('---')
    next()
}
  
app.use(zahtjevInfo)
  


let poruke = [
    {
        id: 4,
        sadrzaj: 'HTML nije jednostavan',
        vazno: true
    },
    {
        id: 8,
        sadrzaj: 'React koristi JSX sintaksu',
        vazno: false
    },
    {
        id: 13,
        sadrzaj: 'GET i POST su najvaznije metode HTTP protokola',
        vazno: true
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Pozdrav od Express servera + nodemona</h1>')
})

app.get('/api/poruke', (req, res) => {
    Poruka.find({}).then( rezultat =>{
        res.json(rezultat)
    })
})

	
app.get('/api/poruke/:id', (req, res,next) => {
    Poruka.findById(req.params.id)
      .then(poruka => {
        if (poruka) {
          res.json(poruka)
        } else {
          res.status(404).end()
        }
   
      })
      .catch(err => next(err))
  })

app.delete('/api/poruke/:id', (req, res,next) => {
    const id = (req.params.id)
    Poruka.findByIdAndRemove(id)
    .then(result=>{
        res.status(204).end()
    })
    .catch(err => next(err))

})

app.put('/api/poruke/:id', (req, res,next) => {
    const id = req.params.id
    const podatak = req.body
    const poruka= {
        sadrzaj:podatak.sadrzaj,
        vazno:podatak.vazno
    }    
	
    Poruka.findByIdAndUpdate(id, poruka, {new: true})
    .then( novaPoruka => {
      res.json(novaPoruka)
    })
    .catch(err => next(err))
   })

app.post('/api/poruke', (req, res,next) => {
    const podatak = req.body
    
    const poruka = new Poruka({
        sadrzaj: podatak.sadrzaj,
        vazno: podatak.vazno || false,
        datum: new Date()
    })
    poruka.save().then(result => {
        console.log(result);
        res.json(result)
    })
    .catch(err=> next(err))
})

const nepoznataRuta = (req, res) => {
    res.status(404).send({ error: 'nepostojeca ruta!' })
}  
app.use(nepoznataRuta)

const errorHandler = (err,req,res,next) =>{
    console.log("Midlleware za upravljanje pogreskama");
    if(err.name=== "CastError"){
        res.status(400).send({error:"Krivi format ID parametra"})
    }
    else if(err.name==="MongoParseError")
    {
        res.status(400).send({error:"Krivi format podatka"})
    }
    next()

}
app.use(errorHandler)


const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server sluša na portu ${PORT}`);
})
