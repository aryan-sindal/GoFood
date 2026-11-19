require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const ImageKit = require("@imagekit/nodejs");

const connectDB = require("../src/db/db");

const Restaurant = require("../src/models/restaurant.model");
const Category = require("../src/models/category.model");
const Food = require("../src/models/items.model");


// =====================================================
// IMAGEKIT
// =====================================================

if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is missing from .env");
}

const imagekit = new ImageKit({
    privateKey: process.env.PRIVATE_KEY
});


// =====================================================
// IMAGE CACHE
// =====================================================

const imageCache = new Map();


// =====================================================
// CREATE SAFE FILE NAME
// =====================================================

function createFileName(restaurantName, foodName) {

    const restaurant = restaurantName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

    const food = foodName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

    return `${restaurant}-${food}-${Date.now()}.svg`;
}


// =====================================================
// GENERATE FALLBACK FOOD SVG
// =====================================================

function generateFoodSvg(foodName, categoryName) {

    const colors = {
        Pizza: "#f59e0b",
        Burger: "#92400e",
        Starter: "#16a34a",
        Drinks: "#2563eb",
        Chicken: "#dc2626",
        Desserts: "#9333ea"
    };

    const color = colors[categoryName] || "#111827";

    const safeFoodName = foodName
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const safeCategoryName = categoryName
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const svg = `
<svg
    xmlns="http://www.w3.org/2000/svg"
    width="800"
    height="600"
    viewBox="0 0 800 600"
>
    <defs>
        <linearGradient
            id="background"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
        >
            <stop
                offset="0%"
                stop-color="${color}"
            />

            <stop
                offset="100%"
                stop-color="#111827"
            />
        </linearGradient>
    </defs>

    <rect
        width="800"
        height="600"
        fill="url(#background)"
    />

    <circle
        cx="400"
        cy="260"
        r="130"
        fill="white"
        opacity="0.95"
    />

    <circle
        cx="350"
        cy="230"
        r="18"
        fill="${color}"
    />

    <circle
        cx="450"
        cy="230"
        r="18"
        fill="${color}"
    />

    <circle
        cx="380"
        cy="310"
        r="18"
        fill="${color}"
    />

    <circle
        cx="470"
        cy="300"
        r="18"
        fill="${color}"
    />

    <text
        x="400"
        y="480"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="38"
        font-weight="bold"
        fill="white"
    >
        ${safeFoodName}
    </text>

    <text
        x="400"
        y="525"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="22"
        fill="white"
        opacity="0.85"
    >
        ${safeCategoryName}
    </text>

</svg>
`;

    return svg;
}


// =====================================================
// UPLOAD SOURCE IMAGE
// =====================================================

async function uploadSourceImage(
    sourceUrl,
    fileName
) {

    if (!sourceUrl) {
        throw new Error(
            "Source image URL is missing"
        );
    }

    if (imageCache.has(sourceUrl)) {

        console.log(
            `Using cached image: ${fileName}`
        );

        return imageCache.get(sourceUrl);
    }


    console.log(
        `Uploading source image: ${fileName}`
    );


    try {

        const result =
            await imagekit.files.upload({

                file: sourceUrl,

                fileName: fileName,

                folder: "gofood/seed",

                tags: [
                    "gofood",
                    "seed"
                ]
            });


        if (!result?.url) {
            throw new Error(
                "ImageKit did not return a URL"
            );
        }


        imageCache.set(
            sourceUrl,
            result.url
        );


        console.log(
            `Uploaded successfully`
        );


        return result.url;

    } catch (error) {

        console.log(
            `Source image failed: ${fileName}`
        );

        console.log(
            "Creating fallback image..."
        );

        throw error;
    }
}


// =====================================================
// UPLOAD FALLBACK SVG
// =====================================================

async function uploadFallbackImage(
    foodName,
    categoryName,
    fileName
) {

    const svg =
        generateFoodSvg(
            foodName,
            categoryName
        );


    const base64Svg =
        Buffer
            .from(svg)
            .toString("base64");


    const fallbackFileName =
        fileName.replace(
            /\.jpg$/,
            ".svg"
        );


    console.log(
        `Uploading fallback image: ${fallbackFileName}`
    );


    const result =
        await imagekit.files.upload({

            file: base64Svg,

            fileName:
                fallbackFileName,

            folder:
                "gofood/seed/fallback",

            tags: [
                "gofood",
                "seed",
                "fallback"
            ]
        });


    if (!result?.url) {

        throw new Error(
            `Fallback upload failed for ${foodName}`
        );
    }


    console.log(
        `Fallback uploaded successfully`
    );


    return result.url;
}


// =====================================================
// GET IMAGE
// =====================================================

async function getImage(
    food,
    restaurantName,
    categoryName
) {

    const fileName =
        createFileName(
            restaurantName,
            food.name
        );


    try {

        return await uploadSourceImage(
            food.sourceImage,
            fileName
        );

    } catch (error) {

        console.log(
            `Using fallback for ${food.name}`
        );


        return await uploadFallbackImage(
            food.name,
            categoryName,
            fileName
        );
    }
}


// =====================================================
// RESTAURANTS
// =====================================================

const restaurantsData = [

    {
        name: "Domino's",
        email: "dominos@gmail.com",
        password: "Domino123",
        location: "Varanasi",
        description:
            "Pizza, sides and refreshing beverages"
    },

    {
        name: "KFC",
        email: "kfc@gmail.com",
        password: "Kfc123456",
        location: "Varanasi",
        description:
            "Crispy chicken, burgers and delicious sides"
    },

    {
        name: "Burger King",
        email: "burgerking@gmail.com",
        password: "Burger123",
        location: "Varanasi",
        description:
            "Burgers, fries, desserts and beverages"
    }
];


// =====================================================
// MENU DATA
// =====================================================

const menuData = {

    // =================================================
    // DOMINO'S
    // =================================================

    "Domino's": {

        Pizza: [

            {
                name: "Margherita Pizza",

                sourceImage:
                    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",

                options: [
                    {
                        type: "Regular",
                        price: "199"
                    },
                    {
                        type: "Medium",
                        price: "299"
                    },
                    {
                        type: "Large",
                        price: "399"
                    }
                ],

                description:
                    "Classic pizza topped with tomato sauce, mozzarella and fresh basil."
            },

            {
                name: "Farmhouse Pizza",

                sourceImage:
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",

                options: [
                    {
                        type: "Regular",
                        price: "249"
                    },
                    {
                        type: "Medium",
                        price: "349"
                    },
                    {
                        type: "Large",
                        price: "449"
                    }
                ],

                description:
                    "Loaded with onion, capsicum, tomato and cheese."
            },

            {
                name: "Veggie Supreme Pizza",

                sourceImage:
                    "https://images.unsplash.com/photo-1593560708920-61dd98c8e2e2",

                options: [
                    {
                        type: "Regular",
                        price: "279"
                    },
                    {
                        type: "Medium",
                        price: "379"
                    },
                    {
                        type: "Large",
                        price: "479"
                    }
                ],

                description:
                    "A delicious combination of fresh vegetables and melted cheese."
            },

            {
                name: "Cheese Burst Pizza",

                sourceImage:
                    "https://images.unsplash.com/photo-1579751626657-72bc17010498",

                options: [
                    {
                        type: "Regular",
                        price: "299"
                    },
                    {
                        type: "Medium",
                        price: "399"
                    },
                    {
                        type: "Large",
                        price: "499"
                    }
                ],

                description:
                    "Cheesy pizza with a rich and creamy cheese-filled crust."
            }
        ],


        Starter: [

            {
                name: "Garlic Bread",

                sourceImage:
                    "https://images.unsplash.com/photo-1573140401552-3fab0b24306f",

                options: [
                    {
                        type: "Regular",
                        price: "129"
                    },
                    {
                        type: "Large",
                        price: "179"
                    }
                ],

                description:
                    "Freshly baked garlic bread with herbs and butter."
            },

            {
                name: "Stuffed Garlic Bread",

                sourceImage:
                    "https://images.unsplash.com/photo-1509440159596-0249088772ff",

                options: [
                    {
                        type: "Regular",
                        price: "179"
                    },
                    {
                        type: "Large",
                        price: "229"
                    }
                ],

                description:
                    "Soft garlic bread stuffed with cheese and vegetables."
            },

            {
                name: "Potato Wedges",

                sourceImage:
                    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",

                options: [
                    {
                        type: "Regular",
                        price: "119"
                    },
                    {
                        type: "Large",
                        price: "169"
                    }
                ],

                description:
                    "Crispy seasoned potato wedges."
            }
        ],


        Burger: [

            {
                name: "Veg Burger",

                sourceImage:
                    "https://images.unsplash.com/photo-1520072959219-c595dc870360",

                options: [
                    {
                        type: "Regular",
                        price: "149"
                    },
                    {
                        type: "Combo",
                        price: "229"
                    }
                ],

                description:
                    "Crispy vegetable patty with fresh lettuce and sauces."
            },

            {
                name: "Cheese Burger",

                sourceImage:
                    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",

                options: [
                    {
                        type: "Regular",
                        price: "179"
                    },
                    {
                        type: "Combo",
                        price: "259"
                    }
                ],

                description:
                    "Classic burger with a crispy patty and melted cheese."
            },

            {
                name: "Double Cheese Burger",

                sourceImage:
                    "https://images.unsplash.com/photo-1553979459-d2229ba7433b",

                options: [
                    {
                        type: "Regular",
                        price: "229"
                    },
                    {
                        type: "Combo",
                        price: "309"
                    }
                ],

                description:
                    "Double patty burger layered with melted cheese."
            }
        ],


        Drinks: [

            {
                name: "Coca Cola",

                sourceImage:
                    "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e",

                options: [
                    {
                        type: "Regular",
                        price: "60"
                    },
                    {
                        type: "Large",
                        price: "90"
                    }
                ],

                description:
                    "Refreshing chilled Coca Cola."
            },

            {
                name: "Pepsi",

                sourceImage:
                    "https://images.unsplash.com/photo-1629203851122-3726ecdf080e",

                options: [
                    {
                        type: "Regular",
                        price: "60"
                    },
                    {
                        type: "Large",
                        price: "90"
                    }
                ],

                description:
                    "Refreshing chilled Pepsi."
            }
        ]
    },


    // =================================================
    // KFC
    // =================================================

    KFC: {

        Burger: [

            {
                name: "Zinger Burger",

                sourceImage:
                    "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9",

                options: [
                    {
                        type: "Regular",
                        price: "199"
                    },
                    {
                        type: "Combo",
                        price: "299"
                    }
                ],

                description:
                    "Crispy chicken burger with lettuce and creamy sauce."
            },

            {
                name: "Chicken Burger",

                sourceImage:
                    "https://images.unsplash.com/photo-1586190848861-99aa4a171e90",

                options: [
                    {
                        type: "Regular",
                        price: "179"
                    },
                    {
                        type: "Combo",
                        price: "279"
                    }
                ],

                description:
                    "Juicy crispy chicken burger served with fresh vegetables."
            }
        ],


        Chicken: [

            {
                name: "Chicken Bucket",

                sourceImage:
                    "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec",

                options: [
                    {
                        type: "Small",
                        price: "299"
                    },
                    {
                        type: "Medium",
                        price: "499"
                    },
                    {
                        type: "Large",
                        price: "699"
                    }
                ],

                description:
                    "Crispy fried chicken bucket perfect for sharing."
            },

            {
                name: "Hot Wings",

                sourceImage:
                    "https://images.unsplash.com/photo-1527477396000-e27163b481c2",

                options: [
                    {
                        type: "6 Pieces",
                        price: "199"
                    },
                    {
                        type: "10 Pieces",
                        price: "299"
                    }
                ],

                description:
                    "Spicy crispy chicken wings."
            },

            {
                name: "Chicken Strips",

                sourceImage:
                    "https://images.unsplash.com/photo-1562967916-eb82221dfb92",

                options: [
                    {
                        type: "3 Pieces",
                        price: "169"
                    },
                    {
                        type: "6 Pieces",
                        price: "299"
                    }
                ],

                description:
                    "Tender crispy chicken strips."
            },

            {
                name: "Chicken Popcorn",

                sourceImage:
                    "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec",

                options: [
                    {
                        type: "Regular",
                        price: "149"
                    },
                    {
                        type: "Large",
                        price: "229"
                    }
                ],

                description:
                    "Bite-sized crispy chicken pieces."
            }
        ],


        Starter: [

            {
                name: "French Fries",

                sourceImage:
                    "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d",

                options: [
                    {
                        type: "Regular",
                        price: "99"
                    },
                    {
                        type: "Large",
                        price: "149"
                    }
                ],

                description:
                    "Golden crispy French fries."
            },

            {
                name: "Chicken Nuggets",

                sourceImage:
                    "https://images.unsplash.com/photo-1619881590738-a111d176d906",

                options: [
                    {
                        type: "6 Pieces",
                        price: "129"
                    },
                    {
                        type: "10 Pieces",
                        price: "199"
                    }
                ],

                description:
                    "Crispy chicken nuggets."
            },

            {
                name: "Coleslaw",

                sourceImage:
                    "https://images.unsplash.com/photo-1625938144755-652e08e359b7",

                options: [
                    {
                        type: "Regular",
                        price: "99"
                    }
                ],

                description:
                    "Fresh creamy vegetable coleslaw."
            }
        ],


        Drinks: [

            {
                name: "Pepsi",

                sourceImage:
                    "https://images.unsplash.com/photo-1629203851122-3726ecdf080e",

                options: [
                    {
                        type: "Regular",
                        price: "60"
                    },
                    {
                        type: "Large",
                        price: "90"
                    }
                ],

                description:
                    "Refreshing chilled Pepsi."
            },

            {
                name: "7UP",

                sourceImage:
                    "https://images.unsplash.com/photo-1581006852262-e4307cf6283a",

                options: [
                    {
                        type: "Regular",
                        price: "60"
                    },
                    {
                        type: "Large",
                        price: "90"
                    }
                ],

                description:
                    "Refreshing lemon-lime drink."
            }
        ]
    },


    // =================================================
    // BURGER KING
    // =================================================

    "Burger King": {

        Burger: [

            {
                name: "Whopper",

                sourceImage:
                    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",

                options: [
                    {
                        type: "Regular",
                        price: "249"
                    },
                    {
                        type: "Combo",
                        price: "349"
                    }
                ],

                description:
                    "Signature burger with fresh vegetables, cheese and classic sauce."
            },

            {
                name: "Cheese Burger",

                sourceImage:
                    "https://images.unsplash.com/photo-1553979459-d2229ba7433b",

                options: [
                    {
                        type: "Regular",
                        price: "199"
                    },
                    {
                        type: "Combo",
                        price: "299"
                    }
                ],

                description:
                    "Classic burger topped with melted cheese."
            },

            {
                name: "Crispy Veg Burger",

                sourceImage:
                    "https://images.unsplash.com/photo-1520072959219-c595dc870360",

                options: [
                    {
                        type: "Regular",
                        price: "149"
                    },
                    {
                        type: "Combo",
                        price: "249"
                    }
                ],

                description:
                    "Crispy vegetable patty with fresh lettuce and sauce."
            }
        ],


        Starter: [

            {
                name: "French Fries",

                sourceImage:
                    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877",

                options: [
                    {
                        type: "Regular",
                        price: "99"
                    },
                    {
                        type: "Large",
                        price: "149"
                    }
                ],

                description:
                    "Golden crispy French fries."
            },

            {
                name: "Onion Rings",

                sourceImage:
                    "https://images.unsplash.com/photo-1639024471283-03518883512d",

                options: [
                    {
                        type: "Regular",
                        price: "119"
                    },
                    {
                        type: "Large",
                        price: "169"
                    }
                ],

                description:
                    "Crispy golden onion rings."
            },

            {
                name: "Chicken Nuggets",

                sourceImage:
                    "https://images.unsplash.com/photo-1619881590738-a111d176d906",

                options: [
                    {
                        type: "6 Pieces",
                        price: "129"
                    },
                    {
                        type: "10 Pieces",
                        price: "199"
                    }
                ],

                description:
                    "Tender crispy chicken nuggets."
            }
        ],


        Drinks: [

            {
                name: "Coca Cola",

                sourceImage:
                    "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e",

                options: [
                    {
                        type: "Regular",
                        price: "60"
                    },
                    {
                        type: "Large",
                        price: "90"
                    }
                ],

                description:
                    "Refreshing chilled Coca Cola."
            },

            {
                name: "Sprite",

                sourceImage:
                    "https://images.unsplash.com/photo-1581006852262-e4307cf6283a",

                options: [
                    {
                        type: "Regular",
                        price: "60"
                    },
                    {
                        type: "Large",
                        price: "90"
                    }
                ],

                description:
                    "Refreshing lemon-lime beverage."
            }
        ],


        Desserts: [

            {
                name: "Chocolate Sundae",

                sourceImage:
                    "https://images.unsplash.com/photo-1563805042-7684c019e1cb",

                options: [
                    {
                        type: "Regular",
                        price: "129"
                    }
                ],

                description:
                    "Creamy vanilla dessert topped with rich chocolate sauce."
            },

            {
                name: "Chocolate Brownie",

                sourceImage:
                    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",

                options: [
                    {
                        type: "Regular",
                        price: "149"
                    }
                ],

                description:
                    "Warm chocolate brownie with a rich chocolate flavour."
            }
        ]
    }
};


// =====================================================
// CREATE RESTAURANTS
// =====================================================

async function createRestaurants() {

    const restaurants = [];

    for (const data of restaurantsData) {

        const hashedPassword =
            await bcrypt.hash(
                data.password,
                12
            );


        const restaurant =
            await Restaurant.create({

                name:
                    data.name,

                email:
                    data.email,

                password:
                    hashedPassword,

                location:
                    data.location,

                description:
                    data.description
            });


        restaurants.push(
            restaurant
        );


        console.log(
            `Restaurant created: ${restaurant.name}`
        );
    }


    return restaurants;
}


// =====================================================
// CREATE MENU
// =====================================================

async function createMenu(
    restaurants
) {

    let categoryCount = 0;

    let foodCount = 0;


    for (
        const restaurant
        of restaurants
    ) {

        const restaurantMenu =
            menuData[
                restaurant.name
            ];


        if (!restaurantMenu) {

            console.log(
                `No menu found for ${restaurant.name}`
            );

            continue;
        }


        console.log(
            `\nCreating menu for ${restaurant.name}`
        );


        for (
            const [
                categoryName,
                foods
            ]
            of Object.entries(
                restaurantMenu
            )
        ) {


            // =========================================
            // CREATE CATEGORY
            // =========================================

            const category =
                await Category.create({

                    restaurantId:
                        restaurant._id,

                    name:
                        categoryName
                });


            categoryCount++;


            console.log(
                `  Category: ${categoryName}`
            );


            // =========================================
            // CREATE FOODS
            // =========================================

            for (
                const food
                of foods
            ) {

                console.log(
                    `    Preparing: ${food.name}`
                );


                // -------------------------------------
                // IMAGE
                // -------------------------------------

                const imageUrl =
                    await getImage(
                        food,
                        restaurant.name,
                        categoryName
                    );


                // -------------------------------------
                // FOOD DOCUMENT
                // -------------------------------------

                await Food.create({

                    restaurantId:
                        restaurant._id,

                    categoryId:
                        category._id,

                    categoryName:
                        categoryName,

                    CategoryName:
                        categoryName,

                    name:
                        food.name,

                    img:
                        imageUrl,

                    options:
                        food.options,

                    description:
                        food.description
                });


                foodCount++;


                console.log(
                    `    Food created: ${food.name}`
                );
            }
        }
    }


    return {
        categoryCount,
        foodCount
    };
}


// =====================================================
// MAIN SEED FUNCTION
// =====================================================

async function seedDatabase() {

    try {

        console.log(
            "\n========================================"
        );

        console.log(
            "          GOFOOD DATABASE SEED"
        );

        console.log(
            "========================================\n"
        );


        // =============================================
        // CONNECT
        // =============================================

        console.log(
            "Connecting to MongoDB..."
        );


        await connectDB();


        console.log(
            "MongoDB connected successfully.\n"
        );


        // =============================================
        // DELETE OLD DATA
        // =============================================

        console.log(
            "Deleting existing food..."
        );

        await Food.deleteMany({});


        console.log(
            "Deleting existing categories..."
        );

        await Category.deleteMany({});


        console.log(
            "Deleting existing restaurants..."
        );

        await Restaurant.deleteMany({});


        console.log(
            "Old data deleted successfully.\n"
        );


        // =============================================
        // RESTAURANTS
        // =============================================

        const restaurants =
            await createRestaurants();


        // =============================================
        // MENU
        // =============================================

        const {
            categoryCount,
            foodCount
        } =
            await createMenu(
                restaurants
            );


        // =============================================
        // SUMMARY
        // =============================================

        console.log(
            "\n========================================"
        );

        console.log(
            "       SEED COMPLETED SUCCESSFULLY"
        );

        console.log(
            "========================================"
        );

        console.log(
            `Restaurants : ${restaurants.length}`
        );

        console.log(
            `Categories  : ${categoryCount}`
        );

        console.log(
            `Food Items  : ${foodCount}`
        );

        console.log(
            "========================================\n"
        );


        // =============================================
        // CREDENTIALS
        // =============================================

        console.log(
            "RESTAURANT LOGIN CREDENTIALS"
        );

        console.log(
            "========================================"
        );


        for (
            const restaurant
            of restaurantsData
        ) {

            console.log(
                `Restaurant : ${restaurant.name}`
            );

            console.log(
                `Email      : ${restaurant.email}`
            );

            console.log(
                `Password   : ${restaurant.password}`
            );

            console.log(
                "----------------------------------------"
            );
        }


    } catch (error) {

        console.error(
            "\n========================================"
        );

        console.error(
            "             SEED FAILED"
        );

        console.error(
            "========================================"
        );

        console.error(
            error
        );

        process.exitCode = 1;

    } finally {

        if (
            mongoose.connection.readyState !== 0
        ) {

            await mongoose.connection.close();

            console.log(
                "\nMongoDB connection closed."
            );
        }
    }
}


// =====================================================
// RUN
// =====================================================

seedDatabase();