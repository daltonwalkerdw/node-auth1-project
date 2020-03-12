const express = require("express")
const Users = require("../database/model")
const bcrypt = require("bcryptjs")

const router = express.Router()

router.post("/register", async (req, res, next) => {
    try {
        const { username } = req.body
      const user = await Users.findById(username).first()

      if(user) {
          return res.status(409).json({
              message: "username is already taken"
          })
      }
    console.log(req.body)
      await Users.add(req.body)
      res.status(201).json(req.body)
    } catch(err) {
        next(err)
    }
})

router.post("/login", async (req, res, next) => {
    try {
      const {username, password} = req.body

      const user = await Users.findBy({username}).first()

      const passwordValid = await bcrypt.compare(password, user.password)

      if(!user || !passwordValid) {
          return res.status(401).json({
              message: "invalid credentials"
          })
      }

      res.json({
          message: `Welcome ${user.username}`
      })
    } catch(err) {
        next(err)
    }
})

router.get("/users", restricted(), async (req, res, next) => {
    try {
     res.json(await Users.find())
    } catch(err) {
        next(err)
    }
})

function restricted() {
	const authError = {
		message: "you shall not pass!"
	}

	return async (req, res ,next) => {

	try {
	  const {username, password} = req.headers

	  if(!username || !password) {
		  return res.status(401).json(authError)
	  }

	  const user = await Users.findBy({username}).first()

	  // make sure that the user exist

	  if(!user) {
		  res.status(201).json(authError)
	  }
	   const passwordValid = await bcrypt.compare(password, user.password)
	   
	   if(!passwordValid) {
		   return res.status(401).json(authError)
	   }

	   next()
	} catch(err) {
		next(err)
	}
}
}

module.exports = router