


class Desk {
    // x: number - x pos of desk
    // y: number - y pos of desk
    // owner: string - the owner of the desk
    constructor(x, y, owner) {
        this.x = x;
        this.y = y;
        this.owner = owner;
        this.cubes = [];
        this.construct();
    }

    construct() {
        const height = 40;
        const width = 60;
        const length = 120;
        const woodDepth = 4;
        const colors = [
            '#703804',
            '#562b03',
            '#753d09',
        ];
        this.cubes.push(
            // leg btm rht
            new Cube({
                x: this.x + width - woodDepth,
                y: this.y + length - woodDepth,
                colors,
                text: ['', '', ''],
                width: woodDepth,
                height: height + woodDepth,
                depth: woodDepth,
            }),
            // leg btm lft
            new Cube({
                x: this.x,
                y: this.y + length - woodDepth,
                colors,
                text: ['', '', ''],
                width: woodDepth,
                height: height + woodDepth,
                depth: woodDepth,
            }),
            // leg top rht
            new Cube({
                x: this.x + width - woodDepth,
                y: this.y,
                colors,
                text: ['', '', ''],
                width: woodDepth,
                height: height + woodDepth,
                depth: woodDepth,
            }),
            // leg top lft
            new Cube({
                x: this.x,
                y: this.y,
                colors,
                text: ['', '', ''],
                width: woodDepth,
                height: height + woodDepth,
                depth: woodDepth,
            }),
            // top
            new Cube({
                x: this.x,
                y: this.y,
                colors,
                text: [this.owner, '', ''],
                width,
                height: woodDepth,
                depth: length,
                z: height,
            }),
        );
    }

    get elements() {
        return this.cubes.map(cube => cube.createElement());
    }

    addToMap(map) {
        this.elements.forEach(el => map.addItem(el));
    }
}