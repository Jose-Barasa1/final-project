from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate  # Import Migrate
from models import db  # Only import db here

# Initialize app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mama_mboga.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable for better performance
app.config['SECRET_KEY'] = 'secret_key'

# Initialize extensions
db.init_app(app)  # Initialize the db with the Flask app
ma = Marshmallow(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)  # Initialize Flask-Migrate with app and db

# Create tables (if not already created)
with app.app_context():
    db.create_all()  # Create all tables in the database
    
    # Add products manually if they don't already exist
    from models import Product  # Import Product here, after db initialization
    if not Product.query.first():  # Check if there are no products in the DB
        product1 = Product(name="Tomato", description="Fresh red tomatoes", price=3.5, vendor_id=1)
        product2 = Product(name="Cabbage", description="Green cabbage", price=2.0, vendor_id=1)

        db.session.add(product1)
        db.session.add(product2)
        db.session.commit()

        print("Products added to the database.")
    else:
        print("Products already exist.")

# Routes import
import routes

# Start the Flask application
if __name__ == '__main__':
    app.run(debug=True)
