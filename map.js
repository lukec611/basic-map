
const DEFAULT_MAP_OPTIONS = {
    width: 50,
    height: 50,
    tileSize: 40,
    rootSelector: 'body',
};

class Map {
    /*
        options: {
            width?: number;
            height?: number;
            tileSize?: number,
            rootSelector?: string
        }

    */
    constructor(options) {
        this.width = options.width  || DEFAULT_MAP_OPTIONS.width;
        this.height = options.height  || DEFAULT_MAP_OPTIONS.height;
        this.tileSize = options.tileSize  || DEFAULT_MAP_OPTIONS.tileSize;
        this.rootSelector = options.rootSelector  || DEFAULT_MAP_OPTIONS.rootSelector;
        this.view = '2d';
        this._initialiseMap();
        this.toggleView();
    }

    _initialiseMap() {
        const root = document.querySelector(this.rootSelector);
        this.mapContainer = document.createElement('div');
        this.mapContainer.className = 'map-container';
        this.mapContainer.style.gridTemplateColumns = `repeat(${this.width}, ${this.tileSize}px)`;
        root.innerHTML = '';
        root.appendChild(this.mapContainer);
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                const tile = document.createElement('div');
                tile.id = `tile${x}-${y}`;
                tile.className = 'tile';
                this.mapContainer.appendChild(tile);
                tile.onclick = () => {
                    tile.style.backgroundColor = 'lightseagreen';
                    tile.innerHTML = `(${x}, ${y})`;
                };
            }
        }
        this.mapContainer.appendChild(new Cube().createElement());
        this.mapContainer.appendChild(new Cube({
            x: 4 * 42,
            y: 9 * 42,
            colors: 'yellow,turquoise,lightseagreen'.split(','),
            text: 'Lukes Desk,,'.split(','),
            width: 50,
        }).createElement());
    }

    toggleView() {
        this.view = this.view === '2d' ? '3d' : '2d';
        this.mapContainer.style.transform = Map.computeCssMatrix3d(this.view);
    }

    // type: '2d' | '3d'
    static computeCssMatrix3d(type) {
        if (type !== '3d') return '';

        const isometricMatrix = new LMat4([
            Math.sqrt(3), 0, -Math.sqrt(3), 0,
            1, 2, 1, 0,
            Math.sqrt(2), -Math.sqrt(2), Math.sqrt(2), 0,
            0, 0, 0, 1,
        ].map(x => x * (1 / Math.sqrt(6))));
        const rotationMatrix = new LMat4([
            1, 0, 0, 0,
            0, Math.cos(90 / 57.3), -Math.sin(90 / 57.3), 0,
            0, Math.sin(90 / 57.3), Math.cos(90 / 57.3), 0,
            0, 0, 0, 1,
        ]);
        const scalingMatrix = LMat4.scale(0.6);
        
        const matrixString = isometricMatrix
            .mult(scalingMatrix)
            .mult(rotationMatrix)
            .transpose()
            .arr.join(', ');
        return `matrix3d(${matrixString})`;
    }
}