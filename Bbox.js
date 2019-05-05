
class Bbox {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    // o: Bbox
    // return: boolean
    intersectsWith(o) {
        if (this.x + this.w < o.x) return false;
        if (this.y + this.h < o.y) return false;
        if (this.x > o.x + o.w) return false;
        if (this.y > o.y + o.h) return false;
        return true;
    }

    within(o) {
        if (this.x < o.x) return false;
        if (this.y < o.y) return false;
        if (this.x + this.w > o.x + o.w) return false;
        if (this.y + this.h > o.y + o.h) return false;
        return true;
    }

    // arr: Array<Bbox>
    // return: boolean
    intersectsWithAny(arr) {
        return arr.some(b => this.intersectsWith(b));
    }

    // arr: Arr<{ getBoundingBox(): Bbox; }>
    // return: boolean
    intersectsWithAnyObject(arr) {
        return arr.some(b => this.intersectsWith(b.getBoundingBox()));
    }



    static add(b1, b2) {
        const minx = Math.min(b1.x, b2.x);
        const miny = Math.min(b1.y, b2.y);
        const maxx = Math.max(b1.x + b1.w, b2.x + b2.w);
        const maxy = Math.max(b1.y + b1.h, b2.y + b2.h);
        return new Bbox(minx, miny, maxx - minx, maxy - miny);
    }
}