# Frontend for Microservices Project

## About
This frontend is part of a microservices-based portfolio project developed for **CS 361 - Software Engineering I**. The project is a donation web application that allows users to make donations easily to an organization and enables registered users to track their donation history. The frontend interacts with multiple microservices via APIs.

## Overview
This application serves as the user interface for users. It communicates with serveral microservices, each deployed separately running on different ports. The forntend makes REST API calles to these microservices to support user acoount registration and management, donation processing, receipt generation, and donation tracking.

## Technologies Used
- React
- Redux
- Axios
- Tailwind CSS
- JSON Web Tokens (JWT)
- Node.js
- Express.js
- MySQL

## Setup & Installation
1. Clone the repository
   ```
   git clone https://github.com/JazmiaCornell/microservicesProject.git
   cd microservicesProject/client
   ```
3. Install dependencies:
   ```
   npm install
   ```
5. Configure environment variables:  
   Create a .env file and add your Stripe public key
6. Run the frontend:
   ```
   npm start
   ```

## Usage
Make sure all backend microservices are running before starting the frontend.  
The UI allows:
- New users to register and create accounts
- Registered users to log in and view their donation history and account overview (dashboard)
- Registered users to view and update account information (profile)
- All users to make donations

## Related Backend Microservices Repositories
The frontend communicates with the following microservices, each maintained in its own repository:
- [Microservice A (Receipt Generator)](https://github.com/bernardom03-cs361/Microservice-A) - Created by a classmate, this service generates a recipt upon successful donation and emails it to the user.
- [Microservice B (User Account Management)](https://github.com/JazmiaCornell/microservice-B) - Manages user registration, authentication, account deatils and access.
- [Microservice C (Donation Processing)](https://github.com/JazmiaCornell/microservice-C) - Handles donation processing, including Stripe API integration.
- [Microservice D (Donation Tracking)](https://github.com/JazmiaCornell/microservice-D) - Stores donations to database and retrieves users' donation histories.


## Testing Donations / Making a Payment

To test donation processing, use Stripe's testing cards:  
[Stripe Testinig Guide](https://docs.stripe.com/terminal/references/testing)  
```
Card Number: 4242 4242 4242 4242  
Exp Date: Any future date  
CVC: Any 3-digit number
```

## Citations

**Citation Scope:** Node.js app setup, database connection, and CRUD operations

- **Date:** 05/04/2025
- **Originality:** Adapted
- **Source:** [osu-cs340-ecampus/nodejs-starter-app](https://github.com/osu-cs340-ecampus/nodejs-starter-app)

**Citation Scope:** Implementation of React, CORS, Redux, Axios, Bcrypt, Tailwind CSS

- **Date:** 05/04/2025
- **Originality:** Adapted
- **Source:** [TechCheck YouTube Series](https://www.youtube.com/watch?v=dICDmbgGFdE&list=PLzF6FKB4VN3_8lYlLOsJI8hElGLRgUs7C)
- **Author:** TechCheck

**Citation Scope:** Dropdown toggle feature using `useState` in React

- **Date:** 05/04/2025
- **Originality:** Adapted
- **Source:** [Giwon on Medium](https://medium.com/@giwon.yi339/toggle-feature-for-a-drop-down-list-on-react-using-usestate-5e40b9cb19a7)
- **Author:** Giwon

**Additional Resources:**

- [React Documentation](https://react.dev/learn)
- [Stripe Checkout Guide](https://docs.stripe.com/checkout/custom/quickstart)
- [Tailwind CSS](https://tailwindcss.com)
- [Unsplash Image Assets](https://unsplash.com)
