 # Standout
An online clothing store, where you can BUY, ADD, EDIT, and DELETE products.
You'll be welcomed to the website as an owner of the site and you have full access and customization of it.
you can't do any changes on the database cuz i don't want people to mess it up. i used local storage instead of database to track product changes and orders. <br>


📃 Its a MERN stack and i used
- HTML
- SCSS
- REACT JS
- NODE JS
- MONGODB
- [Cloudinary](https://cloudinary.com) for storing images
- [Braintree](https://www.braintreepayments.com) for payment gateway
- Libraries
  - [React hook form](https://react-hook-form.com)
  - [React router dom](https://reactrouter.com)
  - [Axios](https://www.npmjs.com/package/axios)
  - [Swiper js](https://swiperjs.com)
  - [Express js](https://expressjs.com)
  - [Mongoose js](https://mongoosejs.com)
  - [Bcrypt js](https://www.npmjs.com/package/bcrypt)
  - [Json Web Token](https://www.npmjs.com/package/jsonwebtoken)
  

## How to run it
you need two tabs on cli

create a .env file and add these variables. (Use your own keys Instead of asterisk)

   - MONGODB_URI=******
   - JWT_SECRET=******
   - CLOUDINARY_CLOUD_NAME=******
   - CLOUDINARY_API_KEY=******
   - CLOUDINARY_API_SECRET=******
   - SANDBOX_MERCHANT_ID=******
   - SANDBOX_PUBLIC_KEY=******
   - SANDBOX_PRIVATE_KEY=******


### Backend

##### Development
```
npm i
npm run dev
```

##### Production
```
npm run Start
```

### Frontend

##### Development
```
cd client
npm i
npm start
```

##### Production
```
cd client
npm i
npm run build
```
