require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db"); // Path to your config/db.js
const Property = require("./models/Property"); // Path to your Property model

// Array of property data to be inserted
const properties = [
    {
        "title": "Office Space For Rent in Pearls Best Heights",
        "description": "This well-designed and functional office space is available for rent in the prime location of Netaji Subhash Place, Delhi.<br><ul><li>Situated on the third floor, this tastefully furnished office space offers a total area of 600 square feet.</li><li> The office is well ventilated and enjoys a road view, providing a refreshing working environment.</li><li> It is Vastu compliant, assuring positive vibes for enhanced productivity.</li><li> Added to this is the ample parking space, ensuring hassle-free parking for you and your clients.</li><li> The interiors of this office space are thoughtfully designed, creating a professional and welcoming atmosphere.</li><li> The wet pantry allows for convenient food and beverage preparation, while the presence of a washroom adds to the convenience.</li><li> In terms of amenities, this office space offers power backup and 24 x 7 security, ensuring a smooth workflow without any interruptions.</li><li> The high-speed elevators provide quick access to the office, making it convenient for employees and clients.</li><li> The building also features various amenities including ATMs, a food court, and visitor parking.</li><li> Additionally, the office comes with facilities like electricity backup, tiles, service elevators, reception/waiting room, maintenance staff, security staff, and CCTV security for a secure working environment.</li><li> In terms of accessibility, this office space is easily reachable and enjoys excellent connectivity to other parts of the city.</li><li> Priced at just 45,500, this is an excellent opportunity for businesses looking for a well-maintained, fully furnished office space in a prime location.</li></ul>Don't miss out on this ideal office space.",
        "location": "Netaji Subhash Place, Delhi",
        "price": 45500,
        "bedrooms": 0,
        "amenities": [
          "Furnished",
          "Wet Pantry",
          "Personal Washroom",
          "Covered Parking: 5",
          "Open/Uncovered Parking: 4",
          "Balcony: Individual",
          "Power Backup: Available",
          "Lift Availability: Yes",
          "View: Road View",
          "Flooring: Carpeted",
          "Floor Number: 3",
          "Tower/Block: 1",
          "Security Deposit: Two Month",
          "Built-up Area: 600 Sq.Ft."
        ],
        "imageUrl": "https://img.squareyards.com/secondaryPortal/638597769986867547-2008240656385638.jpg",
        "available": true,
        
      },
      {
        "title": "3 BHK Builder Floor For Rent in Defence Colony Villas",
        "description": "Looking for a luxurious and spacious builder floor for rent in Defence Colony, Delhi.<br><ul><li>Look no further! Introducing the stunning and well-designed apartments at Defence Colony Villas.</li><li>This semi-furnished 3 BHK builder floor boasts an impressive floor area of 1450 square feet, offering ample space for you and your family to live comfortably. The builder floor is located on the ground floor of a beautiful building and comes with 3 bathrooms and 3 bedrooms, ensuring privacy and convenience for everyone.</li><li>With a well-thought-out floor plan, the apartment features an open and airy layout that maximises natural light and ventilation. In terms of furnishings, this apartment is semi-furnished, giving you the flexibility to add your personal touch.</li><li>With high-quality fittings and fixtures, this home exudes an air of sophistication and elegance.</li><li>The bedrooms are tastefully designed to be your tranquil sanctuary, and the bathrooms are equipped with modern amenities and fittings. One of the highlights of this builder floor is its prime location in Defence Colony, offering a perfect combination of tranquility and convenience.</li><li>Surrounded by lush greenery and well-planned infrastructure, you will find all the necessary amenities within easy reach.</li><li>Whether it's shopping, dining, or entertainment, you'll be spoiled for choice with a wide range of options available in the vicinity. This builder floor also comes with 2 reserved parking spaces, ensuring that your vehicles are safe and secure.</li><li>Additional features include a 24/7 security system for peace of mind and a convenient location with easy access to public transportation.</li><li>Don't miss the opportunity to rent this impeccable builder floor in Defence Colony.</li></ul>With all the bells and whistles you could ever ask for, your dream home awaits you.",
        "location": "Defence Colony, Delhi",
        "price": 250000,
        "bedrooms": 3,
        "amenities": [
          "Only available for Company Lease",
          "Immediately Available",
          "Semi-Furnished",
          "5-7 Years Old",
          "3 Rooms",
          "3 Bathrooms",
          "2 Covered Parking",
          "1 Open/Uncovered Parking",
          "Power Back-up Available",
          "No Lift Availability",
          "North Facing",
          "Marble Flooring",
          "1st Floor",
          "Unit No 3",
          "Two Month Security Deposit"
        ],
        "imageUrl": "https://img.squareyards.com/secondaryPortal/638602717174029926-2608241221572157.jpg",
        "available": true
      },
      {
        "title": "4 BHK + Pooja Room Builder Floor For Rent in Safdarjung Enclave",
        "description": "Looking for an affordable and well-ventilated builder floor for rent in Delhi.<br><ul><li>Look no further! Presenting a spacious and tastefully designed builder floor in the peaceful vicinity of Safdarjang Enclave. This 4-bedroom builder floor offers a peaceful and family-friendly environment, perfect for those looking for a comfortable living space.</li><li>The interiors are thoughtfully designed, ensuring a cozy and welcoming atmosphere for you and your loved ones. Spread across an area of 500 square yards, this semi-furnished builder floor offers ample natural light and scenic garden views, making it a serene and refreshing place to call home.</li><li>The floor faces the beautiful garden, allowing you to enjoy a soothing view right from your living room. Situated in the popular locality of Safdarjang Enclave, the property boasts easy access to a range of amenities such as restaurants, medical facilities, multiplexes, ATMs, and a food court.</li><li>Everything you need is just a stone's throw away! The builder floor is part of the Safdarjung Enclave project, adding to its appeal and reliability.</li><li>With 4 well-appointed bedrooms and 4 bathrooms, each member of your family will have their own personal space and comfort. The property also offers a covered parking space, ensuring the safety of your vehicle.</li><li>The age of the property is between 5-7 years, giving you the assurance of a well-maintained and sturdy structure. Don’t miss out on this wonderful opportunity to rent this beautiful builder floor in the highly sought-after Safdarjung Enclave.</li></ul> Grab this deal for an affordable price of 2.75 lac.",
        "location": "Safdarjung Enclave, Delhi",
        "price": 275000,
        "priceDuration": "Per Month",
        "unitType": "4 BHK",
        "area": "500 Sq.Yd.",
        "available": true,
        "bedrooms": 4,
        "bathrooms": 4,
        "furnishingStatus": "Semi-Furnished",
        "propertyType": "Builder Floor",
        "amenities": [
          "Garden View",
          "Balcony: Connected",
          "Power Back-up: Available",
          "Water Source: Municipal Supply",
          "Lift Availability: Yes",
          "Facing: North East",
          "Flooring: Concrete",
          "Floor Number: Second Floor",
          "Total Floor Count: Four",
          "Unit No: Front",
          "Security Deposit: One Month",
          "Built-up Area: 500 Sq.Yd.",
          "Covered Parking: 1",
          "Open/Uncovered Parking: 2",
          "Additional Rooms: Pooja Room"
        ],
        "imageUrl": "https://img.squareyards.com/secondaryPortal/638600223991425068-230824030639639.jpg",
       "available": true
      }
      
      
    

];

// Connect to MongoDB and insert properties
const insertProperties = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    console.log('Connected to MongoDB database named "test"');

    // Insert property data into 'properties' collection
    await Property.insertMany(properties);
    console.log('Data inserted successfully into "properties" collection');
  } catch (err) {
    console.error("Error inserting data:", err);
  } finally {
    mongoose.connection.close(); // Close the connection after insertion
  }
};

// Run the insertion
insertProperties();
