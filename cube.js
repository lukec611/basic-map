
const DEFAULT_CUBE_OPTIONS = {
    x: 0,
    y: 9 * 42,
    tileSize: 1,
    width: 100,
    height: 40,
    depth: 150,
    colors: ['red', 'green', 'blue'],
    text: ['red', 'green', 'blue'],
};

class Cube {
    /*
    options: {
        x: number;
        y: number;
        width: number;
        height: number;
        depth: number;
        colors: [string, string, string];
        text: [string, string, string];
    }
    */
    constructor(options = {}) {
        'x,y,width,height,depth,colors,text'.split(',')
            .forEach(id => this[id] = options[id] || DEFAULT_CUBE_OPTIONS[id]);
    }

    createElement() {
        const container = document.createElement('div');
        container.style.transformStyle = 'preserve-3d';
        container.style.transform = 'translate3d(0, 0, 0)';
        container.style.position = 'absolute';
        container.style.left = '0px';
        container.style.top = '0px';
        
        const top = document.createElement('div');
        top.style.width = `${this.width}px`;
        top.style.height = `${this.depth}px`;
        top.style.backgroundColor = this.colors[0];
        top.innerHTML = this.text[0];
        top.style.position = 'absolute';
        top.style.top = `${this.y}px`;
        top.style.left = `${this.x}px`;
        top.className = 'desk';
        top.style.transform = `translate3d(0, 0, ${this.height}px)`;
        const side = document.createElement('div');
        side.style.width = `${this.depth}px`;
        side.style.height = `${this.height}px`;
        side.style.backgroundColor = this.colors[1];
        side.style.position = 'absolute';
        side.style.top = `${this.y}px`;
        side.style.left = `${this.x}px`;
        side.style.zIndex = '2000';
        // side.style.transformStyle = 'preserve-3d';
        side.className = 'desk';
        const r = LMat4.rotateY(5);
        const t = LMat4.trans(0, 0, 0);
        const out = t.mult(r);
        // side.style.transform = `matrix3d(${out.transpose().arr.join(', ')})`;
        side.style.transform = `translate3d(${this.width}px, ${this.depth - 42}px, ${0}px) rotateY(90deg)  rotateZ(-90deg)`;
        side.style.transformOrigin = '0% 100%';
        container.appendChild(top);
        container.appendChild(side);
        side.innerHTML = this.text[1];

        return container;
    }
}