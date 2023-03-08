Note: There are timestamps for every model

MODELS
1. User Model
Object{
     username:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        unique:true
    },
    fullname:{type:String},
    bio:{type:String},
    phone:{type:String},
    location:{type:String},
    password:{type:String},
    pic:{
        type:String,
        default:'https://toppng.com/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png'
    },
    verified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },

}

*   Apart from the username and the email that are handled in the  backend as REQUIRED, the frontend dev will determine which other field is required with HTML required field handler or advanced error handler

*   The length of the user password will also be determined by the frontend dev when taking inputs from the user

*   Every User Password is hashed in the database

* There are 2 types of users, admin and normal users. The admin field is meant for the admin section of the application. If that is not available at the moment, every user is a normal user. The admin can add, delete, edit products and perform other admin tasks. By default, every user is a normal one unless specified as an admin.

*   the 'verified' field determines if the user's email is verified or not. If the system verifies the user's email through some verification process the user will go through, it will automatically turn the 'verified' field true. By default, every account is not verified


2. UserVerification Model

Object{
    userId:String,
    uniqueString:String,
    createdAt:Date,
    expiresAt:Date
}

The user verification model does not take any user inputs; it takes its body from the system automatically after the user creates his account. We shall talk about its controllers later


3. ResetPassword Model

Object{
    userId:String,
    resetString:String,
    createdAt:Date,
    expiresAt:Date
}

The password reset model does not require any user input; it takes its body from the system automatically after the user issues a password reset request. We shall discuss the controller later.


4. Product Model 
Object{
    title:String,
    price:Number,
    size:String,
    picture:String,
    colour:String,
    description:String,
    categories:{type:Array},
}

The body of the product model is quite familiar. However, the 'catergories' field takes arrays. For instance, a product can fall in the categories of 'shirt' and at the same time 'XL'



5. Cart Model

Object{
    userId:{
        type:String
    },

    products:[
        {
            productId:{
                type:String
            },
            quantity:{
                type:Number,
                default:1
            }
        }
    ],
    amount:Number
}

*   The cart nodel takes a field of user ID which indicates the person to which the cart belongs.

*   It also takes an array of objects. Every object contains the product ID and the number of items selected for that particular object.

*   The amount field will have a calculation of the sum of quanties by the prices of the particular products selected 



6. Order model
Ther order model has the same body as the cart in case there will be orders from users. There are no controllers for orders as at now


7. GeneralRatings Model
This type of rating is for the entire services of the company and not to a specific product
Object{
    rater:String,
    raterid:{type:String, required:true},
    stars:Number,
    review:String
}

*   The gerneral ratings model contains a rater. The system will detect the rater as the fullname of the current user. If the user has not provided a fullname, the rater field is the username. This is only possible when the frontend dev provides the user ID

* rater ID is the field going to be provided by the frontend dev for the current user.

*   The only 2 fields the user is going to input to the system are the 'review' and the 'stars' fields. The stars determine the rating values. The frontend dev can catch this mechanism with star icons. The 'review' field determines what the user will have to say after the ratings'


8. ProductRatings Model
This is a product specific type of rating. It works almost the same as the GeneralRatings model but with one additional field; 'productid'
Object{
    rater:String,
    raterid:{type:String, required:true},
    productid:{type:String, required:true},
    stars:Number,
    review:String
}

*   The gerneral ratings model contains a rater. The system will detect the rater as the fullname of the current user. If the user has not provided a fullname, the rater field is the username. This is only possible when the frontend dev provides the user ID

* rater ID is the field going to be provided by the frontend dev for the current user.


* product ID is the field going to be provided by the frontend dev for the current product.

*   The only 2 fields the user is going to input to the system are the 'review' and the 'stars' fields. The stars determine the rating values. The frontend dev can catch this mechanism with star icons. The 'review field determines what the user will have to say after the ratings'

*   To get a particular product's ratings, the frontend dev must filter the ratings and confirm the ratings with IDs equal to the current product ID

eg. Ratings.filter((rating)=> rating.productid == currentproduct._id ).map(....)
Note: Here, we are not checking for the type as well, so we can't use tripple equal to signs.

NOTE: Both the generalRatings and productRatings take rater ID to know which particular user has the right to delete and edit the rating. In fact, it is appropriate to give admins such a right.

eg. user_id == Rating.raterid || user.isAdmin &&
....can delete and edit....


CONTROLLERS

1. Auth Controller
The auth controller contains registerUser, Login, Logout, requestPasswordReset. The remaning endpoints do not take inputs from the user. Thus they are triggered by the system after some actions

*   registerUser
after taking inputs from the user, the system will send a mail to the user's email. After clicking on the mail, the system will verify the user and the user can log in from there. The verification process last for 6 hours. After that the user will be deleted from the db and he will have to start creating the account afresh

*   Login
the login controller takes email and password. If the user is not verified, he can't log in. After logging in, the user will have a token. The token stays until the user is logs out.

*   requestPasswordReset
this endpoint only takes an email field from the user. If the user is available, the system will send a password reset link to the user's email. If the email does not exist, it won't send. Another body element to this endpoint is the redirectUrl. The redirectUrl will have to be the exact password rest page in the frontend and has to be given by the frontend dev as a parameter or the body.
A: the user will input his email at forgot password page. The frontend dev has to provide redirectUrl at the background.

B: The system will generate a reset link to the user's email. After clicking, the user will be redirected to the redirectUrl given by the frontend dev bearing the particular user's ID. The frontend dev doesn't have to worry about the ID, the system will find the user by the email given and provide his ID from the database as a param to the redirectUrl.

eg. If the link to the frontend is http://localhost:3000 and the route to the password reset page is /reset/:userId/:resetString, the redirectUrl has to be
http://localhost:3000/passwordreset/

Note: The params in the passwordreset page has to be the same as provided above as they are captured in the backend like so.

eg of body =>  

const [email, setEmail] = useState('');
const [redirectUrl, setRedirectUrl] = useState('http://localhost:3000/users/passwordreset');

const data = {
    email:email,
    redirectUrl:redirectUrl
};

const res = await axios.post('http://localhost:5001/api/users/requestPasswordReset', data)

These configurations have to be done at the forgot password page and not the passwordreset page. At the password rest page, the user will only enter a new password and confirm that same passowrd. The length and the conversions of the password is determined by the frontend dev. However, the password is being hashed at the backend

On the passwordreset page, the user will have to enter a new password. It is necessary he does this twice to confirm. However, only one input field will be captured to the database. The fronend dev can capture the userId and the resetString from the url sent from the database with useParams()

eg. 
const {userId, resetString} = useParams();
const [newPassword, setNewPassword] = useState('');

const data = {
    newPassword:newPassword,
    userId,
    resetString
};

const res = await axios.post('http://localhost:5001/api/users/resetPassword', data)


*   Logout
The logout endpoint only deletes the token for the user. It is also the duty of the frontend dev to set the user state to null after the process to delete the user's session


2. User Controller
This contains endpoint for updating, deleting and fetching users. Only the original user and the admin can update and delete a user. Only the admin can get all users. The frontend dev doesn't have to worry with this, the backend has middlewares checking these activities.

updateUser, deleteUser, getUser, getAllUsers


3. Product Controller
This contains the endpoints for updating, deleting and fetching of products. Only the admin can update and delete, users can only view.

createProduct, updateProduct, deleteProduct, getProduct, getAllProducts

The getAllProducts endpoint will fetch all the products in the DB by default but it also has query params that generate items on specifications. For instance, if new=true, it will generate the recent 5 items in the DB. If u give values for category, it will generate items for that specific category
 eg. localhost:8000/api/products?new=true or
 localhost:8000/api/products?category=shirt


3. Cart Controller
This contains the endpoints for updating, deleting and fetching of cart. Only the original user can perform these activites. A user can only have just one cart at a time. Which means the deleteCart endpoint has to be called whenever the purchase process is over.

createCart, updateCart, deleteCart, getCart


4. generalRating Controller
This contains the endpoints for updating, deleting and fetching of general ratings. Only the original user and admin can delete general ratings. .

createGenRating, updateGenRating, deleteGenRating, getGenRating, getAllGenRatings



5. rating Controller
This contains the endpoints for updating, deleting and fetching of procuct ratings. Only the original user and admin can delete general ratings. These ratings are to a specific product

createRating, updateRating, deleteRating, getRating, getAllRatings


ROUTES

server = http://localhost:8000

1. Auth Routes
root = /api/users

* create User
router.post("/createuser", registerUser);

* Login User
router.post("/login", login);

* Verified User (This is called by the system itself)
router.get("/verified", verificationFile);

*Verify Password Reset
router.get("/verify/:userId/:uniqueString", verify);

* User Password requesr
router.post('/resetpasswordrequest', requestPasswordReset);

2. Product Routes
root = /api/products

router.post('/', verifyAdmin, createProduct)
router.get('/', getAllProducts)
router.get('/:productid', getProduct)
router.put('/:productid', verifyAdmin, updateProduct)
router.delete('/:productid', verifyAdmin, deleteProduct)

verifyUser and verifyAdmin are middlewares


3. Cart Routes
root = /api/carts

router.post('/', verifyUser, createCart);
router.get('/:userId', verifyUser, getCart);
router.put('/:cartid', verifyUser, updateCart);
router.delete('/:cartid', verifyUser, deleteCart);


4.Rating Routes
root = /api/ratings

router.post('/', verifyUser, createRaing);
router.get('/', getAllRatings);
router.get('/:ratingid', getRating);
router.put('/:ratingid', verifyUser, updateRaing);
router.delete('/:ratingid', verifyUser, deleteRaing);

This is specifically for a product


5.Review Routes
root = /api/reviews

router.post('/', verifyUser, createGeRating);
router.get('/', getAllGeRatings);
router.get('/:ratingid', getGeRating);
router.put('/:ratingid', verifyUser, updateGeRating);
router.delete('/:ratingid', verifyUser, deleteGeRating);

These are the general ratings for the company and not to a specific product

6. User Routes
root = /api/profiles
router.put('/:id', verifyUser, updateUser);
router.get('/:id', verifyUser, getUser);
router.delete('/:id', verifyUser, deleteUser);
router.get('/', verifyAdmin, getAllUser);
