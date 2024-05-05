# JWT  access note
 ### steps
 -  install jsonwebtoken
 - jst.sign(payload, secret,{expiresIn:})
 - send token to client

 ### how to store token in the client side
  1. merory  ----> ok type
  2. local storage ---> ok type (XSS)
  3. cookies: http only

  1. set cookies with http only. for development secure: false,
  2. cors
   `app.use(cors({
    origin: ['http://localhost:5173'],
    credentials:true
}));`
  3. client side axios setting 
  `axios.post('http://localhost:5000/jwt', user, {withCredentials: true})`

  ## how to genarate secret
  1. node
  2. > require('crypto').randomBytes(64).toString('hex')
  3. 

  ### resorces
  - [expres cookie parse](https://expressjs.com/en/resources/middleware/cookie-parser.html)

  - jwt
  - how to set cookies in express js
  - search(why should i put jwt token in http only cookie. im using express how can i set it to the cookie and send)
 