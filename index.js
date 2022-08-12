import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'
import {registerValidation} from './validations/auth.js'
import bcrypt from "bcrypt"

import UserModal from './models/User.js'
import checkAuth from './utils/checkAuth.js'

mongoose.connect('mongodb+srv://admin:adminuser@cluster0.vuowldr.mongodb.net/blog?retryWrites=true&w=majority')
.then(()=>console.log('DB ok'))
.catch((err)=>console.log('DB error', err))


const app = express()

app.use(express.json()); 

app.post('/auth/login', async (req, res)=>{
    try{
        const user =await UserModal.findOne({email:req.body.email})
        if(!user){
            return res.status(404).json({
                message:"cant find"
            })
        }
        const isValidPass =await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if(!isValidPass){
            return req.status(404).json
            ({
                message:"not true login and password"
            })
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'secret007',
        {
            expiresIn: '30d'
        },
        )
        const { passwordHash, ...userData} = user._doc
  
    res.json({
        ...userData,
        token
    })

    }catch(err){
        console.log(err)
        res.status(500).json({message: "cant do autorization"})
    }
})

app.post('/auth/register', registerValidation, async(req,res)=>{
 try{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json(errors.array())
    }
  
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const pHash = await bcrypt.hash(password,salt)
  
  
    const doc= new UserModal({
      email:req.body.email,
      fullName:req.body.fullName,
      avatarUrl:req.body.avatarUrl,
      passwordHash:pHash
    })
  
    const user =await doc.save()
    const token = jwt.sign({
        _id: user._id,
    }, 'secret007',
    {
        expiresIn: '30d'
    }
    )

    const { passwordHash, ...userData} = user._doc
  
    res.json({
        ...userData,
        token
    })
 }catch{
    console.log(err)
    res.status(500).json({message: "error registration"})
 }
})


app.get('/auth/me', checkAuth,(req,res)=>{
    try {
        res.json({
            success:true
        })
    } catch (error) {
        
    }
})

app.listen(4444, (err)=>{
    if(err){
        return console.log(err)
    }
    console.log("Server Ok")
})