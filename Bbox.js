
class Bbox {
    /**
     * @constructor
     * @param {number} x - x pos
     * @param {number} y - y pos
     * @param {number} w - width
     * @param {number} h - height
     */
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    /**
     * @desc returns true if another bounding box intersects this one
     * @param {Bbox} otherBox - another bounding box
     * @returns {boolean} 
     */
    intersectsWith(otherBox) {
        if (this.x + this.w < otherBox.x) return false;
        if (this.y + this.h < otherBox.y) return false;
        if (this.x > otherBox.x + otherBox.w) return false;
        if (this.y > otherBox.y + otherBox.h) return false;
        return true;
    }

    /**
     * @desc returns true if this box is within 'otherBox'
     * @param {Bbox} otherBox 
     * @returns {boolean}
     */
    within(otherBox) {
        if (this.x < otherBox.x) return false;
        if (this.y < otherBox.y) return false;
        if (this.x + this.w > otherBox.x + otherBox.w) return false;
        if (this.y + this.h > otherBox.y + otherBox.h) return false;
        return true;
    }

    /**
     * @desc returns true if this box intersects with any box in the array
     * @param {Array<Bbox>} arr
     * @returns {boolean}
     */
    intersectsWithAny(arr) {
        return arr.some(b => this.intersectsWith(b));
    }

    // arr: Arr<{ getBoundingBox(): Bbox; }>
    // return: boolean
    /**
     * @desc returns true if this box intersects with any object
     * which has a boundingBox
     * @param {Array<{ getBoudningBox(): Bbox }>} arr
     * @returns {boolean}
     */
    intersectsWithAnyObject(arr) {
        return arr.some(b => this.intersectsWith(b.getBoundingBox()));
    }

    /**
     * @desc combines two bounding boxes
     * @param {Bbox} b1 
     * @param {Bbox} b2 
     * @returns {Bbox}
     */
    static add(b1, b2) {
        const minx = Math.min(b1.x, b2.x);
        const miny = Math.min(b1.y, b2.y);
        const maxx = Math.max(b1.x + b1.w, b2.x + b2.w);
        const maxy = Math.max(b1.y + b1.h, b2.y + b2.h);
        return new Bbox(minx, miny, maxx - minx, maxy - miny);
    }
}