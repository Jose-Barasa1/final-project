from app import db
from models import Product, User

# Sample Vendor (Mama Mboga)
vendor = User(username='mamaMboga', email='mama@example.com', password='hashed_password', role='vendor')
db.session.add(vendor)
db.session.commit()

# Adding Products
products = [
    {
        'name': 'Fresh Tomatoes',
        'description': 'Fresh, ripe tomatoes grown locally. Perfect for cooking or fresh salads.',
        'price': 50.0,
        'vendor_id': vendor.id
    },
    {
        'name': 'Organic Potatoes',
        'description': 'High-quality organic potatoes harvested from local farms. Great for making fries or mash.',
        'price': 40.0,
        'vendor_id': vendor.id
    },
    {
        'name': 'Spinach Bunch',
        'description': 'Fresh spinach packed with vitamins and minerals, ideal for healthy meals.',
        'price': 30.0,
        'vendor_id': vendor.id
    },
    {
        'name': 'Carrots (500g)',
        'description': 'Fresh carrots, rich in beta-carotene and perfect for soups, salads, or snacks.',
        'price': 25.0,
        'vendor_id': vendor.id
    },
    {
        'name': 'Bananas (Per Bunch)',
        'description': 'Ripe and sweet bananas, a delicious and healthy snack for the whole family.',
        'price': 150.0,
        'vendor_id': vendor.id
    }
]

# Add each product to the session
for product in products:
    new_product = Product(
        name=product['name'],
        description=product['description'],
        price=product['price'],
        vendor_id=product['vendor_id']
    )
    db.session.add(new_product)

# Commit changes to the database
db.session.commit()