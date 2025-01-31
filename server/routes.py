from flask import request, jsonify
from app import app, db, bcrypt  # Import db and bcrypt from app.py
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import traceback

# Import models (User, Product, Order, Delivery) directly at the top
from models import User, Product, Order, Delivery

# Enable CORS to allow requests from different origins
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Register a new user (customer only)
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"message": "No input data provided"}), 400
        
        # Ensure all required fields are present (username removed)
        if 'email' not in data or 'password' not in data or 'role' not in data:
            return jsonify({"message": "Missing required fields"}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"message": "Email already exists"}), 400
        
        # Ensure password is at least 6 characters long (optional but good practice)
        if len(data['password']) < 6:
            return jsonify({"message": "Password must be at least 6 characters long"}), 400
        
        # Hash the password
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

        # Ensure role is 'customer'
        if data['role'] != 'customer':
            return jsonify({"message": "Only customers can register"}), 400
        
        # Create new user without username field
        new_user = User(email=data['email'], password=hashed_password, role=data['role'])
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201

    except Exception as e:
        # Print error details and traceback to the console for debugging
        print(f"Error occurred during user registration: {e}")
        traceback.print_exc()  # This will print the complete traceback
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# Login user and generate JWT token
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No input data provided"}), 400

        if 'email' not in data or 'password' not in data:
            return jsonify({"message": "Missing email or password"}), 400

        user = User.query.filter_by(email=data['email']).first()
        
        if user and bcrypt.check_password_hash(user.password, data['password']):
            token = create_access_token(identity={'id': user.id, 'email': user.email, 'role': user.role})
            return jsonify({'token': token}), 200
        return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"message": f"An error occurred during login: {str(e)}"}), 500

# Get all products (for customers only)
@app.route('/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        product_list = [
            {
                "id": p.id, 
                "name": p.name, 
                "description": p.description,
                "price": p.price,
                "image": p.image
            } for p in products
        ]
        return jsonify(product_list), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# Place an order (for customers only)
@app.route('/order', methods=['POST'])
@jwt_required()
def place_order():
    try:
        current_user = get_jwt_identity()
        if current_user['role'] != 'customer':
            return jsonify({"message": "Unauthorized: Only customers can place orders"}), 403

        data = request.get_json()
        if 'product_id' not in data:
            return jsonify({"message": "Product ID is required"}), 400
        
        new_order = Order(customer_id=current_user['id'], product_id=data['product_id'], status='processing')
        db.session.add(new_order)
        db.session.commit()
        
        new_delivery = Delivery(order_id=new_order.id, delivery_status='on the way')
        db.session.add(new_delivery)
        db.session.commit()
        
        return jsonify({"message": "Order placed successfully"}), 201
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# View orders (for customers only)
@app.route('/orders', methods=['GET'])
@jwt_required()
def view_orders():
    try:
        current_user = get_jwt_identity()
        if current_user['role'] != 'customer':
            return jsonify({"message": "Unauthorized: Only customers can view orders"}), 403

        orders = Order.query.filter_by(customer_id=current_user['id']).all()
        
        order_list = [
            {
                "id": o.id,
                "status": o.status,
                "product_id": o.product_id,
                "product_name": o.product.name, 
                "delivery_status": o.delivery.delivery_status if o.delivery else 'N/A'
            } for o in orders
        ]
        return jsonify(order_list), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
