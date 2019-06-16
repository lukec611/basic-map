class Cube {
    constructor({
        x = 0,
        y = 9 * 42,
        z = 0,
        tileSize = 1,
        width = 100,
        height = 40,
        depth = 150,
        colors = ['red', 'green', 'blue'],
        text = ['', '', ''],
        backside = false,
    }) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.tileSize = tileSize;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.colors = colors;
        this.text = text;
        this.backside = backside;
    }

    // index: number 0 - 6
    getColor(index) {
        return this.colors[index] || 'black';
    }

    getText(index) {
        return this.text[index] || '';
    }

    getBoundingBox() {
        if (!this._bbox) this._bbox = new Bbox(this.x, this.y, this.width, this.depth);
        return this._bbox;
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
        top.style.backgroundColor = this.getColor(0);
        top.innerHTML = this.getText(0);
        top.style.position = 'absolute';
        top.style.top = `${this.y}px`;
        top.style.left = `${this.x}px`;
        top.className = 'desk';
        top.style.transform = `translate3d(0, 0, ${this.height + this.z}px)`;

        const side = document.createElement('div');
        side.style.width = `${this.depth}px`;
        side.style.height = `${this.height}px`;
        side.style.backgroundColor = this.getColor(1);
        side.style.position = 'absolute';
        side.style.top = `${this.y}px`;
        side.style.left = `${this.x}px`;
        side.style.zIndex = '2000';
        side.className = 'desk';
        side.style.transform = `translate3d(${this.width}px, ${this.depth}px, ${this.height + this.z}px) rotateZ(-90deg) rotateX(-90deg)`;
        side.style.transformOrigin = '0% 0%';
        side.innerHTML = this.getText(1);
        
        
        const front = document.createElement('div');
        front.style.width = `${this.width}px`;
        front.style.height = `${this.height}px`;
        front.style.backgroundColor = this.getColor(2);
        front.style.position = 'absolute';
        front.style.top = `${this.y}px`;
        front.style.left = `${this.x}px`;
        front.style.zIndex = '2000';
        front.className = 'desk';
        front.style.transform = `translate3d(${0}px, ${this.depth}px, ${this.height + this.z}px) rotateX(-90deg)`;
        front.style.transformOrigin = '0% 0%';
        front.innerHTML = this.getText(2);
        front.style.color = 'white';
        
        let backside, back;
        if (this.backside) {
            backside = document.createElement('div');
            backside.style.width = `${this.depth}px`;
            backside.style.height = `${this.height}px`;
            backside.style.backgroundColor = this.getColor(3);
            backside.innerHTML = this.getText(3);
            backside.style.position = 'absolute';
            backside.style.top = `${this.y}px`;
            backside.style.left = `${this.x}px`;
            backside.style.zIndex = '2000';
            backside.className = 'desk';
            backside.style.transform = `translate3d(${0}px, ${0}px, ${this.z}px) rotateZ(90deg) rotateX(90deg)`;
            backside.style.transformOrigin = '0% 0%';

            back = document.createElement('div');
            back.style.width = `${this.width}px`;
            back.style.height = `${this.height}px`;
            back.style.backgroundColor = this.getColor(4);
            back.innerHTML = this.getText(4);
            back.style.position = 'absolute';
            back.style.top = `${this.y}px`;
            back.style.left = `${this.x}px`;
            back.style.zIndex = '2000';
            back.className = 'desk';
            back.style.transform = `translate3d(${0}px, ${0}px, ${this.height + this.z}px) rotateX(-90deg)`;
            back.style.transformOrigin = '0% 0%';
            container.appendChild(backside);
            container.appendChild(back);
        } 
        
        container.appendChild(top);
        container.appendChild(side);
        container.appendChild(front);
        this.element = container;
        return container;
    }
}