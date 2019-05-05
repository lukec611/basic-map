


class Desk {
    // x: number - x pos of desk
    // y: number - y pos of desk
    // owner: string - the owner of the desk
    // horizontal: boolean - true if the desk is horizontal
    constructor(x, y, owner, horizontal = false) {
        this.x = x;
        this.y = y;
        this.owner = owner;
        this.cubes = [];
        this.horizontal = horizontal;
        this.construct();
    }

    construct() {
        const height = 37;
        let width = 50;
        let length = 95;
        if (this.horizontal) {
            width = 95;
            length = 50;
        }
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
                text: [`<div style="border:1px solid black;width:100%;height:100%">${this.owner}</div>`, '', ''],
                width,
                height: woodDepth,
                depth: length,
                z: height+1,
            }),
        );
    }

    getBoundingBox() {
        if (!this._bbox) {
            const bbox = this.cubes[0].getBoundingBox();
            this._bbox = this.cubes.reduce((p, c) => Bbox.add(p, c.getBoundingBox()), bbox);
        }
        return this._bbox;
    }

    get elements() {
        return this.cubes.map(cube => cube.createElement());
    }

    addToMap(map) {
        this.elements.forEach(el => map.addItem(el));
    }
}