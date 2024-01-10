# Registration Module

This Node.js application built with Express facilitates user registration and verification. The registration process involves both email and SMS verification, utilizing Nodemailer for email services and Twilio for SMS services. MongoDB is the chosen database for storing user records.

# Prerequisites

Before running the application, ensure you have the following installed:

- Node.js
- npm
- MongoDB
- Twilio account with valid credentials
- Gmail account for sending emails

## Installation

1. **Clone the Repository:**

    ```bash
    git clone <repository-url>
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Set Up Environment Variables:**

    ```env
    email=your_email@gmail.com
    pass=your_gmail_app_password
    accountSid=your_twilio_account_accountSid
    authToken=your_twilio_account_authToken
    ```

    Replace all placeholders with your real credentials.

## Usage

1. **Start the Application:**

    ```bash
    nodemon index.js
    ```

    The application will be accessible at `http://localhost:3000`.

2. **Access the Registration Form:**

    Open a web browser and navigate to `http://localhost:3000`.

3. **Registration Flow:**

   - Enter username, email, or phone number.
   - Receive a verification code via email or SMS.
   - Validate the code to complete the registration.

## Endpoints

- `GET /`: Home page serving the registration form.
- `POST /validation`: Validates user input and sends a verification code via email or SMS.
- `POST /home`: Validates the user-entered code and registers the user.

 Technologies Used

- Node.js
- Express
- MongoDB
- Nodemailer
- Twilio


