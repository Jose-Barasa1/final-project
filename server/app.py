from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate  # Import Migrate
from models import db  # Import the db from models

# Initialize app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mama_mboga.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Should be False for better performance
app.config['SECRET_KEY'] = 'secret_key'

# Initialize extensions
db.init_app(app)  # Initialize the db with the Flask app
ma = Marshmallow(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)  # Initialize Flask-Migrate with app and db

# Routes import
import routes

# Create all tables (make sure this is inside app context)
with app.app_context():
    db.create_all()  # This creates the tables if they don't exist

if __name__ == '__main__':
    app.run(debug=True)
