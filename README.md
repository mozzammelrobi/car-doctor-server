# JWT  access note
 ### steps for server side
 -  install jsonwebtoken `npm install jsonwebtoken` [jwt io documentation](https://github.com/auth0/node-jsonwebtoken)
  **import**
 - `const jwt = require('jsonwebtoken')`
 - `const cookieParser = require('cookie-parser')`
 - 
  ```  
   app.post('/jwt', async(req, res ) => {
            const user = req.body;
            console.log(user)
            // create a token or generate a token
            const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})

            res
            // set in cookies
            .cookie('token',token,{
                httpOnly:true,
                secure:false, 
            })
            .send({success:true})
        }) 
 ```
-  
```
// middleware
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials:true
}));

app.use(cookieParser())

```
 
 - jst.sign(payload, secret,{expiresIn:})
 - send token to client

 ### how to store token in the client side
  1. merory  ----> ok type
  2. local storage ---> ok type (XSS)
  3. cookies: http only
    - 
```
  .cookie('token',token,{
                httpOnly: true,
                secure:false
            })
```

## steps in client side
  1. client side axios setting 
  `axios.post('http://localhost:5000/jwt', user, {withCredentials: true})`

  ## how to genarate secret
  ```
  1. node
  2. > require('crypto').randomBytes(64).toString('hex')
  
   ```
**to send cookies form client side make sure you added withCredientials true**


  ### resorces
  - [expres cookie parse](https://expressjs.com/en/resources/middleware/cookie-parser.html)

  - jwt
  - how to set cookies in express js
  - search(why should i put jwt token in http only cookie. im using express how can i set it to the cookie and send)
 