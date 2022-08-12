import jwt from 'jsonwebtoken'

export default (req, res, next)=>{

    const token  = req.headers.authoriztion

    res.send(token)


}
