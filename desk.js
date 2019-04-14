


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
        const height = 37;
        const width = 52;
        const length = 90;
        const woodDepth = 4;
        const colors = [
            '#000000',
            '#000000',
            '#000000',
        ];
        const topColors = [
            '#FFFFFF',
            '#CCCCCC',
            '#BBBBBB',
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
                colors: topColors,
                text: [this.owner, '', ''],
                width,
                height: woodDepth,
                depth: length,
                z: height+1,
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