////////////////////////
// class Rectangle() {
//     constructor() {
//         this.width = 15
//     }
//     getArea() {
//         //some code runs
//     }
// }

// DEMO TIME!

// class BaseCharacter {
//     constructor() {
//         this.name = "Pete";
//         this.health = 15;
//     }
// }
//
// let pete = new BaseCharacter;
// console.log(pete);

// lets make this dynamic

// class BaseCharacter {
//     constructor(name, health) {
//         this.name = name;
//         this.health = health;
//     }
// }
//
// let pete = new BaseCharacter("Pete", 15);
// let sassafras = new BaseCharacter("sassafras", 15000)
// console.log(pete);
// console.log(sassafras);

// lets add functions

class BaseCharacter {
    constructor(name, health, battleCryText) {
        this.name = name;
        this.health = health;
        this.battleCryText = battleCryText;
    }
    battleCry() {
        return `${this.name} shouts ${this.battleCryText}`;
    }
}

// let markus = new BaseCharacter("Vampire Slayer", 20, "WOARG");
// console.log(markus.battleCry());
//
// let david = new BaseCharacter("Disco Duck", 20, "Hello Kitty");
// console.log(david.battleCry());

class Hero extends BaseCharacter {
    constructor(name, health, battleCryText, role) {
        super(name, health, battleCryText);
        this.alignment = "Good";
        this.role = role;
    }
}

let char = new Hero("Caspar", 22, "ROAR", "Wizard");
// console.log("char: ", char);
console.log("char: ", char.battleCry());

class Monster extends BaseCharacter {
    constructor(name, health, battleCryText) {
        super(name, health, battleCryText);
        this.alignment = "Evil";
    }
}
let goblin = new Monster("Gobby", 5, "Gobby msgobgob");
// console.log("goblin", goblin);
console.log(goblin.battleCry());
