
function computeTriangleCss(a, b, c) {
    const ob = {
        leftBorderWidth: c.x - a.x,
        bottomBorderWidth: a.y - c.y,
        rightBorderWidth: b.x - c.x,
        height: a.y - c.y,
    };
    return ob;
}

/**
 * takes a triangle as input
 * orders the verts to match spec
 *     c
 *   /   \
 *  /     \
 * a - - - - b
 * where a->b is the longest edge
 */
function orderTri(t) {
    const e1 = t.a.dist(t.b);
    const e2 = t.b.dist(t.c);
    const e3 = t.c.dist(t.a);
    if (e1 > e2 && e1 > e3) {
        return t;
    } else if (e2 > e3) {
        return {
            a: t.b,
            b: t.c,
            c: t.a,
        };
    } else {
        return {
            a: t.c,
            b: t.a,
            c: t.b,
        };
    }
}

function normalizeDouble(x) {
    return Math.floor(x * 100000) / 100000;
}

function normalizeVector(v) {
    return v;
    return new LV3(
        normalizeDouble(v.x),
        normalizeDouble(v.y),
        normalizeDouble(v.z),
    );
}

function lRenderTri(_t) {
    const t = orderTri(_t);
    // console.log(t);
    const pointA = t.a.copy();
    const matToOrigin = LMat4.trans(-pointA.x, -pointA.y, -pointA.z);
    const matFromOrigin = LMat4.trans(pointA.x, pointA.y, pointA.z);


    const tOrigin = {
        a: matToOrigin.multLV3(t.a),
        b: matToOrigin.multLV3(t.b),
        c: matToOrigin.multLV3(t.c),
    };

    const right = tOrigin.b.sub(tOrigin.a).unit();
    const fakeFwd = tOrigin.c.sub(tOrigin.a).unit();
    const up = fakeFwd.cross(right).unit();
    const fwd = right.cross(up).unit();
    const rotateTo3D = new LMat4([
        right.x, -fwd.x, up.x, 0,
        right.y, -fwd.y, up.y, 0,
        right.z, -fwd.z, up.z, 0,
        0, 0, 0, 1,
    ]);
    const unRotateTo3D = rotateTo3D.transpose();

    const tNormaled = {
        a: normalizeVector(unRotateTo3D.multLV3(tOrigin.a)),
        b: normalizeVector(unRotateTo3D.multLV3(tOrigin.b)),
        c: normalizeVector(unRotateTo3D.multLV3(tOrigin.c)),
    };


    const triangleCss = computeTriangleCss(tNormaled.a, tNormaled.b, tNormaled.c);
    // console.log(triangleCss);
    const light = new LV3(100000, 100000, 100000);
    let brightness = 0;
    {
        const toLight = light.sub(pointA).unit();
        const v_Normal = t.b.sub(t.a).unit().cross(t.c.sub(t.a).unit()).unit();
        const vertex_normal = v_Normal.unit();
        let cos_angle = vertex_normal.dot(toLight);
        cos_angle = Math.max(Math.min(cos_angle, 1.0), 0);

        brightness = 255 * cos_angle;
    }
    brightness = t.b.sub(t.a).unit().cross(t.c.sub(t.a).unit()).dot(new LV3(-1, -1, -1).unit());
    brightness = brightness > 0 ? brightness * 255 : 0;

    const ne = document.createElement('div');
    document.body.appendChild(ne);
    ne.style.width = '0px';
    ne.style.height = '0px';
    ne.style.borderLeft = `${triangleCss.leftBorderWidth}px solid rgba(0,0,0,0)`;
    ne.style.borderRight = `${triangleCss.rightBorderWidth}px solid rgba(0,0,0,0)`;
    ne.style.borderBottom = `${triangleCss.bottomBorderWidth}px solid rgba(0,${brightness},${brightness},1)`;
    ne.style.borderTop = `${0}px solid rgba(0,0,0,0)`;
    ne.style.position = 'absolute';
    ne.style.top = `${0}px`;
    ne.style.left = '0px';
    ne.style.backfaceVisibility = 'hidden';

    const customScale = LMat4.scale(0.2);
    customScale.arr[5] *= -1;

    const matStack = [
        LMat4.trans(200, 500, 0),
        LMat4.rotateY(0),
        customScale,
        matFromOrigin,
        rotateTo3D,
        LMat4.trans(0, -triangleCss.height, 0),
    ];

    const m = matStack.reduce((p, c) => p.mult(c), LMat4.identity());
    m.itranspose();
    const mString = `perspective(1000px) matrix3d(${m.arr.join(',')})`;
    
    ne.style.transform = mString;
    ne.style.transformOrigin = '0px 0px';
    ne.style.transformStyle = 'preserve-3d';
    // console.log('tOrigin' + JSON.stringify(tOrigin, null, 2));
    // console.log('tNormaled' + JSON.stringify(tNormaled, null, 2));


    // console.log(tOrigin);
}

function start(deer) {
    // console.log(deer.verts.length, deer.triangles.length);
    deer.triangles.forEach(tri => {
        const a = new LV3(...deer.verts[tri[0]]);
        const b = new LV3(...deer.verts[tri[1]]);
        const c = new LV3(...deer.verts[tri[2]]);
        lRenderTri({
            a,
            b,
            c,
        });
    });
}

start(deer);