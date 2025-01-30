from flask import request, jsonify
from app import app, db, bcrypt
from models import User, Product, Order, Delivery
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS

# Enable CORS to allow requests from different origins
CORS(app)

# Register a new user (Mama Mboga or customer)
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "No input data provided"}), 400
        
        # Ensure all required fields are present
        if 'email' not in data or 'password' not in data or 'username' not in data or 'role' not in data:
            return jsonify({"message": "Missing required fields"}), 400
        
        # Check if the email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"message": "Email already exists"}), 400
        
        # Hash the password
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Create new user
        new_user = User(username=data['username'], email=data['email'], password=hashed_password, role=data['role'])
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
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
            token = create_access_token(identity={'id': user.id, 'username': user.username, 'role': user.role})
            return jsonify({'token': token}), 200
        return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# CRUD for Product (only for vendors)
@app.route('/products', methods=['POST'])
@jwt_required()
def add_product():
    try:
        current_user = get_jwt_identity()
        if current_user['role'] != 'vendor':
            return jsonify({"message": "Unauthorized"}), 403

        data = request.get_json()
        if not data or 'name' not in data or 'description' not in data or 'price' not in data:
            return jsonify({"message": "Missing required fields"}), 400
        
        new_product = Product(name=data['name'], description=data['description'], price=data['price'], vendor_id=current_user['id'])
        db.session.add(new_product)
        db.session.commit()

        return jsonify({"message": "Product added successfully"}), 201
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@app.route('/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        return jsonify([{"id": p.id, "name": p.name, "price": p.price} for p in products]), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# Place an order (for customers)
@app.route('/order', methods=['POST'])
@jwt_required()
def place_order():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        if 'product_id' not in data:
            return jsonify({"message": "Product ID is required"}), 400
        
        new_order = Order(customer_id=current_user['id'], product_id=data['product_id'], status='processing')
        db.session.add(new_order)
        db.session.commit()
        
        # Create a delivery entry
        new_delivery = Delivery(order_id=new_order.id, delivery_status='on the way')
        db.session.add(new_delivery)
        db.session.commit()
        
        return jsonify({"message": "Order placed successfully"}), 201
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

# View orders (for customers or vendors)
@app.route('/orders', methods=['GET'])
@jwt_required()
def view_orders():
    try:
        current_user = get_jwt_identity()
        if current_user['role'] == 'vendor':
            orders = Order.query.filter_by(vendor_id=current_user['id']).all()
        else:
            orders = Order.query.filter_by(customer_id=current_user['id']).all()
        
        return jsonify([{"id": o.id, "status": o.status} for o in orders]), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
