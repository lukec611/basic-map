

class Person {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.cubes = {};
        this.construct();
    }

    construct() {
        const x = 1;
        const y = 1;
        this.cubes.head = new Cube({
            x: x,
            y: y + 13 - 10,
            z: 65,
            width: 10,
            height: 10,
            depth: 10,
            colors: ['red', 'blue', 'green'],
            text: ['', '', ''],
            backside: true,
        });
        this.cubes['body'] = new Cube({
            x,
            y,
            z: 35,
            width: 10,
            height: 30,
            depth: 16,
            colors: ['red', 'blue', 'green'],
            text: ['', '', ''],
            backside: true,
        });
        this.cubes['left arm'] = new Cube({
            x: x + 2.5,
            y: y - 7.5,
            z: 65 - 30,
            width: 5,
            height: 30,
            depth: 5,
            colors: ['black', 'brown', 'orange'],
            text: ['', '', ''],
            backside: true,
        });
        this.cubes['right arm'] = new Cube({
            x: x + 2.5,
            y: y + 16 + 2.5,
            z: 65 - 30,
            width: 5,
            height: 30,
            depth: 5,
            colors: ['black', 'brown', 'orange'],
            text: ['', '', ''],
            backside: true,
        });
        this.cubes['left leg'] = new Cube({
            x: x,
            y: y - 2,
            z: 0,
            width: 5,
            height: 35,
            depth: 5,
            colors: ['purple', 'yellow', 'turquoise'],
            text: ['', '', ''],
            backside: true,
        });
        this.cubes['right leg'] = new Cube({
            x: x,
            y: y + 8,
            z: 0,
            width: 5,
            height: 35,
            depth: 5,
            colors: ['purple', 'yellow', 'turquoise'],
            text: ['', '', ''],
            backside: true,
        });
        const container = document.createElement('div');
        container.style.transformStyle = 'preserve-3d';
        container.style.transform = 'translate3d(0, 0, 0)';
        container.style.position = 'absolute';
        container.style.left = '0px';
        container.style.top = '0px';
        Object.keys(this.cubes).forEach((key) => {
            this.cubes[key].element = this.cubes[key].createElement();
            container.appendChild(this.cubes[key].element);
        });
        this.container = container;
    }

    // i ranges 0-1
    setWalkAnimationLevel(i = 0, x = 0, y = 0, z = 0, r = 0) {
        this.x = x;
        this.y = y;
        this.container.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${r}deg) `;
        const la = this.cubes['left arm'].element;
        const ra = this.cubes['right arm'].element;
        const ll = this.cubes['left leg'].element;
        const rl = this.cubes['right leg'].element;
        var deg = Math.sin(i * 2 * Math.PI) * 8;
        var degL = Math.sin(i * 2 * Math.PI) * 10;
        la.style.transform = `rotateY(${deg}deg)`;
        la.style.transformOrigin = '10px 0px 55px';
        ra.style.transform = `rotateY(${-deg}deg)`;
        ra.style.transformOrigin = '10px 0px 55px';
        ll.style.transform = `rotateY(${-degL}deg)`;
        ll.style.transformOrigin = '10px 0px 55px';
        rl.style.transform = `rotateY(${degL}deg)`;
        rl.style.transformOrigin = '10px 0px 55px';
    }

    
    async addToMap(map) {
        map.addItem(this.container);
    }
}