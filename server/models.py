from flask_sqlalchemy import SQLAlchemy

# Initialize the db instance
db = SQLAlchemy()

# User Model (for both customers and vendors)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # 'customer' or 'vendor'

    # Adding a relationship to Order and Product for convenience
    orders = db.relationship('Order', backref='customer_ref', lazy=True)  # Changed backref name
    products = db.relationship('Product', backref='vendor_products', lazy=True)  # Changed backref name

    def __repr__(self):
        return f'<User {self.email}>'

# Product Model (for Mama Mboga's products)
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    price = db.Column(db.Float, nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Added vendor_id field
    image = db.Column(db.String(255), nullable=True)  # Added image field

    # Establish relationship with User (Vendor)
    vendor = db.relationship('User', backref=db.backref('products_vendor', lazy=True))  # Changed backref name

    def __repr__(self):
        return f'<Product {self.name}>'

# Order Model (for orders placed by customers)
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)  # e.g., "processing", "shipped", "delivered"

    # Establish relationship with Product and User (customer)
    product = db.relationship('Product', backref=db.backref('orders', lazy=True))
    customer = db.relationship('User', backref=db.backref('customer_orders', lazy=True))

    def __repr__(self):
        return f'<Order {self.id} - {self.status}>'

# Delivery Model (tracks deliveries for orders)
class Delivery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    delivery_status = db.Column(db.String(50), nullable=False)  # e.g., "on the way", "delivered"

    # Establish relationship with Order
    order = db.relationship('Order', backref=db.backref('delivery', lazy=True))

    def __repr__(self):
        return f'<Delivery {self.id} - {self.delivery_status}>'
