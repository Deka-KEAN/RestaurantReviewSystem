### RestaurantReviewSystem

## How to run locally?
Inside RestaurantReviewSystem project directory run the following commands
- npm install
- node index.js

## APIs

#For User SignUp
Both of the following API returns a JWT authentication token which can be stored in frontend
- /manage/api/signup
- /manage/api/signin

#For Adding Business
Based on the JWT token we got on SignUp/SignIn we can do the following operations
- /manage/api/business/show - Accessible to all
- /manage/api/business/add - Accessible to Business Owners and Admins
- /manage/api/business/update/:id - Accessible to Business Owners and Admins
- /manage/api/business/remove  - Accessible to Admins Only

#For Adding Reviews
Based on the JWT token we got on SignUp/SignIn we can do the following operations
- /manage/api/review/show/:listName  - Accessible to all shows all the reviews for a particular business
- /manage/api/review/add - Accessible to User and Admins to create reviews (Business owners can respond)
- /manage/api/review/update/:id - Accessible to All to update the reviews
- /manage/api/review/remove - Accessible to User and Admins to remove reviews
