# Mama Mboga - Grocery Delivery Service

**Mama Mboga** is an online grocery delivery platform designed to provide customers with an easy and efficient way to shop for fresh groceries and track their orders. The system is built using a **React** frontend and a **Flask** backend with **SQLAlchemy** for database management.

---

## Features

- **User Authentication**: Secure login and registration with JWT-based authentication.
- **Product Browsing**: Customers can search and browse a wide variety of grocery products.
- **Cart Management**: Add products to the cart, adjust quantities, and remove items.
- **Order Tracking**: View order status in real-time (e.g., "In Transit", "Delivered").
- **Responsive Design**: Mobile-first, responsive UI built with **Bootstrap**.

---

## Tech Stack

- **Frontend**:
  - React
  - React Router DOM
  - Axios for API requests
  - Bootstrap for styling
  - Font Awesome for icons
  - React Toastify for notifications

- **Backend**:
  - Flask
  - SQLAlchemy for database management (ORM)
  - JWT for secure user authentication

---

## Installation

### Prerequisites

- Python 3.7+ (for the backend)
- Node.js 14.x+ (for the frontend)
- npm 6.x+ (for managing frontend dependencies)

### Frontend Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/mama-mboga.git
    cd mama-mboga
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```

Your frontend will be available at [http://localhost:3000](http://localhost:3000).

### Backend Setup

1. Clone the backend repository (if separate):
    ```bash
    git clone https://github.com/yourusername/mama-mboga-backend.git
    cd mama-mboga-backend
    ```

2. Set up a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use venv\Scripts\activate
    ```

3. Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

4. Set up the database:
    ```bash
    flask db upgrade
    ```

5. Run the Flask application:
    ```bash
    flask run
    ```

Your backend will be running at [http://localhost:5000](http://localhost:5000).

---

## Usage

### User Authentication

- Navigate to the **Login** or **Register** page to create a new account or log in.
- After logging in, users can browse products, add them to their cart, and place orders.

### Product Browsing

- The **Products** page allows users to explore the catalog and add items to their cart.
- Users can adjust product quantities and view detailed product descriptions.

### Cart Management

- The **Cart** page allows users to review items, update quantities, or remove items before checkout.

### Order Tracking

- After making a purchase, users can track the status of their orders in real-time from the **Orders** page.
- Order status updates include **In Transit**, **Delivered**, etc.

---

## API Documentation

### Endpoints

- **POST** `/register`: Register a new user (customer or vendor).
- **POST** `/login`: Log in and receive a JWT token.
- **GET** `/products`: Retrieve all available products.
- **POST** `/cart`: Add a product to the cart.
- **GET** `/orders`: Retrieve a list of orders for the logged-in user.
- **GET** `/order-details/{orderId}`: Get details of a specific order.
- **POST** `/logout`: Log out the current user and invalidate the JWT token.

---

## Database Models (SQLAlchemy)

- **User**: Tracks user information such as name, email, and password.
- **Product**: Stores details of available products (name, description, price, etc.).
- **Order**: Represents customer orders with status (e.g., pending, delivered).
- **CartItem**: Represents items in the shopping cart with product ID and quantity.

---

## Contributing

We welcome contributions to this project! Here's how you can contribute:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a pull request with a detailed description of the changes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## Acknowledgements

- **React** for building the frontend.
- **Flask** and **SQLAlchemy** for the backend API and database management.
- **Bootstrap** for responsive design.
- **Font Awesome** for the icons.
