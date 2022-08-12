console.log(req.body)
if(req.body.email==='test@test.com'){
    const token = jwt.sign({
        email:req.body.email,
        fullName:"Syimyk Markaev"
    }, 'secret007')
}

res.json({
    created:true,
    token
})


app.get('/',(req, res)=>{
    res.send('Hello world')
})