class LMap {

    constructor({
        width = 25,
        height = 25,
        tileSize = 40,
        rootSelector = 'body',
        view = '2d',
    }) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.rootSelector = rootSelector;
        this.view = view;
        this.zoom = 10;
        this._initialiseMap();
        this.setView(this.view);
    }

    /**
     * @returns {Bbox}
     */
    getBoundingBox() {
        return new Bbox(0, 0, this.width * this.tileSize, this.height * this.tileSize);
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
                tile.onclick = async () => {
                    tile.style.backgroundColor = 'var(--fg)';
                    tile.innerHTML = `(${x}, ${y})`;
                    await new Promise(r => setTimeout(r, 2500));
                    tile.innerHTML = '';
                    tile.style.backgroundColor = 'initial';
                };
            }
        }
    }

    addItem(element) {
        this.mapContainer.appendChild(element);
    }

    /**
     * sets the view style
     * @param {'2d' | '3d' | 'perspective'} newView 
     */
    setView(newView = '3d') {
        this.view = newView;
        this.mapContainer.style.transform = LMap.computeCssMatrix3d(this.view, this.zoom);
    }

    toggleView() {
        const newView = this.view === '2d' ? '3d' : '2d';
        this.setView(newView);
    }

    /**
     * @param {number} zoom
     */
    setZoom(zoom) {
        this.zoom = zoom;
        this.view = this.view === '2d' ? '2d' : '3d';
        this.mapContainer.style.transform = LMap.computeCssMatrix3d(this.view, this.zoom);
    }

    /**
     * @desc computes a css matrix for the map
     * @param {'2d' | '3d' | 'perspective'} type 
     * @param {number} zoom - how "zoomed-in" the map is 
     */
    static computeCssMatrix3d(type = '3d', zoom = 10) {
        if (type === 'perspective') {
            return LMap.computePerspective3dCssMatrix();
        }
        if (type !== '3d') {
            return ` scale(${zoom / 10})`;
        }

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
        const scalingMatrix = LMat4.scale(0.6 * zoom * 0.1);
        const transMatrix = LMat4.trans(450 * zoom * 0.1, 200 * zoom * 0.1, 0);
        
        const matrixString = isometricMatrix
            .mult(scalingMatrix)
            .mult(rotationMatrix)
            .mult(transMatrix)
            .transpose()
            .arr.join(', ');
        return `matrix3d(${matrixString})`;
    }

    /**
     * @desc computes a 3d perspective css matrix
     */
    static computePerspective3dCssMatrix() {
        const amZ = 2000;
        const cameraPos = new LV3(0, 90, amZ);
        const lookAt = new LV3(0, 0, amZ * 1.5);

        const fakeUp = new LV3(0, 1, 0);
        const vec = lookAt.sub(cameraPos).unit();
        const right = fakeUp.cross(vec).unit();
        const up = vec.cross(right).unit();
        const lookAtMat = new LMat4([
            right.x, up.x, vec.x, 0,
            right.y, up.y, vec.y, 0,
            right.z, up.z, vec.z, 0,
            0, 0, 0, 1,
        ]);
        lookAtMat.itranspose();

        const mainRote = LMat4.rotateX(90);
        const mList = [
            LMat4.trans(0, 1000, -70),
            mainRote,
        ];

        const m = mList.reduceRight((p, c) => p.mult(c), LMat4.identity());

        const matStr = m.transpose().arr.join(', ');
        return `perspective(1000px) matrix3d(${matStr})`;
    }
}