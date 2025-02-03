from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    orders = db.relationship('Order', backref='customer_ref', lazy=True)
    products = db.relationship('Product', backref='vendor_products', lazy=True)
    cart_items = db.relationship('Cart', backref='user_cart_items', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    price = db.Column(db.Float, nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    vendor = db.relationship('User', backref=db.backref('products_vendor', lazy=True))

    def __repr__(self):
        return f'<Product {self.name}>'

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)

    product = db.relationship('Product', backref=db.backref('orders', lazy=True))
    customer = db.relationship('User', backref=db.backref('customer_orders', lazy=True))

    def __repr__(self):
        return f'<Order {self.id} - {self.status}>'

class Delivery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    delivery_status = db.Column(db.String(50), nullable=False)

    order = db.relationship('Order', backref=db.backref('delivery', lazy=True))

    def __repr__(self):
        return f'<Delivery {self.id} - {self.delivery_status}>'

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    product = db.relationship('Product', backref=db.backref('cart_items', lazy=True))
    user = db.relationship('User', backref=db.backref('user_cart_items', lazy=True))

    def __repr__(self):
        return f'<Cart {self.user_id} - Product {self.product_id} - Quantity {self.quantity}>'
