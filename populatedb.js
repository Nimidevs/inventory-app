#! /usr/bin/env node
//  This script populates some test categories, items to my database instance

const userArgs = process.argv.slice(2);
const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(
  index,
  name,
  description,
  price,
  no_in_stock,
  category
) {
  const item = new Item({
    name: name,
    description: description,
    price: price,
    no_in_stock: no_in_stock,
    category: category,
  });
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      0,
      "Handguns",
      "Handguns are small, easily concealable firearms designed for quick access and personal defense. They are typically used in close-range situations and can be operated with one hand. Examples include pistols and revolvers"
    ),
    categoryCreate(
      1,
      "Rifles",
      "Rifles are long-barreled firearms designed for precision shooting over long distances. They are typically used in hunting, sport shooting, and military applications. Rifles are known for their accuracy and range, and they come in various calibers and configurations"
    ),
    categoryCreate(
      2,
      "Shotguns",
      "Shotguns are versatile firearms that can be used for hunting, sport shooting, and home defense. They are characterized by their ability to fire a spread of shot or a single slug, making them effective at close to medium ranges. Shotguns come in various types, including pump-action, semi-automatic, and break-action"
    ),
    categoryCreate(
      3,
      "Submachine Guns",
      "Submachine guns are compact, automatic firearms designed for close-quarters combat. They fire pistol-caliber rounds and are known for their high rate of fire and portability, making them ideal for special forces and close-quarters battle scenarios"
    ),
    categoryCreate(
      4,
      "Assault Rifles",
      "Assault rifles are selective-fire rifles that use an intermediate cartridge and a detachable magazine. They are used primarily by military forces and are capable of both semi-automatic and fully automatic fire"
    ),
    categoryCreate(
      5,
      "Revolvers",
      "Revolvers are handguns that feature a revolving cylinder containing multiple chambers for bullets. They are known for their reliability and simplicity of operation. Revolvers are used for self-defense, hunting, and sport shooting"
    ),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(
      0,
      "AK-47",
      "A gas-operated, 7.62x39mm assault rifle known for its durability and reliability",
      54,
      21,
      [categories[4], categories[1]]
    ),
    itemCreate(
      1,
      "M16",
      "A 5.56mm NATO, gas-operated rifle used by the U.S. military, known for its accuracy and modularity",
      60,
      10,
      [categories[4], categories[1]]
    ),
    itemCreate(
      2,
      "Smith & Wesson Model 29",
      "A double-action revolver chambered for .44 Magnum rounds",
      53,
      20,
      [categories[5]]
    ),
    itemCreate(
      3,
      "Colt Python",
      "A .357 Magnum revolver praised for its smooth trigger pull and accuracy",
      93,
      10,
      [categories[5]]
    ),
    itemCreate(
      4,
      "MP5",
      "A 9mm submachine gun developed by Heckler & Koch, known for its accuracy and reliability",
      103,
      10,
      [categories[3]]
    ),
    itemCreate(
      5,
      "Uzi",
      "An Israeli submachine gun known for its compact size and use in special operations",
      100,
      23,
      [categories[3]]
    ),
    itemCreate(
      6,
      "Glock 19",
      "A versatile and reliable 9mm handgun",
      500,
      190,
      [categories[0]]
    ),
    itemCreate(
      7,
      "Smith & Wesson M&P Shield",
      "A compact, concealable handgun for personal defense",
      300,
      50,
      [categories[0]]
    ),
    itemCreate(
      8,
      "AR-15",
      "A lightweight, 5.56mm, magazine-fed, gas-operated rifle.",
      800,
      10,
      [categories[1]]
    ),
    itemCreate(
      9,
      "Remington 700",
      "A bolt-action hunting rifle known for its accuracy",
      900,
      50,
      [categories[1]]
    ),
    itemCreate(
      8,
      "Mossberg 500",
      "A pump-action shotgun known for its versatility and reliability.",
      400,
      30,
      [categories[2]]
    ),
    itemCreate(
      9,
      "Remington 870",
      "A widely used pump-action shotgun ideal for hunting and home defense.",
      900,
      70,
      [categories[2]]
    ),
  ]);
}
