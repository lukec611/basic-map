
const DEFAULT_CUBE_OPTIONS = {
    x: 0,
    y: 9 * 42,
    z: 0,
    tileSize: 1,
    width: 100,
    height: 40,
    depth: 150,
    colors: ['red', 'green', 'blue'],
    text: ['red', 'green', 'blue'],
    backside: false,
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
        'x,y,z'.split(',')
            .forEach(id => this[id] = typeof options[id] === 'number' ? options[id] : DEFAULT_CUBE_OPTIONS[id]);
        'width,height,depth,colors,text'.split(',')
            .forEach(id => this[id] = options[id] || DEFAULT_CUBE_OPTIONS[id]);
        this.backside = !!options.backside;
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
        top.style.transform = `translate3d(0, 0, ${this.height + this.z}px)`;

        const side = document.createElement('div');
        side.style.width = `${this.depth}px`;
        side.style.height = `${this.height}px`;
        side.style.backgroundColor = this.colors[1];
        side.style.position = 'absolute';
        side.style.top = `${this.y}px`;
        side.style.left = `${this.x}px`;
        side.style.zIndex = '2000';
        side.className = 'desk';
        side.style.transform = `translate3d(${this.width}px, ${this.depth}px, ${this.height + this.z}px) rotateZ(-90deg) rotateX(-90deg)`;
        side.style.transformOrigin = '0% 0%';
        side.innerHTML = this.text[1];
        
        
        const front = document.createElement('div');
        front.style.width = `${this.width}px`;
        front.style.height = `${this.height}px`;
        front.style.backgroundColor = this.colors[2];
        front.style.position = 'absolute';
        front.style.top = `${this.y}px`;
        front.style.left = `${this.x}px`;
        front.style.zIndex = '2000';
        front.className = 'desk';
        front.style.transform = `translate3d(${0}px, ${this.depth}px, ${this.height + this.z}px) rotateX(-90deg)`;
        front.style.transformOrigin = '0% 0%';
        front.innerHTML = this.text[2];
        front.style.color = 'white';
        
        if (this.backside) {
            const backside = document.createElement('div');
            backside.style.width = `${this.depth}px`;
            backside.style.height = `${this.height}px`;
            backside.style.backgroundColor = 'black';
            backside.style.position = 'absolute';
            backside.style.top = `${this.y}px`;
            backside.style.left = `${this.x}px`;
            backside.style.zIndex = '2000';
            backside.className = 'desk';
            backside.style.transform = `translate3d(${0}px, ${0}px, ${this.z}px) rotateZ(90deg) rotateX(90deg)`;
            backside.style.transformOrigin = '0% 0%';

            const back = document.createElement('div');
            back.style.width = `${this.width}px`;
            back.style.height = `${this.height}px`;
            back.style.backgroundColor = 'darkblue';
            back.style.position = 'absolute';
            back.style.top = `${this.y}px`;
            back.style.left = `${this.x}px`;
            back.style.zIndex = '2000';
            back.className = 'desk';
            back.style.transform = `translate3d(${0}px, ${0}px, ${this.height + this.z}px) rotateX(-90deg)`;
            back.style.transformOrigin = '0% 0%';
        } 
        
        container.appendChild(top);
        container.appendChild(side);
        if (this.backside) {
            container.appendChild(backside);
            container.appendChild(back);
        }
        container.appendChild(front);
        this.element = container;
        return container;
    }
}