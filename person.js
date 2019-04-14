

class Person {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.cubes = {};
        this.construct();
    }

    construct() {
        const headSize = 10;
        const bodyWidth = 26;
        const bodyThickness = 10;
        const torsoHeight = 30;
        const legHeight = 35;
        const legThickness = 5;
        const chestSize = 16;
        const armHeight = 30;
        const armThickness = 5;
        const armGap = 2.5;
        const legGap = 5;
        
        const halfBodyWidth = bodyWidth * 0.5;

        this.cubes.head = new Cube({
            x: 0,
            y:  halfBodyWidth - headSize,
            z: torsoHeight + legHeight,
            width: headSize,
            height: headSize,
            depth: headSize,
            colors: ['red', 'blue', 'green'],
            text: ['', '', ''],
            backside: true,
        });
        this.cubes['body'] = new Cube({
            x: 0,
            y: 0,
            z: legHeight,
            width: bodyThickness,
            height: torsoHeight,
            depth: chestSize,
            colors: ['red', 'blue', 'green'],
            text: ['', '', ''],
            backside: true,
        });
        this.cubes['left arm'] = new Cube({
            x: bodyThickness * 0.5 - armThickness * 0.5,
            y: -armThickness - armGap,
            z: torsoHeight + legHeight - armHeight,
            width: armThickness,
            height: armHeight,
            depth: armThickness,
            colors: ['black', 'brown', 'orange'],
            text: ['', '', ''],
            backside: true,
        });
        this.cubes['right arm'] = new Cube({
            x: bodyThickness * 0.5 - armThickness * 0.5,
            y: chestSize + armGap,
            z: torsoHeight + legHeight - armHeight,
            width: armThickness,
            height: armHeight,
            depth: armThickness,
            colors: ['black', 'brown', 'orange'],
            text: ['', '', ''],
            backside: true,
        });
        this.cubes['left leg'] = new Cube({
            x: legThickness / 2,
            y: halfBodyWidth - (legThickness + legGap),
            z: 0,
            width: legThickness,
            height: legHeight,
            depth: legThickness,
            colors: ['green', 'green', 'green'],
            text: ['', '', ''],
            backside: true,
        });
        this.cubes['right leg'] = new Cube({
            x: legThickness / 2,
            y: legThickness + legGap,
            z: 0,
            width: legThickness,
            height: legHeight,
            depth: legThickness,
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
        this.container.style.transformOrigin = `2.5px 13px 0px`;
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