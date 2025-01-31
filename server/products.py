from app import db, bcrypt
from models import Product, User

# Check if Vendor exists (to prevent duplicates)
vendor = User.query.filter_by(email='mama@example.com').first()

if not vendor:
    # Create and add Vendor (Mama Mboga) with hashed password
    hashed_password = bcrypt.generate_password_hash('your_plain_password').decode('utf-8')
    vendor = User(username='mamaMboga', email='mama@example.com', password=hashed_password, role='vendor')
    db.session.add(vendor)
    db.session.commit()  # Commit to ensure vendor.id is populated
    print("Vendor created successfully!")
else:
    print("Vendor already exists!")

# Adding Products for the Vendor
products = [
    {
        'name': 'Fresh Tomatoes',
        'description': 'Fresh, ripe tomatoes grown locally. Perfect for cooking or fresh salads.',
        'price': 50.0,
        'vendor_id': vendor.id,
        'image': 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg'
    },
    {
        'name': 'Organic Potatoes',
        'description': 'High-quality organic potatoes harvested from local farms. Great for making fries or mash.',
        'price': 40.0,
        'vendor_id': vendor.id,
        'image': 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg'
    },
    {
        'name': 'Spinach Bunch',
        'description': 'Fresh spinach packed with vitamins and minerals, ideal for healthy meals.',
        'price': 30.0,
        'vendor_id': vendor.id,
        'image': 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg'
    },
    {
        'name': 'Carrots (500g)',
        'description': 'Fresh carrots, rich in beta-carotene and perfect for soups, salads, or snacks.',
        'price': 25.0,
        'vendor_id': vendor.id,
        'image': 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg'
    },
    {
        'name': 'Bananas (Per Bunch)',
        'description': 'Ripe and sweet bananas, a delicious and healthy snack for the whole family.',
        'price': 150.0,
        'vendor_id': vendor.id,
        'image': 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg'
    }
]

# Check if the product already exists before adding (to avoid duplicates)
for product in products:
    try:
        # Check for existing product by name and vendor_id
        existing_product = Product.query.filter_by(name=product['name'], vendor_id=vendor.id).first()

        if not existing_product:
            new_product = Product(
                name=product['name'],
                description=product['description'],
                price=product['price'],
                vendor_id=product['vendor_id'],
                image=product['image']  # Include the image URL in the product entry
            )
            db.session.add(new_product)
            print(f"Product '{product['name']}' added successfully!")
        else:
            print(f"Product '{product['name']}' already exists!")

    except Exception as e:
        print(f"Error while adding product '{product['name']}': {str(e)}")

# Commit changes to the database
try:
    db.session.commit()
    print("Sample products added successfully!")
except Exception as e:
    print(f"Error while committing to the database: {str(e)}")
