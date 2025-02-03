from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from models import db

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mama_mboga.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'secret_key'

db.init_app(app)
ma = Marshmallow(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

with app.app_context():
    db.create_all()
    from models import Product
    if not Product.query.first():
        product1 = Product(name="Tomato", description="Fresh red tomatoes", price=3.5, vendor_id=1)
        product2 = Product(name="Cabbage", description="Green cabbage", price=2.0, vendor_id=1)

        db.session.add(product1)
        db.session.add(product2)
        db.session.commit()

        print("Products added to the database.")
    else:
        print("Products already exist.")

import routes

if __name__ == '__main__':
    app.run(debug=True)
