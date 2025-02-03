from flask import request, jsonify
from app import app, db, bcrypt
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from flask_cors import CORS
from models import User, Product, Order, Delivery, Cart

# Allow requests from your React app
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data or 'role' not in data:
            return jsonify({"message": "Missing required fields"}), 400
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"message": "Email already exists"}), 400
        if len(data['password']) < 6:
            return jsonify({"message": "Password too short"}), 400
       
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        if data['role'] != 'customer':
            return jsonify({"message": "Only customers can register"}), 400
       
        new_user = User(email=data['email'], password=hashed_password, role=data['role'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        print("Error in register:", e)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"message": "Missing email or password"}), 400
       
        user = User.query.filter_by(email=data['email']).first()
        if user and bcrypt.check_password_hash(user.password, data['password']):
            # Use the user's id as a string for the identity.
            token = create_access_token(
                identity=str(user.id),
                additional_claims={
                    'email': user.email,
                    'role': user.role
                }
            )
            return jsonify({'token': token}), 200

        return jsonify({"message": "Invalid credentials"}), 401

    except Exception as e:
        print("Error in login:", e)
        return jsonify({"message": f"An error occurred during login: {str(e)}"}), 500

@app.route('/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        return jsonify([
            {
                "id": p.id,
                "name": p.name,
                "description": p.description,
                "price": p.price
            } for p in products
        ]), 200
    except Exception as e:
        print("Error in get_products:", e)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@app.route('/order', methods=['POST'])
@jwt_required()
def place_order():
    try:
        # Convert the identity (user id) to integer for database queries.
        user_id = int(get_jwt_identity())
        claims = get_jwt()  # Additional claims (like role)
        if claims.get('role') != 'customer':
            return jsonify({"message": "Unauthorized"}), 403

        data = request.get_json()
        if not data or 'cart_items' not in data:
            return jsonify({"message": "Cart items are required"}), 400

        for item in data['cart_items']:
            if 'product_id' not in item or 'quantity' not in item:
                return jsonify({"message": "Product ID and quantity are required"}), 400

            new_order = Order(
                customer_id=user_id,
                product_id=item['product_id'],
                status='processing'
            )
            db.session.add(new_order)
            db.session.commit()

            new_delivery = Delivery(order_id=new_order.id, delivery_status='on the way')
            db.session.add(new_delivery)
            db.session.commit()

        return jsonify({"message": "Order placed successfully"}), 201
    except Exception as e:
        print("Error in place_order:", e)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@app.route('/orders', methods=['GET'])
@jwt_required()
def view_orders():
    try:
        user_id = int(get_jwt_identity())
        claims = get_jwt()
        if claims.get('role') != 'customer':
            return jsonify({"message": "Unauthorized"}), 403

        orders = Order.query.filter_by(customer_id=user_id).all()
        return jsonify([
            {
                "id": o.id,
                "status": o.status,
                "product_id": o.product_id,
                "product_name": o.product.name,
                "delivery_status": o.delivery.delivery_status if o.delivery else 'N/A'
            } for o in orders
        ]), 200
    except Exception as e:
        print("Error in view_orders:", e)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@app.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        if 'product_id' not in data or 'quantity' not in data:
            return jsonify({"message": "Product ID and quantity are required"}), 400

        existing_cart_item = Cart.query.filter_by(user_id=user_id, product_id=data['product_id']).first()
        if existing_cart_item:
            existing_cart_item.quantity += data['quantity']
            db.session.commit()
            return jsonify({"message": "Cart updated"}), 200

        new_cart_item = Cart(user_id=user_id, product_id=data['product_id'], quantity=data['quantity'])
        db.session.add(new_cart_item)
        db.session.commit()
        return jsonify({"message": "Product added to cart"}), 201
    except Exception as e:
        print("Error in add_to_cart:", e)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@app.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    try:
        user_id = int(get_jwt_identity())
        cart_items = Cart.query.filter_by(user_id=user_id).all()
        if not cart_items:
            return jsonify({"message": "Your cart is empty"}), 404
        return jsonify([
            {
                'product_id': item.product.id,
                'product_name': item.product.name,
                'price': item.product.price,
                'quantity': item.quantity
            } for item in cart_items
        ]), 200
    except Exception as e:
        print("Error in get_cart:", e)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@app.route('/cart/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(product_id):
    try:
        user_id = int(get_jwt_identity())
        cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
        if not cart_item:
            return jsonify({"message": "Product not in cart"}), 404
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({"message": "Product removed from cart"}), 200
    except Exception as e:
        print("Error in remove_from_cart:", e)
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
