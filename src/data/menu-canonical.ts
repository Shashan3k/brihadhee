/**
 * Canonical menu: the single source for every dish name, description and price
 * shown on the site, in JSON-LD, in llms files, menu.json and the verify scripts.
 *
 * Source: "new menu.pdf" (client, received 2026-11-11; image-only, transcribed by
 * hand from both pages and checked column by column). It replaces "final menu
 * 13-07-2026.pdf" and the brief prices. Notes printed on the menu:
 *   - prices exclude 5% GST; parcel charges are extra
 *   - preparation can take up to 10 minutes
 *   - Dine-in Combos are available only for lunch
 *   - the chef's-hat icon marks a chef's special (tag "Chef's special")
 *   - the menu spells "Pannai Parotta" and "Phulkha"; the site uses "Paanai" and
 *     "Phulka", and expands "Spl" to "Special"
 * Descriptions: kept from the previous menu where the dish is unchanged; new dishes
 * have an empty description until the owner supplies one (none are invented).
 */

export type Diet = "veg";
export interface MenuItem {
  name: string;
  description: string;
  price: number; // INR, before 5% GST
  diet: Diet;
  tags: string[];
}
export interface MenuCategory {
  id: string;
  name: string;
  blurb: string;
  items: MenuItem[];
}
export interface UnpricedSignature {
  name: string;
  note: string;
  source: string;
}
export interface ByoOption {
  name: string;
  note?: string;
  price: number;
}
export interface ByoStep {
  step: number;
  name: string;
  options: ByoOption[];
}
export interface ByoSuggestion {
  name: string;
  price: number; // printed price (not always the sum of the parts)
  build: string[];
}

export const MENU_SOURCE = "new menu.pdf (client, 2026-11-11)";
export const CURRENCY = "₹";
export const MENU_NOTES = {
  gst: "Prices exclude 5% GST.",
  parcel: "Parcel charges are extra.",
  prep: "Preparation can take up to 10 minutes.",
};

export const MENU: MenuCategory[] = [
  {
    "id": "starters",
    "name": "Starters",
    "blurb": "",
    "items": [
      {
        "name": "Madras Style Veg 65 (Gobi)",
        "description": "Golden-fried cauliflower coated in signature 65 spices.",
        "price": 230,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Madras Style Veg 65 (Paneer)",
        "description": "Golden-fried paneer coated in signature 65 spices.",
        "price": 260,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Indo Chinese Dry Manchurian (Gobi)",
        "description": "",
        "price": 270,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Indo Chinese Dry Manchurian (Paneer)",
        "description": "",
        "price": 290,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Karaikudi Paneer Poppers",
        "description": "Fresh paneer seasoned with heritage gunpowder and house-made 65 spices, fried crisp.",
        "price": 280,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Madras Bhel Parotta",
        "description": "Parotta pieces with Madras-style mixture and salna.",
        "price": 245,
        "diet": "veg",
        "tags": [
          "Chef's special"
        ]
      },
      {
        "name": "Poricha Salna Idly",
        "description": "Idly fried with 65 mix and tossed in salna.",
        "price": 255,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Gun Powder Idly",
        "description": "Crispy mini idlis coated in milagai podi.",
        "price": 245,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Kanthari Nei Varuval (Paneer)",
        "description": "",
        "price": 290,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Kanthari Nei Varuval (Kalaan)",
        "description": "",
        "price": 280,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Kongu Nei Varuval (Paneer)",
        "description": "",
        "price": 290,
        "diet": "veg",
        "tags": [
          "Chef's special"
        ]
      },
      {
        "name": "Kongu Nei Varuval (Kalaan)",
        "description": "",
        "price": 280,
        "diet": "veg",
        "tags": [
          "Chef's special"
        ]
      }
    ]
  },
  {
    "id": "lunch",
    "name": "Lunch",
    "blurb": "Tamil Nadu meals, served at lunch.",
    "items": [
      {
        "name": "Limited TN Meals",
        "description": "Rice with sambar, rasam, kuzhambu, kootu, poriyal and accompaniments.",
        "price": 150,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Executive TN Meals (Unlimited)",
        "description": "Unlimited Tamil Nadu-style meals with rice and traditional accompaniments.",
        "price": 205,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Nellai Special Sodhi Meals",
        "description": "Rice, sodhi, sambar, rasam, kuzhambu of the day, mini chapathi, salna, kootu, poriyal, thogayal, buttermilk, pickle, appalam, karuppati ulundhu kali and banana.",
        "price": 240,
        "diet": "veg",
        "tags": [
          "Chef's special"
        ]
      },
      {
        "name": "Karuppatti Ulundhu Kali",
        "description": "Black urad dal cooked with palm jaggery (karuppatti), a Tirunelveli-style sweet.",
        "price": 100,
        "diet": "veg",
        "tags": []
      }
    ]
  },
  {
    "id": "combos",
    "name": "Dine-in Combos",
    "blurb": "Available only for lunch.",
    "items": [
      {
        "name": "Veg Fried Rice & Gobi Manchurian Combo",
        "description": "",
        "price": 199,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Naan (1 pc) & Paneer Butter Masala Combo",
        "description": "",
        "price": 199,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Phulka (3 pcs) & Dal Tadka Combo",
        "description": "",
        "price": 129,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Phulka (3 pcs) & Paneer Butter Masala Combo",
        "description": "",
        "price": 179,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Kothu Parotta & Lemon Kothu Idiyappam Combo",
        "description": "Kothu parotta with lemon kothu idiyappam.",
        "price": 179,
        "diet": "veg",
        "tags": []
      }
    ]
  },
  {
    "id": "dosa",
    "name": "Dosa Variety",
    "blurb": "",
    "items": [
      {
        "name": "Kal Dosa (2 pcs)",
        "description": "Thick, soft dosas served with chutney and sambar.",
        "price": 100,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Plain Dosa",
        "description": "Classic South Indian dosa, crisp and golden.",
        "price": 105,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Ghee Roast",
        "description": "Thin, crispy dosa roasted with ghee.",
        "price": 155,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Ghee Podi Dosa",
        "description": "Crispy dosa coated with spicy podi and ghee.",
        "price": 165,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Rava Dosa",
        "description": "Crisp semolina dosa with spices.",
        "price": 130,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Ghee Masala Dosa",
        "description": "Dosa filled with potato masala and finished with ghee.",
        "price": 175,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Madurai Malli Dosa",
        "description": "Dosa topped with fresh coriander paste.",
        "price": 165,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Onion Podi Uthappam",
        "description": "Uthappam layered with onions and podi masala.",
        "price": 175,
        "diet": "veg",
        "tags": []
      }
    ]
  },
  {
    "id": "idly",
    "name": "Idly & Mini Idly",
    "blurb": "",
    "items": [
      {
        "name": "Idly (2 pcs)",
        "description": "Soft steamed rice cakes served with chutney and sambar.",
        "price": 50,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Tossed Podi Idli (Garlic, Curry Leaves or Peanut)",
        "description": "Idlis tossed in your choice of garlic, curry leaves or peanut podi.",
        "price": 175,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Idly Upma",
        "description": "Upma made from soft, crumbled idlis.",
        "price": 135,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Ghee Sambar Idly (2 pcs)",
        "description": "Idlis soaked in hot sambar and drizzled with ghee.",
        "price": 105,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Ghee Mini Sambar Idly (14 pcs)",
        "description": "Bite-sized idlis dipped in sambar and ghee.",
        "price": 115,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Tomato Kothu Idly",
        "description": "Idly scrambled with tangy tomato thokku.",
        "price": 170,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Tawa Thokku Podi Idly",
        "description": "Pan-fried idlis with onion-tomato thokku, podi and ghee.",
        "price": 155,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Sodhi Idly",
        "description": "Hot idly dipped in a traditional coconut milk stew.",
        "price": 180,
        "diet": "veg",
        "tags": [
          "Chef's special"
        ]
      }
    ]
  },
  {
    "id": "idiyappam",
    "name": "Idiyappam",
    "blurb": "",
    "items": [
      {
        "name": "Idiyappam Coconut Milk",
        "description": "Soft string hoppers served with sweet coconut milk.",
        "price": 90,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Lemon Kothu Idiyappam",
        "description": "Idiyappam tossed with lemon and curry leaves.",
        "price": 160,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Kothu Idiyappam (Paneer or Mushroom)",
        "description": "",
        "price": 220,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Tomato Kothu Idiyappam",
        "description": "Idiyappam scrambled with tangy tomato masala.",
        "price": 170,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Idiyappam Sodhi",
        "description": "Soft string hoppers dipped in traditional coconut milk stew.",
        "price": 180,
        "diet": "veg",
        "tags": [
          "Chef's special"
        ]
      }
    ]
  },
  {
    "id": "parotta",
    "name": "Parotta & Chapathi",
    "blurb": "",
    "items": [
      {
        "name": "Chapathi Salna (2 pcs)",
        "description": "Soft chapathis served with vegetable salna.",
        "price": 105,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Parotta Salna (2 pcs)",
        "description": "Flaky parottas served with salna and thokku.",
        "price": 120,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Special Kothu Parotta",
        "description": "Shredded parotta tossed with paneer, mushroom and special masala.",
        "price": 195,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Paanai Parotta",
        "description": "Parotta layered with rich salna, paneer and mushroom, slow-cooked in a sealed pot (dum style).",
        "price": 270,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Madurai Salna Parotta",
        "description": "Parottas served with spicy Madurai-style salna.",
        "price": 210,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Chilli Parotta",
        "description": "Shredded parotta tossed with onions, capsicum and sauces.",
        "price": 230,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Special Kothu Chapathi",
        "description": "Shredded chapathi tossed with paneer, mushroom and special masala.",
        "price": 195,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Special Pottalam Parotta",
        "description": "",
        "price": 230,
        "diet": "veg",
        "tags": [
          "Chef's special"
        ]
      }
    ]
  },
  {
    "id": "rice",
    "name": "Rice",
    "blurb": "",
    "items": [
      {
        "name": "Paneer Fried Rice",
        "description": "",
        "price": 245,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Mushroom Fried Rice",
        "description": "",
        "price": 245,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Paneer Schezwan Fried Rice",
        "description": "",
        "price": 275,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Mushroom Schezwan Fried Rice",
        "description": "",
        "price": 275,
        "diet": "veg",
        "tags": []
      }
    ]
  },
  {
    "id": "breads",
    "name": "Indian Breads",
    "blurb": "",
    "items": [
      {
        "name": "Naan (Plain)",
        "description": "",
        "price": 70,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Naan (Butter)",
        "description": "",
        "price": 90,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Naan (Garlic)",
        "description": "",
        "price": 100,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Roti (Plain)",
        "description": "",
        "price": 60,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Roti (Butter)",
        "description": "",
        "price": 80,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Roti (Garlic)",
        "description": "",
        "price": 90,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Phulka (Plain)",
        "description": "",
        "price": 45,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Phulka (Ghee)",
        "description": "",
        "price": 55,
        "diet": "veg",
        "tags": []
      }
    ]
  },
  {
    "id": "gravies",
    "name": "Indian Gravies",
    "blurb": "",
    "items": [
      {
        "name": "Aloo Gobi Masala",
        "description": "Potato and cauliflower in spiced onion-tomato masala.",
        "price": 295,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Nilgiris Dum Aloo",
        "description": "Potatoes cooked in Nilgiris-style green masala.",
        "price": 295,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Paneer Butter Masala",
        "description": "Paneer simmered in rich tomato gravy.",
        "price": 315,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Kaalan Chukka Gravy",
        "description": "Mushroom cooked in Chettinad chukka masala.",
        "price": 315,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Chettinadu Paneer Gravy",
        "description": "Paneer in spicy Chettinad-style gravy.",
        "price": 315,
        "diet": "veg",
        "tags": [
          "Chef's special"
        ]
      }
    ]
  },
  {
    "id": "beverages",
    "name": "Beverages",
    "blurb": "",
    "items": [
      {
        "name": "Filter Coffee",
        "description": "South Indian coffee brewed with a traditional filter.",
        "price": 45,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Tea",
        "description": "Tea brewed with milk.",
        "price": 45,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Lemon Tea",
        "description": "Black tea with lemon, served hot.",
        "price": 35,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Plain Milk",
        "description": "Milk served hot or cold.",
        "price": 40,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Black Coffee",
        "description": "Strong coffee brewed without milk.",
        "price": 35,
        "diet": "veg",
        "tags": []
      }
    ]
  },
  {
    "id": "signatures",
    "name": "Brihadhee Signatures",
    "blurb": "Signature drinks.",
    "items": [
      {
        "name": "Butter Biscuit Smoothie",
        "description": "",
        "price": 215,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Summer in Tenkasi",
        "description": "",
        "price": 195,
        "diet": "veg",
        "tags": [
          "Chef's special"
        ]
      },
      {
        "name": "Salem Mango Milkshake",
        "description": "",
        "price": 195,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Meltdown in Madras",
        "description": "",
        "price": 135,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "The Filter Kaapi Shake",
        "description": "",
        "price": 165,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Kaapi Affogato",
        "description": "",
        "price": 105,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Salted Caramel Iced Latte",
        "description": "",
        "price": 145,
        "diet": "veg",
        "tags": []
      },
      {
        "name": "Salted Caramel Filter Macchiato",
        "description": "",
        "price": 95,
        "diet": "veg",
        "tags": []
      }
    ]
  }
];

/** Build Your Own Dosa: pick a batter, then toppings, a stuffing and a garnish (page 1 of the menu). */
export const BUILD_YOUR_OWN_DOSA: { steps: ByoStep[]; suggestions: ByoSuggestion[] } = {
  "steps": [
    {
      "step": 1,
      "name": "Batter",
      "options": [
        {
          "name": "Golden Hour",
          "note": "Classic rice batter",
          "price": 120
        },
        {
          "name": "Midnight Sky",
          "note": "Activated charcoal",
          "price": 140
        },
        {
          "name": "Pink Sea",
          "note": "Beetroot & Navadhaniyam",
          "price": 145
        },
        {
          "name": "Monsoon Forest",
          "note": "Spinach & Pesarattu",
          "price": 140
        },
        {
          "name": "Terracotta Canyon",
          "note": "Ragi",
          "price": 135
        }
      ]
    },
    {
      "step": 2,
      "name": "Topping",
      "options": [
        {
          "name": "Garlic Podi",
          "price": 25
        },
        {
          "name": "Curry Leaves Podi",
          "price": 25
        },
        {
          "name": "Peanut Podi",
          "price": 25
        },
        {
          "name": "Thenga Poondu Podi",
          "price": 40
        },
        {
          "name": "Small Onion",
          "price": 15
        },
        {
          "name": "Cheese",
          "price": 30
        }
      ]
    },
    {
      "step": 3,
      "name": "Stuffing",
      "options": [
        {
          "name": "Potato Masala",
          "price": 30
        },
        {
          "name": "Paneer Chettinadu",
          "price": 60
        },
        {
          "name": "Mushroom Truffle",
          "price": 65
        },
        {
          "name": "Tomato Thokku",
          "price": 35
        }
      ]
    },
    {
      "step": 4,
      "name": "Garnish",
      "options": [
        {
          "name": "Gingelly Oil",
          "price": 15
        },
        {
          "name": "Butter",
          "price": 25
        },
        {
          "name": "Ghee",
          "price": 30
        },
        {
          "name": "Refined Oil",
          "price": 5
        },
        {
          "name": "Chilli Oil",
          "price": 20
        }
      ]
    }
  ],
  "suggestions": [
    {
      "name": "The Godfather",
      "price": 255,
      "build": [
        "Monsoon Forest",
        "Cheese",
        "Mushroom Truffle",
        "Chilli Oil"
      ]
    },
    {
      "name": "Coimbatore Mappillai",
      "price": 215,
      "build": [
        "Golden Hour",
        "Thenga Poondu Podi",
        "Tomato Thokku",
        "Ghee"
      ]
    },
    {
      "name": "Mylapore Maama",
      "price": 180,
      "build": [
        "Golden Hour",
        "Potato Masala",
        "Ghee"
      ]
    },
    {
      "name": "Gym Bro",
      "price": 230,
      "build": [
        "Monsoon Forest",
        "Peanut Podi",
        "Paneer Chettinadu",
        "Refined Oil"
      ]
    },
    {
      "name": "Poison Ivy",
      "price": 250,
      "build": [
        "Monsoon Forest",
        "Curry Leaves Podi",
        "Mushroom Truffle",
        "Chilli Oil"
      ]
    },
    {
      "name": "Burma Vyapari",
      "price": 240,
      "build": [
        "Terracotta Canyon",
        "Small Onion",
        "Paneer Chettinadu",
        "Ghee"
      ]
    },
    {
      "name": "The Dark Knight",
      "price": 230,
      "build": [
        "Midnight Sky",
        "Mushroom Truffle",
        "Butter"
      ]
    },
    {
      "name": "Zamindar",
      "price": 260,
      "build": [
        "Pink Sea",
        "Garlic Podi",
        "Paneer Chettinadu",
        "Ghee"
      ]
    },
    {
      "name": "Sleeper Cell",
      "price": 200,
      "build": [
        "Golden Hour",
        "Garlic Podi",
        "Tomato Thokku",
        "Chilli Oil"
      ]
    },
    {
      "name": "Shaolin Monk",
      "price": 215,
      "build": [
        "Terracotta Canyon",
        "Peanut Podi",
        "Tomato Thokku",
        "Chilli Oil"
      ]
    }
  ]
};

/** Signature items whose price is not verified: shown by name only, never with a price. */
export const UNPRICED_SIGNATURES: UnpricedSignature[] = [];
